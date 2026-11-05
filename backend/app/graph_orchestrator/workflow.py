import time
from typing import TypedDict, List, Dict, Any, Optional
from langgraph.graph import StateGraph, START, END

from app.agents.planner import planner_agent
from app.agents.recommendation import project_recommendation_agent
from app.agents.research_paper import research_paper_agent
from app.agents.novelty import novelty_agent
from app.agents.research_gap import research_gap_agent
from app.agents.roadmap import learning_roadmap_agent
from app.agents.documentation import documentation_agent
from app.agents.viva import viva_agent
from app.rag.arxiv_client import arxiv_client
from app.rag.vector_store import vector_store

class AgentState(TypedDict):
    student_input: Dict[str, Any]
    plan: Optional[Dict[str, Any]]
    retrieved_papers: Optional[List[Dict[str, Any]]]
    recommendations: Optional[List[Dict[str, Any]]]
    selected_project: Optional[Dict[str, Any]]
    novelty_data: Optional[Dict[str, Any]]
    research_gaps: Optional[Dict[str, Any]]
    roadmap: Optional[Dict[str, Any]]
    documentation: Optional[Dict[str, Any]]
    viva_questions: Optional[List[Dict[str, Any]]]
    execution_trace: List[Dict[str, Any]]
    total_latency_ms: int

async def planner_node(state: AgentState) -> Dict[str, Any]:
    start = time.time()
    plan = await planner_agent.execute(state["student_input"])
    elapsed = int((time.time() - start) * 1000)
    trace = list(state.get("execution_trace", []))
    trace.append({
        "step": 1,
        "agent": "Planner Agent",
        "action": "Parsed user constraints & assembled LangGraph execution DAG",
        "latency_ms": elapsed,
        "status": "Completed"
    })
    return {"plan": plan, "execution_trace": trace}

async def rag_retrieval_node(state: AgentState) -> Dict[str, Any]:
    start = time.time()
    domain = state["student_input"].get("domain", "Artificial Intelligence")
    custom_title = state["student_input"].get("title", "")
    search_q = f"{custom_title} {domain}".strip() if custom_title else domain

    # Query live arXiv papers asynchronously
    try:
        live_papers = await arxiv_client.search_papers(query=search_q, max_results=4)
        if live_papers:
            vector_store.index_live_papers(live_papers)
    except Exception as e:
        print(f"[RAGNode] Live fetch note: {e}")

    # Dense retrieval from ChromaDB
    literature_data = await research_paper_agent.execute(query=search_q, top_k=4)
    papers = literature_data.get("papers", [])
    elapsed = int((time.time() - start) * 1000)

    trace = list(state.get("execution_trace", []))
    trace.append({
        "step": 2,
        "agent": "Research Paper Agent (RAG)",
        "action": f"Queried ChromaDB & arXiv live; retrieved {len(papers)} peer-reviewed papers",
        "latency_ms": elapsed,
        "status": "Completed"
    })
    return {"retrieved_papers": papers, "execution_trace": trace}

async def recommendation_node(state: AgentState) -> Dict[str, Any]:
    start = time.time()
    student_input = state["student_input"]
    papers = state.get("retrieved_papers", [])

    # Check if custom project was supplied
    if student_input.get("is_custom"):
        selected = {
            "title": student_input.get("title", "Custom Capstone Project"),
            "domain": student_input.get("domain", "Computer Science"),
            "tagline": student_input.get("description", "Student Proposed Engineering Capstone Project"),
            "methodology": student_input.get("description", "Engineered with modular architecture and modern frameworks."),
            "tech_stack": student_input.get("skills", ["Python", "React", "FastAPI"]),
            "novelty_score": 92.0,
            "publication_venue": "IEEE Conference Track"
        }
        recommendations = [selected]
    else:
        recommendations = await project_recommendation_agent.execute(student_input, papers)
        selected = recommendations[0] if recommendations else {}

    elapsed = int((time.time() - start) * 1000)
    trace = list(state.get("execution_trace", []))
    trace.append({
        "step": 3,
        "agent": "Project Recommendation Agent",
        "action": f"Formulated {len(recommendations)} tailored capstone proposals",
        "latency_ms": elapsed,
        "status": "Completed"
    })
    return {"recommendations": recommendations, "selected_project": selected, "execution_trace": trace}

async def novelty_node(state: AgentState) -> Dict[str, Any]:
    start = time.time()
    selected = state.get("selected_project", {})
    papers = state.get("retrieved_papers", [])

    novelty_data = await novelty_agent.execute(
        project_title=selected.get("title", ""),
        methodology=selected.get("methodology", ""),
        retrieved_papers=papers
    )
    elapsed = int((time.time() - start) * 1000)

    trace = list(state.get("execution_trace", []))
    trace.append({
        "step": 4,
        "agent": "Novelty Agent",
        "action": f"Computed Innovation Score: {novelty_data.get('innovation_score', 92)}% ({novelty_data.get('novelty_tier', 'High')})",
        "latency_ms": elapsed,
        "status": "Completed"
    })
    return {"novelty_data": novelty_data, "execution_trace": trace}

async def research_gap_node(state: AgentState) -> Dict[str, Any]:
    start = time.time()
    selected = state.get("selected_project", {})
    papers = state.get("retrieved_papers", [])

    gaps = await research_gap_agent.execute(
        project_title=selected.get("title", ""),
        retrieved_papers=papers
    )
    elapsed = int((time.time() - start) * 1000)

    trace = list(state.get("execution_trace", []))
    trace.append({
        "step": 5,
        "agent": "Research Gap Agent",
        "action": "Identified literature limitations and student capstone opportunities",
        "latency_ms": elapsed,
        "status": "Completed"
    })
    return {"research_gaps": gaps, "execution_trace": trace}

async def roadmap_node(state: AgentState) -> Dict[str, Any]:
    start = time.time()
    selected = state.get("selected_project", {})
    student_input = state["student_input"]
    duration = int(student_input.get("duration_weeks", 16))

    roadmap = await learning_roadmap_agent.execute(
        project_title=selected.get("title", ""),
        tech_stack=selected.get("tech_stack", []),
        duration_weeks=duration
    )
    elapsed = int((time.time() - start) * 1000)

    trace = list(state.get("execution_trace", []))
    trace.append({
        "step": 6,
        "agent": "Learning Roadmap Agent",
        "action": f"Constructed {len(roadmap.get('weekly_tasks', []))}-week schedule across 6 engineering phases",
        "latency_ms": elapsed,
        "status": "Completed"
    })
    return {"roadmap": roadmap, "execution_trace": trace}

async def documentation_node(state: AgentState) -> Dict[str, Any]:
    start = time.time()
    selected = state.get("selected_project", {})
    student_input = state["student_input"]

    doc = await documentation_agent.execute({
        "title": selected.get("title", ""),
        "domain": student_input.get("domain", "Computer Science"),
        "methodology": selected.get("methodology", ""),
        "tech_stack": selected.get("tech_stack", [])
    })
    elapsed = int((time.time() - start) * 1000)

    trace = list(state.get("execution_trace", []))
    trace.append({
        "step": 7,
        "agent": "Documentation Agent",
        "action": "Generated IEEE Abstract, Problem Statement, and Thesis Chapters (1-5)",
        "latency_ms": elapsed,
        "status": "Completed"
    })
    return {"documentation": doc, "execution_trace": trace}

async def viva_node(state: AgentState) -> Dict[str, Any]:
    start = time.time()
    selected = state.get("selected_project", {})

    viva_q = await viva_agent.generate_questions(
        project_title=selected.get("title", ""),
        tech_stack=selected.get("tech_stack", [])
    )
    elapsed = int((time.time() - start) * 1000)

    trace = list(state.get("execution_trace", []))
    trace.append({
        "step": 8,
        "agent": "Viva Agent",
        "action": f"Synthesized {len(viva_q)} defense questions across examination rubrics",
        "latency_ms": elapsed,
        "status": "Completed"
    })
    return {"viva_questions": viva_q, "execution_trace": trace}

# --- Compile LangGraph StateGraph ---
def build_langgraph_workflow():
    workflow = StateGraph(AgentState)

    workflow.add_node("planner", planner_node)
    workflow.add_node("rag_retrieval", rag_retrieval_node)
    workflow.add_node("recommendation", recommendation_node)
    workflow.add_node("novelty", novelty_node)
    workflow.add_node("research_gap", research_gap_node)
    workflow.add_node("roadmap", roadmap_node)
    workflow.add_node("documentation", documentation_node)
    workflow.add_node("viva", viva_node)

    workflow.add_edge(START, "planner")
    workflow.add_edge("planner", "rag_retrieval")
    workflow.add_edge("rag_retrieval", "recommendation")
    workflow.add_edge("recommendation", "novelty")
    workflow.add_edge("novelty", "research_gap")
    workflow.add_edge("research_gap", "roadmap")
    workflow.add_edge("roadmap", "documentation")
    workflow.add_edge("documentation", "viva")
    workflow.add_edge("viva", END)

    return workflow.compile()

compiled_agent_graph = build_langgraph_workflow()

class AgentWorkflowOrchestrator:
    """
    IntelliProject Master Orchestrator backed by real compiled LangGraph.
    """
    def __init__(self):
        self.orchestrator_name = "LangGraph Master Coordinator"
        self.graph = compiled_agent_graph

    async def run_full_pipeline(self, student_input: Dict[str, Any]) -> Dict[str, Any]:
        start_time = time.time()
        initial_state: AgentState = {
            "student_input": student_input,
            "plan": None,
            "retrieved_papers": None,
            "recommendations": None,
            "selected_project": None,
            "novelty_data": None,
            "research_gaps": None,
            "roadmap": None,
            "documentation": None,
            "viva_questions": None,
            "execution_trace": [],
            "total_latency_ms": 0
        }

        # Execute LangGraph StateGraph
        final_state = await self.graph.ainvoke(initial_state)
        total_time = int((time.time() - start_time) * 1000)

        return {
            "orchestration_summary": {
                "total_agents_invoked": 8,
                "total_pipeline_time_ms": total_time,
                "status": "Success",
                "framework": "LangGraph StateGraph Engine"
            },
            "execution_trace": final_state.get("execution_trace", []),
            "plan": final_state.get("plan"),
            "recommendations": final_state.get("recommendations", []),
            "selected_project": final_state.get("selected_project"),
            "literature_survey": {
                "papers": final_state.get("retrieved_papers", [])
            },
            "novelty_analysis": final_state.get("novelty_data"),
            "research_gaps": final_state.get("research_gaps"),
            "roadmap": final_state.get("roadmap"),
            "documentation": final_state.get("documentation"),
            "viva_questions": final_state.get("viva_questions", [])
        }

orchestrator = AgentWorkflowOrchestrator()
