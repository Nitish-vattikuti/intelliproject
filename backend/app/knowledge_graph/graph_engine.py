import json
import re
import networkx as nx
from typing import List, Dict, Any, Optional
from app.knowledge_graph.seed_ontology import ONTOLOGY_NODES, ONTOLOGY_EDGES
from app.core.llm import llm_service

CATEGORY_COLORS = {
    "Domain": "#818cf8",        # Light Indigo
    "Subdomain": "#a5b4fc",     # Soft Indigo
    "Architecture": "#6366f1",  # Deep Indigo
    "Algorithm": "#10b981",     # Emerald
    "Technology": "#38bdf8",     # Sky Blue
    "Dataset": "#f43f5e",        # Rose
    "Evaluation": "#f59e0b"      # Amber
}

class KnowledgeGraphEngine:
    """
    Knowledge Graph Engine:
    Manages global CS & AI taxonomies, and generates dynamic, project-specific
    concept relationship graphs using live AI extraction.
    """
    def __init__(self):
        self.graph = nx.DiGraph()
        self.nodes_data = {n["id"]: n for n in ONTOLOGY_NODES}
        self.edges_data = ONTOLOGY_EDGES
        self.project_graphs: Dict[str, Dict[str, Any]] = {}
        self._build_graph()

    def _build_graph(self):
        for node in ONTOLOGY_NODES:
            self.graph.add_node(node["id"], **node)

        for edge in ONTOLOGY_EDGES:
            self.graph.add_edge(edge["source"], edge["target"], relation=edge["relation"])

    def get_full_graph(self) -> Dict[str, Any]:
        """Returns the foundational CS/AI ontology formatted for visualization engines"""
        nodes = []
        for n_id, attrs in self.graph.nodes(data=True):
            cat = attrs.get("category", "Concept")
            nodes.append({
                "id": n_id,
                "label": attrs.get("label", n_id),
                "category": cat,
                "level": attrs.get("level", 2),
                "color": attrs.get("color") or CATEGORY_COLORS.get(cat, "#6366f1")
            })
            
        edges = []
        for u, v, attrs in self.graph.edges(data=True):
            edges.append({
                "source": u,
                "target": v,
                "relation": attrs.get("relation", "RELATES_TO")
            })

        return {
            "title": "Computer Science & AI Global Ontology",
            "nodes": nodes,
            "edges": edges,
            "stats": {
                "total_nodes": self.graph.number_of_nodes(),
                "total_edges": self.graph.number_of_edges(),
                "categories": list(set(n.get("category", "") for n in nodes))
            }
        }

    async def generate_project_graph(
        self,
        title: str,
        domain: str = "",
        description: str = "",
        tech_stack: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Dynamically extracts a technical concept graph for a specific user project using Gemini.
        Validates input to prevent generic/trivial outputs on empty or placeholder queries.
        """
        clean_title = (title or "").strip()
        clean_desc = (description or "").strip()
        words = clean_title.split()

        # Strict validation: prevent generic graphs on trivial inputs like "hi", "test"
        trivial_inputs = {"hi", "hello", "test", "demo", "asdf", "none", "project", "my project", "a", "b", "c"}
        if len(clean_title) < 4 or clean_title.lower() in trivial_inputs or (len(words) == 1 and len(clean_desc) < 15):
            return {
                "error": f"The project input '{clean_title}' is too brief or ambiguous to generate an ontological graph. Please provide a descriptive engineering topic (e.g., 'Autonomous Drone Obstacle Avoidance with Edge AI' or 'Decentralized Federated Learning for Medical IoT') so AI can extract real architectural components, algorithms, and dependencies.",
                "valid": False,
                "nodes": [],
                "edges": [],
                "stats": {"total_nodes": 0, "total_edges": 0, "categories": []}
            }

        cache_key = f"{clean_title.lower()}_{domain.lower()}"
        if cache_key in self.project_graphs:
            return self.project_graphs[cache_key]

        tech_str = ", ".join(tech_stack) if tech_stack else "Python, FastAPI, PyTorch"

        prompt = f"""
Extract a concise, technical Computer Science knowledge graph for:
Project Title: {clean_title}
Domain: {domain or 'Computer Science & Engineering'}
Description: {clean_desc or f'System engineering for {clean_title}'}
Tech Stack: {tech_str}

Generate 12 to 16 nodes and 14 to 20 directional edges. Keep descriptions under 10 words.
Valid categories: Domain, Architecture, Algorithm, Technology, Dataset, Evaluation.

Format STRICTLY as valid JSON:
{{
  "project_summary": "Short 2-sentence summary of architecture.",
  "nodes": [
    {{"id": "short_unique_id", "label": "Concise Label", "category": "Algorithm", "level": 2, "description": "Short explanation"}}
  ],
  "edges": [
    {{"source": "short_unique_id", "target": "short_unique_id_2", "relation": "IMPLEMENTS"}}
  ]
}}
Do NOT output code blocks or markdown, return ONLY the raw JSON string.
"""
        system_instruction = "You are a Computer Science knowledge graph specialist creating domain ontologies. Output strictly valid JSON."
        llm_response = await llm_service.generate_content(system_instruction, prompt)

        graph_result = None
        if llm_response:
            try:
                clean_json = llm_response.strip().replace("```json", "").replace("```", "").strip()
                s_idx = clean_json.find("{")
                e_idx = clean_json.rfind("}")
                if s_idx != -1 and e_idx != -1:
                    clean_json = clean_json[s_idx:e_idx+1]
                data = json.loads(clean_json)

                raw_nodes = data.get("nodes", [])
                raw_edges = data.get("edges", [])

                if raw_nodes and len(raw_nodes) >= 6:
                    valid_node_ids = set()
                    nodes = []
                    for n in raw_nodes:
                        nid = str(n.get("id", "")).lower().replace(" ", "_").replace("-", "_")
                        if nid:
                            valid_node_ids.add(nid)
                            cat = n.get("category", "Architecture")
                            nodes.append({
                                "id": nid,
                                "label": n.get("label", nid),
                                "category": cat,
                                "level": int(n.get("level", 2)),
                                "color": CATEGORY_COLORS.get(cat, "#6366f1"),
                                "description": n.get("description", "")
                            })

                    edges = []
                    for e in raw_edges:
                        src = str(e.get("source", "")).lower().replace(" ", "_").replace("-", "_")
                        tgt = str(e.get("target", "")).lower().replace(" ", "_").replace("-", "_")
                        if src in valid_node_ids and tgt in valid_node_ids and src != tgt:
                            edges.append({
                                "source": src,
                                "target": tgt,
                                "relation": e.get("relation", "RELATES_TO")
                            })

                    graph_result = {
                        "title": f"Ontology: {clean_title}",
                        "valid": True,
                        "project_summary": data.get("project_summary", f"Ontological concept graph for {clean_title}"),
                        "nodes": nodes,
                        "edges": edges,
                        "stats": {
                            "total_nodes": len(nodes),
                            "total_edges": len(edges),
                            "categories": list(set(n["category"] for n in nodes))
                        }
                    }
            except Exception as ex:
                print(f"[KnowledgeGraphEngine] JSON parse note: {ex}")

        if not graph_result:
            # Dynamic algorithmic fallback customized specifically to project tokens
            root_id = re.sub(r'[^a-z0-9]', '_', clean_title.lower())[:20].strip('_')
            domain_id = re.sub(r'[^a-z0-9]', '_', (domain or "ai").lower())[:15].strip('_')
            
            nodes = [
                {"id": root_id, "label": clean_title, "category": "Domain", "level": 1, "color": CATEGORY_COLORS["Domain"], "description": f"Core engineering project: {clean_title}"},
                {"id": domain_id, "label": domain or "Computer Science", "category": "Subdomain", "level": 1, "color": CATEGORY_COLORS["Subdomain"], "description": "Primary academic domain"},
                {"id": f"{root_id}_ingestion", "label": "Data Ingestion Pipeline", "category": "Architecture", "level": 2, "color": CATEGORY_COLORS["Architecture"], "description": "Captures and normalizes input data"},
                {"id": f"{root_id}_core_engine", "label": "Core Algorithmic Engine", "category": "Algorithm", "level": 2, "color": CATEGORY_COLORS["Algorithm"], "description": "Primary model inference and state logic"},
                {"id": f"{root_id}_api_service", "label": "API Microservice Gateway", "category": "Technology", "level": 2, "color": CATEGORY_COLORS["Technology"], "description": "Exposes endpoints for external interaction"},
                {"id": f"{root_id}_telemetry", "label": "Evaluation Telemetry", "category": "Evaluation", "level": 3, "color": CATEGORY_COLORS["Evaluation"], "description": "Tracks latency, throughput, and accuracy metrics"}
            ]

            # Add tech stack nodes
            if tech_stack:
                for idx, t in enumerate(tech_stack[:4]):
                    t_id = re.sub(r'[^a-z0-9]', '_', t.lower()).strip('_')
                    nodes.append({
                        "id": t_id,
                        "label": t,
                        "category": "Technology",
                        "level": 3,
                        "color": CATEGORY_COLORS["Technology"],
                        "description": f"Supporting technology: {t}"
                    })

            edges = [
                {"source": root_id, "target": domain_id, "relation": "SUBFIELD_OF"},
                {"source": root_id, "target": f"{root_id}_ingestion", "relation": "IMPLEMENTS"},
                {"source": f"{root_id}_ingestion", "target": f"{root_id}_core_engine", "relation": "FEEDS_DATA_TO"},
                {"source": f"{root_id}_core_engine", "target": f"{root_id}_api_service", "relation": "EXPOSES"},
                {"source": f"{root_id}_core_engine", "target": f"{root_id}_telemetry", "relation": "EVALUATED_BY"}
            ]

            if tech_stack:
                for t in tech_stack[:4]:
                    t_id = re.sub(r'[^a-z0-9]', '_', t.lower()).strip('_')
                    edges.append({"source": f"{root_id}_core_engine", "target": t_id, "relation": "DEPENDS_ON"})

            graph_result = {
                "title": f"Ontology: {clean_title}",
                "valid": True,
                "project_summary": f"Systematic architecture and technology dependency network for {clean_title}.",
                "nodes": nodes,
                "edges": edges,
                "stats": {
                    "total_nodes": len(nodes),
                    "total_edges": len(edges),
                    "categories": list(set(n["category"] for n in nodes))
                }
            }

        self.project_graphs[cache_key] = graph_result
        return graph_result

    def get_neighbors(self, node_id: str, depth: int = 1) -> Dict[str, Any]:
        """Retrieves adjacent nodes up to a specified hop depth"""
        if node_id not in self.graph:
            for n_id, attrs in self.graph.nodes(data=True):
                if node_id.lower() in attrs.get("label", "").lower():
                    node_id = n_id
                    break

        if node_id not in self.graph:
            return {"nodes": [], "edges": []}

        subgraph_nodes = {node_id}
        current_layer = {node_id}

        for _ in range(depth):
            next_layer = set()
            for n in current_layer:
                successors = set(self.graph.successors(n))
                predecessors = set(self.graph.predecessors(n))
                next_layer.update(successors)
                next_layer.update(predecessors)
            subgraph_nodes.update(next_layer)
            current_layer = next_layer

        subgraph = self.graph.subgraph(subgraph_nodes)
        
        nodes = [self.nodes_data[n] for n in subgraph.nodes() if n in self.nodes_data]
        edges = []
        for u, v in subgraph.edges():
            rel = self.graph[u][v].get("relation", "RELATES_TO")
            edges.append({"source": u, "target": v, "relation": rel})

        return {"center_node": node_id, "nodes": nodes, "edges": edges}

    def find_path(self, start_id: str, end_id: str) -> List[str]:
        """Calculates shortest conceptual pathway between two entities"""
        try:
            undirected = self.graph.to_undirected()
            if nx.has_path(undirected, start_id, end_id):
                path = nx.shortest_path(undirected, source=start_id, target=end_id)
                return [self.nodes_data.get(pid, {}).get("label", pid) for pid in path]
        except Exception:
            pass
        return []

    def recommend_technologies(self, domain: str = "") -> List[Dict[str, Any]]:
        """
        Recommends technologies from the knowledge graph relevant to the specified domain.
        Falls back to curated domain-aligned tech stacks if no direct graph links exist.
        """
        domain_lower = (domain or "").lower()
        tech_nodes = []
        for n_id, attrs in self.graph.nodes(data=True):
            if attrs.get("category") == "Technology":
                tech_nodes.append({
                    "id": n_id,
                    "label": attrs.get("label", n_id),
                    "category": "Technology"
                })

        domain_tech_map = {
            "ai": ["PyTorch", "LangGraph", "ChromaDB", "FastAPI", "React.js", "Gemini 1.5 / 2.0 API"],
            "artificial intelligence": ["PyTorch", "LangGraph", "ChromaDB", "FastAPI", "React.js", "Gemini 1.5 / 2.0 API"],
            "machine learning": ["PyTorch", "FastAPI", "Docker & Containers", "PostgreSQL", "ChromaDB"],
            "cloud": ["Docker & Containers", "FastAPI", "PostgreSQL", "React.js"],
            "distributed": ["Docker & Containers", "FastAPI", "PostgreSQL", "React.js"],
            "cybersecurity": ["FastAPI", "PostgreSQL", "Docker & Containers", "React.js"],
            "iot": ["PyTorch", "Docker & Containers", "FastAPI", "React.js"],
            "robotics": ["PyTorch", "Docker & Containers", "FastAPI", "React.js"],
            "data": ["PostgreSQL", "ChromaDB", "FastAPI", "React.js", "Docker & Containers"]
        }

        for key, techs in domain_tech_map.items():
            if key in domain_lower:
                return [{"id": t.lower().replace(" ", "_"), "label": t, "category": "Technology"} for t in techs]

        if tech_nodes:
            return tech_nodes[:6]

        return [
            {"id": "fastapi", "label": "FastAPI", "category": "Technology"},
            {"id": "react", "label": "React.js", "category": "Technology"},
            {"id": "langgraph", "label": "LangGraph", "category": "Technology"},
            {"id": "chromadb", "label": "ChromaDB", "category": "Technology"}
        ]

knowledge_graph = KnowledgeGraphEngine()

