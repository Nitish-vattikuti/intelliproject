import json
from typing import Dict, Any, List
from app.core.llm import llm_service

class LearningRoadmapAgent:
    """
    Learning Roadmap Agent:
    Generates a week-by-week progressive project roadmap structured into
    rigorous engineering milestones from inception to final viva defense.
    """
    def __init__(self):
        self.name = "Learning Roadmap Agent"

    async def execute(self, project_title: str, tech_stack: List[str], duration_weeks: int = 16) -> Dict[str, Any]:
        techs_str = ", ".join(tech_stack) if isinstance(tech_stack, list) else str(tech_stack)

        prompt = f"""
Generate a comprehensive, technically specific {duration_weeks}-week engineering implementation and learning roadmap for:
Project Title: {project_title}
Technologies: {techs_str}

Each week must teach the student concrete concepts and skills required to implement this project (e.g. specific algorithms, tensor operations, hardware setups, dataset training, API integration, performance benchmarks).
Keep 'learning_focus' and 'deliverable' under 20 words each.

Return STRICT JSON formatted as:
{{
  "phases": [
    {{"phase_name": "Phase 1: Inception & Environment Scaffolding", "weeks": "Weeks 1-2", "focus": "Project scope and dev environment"}}
  ],
  "weekly_tasks": [
    {{
      "week": 1,
      "phase": "Phase 1: Inception",
      "title": "Concise Task Title",
      "learning_focus": "Specific libraries, tutorials, and mathematical foundations to study",
      "deliverable": "Working code, schema, or document deliverable",
      "suggested_tools": ["tool1", "tool2"]
    }}
  ]
}}
Generate all {duration_weeks} weeks. Output ONLY raw JSON without markdown formatting.
"""
        system_instruction = "You are a university capstone engineering director designing customized technical schedules."
        llm_response = await llm_service.generate_content(system_instruction, prompt)

        roadmap = None
        if llm_response:
            try:
                clean_json = llm_response.strip().replace("```json", "").replace("```", "").strip()
                s_idx = clean_json.find("{")
                e_idx = clean_json.rfind("}")
                if s_idx != -1 and e_idx != -1:
                    clean_json = clean_json[s_idx:e_idx+1]
                roadmap = json.loads(clean_json)
            except Exception as e:
                print(f"[LearningRoadmapAgent] JSON parse note: {e}")

        if not roadmap:
            primary_tech = tech_stack[0] if (isinstance(tech_stack, list) and len(tech_stack) > 0) else "Core Framework"
            secondary_tech = tech_stack[1] if (isinstance(tech_stack, list) and len(tech_stack) > 1) else "Database & APIs"
            other_techs = ", ".join(tech_stack[2:]) if (isinstance(tech_stack, list) and len(tech_stack) > 2) else "Modern Dev Tools"
            roadmap = {
                "phases": [
                    {"phase_name": "Phase 1: Inception & Architectural Design", "weeks": "Weeks 1-2", "focus": f"Problem definition for {project_title}, feasibility analysis, and architecture specifications"},
                    {"phase_name": "Phase 2: Literature Survey & Data Modeling", "weeks": "Weeks 3-5", "focus": f"Prior art review, dataset curation, and data pipeline modeling with {primary_tech}"},
                    {"phase_name": "Phase 3: Core Algorithm & Backend Implementation", "weeks": "Weeks 6-9", "focus": f"Building core logic, model training/algorithms, and backend services with {secondary_tech}"},
                    {"phase_name": "Phase 4: Full-Stack Integration & Interface Design", "weeks": "Weeks 10-12", "focus": f"User interface, API endpoints connection, and end-to-end testing with {other_techs}"},
                    {"phase_name": "Phase 5: Empirical Benchmarking & Research Paper", "weeks": "Weeks 13-14", "focus": "Latency, accuracy, throughput evaluation, comparative tables, and manuscript drafting"},
                    {"phase_name": "Phase 6: Final Documentation & Viva-Voce Defense", "weeks": "Weeks 15-16", "focus": "Thesis chapters compilation, oral defense rehearsals, and final demonstration"}
                ],
                "weekly_tasks": [
                    {
                        "week": 1,
                        "phase": "Phase 1: Inception",
                        "title": f"Requirements Analysis for {project_title}",
                        "learning_focus": "Formalizing functional requirements, problem boundaries, and target user personas",
                        "deliverable": "Project Synopsis & Requirements Specification Document",
                        "suggested_tools": ["LaTeX", "Overleaf", "Notion"]
                    },
                    {
                        "week": 2,
                        "phase": "Phase 1: Inception",
                        "title": "System Architecture & Repository Scaffolding",
                        "learning_focus": f"Designing system components, modularization, and setup for {primary_tech}",
                        "deliverable": "Architecture diagram, Git repository scaffolding, and environment config",
                        "suggested_tools": ["Git", "GitHub", "Draw.io", primary_tech]
                    },
                    {
                        "week": 3,
                        "phase": "Phase 2: Literature & Data",
                        "title": "Literature Review & Prior Art Synthesis",
                        "learning_focus": "Reviewing state-of-the-art papers on arXiv and IEEE Xplore relevant to this domain",
                        "deliverable": "Comparative literature survey matrix with 10+ cited publications",
                        "suggested_tools": ["arXiv", "IEEE Xplore", "Zotero"]
                    },
                    {
                        "week": 4,
                        "phase": "Phase 2: Literature & Data",
                        "title": "Data Corpus & Schema Engineering",
                        "learning_focus": "Collecting benchmark datasets, defining schemas, and preprocessing pipelines",
                        "deliverable": "Cleaned datasets, baseline schemas, and data ingestion scripts",
                        "suggested_tools": ["Python", "Pandas", "JSON"]
                    },
                    {
                        "week": 5,
                        "phase": "Phase 2: Literature & Data",
                        "title": "Baseline Pipeline & Verification Gate",
                        "learning_focus": "Implementing baseline algorithms and measuring initial performance indicators",
                        "deliverable": "Baseline benchmark results and phase review milestone report",
                        "suggested_tools": ["Jupyter", "PyTest"]
                    },
                    {
                        "week": 6,
                        "phase": "Phase 3: Core Implementation",
                        "title": f"Core Engine Implementation with {primary_tech}",
                        "learning_focus": f"Developing primary algorithms and core computational logic in {primary_tech}",
                        "deliverable": "Modular core execution engine with unit test suite",
                        "suggested_tools": [primary_tech, "PyTest"]
                    },
                    {
                        "week": 7,
                        "phase": "Phase 3: Core Implementation",
                        "title": f"Backend API & Services Layer with {secondary_tech}",
                        "learning_focus": f"Building REST endpoints, service orchestration, and data storage with {secondary_tech}",
                        "deliverable": "Tested backend API endpoints with schema validation",
                        "suggested_tools": [secondary_tech, "Postman"]
                    },
                    {
                        "week": 8,
                        "phase": "Phase 3: Core Implementation",
                        "title": "Performance Optimization & Edge Case Handling",
                        "learning_focus": "Profiling memory footprint, latency optimization, and handling exceptions",
                        "deliverable": "Optimized execution pipeline with benchmark profiling",
                        "suggested_tools": ["cProfile", "Locust"]
                    },
                    {
                        "week": 9,
                        "phase": "Phase 3: Core Implementation",
                        "title": "Core Milestone Demo & Midterm Review Gate",
                        "learning_focus": "Validating core components against initial objectives and acceptance criteria",
                        "deliverable": "Working backend milestone demo and progress report",
                        "suggested_tools": ["Markdown", "Git"]
                    },
                    {
                        "week": 10,
                        "phase": "Phase 4: Full-Stack Integration",
                        "title": "User Interface & Dashboard Development",
                        "learning_focus": "Developing responsive UI components, control panels, and interactive dashboards",
                        "deliverable": "Interactive user interface communicating with backend services",
                        "suggested_tools": ["React", "CSS", "Vite"]
                    },
                    {
                        "week": 11,
                        "phase": "Phase 4: Full-Stack Integration",
                        "title": "Interactive Visualizations & Feedback Loops",
                        "learning_focus": "Rendering real-time charts, telemetry, and status indicators",
                        "deliverable": "Live data visualization panel and telemetry widgets",
                        "suggested_tools": ["Charts.js", "Canvas"]
                    },
                    {
                        "week": 12,
                        "phase": "Phase 4: Full-Stack Integration",
                        "title": "End-to-End System Testing & Bug Fixes",
                        "learning_focus": "Integration testing, user validation, and edge case resilience",
                        "deliverable": "Fully integrated end-to-end prototype meeting project specifications",
                        "suggested_tools": ["Cypress", "PyTest", "Docker"]
                    },
                    {
                        "week": 13,
                        "phase": "Phase 5: Evaluation & Paper",
                        "title": "Empirical Benchmarking & Performance Metrics",
                        "learning_focus": "Measuring accuracy, latency, resource utilization, and ablation tests",
                        "deliverable": "Empirical benchmark evaluation graphs and comparative tables",
                        "suggested_tools": ["Matplotlib", "Seaborn"]
                    },
                    {
                        "week": 14,
                        "phase": "Phase 5: Evaluation & Paper",
                        "title": "Research Paper Manuscript Drafting",
                        "learning_focus": "Structuring academic publication: Abstract, Methodology, Results, Discussion",
                        "deliverable": "Complete 6-page IEEE/Springer formatted conference paper draft",
                        "suggested_tools": ["LaTeX", "Overleaf"]
                    },
                    {
                        "week": 15,
                        "phase": "Phase 6: Final Documentation & Viva",
                        "title": "Viva-Voce Mock Defense Rehearsal",
                        "learning_focus": "Preparing defense arguments for architectural trade-offs, limitations, and scalability",
                        "deliverable": "Viva defense slide deck and comprehensive Q&A preparation notes",
                        "suggested_tools": ["Google Slides", "Viva Simulator"]
                    },
                    {
                        "week": 16,
                        "phase": "Phase 6: Final Documentation & Viva",
                        "title": "Final Thesis Archival & Viva Voce",
                        "learning_focus": "Final thesis binding, code repository release, and demonstration rehearsal",
                        "deliverable": "Final B.Tech/M.Tech Capstone Thesis and Successful Viva-Voce Defense",
                        "suggested_tools": ["PDF Export", "GitHub Release"]
                    }
                ]
            }

        return roadmap

learning_roadmap_agent = LearningRoadmapAgent()
