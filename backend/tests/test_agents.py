import pytest
import asyncio
from app.rag.vector_store import vector_store
from app.knowledge_graph.graph_engine import knowledge_graph
from app.agents.planner import planner_agent
from app.agents.recommendation import project_recommendation_agent
from app.agents.novelty import novelty_agent
from app.agents.research_gap import research_gap_agent
from app.agents.roadmap import learning_roadmap_agent
from app.agents.documentation import documentation_agent
from app.agents.viva import viva_agent

def test_knowledge_graph_structure():
    graph_data = knowledge_graph.get_full_graph()
    assert graph_data["stats"]["total_nodes"] >= 15
    assert graph_data["stats"]["total_edges"] >= 15
    
    # Check neighbors
    neighbors = knowledge_graph.get_neighbors("ai", depth=1)
    assert len(neighbors["nodes"]) > 0

def test_vector_store_retrieval():
    results = vector_store.search(query="Agentic RAG Knowledge Graph", top_k=3)
    assert len(results) > 0
    assert "similarity_score" in results[0]

@pytest.mark.asyncio
async def test_planner_agent():
    plan = await planner_agent.execute({
        "skills": ["Python", "FastAPI"],
        "domain": "Artificial Intelligence",
        "duration": "6 Months",
        "difficulty": "Advanced",
        "interest": "Agentic AI"
    })
    assert "agent_pipeline" in plan
    assert len(plan["agent_pipeline"]) >= 5

@pytest.mark.asyncio
async def test_recommendation_agent():
    recs = await project_recommendation_agent.execute({
        "skills": ["Python", "Machine Learning"],
        "domain": "Artificial Intelligence",
        "interest": "RAG"
    })
    assert len(recs) >= 1
    assert "title" in recs[0]
    assert "novelty_score" in recs[0]

@pytest.mark.asyncio
async def test_viva_agent_generation():
    questions = await viva_agent.generate_questions("IntelliProject", ["FastAPI", "React", "ChromaDB"])
    assert len(questions) >= 4
    assert "category" in questions[0]
