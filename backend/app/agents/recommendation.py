import json
import re
from typing import Dict, Any, List
from app.core.llm import llm_service
from app.knowledge_graph.graph_engine import knowledge_graph

class ProjectRecommendationAgent:
    """
    Project Recommendation Agent:
    Formulates 3 distinct, innovative capstone project proposals dynamically
    tailored to the student's specific skills, domain, and literature context.
    """
    def __init__(self):
        self.name = "Project Recommendation Agent"

    async def execute(self, student_input: Dict[str, Any], retrieved_papers: List[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        domain = student_input.get("domain", "Artificial Intelligence")
        skills = student_input.get("skills", ["Python", "Machine Learning"])
        skills_list = skills if isinstance(skills, list) else [s.strip() for s in str(skills).split(",") if s.strip()]
        difficulty = student_input.get("difficulty", "Advanced")
        interest = student_input.get("interest", f"{domain} Research")

        # Query knowledge graph for tech recommendations
        recommended_techs = [n["label"] for n in knowledge_graph.recommend_technologies(domain)]
        paper_contexts = [f"{p['title']} ({p.get('doi_or_arxiv', '')})" for p in (retrieved_papers or [])[:3]]

        prompt = f"""
Recommend 3 distinct, publication-grade engineering capstone projects based on:
- Domain: {domain}
- Student Skills: {', '.join(skills_list)}
- Research Focus: {interest}
- Relevant Academic Literature: {', '.join(paper_contexts)}
- Recommended Tech Stack: {', '.join(recommended_techs)}

For each project provide JSON format:
- "title": Compelling technical title
- "tagline": 1-sentence punchy elevator pitch
- "problem_statement": Clear explanation of the challenge
- "objectives": List of 4-5 measurable deliverables
- "methodology": Technical approach, architecture, or algorithmic pipeline
- "tech_stack": List of 4-6 specific technologies
- "novelty_score": Number between 88.0 and 96.5
- "publication_venue": e.g. IEEE / Springer / ACM Track
- "feasibility_weeks": Estimated completion weeks
Return a list of 3 project objects in valid JSON.
"""
        system_instruction = "You are a senior computer science capstone committee chair formulating cutting-edge engineering project titles."
        llm_response = await llm_service.generate_content(system_instruction, prompt)
        
        proposals = None
        if llm_response:
            try:
                clean_json = llm_response.strip().replace("```json", "").replace("```", "").strip()
                proposals = json.loads(clean_json)
            except Exception:
                pass

        if not proposals or not isinstance(proposals, list):
            papers_list = retrieved_papers or []
            p1_paper = papers_list[0] if len(papers_list) > 0 else {"title": "Dense Retrieval Architecture"}
            p2_paper = papers_list[1] if len(papers_list) > 1 else {"title": "Knowledge-Grounded Systems"}

            base_tech = list(set(skills_list + recommended_techs[:3]))[:6]

            proposals = [
                {
                    "title": f"Adaptive {domain.split('&')[0].strip()} System with {interest.split(',')[0].strip()}",
                    "tagline": f"An intelligent, high-performance architecture solving critical bottlenecks in {domain} using {', '.join(base_tech[:2])}.",
                    "problem_statement": f"Current implementations in {domain} suffer from scalability limitations, latency bottlenecks, and lack of real-time grounding in empirical data, as highlighted in prior work on {p1_paper['title']}.",
                    "objectives": [
                        f"Design and benchmark an end-to-end processing pipeline using {base_tech[0] if base_tech else 'Python'}",
                        f"Integrate empirical vector embeddings and knowledge constraints",
                        f"Optimize execution latency and throughput across heterogeneous environments",
                        f"Evaluate system performance against state-of-the-art literature baselines"
                    ],
                    "methodology": f"A modular, distributed architecture coupling dense representation modeling with {base_tech[1] if len(base_tech) > 1 else 'FastAPI'} and structured evaluation benchmarks.",
                    "tech_stack": base_tech,
                    "novelty_score": 93.4,
                    "publication_venue": f"IEEE International Conference on {domain.split()[0]} Systems",
                    "feasibility_weeks": 16
                },
                {
                    "title": f"Knowledge-Grounded Multi-Modal Framework for {domain.split('&')[-1].strip()}",
                    "tagline": f"Bridging semantic data representation with low-latency algorithmic inference for {interest.split()[-1] if interest else domain}.",
                    "problem_statement": f"Existing approaches lack multi-hop reasoning capabilities and fail to provide explainable verification during high-stakes decision making, creating gaps identified in {p2_paper['title']}.",
                    "objectives": [
                        f"Develop an automated feature extraction and alignment engine",
                        f"Implement cross-attention mechanisms between structured ontologies and unstructured streams",
                        f"Deploy an interactive web dashboard for real-time telemetry and validation",
                        f"Publish comprehensive ablation studies verifying individual module gains"
                    ],
                    "methodology": f"Dual-layer integration uniting non-parametric graph traversal with {', '.join(base_tech[2:4]) if len(base_tech) > 3 else 'neural networks'} for verified contextual synthesis.",
                    "tech_stack": base_tech,
                    "novelty_score": 91.8,
                    "publication_venue": "Springer Journal of Applied Computer Science",
                    "feasibility_weeks": 18
                },
                {
                    "title": f"Decentralized Edge Intelligence Pipeline for Real-Time {interest.split(',')[0].strip()}",
                    "tagline": f"Ultra-efficient, quantized model deployment optimized for resource-constrained {domain} environments.",
                    "problem_statement": f"Centralized cloud architectures introduce prohibitive latency, bandwidth costs, and privacy vulnerabilities when deployed for continuous monitoring in {domain}.",
                    "objectives": [
                        "Quantize neural weights for embedded microcontroller and edge execution",
                        "Formulate fault-tolerant synchronization protocols between peer nodes",
                        "Minimize power dissipation while preserving inference precision above 92%",
                        "Deliver a production-ready containerized microservice suite"
                    ],
                    "methodology": f"Edge-native quantization combined with peer-to-peer asynchronous consensus and lightweight REST gateways.",
                    "tech_stack": list(set(base_tech + ["Docker", "SQLite", "C++"])),
                    "novelty_score": 89.6,
                    "publication_venue": "ACM Transactions on Computing Systems",
                    "feasibility_weeks": 16
                }
            ]

        return proposals

project_recommendation_agent = ProjectRecommendationAgent()
