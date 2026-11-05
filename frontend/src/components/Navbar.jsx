import React from 'react';
import { Sparkles, SlidersHorizontal, Plus, ChevronDown } from 'lucide-react';

export default function Navbar({ activeProject, onNewProject, onOpenProjectsManager, onOpenSettings }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            IP
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-base text-zinc-100 tracking-tight">IntelliProject</span>
              <span className="px-2 py-0.5 text-[10px] font-medium tracking-wide rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                Agentic RAG + KG
              </span>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2.5">
          
          {/* Active Project Pill */}
          <button
            onClick={activeProject ? onOpenProjectsManager : onNewProject}
            className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 transition"
          >
            <span className={`w-2 h-2 rounded-full ${activeProject ? 'bg-emerald-500' : 'bg-zinc-500'}`} />
            <span className="text-zinc-400 font-normal">{activeProject ? 'Project:' : 'Status:'}</span>
            <span className="font-medium text-zinc-100 max-w-[200px] truncate">
              {activeProject ? (activeProject.title?.split(':')[0] || activeProject.title) : 'No Project Active'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          </button>

          {/* AI Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium transition"
            title="Configure AI Engine & API Keys"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Engine Settings</span>
          </button>

          {/* New Project Action */}
          <button
            onClick={onNewProject}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>

        </div>

      </div>
    </header>
  );
}
