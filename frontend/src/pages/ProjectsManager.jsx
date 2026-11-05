import React, { useState, useEffect } from 'react';
import { FolderKanban, Plus, Trash2, CheckCircle2, ArrowRight, Sparkles, Clock, Layers } from 'lucide-react';
import { listProjects, saveProject, deleteProject } from '../services/api';
import confetti from 'canvas-confetti';

export default function ProjectsManager({ activeProject, onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('Artificial Intelligence');
  const [problemStatement, setProblemStatement] = useState('');
  const [techStackStr, setTechStackStr] = useState('');

  const fetchProjectsList = async () => {
    setIsLoading(true);
    try {
      const data = await listProjects();
      const filtered = (data || []).filter(p => !p.title.includes("IntelliProject: Agentic AI-Based"));
      setProjects(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsList();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const stack = techStackStr.split(',').map(s => s.trim()).filter(Boolean);
      const newProj = await saveProject({
        title,
        domain,
        problem_statement: problemStatement,
        tech_stack: stack,
        novelty_score: 92.5,
        status: "In Progress"
      });
      onSelectProject(newProj);
      setShowCreateModal(false);
      setTitle('');
      setProblemStatement('');
      fetchProjectsList();
      confetti({ particleCount: 50, spread: 60 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
      fetchProjectsList();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            <FolderKanban className="w-4 h-4 text-indigo-400" />
            <span>Capstone Projects Repository</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-['Outfit']">
            Saved Projects & Workspaces
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your engineering capstone projects, track lifecycle status, or switch between active workspaces.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Project Workspace</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const isActive = activeProject?.title === proj.title || activeProject?.id === proj.id;
          return (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj)}
              className={`glass-panel p-6 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-4 ${
                isActive 
                  ? 'border-indigo-500/60 shadow-lg bg-zinc-900/90'
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {proj.domain}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 font-mono">
                    Novelty: {proj.novelty_score || 92}%
                  </span>
                </div>

                <h4 className="text-base font-bold text-white font-['Outfit'] leading-snug">
                  {proj.title}
                </h4>

                {proj.problem_statement && (
                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                    {proj.problem_statement}
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.tech_stack?.slice(0, 4).map((tech, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                      {tech}
                    </span>
                  ))}
                  {proj.tech_stack?.length > 4 && (
                    <span className="text-[10px] text-zinc-500">+{proj.tech_stack.length - 4} more</span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isActive ? 'Current Workspace' : proj.status || 'Active'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => handleDelete(proj.id, e)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onSelectProject(proj)}
                    className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition border border-zinc-700/60"
                  >
                    {isActive ? 'Selected' : 'Open'}
                  </button>
                </div>
              </div>

            </div>
          );
        })}

        {projects.length === 0 && !isLoading && (
          <div className="col-span-full text-center py-12 glass-panel rounded-2xl border border-zinc-800 space-y-3">
            <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Saved Projects Yet</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Run the Agent Studio to generate new proposals or click the button below to register a custom project workspace.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-sm"
            >
              Create First Project
            </button>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-zinc-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-['Outfit']">Create New Project Workspace</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., VisionTransformer-Health: Retinal Diagnostic RAG"
                  className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="text-zinc-300 block mb-1">Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Healthcare & Computer Vision">Healthcare & Computer Vision</option>
                  <option value="Internet of Things & Edge AI">Internet of Things & Edge AI</option>
                  <option value="Blockchain & Cybersecurity">Cybersecurity & Blockchain</option>
                  <option value="Cloud & Distributed Systems">Cloud & Distributed Systems</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1">Problem Statement</label>
                <textarea
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  rows={3}
                  placeholder="Briefly describe the challenge this project tackles..."
                  className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none transition"
                />
              </div>

              <div>
                <label className="text-zinc-300 block mb-1">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  value={techStackStr}
                  onChange={(e) => setTechStackStr(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm transition"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
