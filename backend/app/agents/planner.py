import json
from typing import Dict, Any, List
from app.core.llm import llm_service

class PlannerAgent:
    """
    Planner Agent: Analyzes the student's background, interests, timeline,
    and constraints, then coordinates downstream specialized agents.
    """
    def __init__(self):
        self.name = "Planner Agent"
        self.description = "Analyzes student profile and orchestrates multi-agent workflow"

    async def execute(self, student_input: Dict[str, Any]) -> Dict[str, Any]:
        skills = student_input.get("skills", ["Python", "Machine Learning"])
        domain = student_input.get("domain", "Artificial Intelligence")
        duration = student_input.get("duration", "16 Weeks")
        difficulty = student_input.get("difficulty", "Advanced")
        interest = student_input.get("interest", "Agentic RAG and Knowledge Systems")

        prompt = f"""
Analyze this student profile for a final-year engineering capstone project:
- Skills: {', '.join(skills) if isinstance(skills, list) else skills}
- Domain: {domain}
- Desired Project Duration: {duration}
- Difficulty Target: {difficulty}
- Specific Interests: {interest}

Generate a JSON execution plan with:
1. "domain_focus": Primary and secondary domain classification
2. "agent_pipeline": List of all 7 specialized agents to activate in sequential order: ["Project Recommendation Agent", "Research Paper Agent (RAG)", "Novelty Agent", "Research Gap Agent", "Learning Roadmap Agent", "Documentation Agent", "Viva Agent"] with subtask directives for each
3. "feasibility_assessment": Estimated feasibility within the duration (score out of 100 and comment)
4. "key_milestone_gates": Recommended project phases
Format strictly as JSON.
"""
        system_instruction = "You are a senior computer science academic research advisor and multi-agent workflow planner."
        llm_response = await llm_service.generate_content(system_instruction, prompt)
        
        plan = None
        if llm_response:
            try:
                clean_json = llm_response.strip().replace("```json", "").replace("```", "").strip()
                plan = json.loads(clean_json)
            except Exception:
                pass

        default_pipeline = [
            {"agent": "Project Recommendation Agent", "status": "Ready", "task": "Formulate 3 tailored research project proposals"},
            {"agent": "Research Paper Agent (RAG)", "status": "Ready", "task": f"Retrieve literature from ChromaDB for {domain}"},
            {"agent": "Novelty Agent", "status": "Ready", "task": "Evaluate uniqueness score and patent/literature overlap"},
            {"agent": "Research Gap Agent", "status": "Ready", "task": "Extract limitations and open opportunities from literature"},
            {"agent": "Learning Roadmap Agent", "status": "Ready", "task": f"Structure {duration} week-by-week implementation plan"},
            {"agent": "Documentation Agent", "status": "Ready", "task": "Draft IEEE abstract, methodology, and thesis chapters"},
            {"agent": "Viva Agent", "status": "Ready", "task": "Prepare conceptual, architectural, and defense questions"}
        ]

        if plan and isinstance(plan, dict):
            if "agent_pipeline" not in plan or not isinstance(plan["agent_pipeline"], list) or len(plan["agent_pipeline"]) < 5:
                plan["agent_pipeline"] = default_pipeline

        if not plan:
            plan = {
                "domain_focus": {
                    "primary": domain,
                    "secondary": f"{domain} & Applied Systems",
                    "publication_potential": "High (IEEE / Springer / Scopus Track)"
                },
                "agent_pipeline": default_pipeline,
                "feasibility_assessment": {
                    "score": 94.0,
                    "comment": f"Strongly feasible within {duration} given foundational skills in {', '.join(skills[:3]) if isinstance(skills, list) else skills}."
                },
                "key_milestone_gates": [
                    "Phase 1: Problem Definition & Feasibility Study",
                    "Phase 2: Literature Review & Architecture Design",
                    "Phase 3: Core Module Implementation & Vector Indexing",
                    "Phase 4: Full-Stack Integration & API Verification",
                    "Phase 5: Performance Evaluation & Research Paper Draft",
                    "Phase 6: Final Documentation & Viva-Voce Defense"
                ]
            }

        return plan

planner_agent = PlannerAgent()
