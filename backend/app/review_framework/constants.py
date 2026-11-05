"""
Final Year Project Review Presentation Framework Constants
Generalised Capstone Review Framework for Computer Science & Engineering
"""

COLLEGE_NAME = "University / College of Engineering"
DEPARTMENT_NAME = "Department of Computer Science & Engineering"
BATCH_NAME = "Capstone Project Batch"
ACADEMIC_YEAR = "Final Year B.Tech / B.E."
DEFAULT_GUIDE = "Faculty Project Guide / Advisor"

DEFAULT_TEAM_MEMBERS = [
    {
        "id": 1,
        "name": "Project Lead",
        "roll_number": "Core Lead",
        "role": "System Architecture & Integration"
    },
    {
        "id": 2,
        "name": "AI / ML Engineer",
        "roll_number": "ML Lead",
        "role": "Machine Learning & Agent Workflows"
    },
    {
        "id": 3,
        "name": "Backend Engineer",
        "roll_number": "Backend Lead",
        "role": "API Development & Database Engineering"
    },
    {
        "id": 4,
        "name": "Frontend Engineer",
        "roll_number": "Frontend Lead",
        "role": "UI/UX & Interactive Visualizations"
    }
]

FRAMEWORK_RULES = [
    {
        "rule_number": "01",
        "title": "One deck per review",
        "description": "Copy the matching 10-slide review section (or 20-slide Final deck). Do not mix slides from different reviews into one deck."
    },
    {
        "rule_number": "02",
        "title": "Slide titles are generalised — content is yours",
        "description": "Follow the structure and the thesis mapping shown on every slide. Content automatically aligns with your project deliverables."
    },
    {
        "rule_number": "03",
        "title": "Every slide maps to a thesis section",
        "description": "The footer on each slide shows exactly which thesis chapter/section it feeds. Finish the slide, then write that section within 1 week."
    }
]

REVIEW_DECKS_METADATA = [
    {
        "id": "p1r1",
        "phase_num": 1,
        "review_num": 1,
        "name": "Review 1",
        "title": "Project Acceptance Review",
        "gate_label": "ACCEPTANCE GATE",
        "date_str": "Milestone 1",
        "semester": "Semester VII",
        "slide_count": 10,
        "focus": "Problem definition, motivation, objectives, solution approach, scope, tech stack, and initial literature survey."
    },
    {
        "id": "p1r2",
        "phase_num": 1,
        "review_num": 2,
        "name": "Review 2",
        "title": "Literature Review & System Design",
        "gate_label": "DESIGN GATE",
        "date_str": "Milestone 2",
        "semester": "Semester VII",
        "slide_count": 10,
        "focus": "Dense literature survey, comparative matrix, system architecture, data flow diagrams, and database design."
    },
    {
        "id": "p1r3",
        "phase_num": 1,
        "review_num": 3,
        "name": "Review 3",
        "title": "Implementation Phase I — Core Modules",
        "gate_label": "MID-CHECK GATE",
        "date_str": "Milestone 3",
        "semester": "Semester VII",
        "slide_count": 10,
        "focus": "Core AI/backend pipeline implementation, algorithms, vector ingestion, and initial unit test validation."
    },
    {
        "id": "p1r4",
        "phase_num": 1,
        "review_num": 4,
        "name": "Review 4",
        "title": "Implementation Phase II & Phase 1 Completion Gate",
        "gate_label": "PHASE 1 GATE",
        "date_str": "Milestone 4",
        "semester": "Semester VII",
        "slide_count": 10,
        "focus": "Full module integration, frontend-backend connectivity, initial empirical results, and Phase 1 signoff."
    },
    {
        "id": "p2r1",
        "phase_num": 2,
        "review_num": 1,
        "name": "Review 5",
        "title": "Integration, Evaluation & Research Paper",
        "gate_label": "RESEARCH GATE",
        "date_str": "Milestone 5",
        "semester": "Semester VIII",
        "slide_count": 10,
        "focus": "Comprehensive evaluation, latency/accuracy metrics, ablation studies, and IEEE/Springer manuscript draft."
    },
    {
        "id": "p2r2",
        "phase_num": 2,
        "review_num": 2,
        "name": "Review 6",
        "title": "Final Completion — Viva Ready",
        "gate_label": "COMPLETION GATE",
        "date_str": "Milestone 6",
        "semester": "Semester VIII",
        "slide_count": 10,
        "focus": "End-to-end system live demo verification, user acceptance testing, final thesis draft, and defense readiness."
    },
    {
        "id": "viva_deck",
        "phase_num": 2,
        "review_num": 3,
        "name": "Final / Viva Deck",
        "title": "Comprehensive Defense Deck",
        "gate_label": "VIVA-VOCE GATE",
        "date_str": "Final Defense",
        "semester": "Semester VIII",
        "slide_count": 20,
        "focus": "Complete 20-slide master oral defense deck covering inception to validation for external university examiners."
    }
]
