import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ExternalLink, Sparkles, Filter, ChevronDown, ChevronUp, Layers, MessageSquare, Send, RefreshCw, CheckCircle2 } from 'lucide-react';
import { searchPapers, askRAG } from '../services/api';

export default function ResearchHub({ activeProject, orchestrationResult, onNavigate }) {
  const initialQuery = activeProject 
    ? `${activeProject.title}` 
    : 'Deep Learning, Artificial Intelligence, and Scalable Systems';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedPaper, setExpandedPaper] = useState(null);

  // Ask RAG State
  const [ragQuestion, setRagQuestion] = useState('');
  const [isAskingRAG, setIsAskingRAG] = useState(false);
  const [ragAnswer, setRagAnswer] = useState(null);

  const sampleQueries = activeProject ? [
    activeProject.title,
    activeProject.domain || "Computer Science",
    ...(activeProject.tech_stack || []).slice(0, 2),
    "State of the Art Benchmarks & Ablation Studies"
  ] : [
    "Autonomous Robotics and Visual SLAM",
    "Vision Transformers in Healthcare",
    "Zero-Knowledge Cryptography and Blockchains",
    "Agentic AI and Multi-Agent Workflows",
    "Graph Neural Networks & Relational Embeddings"
  ];

  const handleSearch = async (searchQuery) => {
    const q = searchQuery || query;
    if (!q.trim()) return;
    setIsLoading(true);
    try {
      const data = await searchPapers(q, 5);
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskRAG = async () => {
    if (!ragQuestion.trim()) return;
    setIsAskingRAG(true);
    try {
      const data = await askRAG(ragQuestion, 4);
      setRagAnswer(data);
    } catch (err) {
      console.error("RAG QA error:", err);
    } finally {
      setIsAskingRAG(false);
    }
  };

  useEffect(() => {
    if (activeProject?.title) {
      setQuery(activeProject.title);
      handleSearch(activeProject.title);
    } else {
      handleSearch(initialQuery);
    }
  }, [activeProject?.title]);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span>ChromaDB Academic RAG Knowledge Base</span>
        </div>
        <h2 className="text-2xl font-bold text-white font-['Outfit']">
          Research Papers & Literature Survey Hub
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Semantic dense retrieval over indexed arXiv, IEEE, and peer-reviewed research papers. Ground your final-year thesis in verified academic literature.
        </p>
      </div>

      {/* Search Bar & Preset Pills */}
      <div className="glass-panel p-5 rounded-2xl border border-zinc-800/80 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search academic literature, architectures, or papers (e.g. SBERT, Graph RAG, Agentic AI)..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/90 border border-zinc-700/60 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={isLoading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition flex items-center space-x-2 disabled:opacity-50 shadow-sm"
          >
            <span>{isLoading ? 'Retrieving...' : 'RAG Retrieve'}</span>
          </button>
        </div>

        {/* Quick query chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <span className="text-[11px] text-zinc-400 shrink-0">Quick Queries:</span>
          {sampleQueries.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(sq);
                handleSearch(sq);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 whitespace-nowrap transition border border-zinc-700/50"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Synthesis Summary */}
      {results?.analysis?.synthesis_summary && (
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 leading-relaxed space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold uppercase tracking-wider text-[11px]">
            <Sparkles className="w-4 h-4" />
            <span>AI Literature Survey Synthesis (RAG Agent)</span>
          </div>
          <p className="text-zinc-300">{results.analysis.synthesis_summary}</p>
        </div>
      )}

      {/* Interactive Ask RAG Literature Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-300 uppercase tracking-wider">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span>Ask RAG Assistant (Q&A Over Indexed Literature)</span>
        </div>
        <p className="text-xs text-zinc-400">
          Ask technical questions about the retrieved papers, architectures, or benchmarks to get literature-grounded answers.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={ragQuestion}
            onChange={(e) => setRagQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskRAG()}
            placeholder="e.g., How does Graph RAG mitigate multi-hop retrieval failure modes compared to dense embeddings alone?"
            className="flex-1 bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition"
          />
          <button
            onClick={handleAskRAG}
            disabled={isAskingRAG || !ragQuestion.trim()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center space-x-1.5 disabled:opacity-50 shadow-sm"
          >
            {isAskingRAG ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>{isAskingRAG ? 'Searching Corpus...' : 'Ask RAG'}</span>
          </button>
        </div>

        {ragAnswer && (
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-700/60 text-xs text-zinc-200 leading-relaxed space-y-2 animate-fade-in">
            <span className="font-semibold text-zinc-300 block text-[11px] uppercase tracking-wider">
              Grounded AI Literature Answer:
            </span>
            <p className="text-zinc-200">{ragAnswer.answer}</p>
            {ragAnswer.cited_papers?.length > 0 && (
              <div className="pt-2 border-t border-zinc-800 flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-zinc-400">Citations:</span>
                {ragAnswer.cited_papers.map((cp, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
                    {cp.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Retrieved Papers List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit']">
            Retrieved Academic Papers ({results?.papers?.length || 0})
          </h3>
          <span className="text-xs text-zinc-400 font-mono">
            ChromaDB Cosine Proximity Scored
          </span>
        </div>

        <div className="space-y-3">
          {results?.papers?.map((paper) => {
            const isExpanded = expandedPaper === paper.id;
            return (
              <div
                key={paper.id}
                className="glass-panel p-5 rounded-2xl border border-zinc-800/80 hover:border-zinc-700 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono text-zinc-300 font-semibold bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                        {paper.doi_or_arxiv || paper.id}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-medium">
                        {paper.authors} ({paper.year}) · {paper.venue}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white font-['Outfit'] mt-1">
                      {paper.title}
                    </h4>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {paper.domain}
                      </span>
                      {paper.subdomains?.map((sub, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2 shrink-0">
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/40 font-mono">
                      Match: {Math.round((paper.similarity_score || 0.9) * 100)}%
                    </span>
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition flex items-center space-x-1 text-[10px]"
                    >
                      <span>Paper Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {paper.abstract}
                </p>

                <button
                  onClick={() => setExpandedPaper(isExpanded ? null : paper.id)}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 pt-1"
                >
                  <span>{isExpanded ? 'Hide Detailed Survey Analysis' : 'Inspect Contributions & Limitations'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {isExpanded && (
                  <div className="pt-3 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                      <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                        Key Contributions
                      </span>
                      <ul className="space-y-1">
                        {paper.key_contributions?.map((c, i) => (
                          <li key={i} className="text-xs text-zinc-300 flex items-start space-x-1.5">
                            <span className="text-emerald-400">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                      <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                        Identified Limitations & Research Gaps
                      </span>
                      <ul className="space-y-1">
                        {paper.limitations?.map((l, i) => (
                          <li key={i} className="text-xs text-zinc-300 flex items-start space-x-1.5">
                            <span className="text-amber-400">•</span>
                            <span>{l}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* Comparative Literature Survey Table */}
      {results?.analysis?.comparison_table && (
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit']">
              Comparative Literature Survey Matrix (Thesis Chapter 2)
            </h3>
            <span className="text-[11px] text-zinc-400">
              Structured Prior Art Analysis
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300 border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] font-semibold">
                  <th className="py-3 px-3">Research Work</th>
                  <th className="py-3 px-3">Approach</th>
                  <th className="py-3 px-3">Key Advantages</th>
                  <th className="py-3 px-3">Limitations</th>
                  <th className="py-3 px-3">Relevance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {results.analysis.comparison_table.map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-800/40 transition">
                    <td className="py-3 px-3 font-semibold text-white max-w-xs">{row.paper_title}</td>
                    <td className="py-3 px-3 text-indigo-300">{row.approach}</td>
                    <td className="py-3 px-3 text-emerald-300">{row.key_advantages}</td>
                    <td className="py-3 px-3 text-amber-300">{row.limitations}</td>
                    <td className="py-3 px-3 text-zinc-400">{row.relevance_to_project}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
