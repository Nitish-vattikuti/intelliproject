import json
from typing import Dict, Any, List
from app.core.llm import llm_service
from app.ml.novelty_engine import empirical_novelty_engine

class NoveltyAgent:
    """
    Novelty Agent:
    Checks whether the proposed project idea is saturated, common, or holds publication potential.
    Calculates an empirical Innovation Score (0-100) based on mathematical vector proximity to literature
    and outlines the unique technical value proposition.
    """
    def __init__(self):
        self.name = "Novelty Agent"

    async def execute(self, project_title: str, methodology: str, retrieved_papers: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        # 1. Compute empirical baseline metrics from real vector store
        empirical_data = empirical_novelty_engine.calculate_empirical_novelty(
            project_title=project_title,
            methodology=methodology,
            retrieved_papers=retrieved_papers
        )

        papers_context = ", ".join([p["title"] for p in (retrieved_papers or [])[:4]])

        prompt = f"""
Evaluate the academic novelty and technical uniqueness of this specific proposed project:
- Title: {project_title}
- Methodology: {methodology}
- Comparison Corpus: {papers_context}
- Nearest Academic Paper: {empirical_data.get('nearest_academic_reference', '')}
- Calculated Max Proximity: {empirical_data.get('max_similarity_score', 0.65)}

Return JSON with:
1. "innovation_score": Float matching calibrated score {empirical_data['innovation_score']}
2. "novelty_tier": "{empirical_data['novelty_tier']}"
3. "existing_overlaps": List of 2-3 standard practices or common GitHub project tropes this avoids or builds upon
4. "novel_differentiators": List of 3-4 distinct architectural or scientific contributions specific to {project_title}
5. "patent_or_publication_verdict": 2-sentence formal review assessment
Format strictly as JSON.
"""
        system_instruction = "You are a university patent assessor and IEEE peer review evaluator analyzing technical novelty."
        llm_response = await llm_service.generate_content(system_instruction, prompt)

        novelty_data = None
        if llm_response:
            try:
                clean_json = llm_response.strip().replace("```json", "").replace("```", "").strip()
                novelty_data = json.loads(clean_json)
                # Keep real computed score and metrics
                novelty_data["innovation_score"] = empirical_data["innovation_score"]
                novelty_data["novelty_tier"] = empirical_data["novelty_tier"]
                novelty_data["nearest_academic_reference"] = empirical_data["nearest_academic_reference"]
                novelty_data["max_similarity_score"] = empirical_data["max_similarity_score"]
                novelty_data["mean_literature_proximity"] = empirical_data["mean_literature_proximity"]
                novelty_data["is_empirically_computed"] = True
            except Exception:
                pass

        if not novelty_data:
            novelty_data = empirical_data

        return novelty_data

novelty_agent = NoveltyAgent()

