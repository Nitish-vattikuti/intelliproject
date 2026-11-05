"""
Comprehensive Computer Science & Engineering Ontology for IntelliProject Knowledge Graph.
Defines domains, subdomains, paradigms, technologies, libraries, and relationships.
"""

ONTOLOGY_NODES = [
    # Top-Level Domains
    {"id": "ai", "label": "Artificial Intelligence", "category": "Domain", "level": 1, "color": "#6366f1"},
    {"id": "cloud_systems", "label": "Cloud & Distributed Systems", "category": "Domain", "level": 1, "color": "#0ea5e9"},
    {"id": "cybersecurity", "label": "Cybersecurity & Cryptography", "category": "Domain", "level": 1, "color": "#ef4444"},
    {"id": "iot_robotics", "label": "IoT & Edge Computing", "category": "Domain", "level": 1, "color": "#10b981"},
    {"id": "data_eng", "label": "Data Engineering & Analytics", "category": "Domain", "level": 1, "color": "#f59e0b"},

    # AI Subdomains
    {"id": "ml", "label": "Machine Learning", "category": "Subdomain", "level": 2, "color": "#818cf8"},
    {"id": "nlp", "label": "Natural Language Processing", "category": "Subdomain", "level": 2, "color": "#a855f7"},
    {"id": "cv", "label": "Computer Vision", "category": "Subdomain", "level": 2, "color": "#ec4899"},
    {"id": "agentic_ai", "label": "Agentic AI & Multi-Agent Systems", "category": "Subdomain", "level": 2, "color": "#06b6d4"},
    
    # ML/DL Concepts
    {"id": "dl", "label": "Deep Learning", "category": "Concept", "level": 3, "color": "#93c5fd"},
    {"id": "transformers", "label": "Transformer Architectures", "category": "Concept", "level": 3, "color": "#c084fc"},
    {"id": "rag_concept", "label": "Retrieval-Augmented Generation (RAG)", "category": "Concept", "level": 3, "color": "#38bdf8"},
    {"id": "kg_concept", "label": "Knowledge Graphs & Ontologies", "category": "Concept", "level": 3, "color": "#34d399"},
    {"id": "vector_embeddings", "label": "Vector Embeddings & Semantic Search", "category": "Concept", "level": 3, "color": "#f472b6"},

    # Frameworks & Technologies
    {"id": "fastapi", "label": "FastAPI", "category": "Technology", "level": 4, "color": "#22c55e"},
    {"id": "react", "label": "React.js", "category": "Technology", "level": 4, "color": "#38bdf8"},
    {"id": "langgraph", "label": "LangGraph", "category": "Technology", "level": 4, "color": "#8b5cf6"},
    {"id": "chromadb", "label": "ChromaDB", "category": "Technology", "level": 4, "color": "#eab308"},
    {"id": "neo4j", "label": "Neo4j", "category": "Technology", "level": 4, "color": "#0284c7"},
    {"id": "pytorch", "label": "PyTorch", "category": "Technology", "level": 4, "color": "#f97316"},
    {"id": "gemini_api", "label": "Gemini 1.5 / 2.0 API", "category": "Technology", "level": 4, "color": "#4f46e5"},
    {"id": "docker", "label": "Docker & Containers", "category": "Technology", "level": 4, "color": "#0284c7"},
    {"id": "postgresql", "label": "PostgreSQL", "category": "Technology", "level": 4, "color": "#3b82f6"},

    # Project Archetypes / Deliverables
    {"id": "proj_intelliproject", "label": "IntelliProject Mentor System", "category": "Project", "level": 5, "color": "#14b8a6"},
    {"id": "proj_med_rag", "label": "Clinical Diagnostic RAG Assistant", "category": "Project", "level": 5, "color": "#14b8a6"},
    {"id": "proj_edge_vision", "label": "Edge AI Smart Surveillance", "category": "Project", "level": 5, "color": "#14b8a6"},
    {"id": "proj_zkp_cred", "label": "ZK-Proof Academic Credentialing", "category": "Project", "level": 5, "color": "#14b8a6"}
]

ONTOLOGY_EDGES = [
    # AI Hierarchy
    {"source": "ai", "target": "ml", "relation": "SUBFIELD_OF"},
    {"source": "ml", "target": "dl", "relation": "EXTENDS"},
    {"source": "ai", "target": "nlp", "relation": "SUBFIELD_OF"},
    {"source": "ai", "target": "cv", "relation": "SUBFIELD_OF"},
    {"source": "ai", "target": "agentic_ai", "relation": "EMERGING_PARADIGM"},

    # Connections into Concepts
    {"source": "nlp", "target": "transformers", "relation": "UTILIZES"},
    {"source": "transformers", "target": "rag_concept", "relation": "ENABLES"},
    {"source": "rag_concept", "target": "vector_embeddings", "relation": "REQUIRES"},
    {"source": "rag_concept", "target": "kg_concept", "relation": "HYBRIDIZED_WITH"},
    {"source": "agentic_ai", "target": "langgraph", "relation": "IMPLEMENTED_USING"},
    {"source": "agentic_ai", "target": "gemini_api", "relation": "POWERED_BY"},

    # Technologies to Concepts
    {"source": "vector_embeddings", "target": "chromadb", "relation": "INDEXED_IN"},
    {"source": "kg_concept", "target": "neo4j", "relation": "STORED_IN"},
    {"source": "dl", "target": "pytorch", "relation": "IMPLEMENTED_IN"},
    {"source": "cv", "target": "pytorch", "relation": "BUILT_ON"},

    # Fullstack & Infrastructure
    {"source": "fastapi", "target": "postgresql", "relation": "PERSISTS_TO"},
    {"source": "fastapi", "target": "langgraph", "relation": "ORCHESTRATES"},
    {"source": "react", "target": "fastapi", "relation": "COMMUNICATES_WITH"},
    {"source": "cloud_systems", "target": "docker", "relation": "DEPLOYED_VIA"},

    # Project Mappings
    {"source": "proj_intelliproject", "target": "agentic_ai", "relation": "ARCHITECTED_ON"},
    {"source": "proj_intelliproject", "target": "rag_concept", "relation": "INCORPORATES"},
    {"source": "proj_intelliproject", "target": "kg_concept", "relation": "INTEGRATES"},
    {"source": "proj_intelliproject", "target": "fastapi", "relation": "BACKEND_STACK"},
    {"source": "proj_intelliproject", "target": "react", "relation": "FRONTEND_STACK"},

    {"source": "proj_med_rag", "target": "rag_concept", "relation": "SPECIALIZES"},
    {"source": "proj_med_rag", "target": "cv", "relation": "IMAGE_MODALITY"},
    {"source": "proj_edge_vision", "target": "iot_robotics", "relation": "HARDWARE_TIER"},
    {"source": "proj_edge_vision", "target": "cv", "relation": "VISION_CORE"},
    {"source": "proj_zkp_cred", "target": "cybersecurity", "relation": "CRYPTOGRAPHY_CORE"}
]
