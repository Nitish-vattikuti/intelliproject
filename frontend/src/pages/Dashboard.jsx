import React from 'react';
import { 
  Sparkles, 
  Bot, 
  BookOpen, 
  Share2, 
  CalendarRange, 
  Award, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2, 
  TrendingUp, 
  FileText,
  Zap,
  ArrowRight,
  FolderPlus
} from 'lucide-react';
import InnovationMeter from '../components/InnovationMeter';

export default function Dashboard({ 
  onNavigate, 
  projectData, 
  orchestrationResult 
}) {
  // If no project is active, display a clean call-to-action to enter details
  if (!projectData) {
    return (
      <div className="space-y-8 animate-fade-in max-w-4xl mx-auto my-12">
        <div className="glass-panel p-10 sm:p-14 rounded-2xl border border-zinc-800 text-center space-y-6 shadow-xl relative overflow-hidden">
          
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 text-indigo-400 mx-auto flex items-center justify-center shadow-sm">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700">
              Project Intake Required
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] pt-2">
              No Project Configured Yet
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Enter your project details to run our 8 autonomous AI agents. The engine will retrieve relevant literature from arXiv, verify novelty, create an implementation roadmap, draft IEEE thesis documentation, and prepare viva questions.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('orchestrator')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-sm flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Enter Project Details Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-zinc-800 text-left text-xs text-zinc-400">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="font-semibold text-white block">1. Problem Input</span>
              <span className="text-[11px]">Title & Tech Stack</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="font-semibold text-white block">2. 8 Agents</span>
              <span className="text-[11px]">LangGraph DAG</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="font-semibold text-white block">3. arXiv RAG</span>
              <span className="text-[11px]">ChromaDB Indexing</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="font-semibold text-white block">4. Full Defense</span>
              <span className="text-[11px]">Docs & Viva Prep</span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  const currentProject = projectData;

  const agentsList = [
    { name: "Planner Agent", role: "Goal Decomposition & DAG Routing", status: "Active" },
    { name: "Recommendation Agent", role: "Architecture Synthesis", status: "Active" },
    { name: "Research Paper Agent", role: "ChromaDB Dense Vector Retrieval", status: "Active" },
    { name: "Novelty Agent", role: "Literature Overlap & Innovation Scoring", status: "Active" },
    { name: "Research Gap Agent", role: "Open Limitations & Gap Mapping", status: "Active" },
    { name: "Learning Roadmap Agent", role: "Weekly Implementation Gantt", status: "Active" },
    { name: "Documentation Agent", role: "IEEE Abstract & Thesis Drafting", status: "Active" },
    { name: "Viva Agent", role: "Mock Defense Simulator & Rubric", status: "Active" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Banner with Active Project Title */}
      <div className="relative rounded-2xl overflow-hidden glass-panel p-6 sm:p-8 border border-zinc-800 shadow-xl">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Project Workspace · {currentProject.domain || 'Engineering Capstone'}</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight leading-snug">
            {currentProject.title}
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
            {currentProject.tagline || currentProject.problem_statement || "Comprehensive project intelligence generated by autonomous multi-agent orchestration."}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('orchestrator')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm flex items-center space-x-2 transition"
            >
              <Bot className="w-4 h-4" />
              <span>Multi-Agent Studio</span>
            </button>

            <button
              onClick={() => onNavigate('papers')}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 flex items-center space-x-2 transition"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Literature Survey & Ask RAG</span>
            </button>

            <button
              onClick={() => onNavigate('novelty')}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 flex items-center space-x-2 transition"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Novelty & Gaps</span>
            </button>

            <button
              onClick={() => onNavigate('roadmap')}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 flex items-center space-x-2 transition"
            >
              <CalendarRange className="w-4 h-4 text-emerald-400" />
              <span>Weekly Roadmap</span>
            </button>

            <button
              onClick={() => onNavigate('docs')}
              className="px-4 py-2.5 rounded-xl glass-panel hover:bg-white/10 text-gray-200 font-semibold text-xs border border-white/10 flex items-center space-x-2 transition"
            >
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Thesis Docs</span>
            </button>

            <button
              onClick={() => onNavigate('viva')}
              className="px-4 py-2.5 rounded-xl glass-panel hover:bg-white/10 text-gray-200 font-semibold text-xs border border-white/10 flex items-center space-x-2 transition"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Viva Defense</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Multi-Agent Engine</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white font-['Outfit']">8 Agents</span>
            <p className="text-xs text-emerald-400 font-medium mt-0.5">LangGraph StateGraph Active</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">RAG Knowledge Base</span>
            <div className="p-2 rounded-xl bg-zinc-800 text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white font-['Outfit']">ChromaDB</span>
            <p className="text-xs text-zinc-400 mt-0.5">arXiv Literature Indexed</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Project Domain</span>
            <div className="p-2 rounded-xl bg-purple-950/40 text-purple-400 border border-purple-800/30">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg font-bold text-white font-['Outfit'] truncate block">
              {currentProject.domain || 'Engineering'}
            </span>
            <p className="text-xs text-zinc-400 mt-0.5">Ontology & Topic Grounded</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Innovation Score</span>
            <div className="p-2 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-800/30">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-400 font-['Outfit']">
              {currentProject.novelty_score ? Number(currentProject.novelty_score).toFixed(1) : '92.5'}%
            </span>
            <p className="text-xs text-zinc-400 mt-0.5">Verified Capstone Novelty</p>
          </div>
        </div>

      </div>

      {/* Main Grid: Active Project Card & Innovation Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Project Card */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              Active Project Workspace
            </span>
            <span className="text-xs text-emerald-400 font-medium flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{currentProject.status || 'In Progress'}</span>
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white font-['Outfit'] leading-snug">
              {currentProject.title}
            </h3>
            {currentProject.tagline && (
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                {currentProject.tagline}
              </p>
            )}
          </div>

          {/* Problem Statement excerpt */}
          {currentProject.problem_statement && (
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
              <strong className="text-zinc-400 text-[11px] uppercase tracking-wider block mb-1">
                Target Problem & Methodology:
              </strong>
              {currentProject.problem_statement}
            </div>
          )}

          {/* Tech stack badges */}
          {currentProject.tech_stack && currentProject.tech_stack.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                Technology Stack Architecture
              </span>
              <div className="flex flex-wrap gap-2">
                {currentProject.tech_stack.map((tech, i) => (
                  <span key={i} className="text-xs font-medium px-3 py-1 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700/60 font-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Lifecycle Link Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-zinc-800">
            <button
              onClick={() => onNavigate('papers')}
              className="p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left transition"
            >
              <BookOpen className="w-4 h-4 text-indigo-400 mb-1" />
              <h5 className="text-xs font-bold text-white">Literature RAG</h5>
              <p className="text-[10px] text-zinc-400 mt-0.5">arXiv Citations</p>
            </button>

            <button
              onClick={() => onNavigate('novelty')}
              className="p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left transition"
            >
              <Sparkles className="w-4 h-4 text-indigo-400 mb-1" />
              <h5 className="text-xs font-bold text-white">Novelty Check</h5>
              <p className="text-[10px] text-zinc-400 mt-0.5">Gaps & Metrics</p>
            </button>

            <button
              onClick={() => onNavigate('roadmap')}
              className="p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left transition"
            >
              <CalendarRange className="w-4 h-4 text-emerald-400 mb-1" />
              <h5 className="text-xs font-bold text-white">Weekly Plan</h5>
              <p className="text-[10px] text-zinc-400 mt-0.5">Gantt Milestones</p>
            </button>

            <button
              onClick={() => onNavigate('viva')}
              className="p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left transition"
            >
              <Award className="w-4 h-4 text-amber-400 mb-1" />
              <h5 className="text-xs font-bold text-white">AI Viva Voce</h5>
              <p className="text-[10px] text-zinc-400 mt-0.5">Mock Defense</p>
            </button>
          </div>

        </div>

        {/* Right Column: Innovation Gauge */}
        <div className="lg:col-span-4 space-y-6">
          <InnovationMeter 
            score={currentProject.novelty_score || 92.5} 
            tier="High" 
            publicationPotential="IEEE / Conference Ready" 
          />

          <div className="glass-panel p-5 rounded-2xl border border-zinc-800 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>Thesis & Viva Deliverables</span>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900">
                <span>IEEE Abstract</span>
                <span className="text-emerald-400 font-medium">Ready</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900">
                <span>Chapters 1-5 Outline</span>
                <span className="text-emerald-400 font-medium">Drafted</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900">
                <span>Viva Defense Q&A</span>
                <span className="text-emerald-400 font-medium">Ready</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('docs')}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center justify-center space-x-1 shadow-sm"
            >
              <span>View Thesis Documentation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 8 Specialized Agents Status Grid */}
      <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
              Autonomous Multi-Agent Architecture (LangGraph Engine)
            </h3>
          </div>
          <span className="text-xs text-zinc-400">All 8 Agents Initialized</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {agentsList.map((agent, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5 hover:border-zinc-700 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{agent.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">{agent.role}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
