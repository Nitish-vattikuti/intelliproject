# IntelliProject: Agentic AI-Based Intelligent Project Mentor using RAG and Knowledge Graph

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![ChromaDB](https://img.shields.io/badge/VectorDB-ChromaDB-FC521F.svg)](https://www.trychroma.com/)
[![NetworkX](https://img.shields.io/badge/KnowledgeGraph-NetworkX%20%2F%20Neo4j-0284c7.svg)](https://networkx.org)
[![LangGraph](https://img.shields.io/badge/Agents-LangGraph-8b5cf6.svg)](https://langchain-ai.github.io/langgraph/)

An autonomous, multi-agent AI mentorship platform designed to guide engineering students through the complete capstone lifecycle—from project ideation and dense literature survey to novelty verification, research gap extraction, learning roadmaps, thesis documentation, and viva-voce examination.

---

## 🌟 Core Features & Modules

### 1. Multi-Agent Orchestrator Studio (8 Specialized Agents)
- **Planner Agent**: Analyzes student background, skills, domain interests, target difficulty, and timeframe to assemble an execution DAG.
- **Project Recommendation Agent**: Formulates 3 distinct, publication-grade project proposals with problem statements, objectives, and tech stacks.
- **Custom Project Mentorship**: Submit any custom project idea directly to receive instant novelty scoring, literature RAG, research gaps, roadmap, thesis documentation, and viva drills tailored to your exact idea.
- **Novelty Agent**: Evaluates project uniqueness against known academic literature and open-source repositories; computes an Innovation Score (0–100%).
- **Research Gap Agent**: Identifies unaddressed algorithmic, data, and deployment limitations in current research that your project can resolve.
- **Learning Roadmap Agent**: Sequences an interactive 16-week milestone timeline with weekly deliverables, tools, and progress checkboxes.
- **Documentation Agent**: Generates IEEE-format abstracts, problem statements, methodologies, and complete Chapters 1–5 thesis drafts with 1-click Markdown export.
- **Viva Agent**: Simulates a university viva-voce panel; asks categorized defense questions and scores student oral answers (0–10) with rubric feedback.

### 2. RAG Knowledge Base & Ask RAG Assistant
- Pre-indexed in **ChromaDB** with dense vector representations and cosine similarity matching.
- Curated academic literature covering NLP embeddings, Multi-Agent workflows, RAG evaluation, Knowledge Graph RAG, Healthcare AI, TinyML IoT, and Blockchain.
- **Interactive Ask RAG Assistant**: Ask any technical question about the literature to receive factual, citation-grounded answers.

### 3. Interactive Computer Science Knowledge Graph
- Built with **NetworkX** and fully compatible with Neo4j.
- Taxonomic hierarchies connecting Domains, Subdomains, Concepts, Technologies, and Project Archetypes.
- **Interactive HTML5 Canvas Viewer**: Drag, zoom, filter by entity type, and compute multi-hop conceptual dependency pathways.

### 4. Capstone Projects Workspace Manager
- Save projects to database, track completion status, edit objectives, and switch between active project workspaces.

---

## 🏗️ System Architecture

```
                                 ┌──────────────────────────────────────────────┐
                                 │     React.js + Tailwind CSS Web Frontend     │
                                 │   (Dashboard, Agent Studio, Knowledge Graph, │
                                 │     Ask RAG, Viva Simulator, Thesis Builder) │
                                 └──────────────────────┬───────────────────────┘
                                                        │ REST / JSON APIs
                                 ┌──────────────────────▼───────────────────────┐
                                 │             FastAPI Backend Hub              │
                                 └──────────────────────┬───────────────────────┘
                                                        │
                      ┌─────────────────────────────────┴─────────────────────────────────┐
                      │                     LangGraph Multi-Agent Engine                   │
                      └───────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬───┘
                              │         │         │         │         │         │         │
                   ┌──────────▼┐ ┌──────▼───┐ ┌───▼─────┐ ┌─▼───────┐ ┌▼───────┐ ┌▼───────┐ ┌▼──────┐
                   │  Planner  │ │ Project  │ │Research │ │ Novelty │ │Research│ │Learning│ │ Docs &│
                   │   Agent   │ │Recommend │ │ Paper   │ │  Agent  │ │  Gap   │ │Roadmap │ │ Viva  │
                   │           │ │  Agent   │ │(RAG) Agt│ │ (Score) │ │ Agent  │ │ Agent  │ │ Agents│
                   └───────────┘ └──────────┘ └─────────┘ └─────────┘ └─────────┘ └────────┘ └──────┘
                                      │            │           │           │           │
                 ┌────────────────────┴────────────┼───────────┴───────────┴───────────┴────┐
                 │                                 │                                        │
      ┌──────────▼───────────────┐   ┌─────────────▼───────────────┐          ┌─────────────▼──────────┐
      │  ChromaDB Vector Store   │   │   Neo4j / Knowledge Graph   │          │   Google Gemini API    │
      │  (Academic Papers, IEEE, │   │   (Domain -> Concept ->     │          │   (Reasoning & Natural │
      │   Past Project Catalog)  │   │    Tech -> Project Links)   │          │    Language Generation)│
      └──────────────────────────┘   └─────────────────────────────┘          └────────────────────────┘
```

---

## 🚀 Quickstart & Running Locally

### Start Both Backend & Frontend
```bash
./start.sh
```
- **Web Frontend**: `http://localhost:5173`
- **FastAPI Backend & Interactive Swagger API Docs**: `http://127.0.0.1:8000/docs`

### Manual Execution

#### Backend:
```bash
cd backend
source ./venv/bin/activate
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### Frontend:
```bash
cd frontend
npm run dev
```

---

## 🧪 Automated Testing

```bash
cd backend
PYTHONPATH=. ./venv/bin/pytest tests/
```
All 5 unit and integration tests verify:
- Knowledge Graph structure & neighbor retrieval
- ChromaDB vector store dense semantic search
- Planner Agent execution DAG generation
- Project Recommendation Agent proposal synthesis
- Viva Agent question formulation
