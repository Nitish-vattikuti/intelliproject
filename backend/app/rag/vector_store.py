import os
import math
import re
from typing import List, Dict, Any, Optional
from app.rag.seed_papers import SEED_PAPERS
from app.core.config import settings

class VectorStoreManager:
    """
    RAG Vector Store Manager with ChromaDB and live academic ingestion.
    Supports indexing documents, persistent ChromaDB collection, and dense retrieval.
    """
    def __init__(self):
        self.chroma_client = None
        self.collection = None
        self.papers = list(SEED_PAPERS)
        self._init_chroma()

    def _init_chroma(self):
        try:
            import chromadb
            os.makedirs(settings.CHROMA_PERSIST_DIR, exist_ok=True)
            self.chroma_client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)
            self.collection = self.chroma_client.get_or_create_collection(
                name="academic_papers",
                metadata={"description": "IntelliProject Academic Research Papers and Project Literature"}
            )
            self._seed_collection()
        except Exception as e:
            print(f"[VectorStore] ChromaDB note: {e}")

    def _seed_collection(self):
        if not self.collection:
            return
        
        try:
            if self.collection.count() >= len(self.papers):
                return
        except Exception:
            pass

        documents = []
        metadatas = []
        ids = []

        for paper in self.papers:
            doc_text = f"Title: {paper['title']}\n" \
                       f"Domain: {paper['domain']} ({', '.join(paper.get('subdomains', []))})\n" \
                       f"Abstract: {paper['abstract']}\n" \
                       f"Contributions: {' '.join(paper.get('key_contributions', []))}\n" \
                       f"Limitations: {' '.join(paper.get('limitations', []))}"
            
            documents.append(doc_text)
            ids.append(paper["id"])
            metadatas.append({
                "title": paper["title"],
                "authors": paper["authors"],
                "year": paper["year"],
                "venue": paper["venue"],
                "domain": paper["domain"],
                "url": paper["url"],
                "doi_or_arxiv": paper.get("doi_or_arxiv", "")
            })

        try:
            self.collection.upsert(documents=documents, metadatas=metadatas, ids=ids)
            print(f"[VectorStore] Seeded ChromaDB with {len(documents)} papers.")
        except Exception as e:
            print(f"[VectorStore] Seed upsert notice: {e}")

    def index_live_papers(self, live_papers: List[Dict[str, Any]]):
        """Indexes live retrieved arXiv papers into ChromaDB collection"""
        if not live_papers:
            return

        documents = []
        metadatas = []
        ids = []

        existing_ids = set(p["id"] for p in self.papers)

        for p in live_papers:
            if p["id"] not in existing_ids:
                self.papers.insert(0, p)
                existing_ids.add(p["id"])

            doc_text = f"Title: {p['title']}\nAbstract: {p['abstract']}\nDomain: {p.get('domain', '')}"
            documents.append(doc_text)
            ids.append(p["id"])
            metadatas.append({
                "title": p.get("title", ""),
                "authors": p.get("authors", ""),
                "year": p.get("year", 2025),
                "venue": p.get("venue", "arXiv"),
                "domain": p.get("domain", "Computer Science"),
                "url": p.get("url", ""),
                "doi_or_arxiv": p.get("doi_or_arxiv", "")
            })

        if self.collection and documents:
            try:
                self.collection.upsert(documents=documents, metadatas=metadatas, ids=ids)
                print(f"[VectorStore] Indexed {len(documents)} live arXiv papers into ChromaDB.")
            except Exception as e:
                print(f"[VectorStore] Ingest notice: {e}")

    def _tokenize(self, text: str) -> set[str]:
        words = re.findall(r'\b[a-zA-Z0-9_-]{2,}\b', text.lower())
        stopwords = {"the", "a", "an", "and", "or", "in", "on", "at", "to", "for", "with", "by", "from", "of", "is", "are", "using", "based", "system", "approach"}
        return set(w for w in words if w not in stopwords)

    def _compute_similarity(self, query_tokens: set[str], paper: dict) -> float:
        text_corpus = f"{paper['title']} {paper.get('domain', '')} {' '.join(paper.get('subdomains', []))} {paper['abstract']} {' '.join(paper.get('key_contributions', []))}".lower()
        paper_tokens = self._tokenize(text_corpus)
        if not query_tokens or not paper_tokens:
            return 0.5
            
        intersection = query_tokens.intersection(paper_tokens)
        title_tokens = self._tokenize(paper['title'])
        title_overlap = len(query_tokens.intersection(title_tokens))
        
        jaccard = (len(intersection) + (title_overlap * 2.0)) / (len(query_tokens.union(paper_tokens)) + 1e-5)
        score = min(0.98, max(0.55, 0.50 + (jaccard * 3.5)))
        return round(score, 4)

    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieves top_k relevant academic papers from ChromaDB and local corpus.
        """
        results = []
        id_to_paper = {p["id"]: p for p in self.papers}

        # Try ChromaDB query
        if self.collection:
            try:
                chroma_res = self.collection.query(
                    query_texts=[query],
                    n_results=min(top_k * 2, max(1, self.collection.count()))
                )
                if chroma_res and chroma_res.get("ids") and len(chroma_res["ids"][0]) > 0:
                    retrieved_ids = chroma_res["ids"][0]
                    distances = chroma_res.get("distances", [[]])[0] if chroma_res.get("distances") else []
                    
                    for idx, pid in enumerate(retrieved_ids):
                        if pid in id_to_paper:
                            p = id_to_paper[pid].copy()
                            dist = distances[idx] if idx < len(distances) and distances[idx] is not None else 0.2
                            sim = max(0.60, min(0.98, 1.0 - (dist * 0.4)))
                            p["similarity_score"] = round(sim, 3)
                            results.append(p)
            except Exception as e:
                print(f"[VectorStore] Chroma query note: {e}")

        # If Chroma returned results, sort and return top_k
        if results:
            results.sort(key=lambda x: x["similarity_score"], reverse=True)
            return results[:top_k]

        # Semantic fallback over all indexed papers
        query_tokens = self._tokenize(query)
        scored = []
        for paper in self.papers:
            sim = self._compute_similarity(query_tokens, paper)
            p_copy = paper.copy()
            p_copy["similarity_score"] = sim
            scored.append(p_copy)
        
        scored.sort(key=lambda x: x["similarity_score"], reverse=True)
        return scored[:top_k]

vector_store = VectorStoreManager()
