import React, { useState, useEffect } from 'react';
import { X, Key, CheckCircle2, AlertCircle, RefreshCw, Cpu, Layers, Database, Sparkles } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/settings/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (e) {
      console.log("Status fetch notice:", e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setFeedback(null);
    }
  }, [isOpen]);

  const handleSaveKey = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/settings/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey.trim() }),
      });
      const data = await res.json();
      setFeedback(data);
      fetchStatus();
      setApiKey('');
    } catch (err) {
      setFeedback({ connected: false, message: "Error updating API key." });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-zinc-800 space-y-5 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white font-['Outfit']">
              AI Engine & System Configuration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Engine Status Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-zinc-400 block tracking-wider">Multi-Agent Engine</span>
            <span className="font-semibold text-white flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LangGraph (8 Agents)</span>
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-zinc-400 block tracking-wider">ChromaDB Vector Store</span>
            <span className="font-semibold text-white flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>{status?.chroma_papers_indexed || 8} Papers Indexed</span>
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-zinc-400 block tracking-wider">Knowledge Graph</span>
            <span className="font-semibold text-white flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>{status?.knowledge_graph_nodes || 23} Nodes · {status?.knowledge_graph_edges || 22} Edges</span>
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-zinc-400 block tracking-wider">Gemini LLM Status</span>
            <span className={`font-semibold flex items-center space-x-1.5 ${status?.gemini_connected ? 'text-emerald-400' : 'text-amber-400'}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{status?.gemini_connected ? `Live (${status?.gemini_model || 'Gemini Connected'})` : 'Fallback Dynamic Engine'}</span>
            </span>
          </div>
        </div>

        {/* Gemini API Key Configuration */}
        <div className="space-y-3 pt-2 border-t border-zinc-800">
          <div>
            <label className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5 mb-1">
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              <span>Google Gemini API Key</span>
            </label>
            <p className="text-[11px] text-zinc-400 mb-2">
              Connect your Google AI Studio API Key to enable live Gemini multi-model reasoning and autonomous generation across all agents.
            </p>
          </div>

          <form onSubmit={handleSaveKey} className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 bg-zinc-900 border border-zinc-700/60 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono transition"
            />
            <button
              type="submit"
              disabled={isSaving || !apiKey.trim()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center space-x-1 disabled:opacity-50 shadow-sm"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>{isSaving ? 'Testing...' : 'Save & Connect'}</span>
            </button>
          </form>

          {feedback && (
            <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
              feedback.connected 
                ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' 
                : 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
            }`}>
              {feedback.connected ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{feedback.message}</span>
            </div>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
