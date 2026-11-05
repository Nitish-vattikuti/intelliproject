import json
from typing import Dict, Any, List
from app.core.llm import llm_service
from app.core.config import settings

class DocumentationAgent:
    """
    Documentation Agent:
    Generates formal IEEE-style abstracts, problem statements, methodologies,
    and complete thesis chapter drafts adhering to standard university capstone guidelines.
    """
    def __init__(self):
        self.name = "Documentation Agent"

    async def execute(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        title = project_data.get("title", "IntelliProject: Agentic AI-Based Intelligent Project Mentor")
        domain = project_data.get("domain", "Artificial Intelligence")
        methodology = project_data.get("methodology", "Multi-Agent System with RAG and Knowledge Graph")
        tech_stack = project_data.get("tech_stack", ["React", "FastAPI", "ChromaDB", "LangGraph"])

        prompt = f"""
Draft complete academic thesis documentation components for:
- Title: {title}
- Domain: {domain}
- Methodology: {methodology}
- Tech Stack: {tech_stack}

Generate JSON with:
1. "ieee_abstract": A 250-word formal IEEE-style abstract.
2. "problem_statement_section": Formal problem statement text.
3. "objectives_section": List of bulleted measurable goals.
4. "scope_and_boundaries": Dict with "in_scope" and "out_scope" items.
5. "thesis_chapters": Dict of chapters:
   - "ch1_introduction": Outline and summary
   - "ch2_literature_review": Outline and summary
   - "ch3_methodology_design": Outline and summary
   - "ch4_implementation_results": Outline and summary
   - "ch5_conclusion_future_scope": Outline and summary
Format strictly as JSON.
"""
        system_instruction = "You are a senior computer science thesis advisor drafting publication-grade thesis chapters."
        llm_response = await llm_service.generate_content(system_instruction, prompt)

        doc = None
        if llm_response:
            try:
                clean_json = llm_response.strip().replace("```json", "").replace("```", "").strip()
                doc = json.loads(clean_json)
            except Exception:
                pass

        if not doc:
            techs = ", ".join(tech_stack) if isinstance(tech_stack, list) else str(tech_stack)
            doc = {
                "ieee_abstract": f"In modern engineering applications, robust implementations of {domain} systems require systematic architecture design and rigorous validation. This research presents {title}, an advanced engineering solution built using {techs}. By leveraging {methodology}, the proposed approach addresses key challenges in scalability, latency, and operational efficiency. We evaluate system performance through empirical benchmarks, demonstrating significant improvements over baseline approaches and providing a reproducible framework for real-world deployment.",
                "problem_statement_section": f"Current solutions in the domain of {domain} often suffer from architectural fragmentation, suboptimal performance, and limited adaptability. Specifically, existing implementations lack unified integration of {techs}, leading to reliability and throughput bottlenecks in production environments.",
                "objectives_section": [
                    f"Design and implement a robust system architecture for {title}.",
                    f"Integrate core algorithmic modules leveraging {techs}.",
                    f"Establish validation pipelines and empirical performance metrics in {domain}.",
                    f"Benchmark latency, computational efficiency, and accuracy against state-of-the-art baselines.",
                    f"Deliver production-ready modular codebase and comprehensive technical documentation."
                ],
                "scope_and_boundaries": {
                    "in_scope": [
                        f"Core architectural design and implementation using {techs}",
                        f"Algorithmic execution and validation for {domain}",
                        "Automated performance metric benchmarking and evaluation",
                        "Modular API design and developer documentation"
                    ],
                    "out_scope": [
                        "Proprietary hardware fabrication (assumes standard runtime hardware)",
                        "Unrestricted multi-tenant public deployment without authentication"
                    ]
                },
                "thesis_chapters": {
                    "ch1_introduction": {
                        "title": "Chapter 1: Introduction",
                        "sections": [
                            "1.1 Domain Background & Context",
                            f"1.2 Problem Statement in {domain}",
                            "1.3 Project Motivation & Objectives",
                            "1.4 Proposed Architectural Approach",
                            "1.5 Scope and System Boundaries",
                            f"1.6 Technical Stack Overview ({techs})",
                            "1.7 Thesis Organization"
                        ]
                    },
                    "ch2_literature_review": {
                        "title": "Chapter 2: Literature Review",
                        "sections": [
                            f"2.1 Survey of Modern Methodologies in {domain}",
                            f"2.2 Comparative Analysis of Frameworks ({techs})",
                            "2.3 Performance and Scalability Paradigms",
                            "2.4 Identified Research and Implementation Gaps",
                            "2.5 Summary of Prior Art"
                        ]
                    },
                    "ch3_methodology_design": {
                        "title": "Chapter 3: Methodology & System Architecture",
                        "sections": [
                            "3.1 High-Level System Architecture Design",
                            "3.2 Data Flow & Component Sequence Models",
                            "3.3 Core Algorithm Formulation",
                            "3.4 Database and Vector Storage Schema",
                            "3.5 API Specification and Interface Contracts"
                        ]
                    },
                    "ch4_implementation_results": {
                        "title": "Chapter 4: Implementation & Experimental Results",
                        "sections": [
                            "4.1 Development Environment & Setup",
                            "4.2 Modular Implementation Details",
                            "4.3 Benchmark Setup & Experimental Metrics",
                            "4.4 Comparative Performance Analysis",
                            "4.5 Discussion of Results & Ablation Studies"
                        ]
                    },
                    "ch5_conclusion_future_scope": {
                        "title": "Chapter 5: Conclusion & Future Scope",
                        "sections": [
                            "5.1 Summary of Contributions",
                            "5.2 Key Takeaways & Practical Implications",
                            "5.3 Technical Challenges & Known Limitations",
                            "5.4 Directions for Future Research & Extensions"
                        ]
                    }
                }
            }

        return doc

documentation_agent = DocumentationAgent()
