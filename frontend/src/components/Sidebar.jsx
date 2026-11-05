import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  BookOpen, 
  Share2, 
  Sparkles, 
  CalendarRange, 
  FileText, 
  Award,
  FolderKanban,
  Presentation
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'reviews', label: 'Review Decks & PPTX', icon: Presentation, badge: 'Capstone' },
  { id: 'orchestrator', label: 'Agent Studio', icon: Bot, badge: '8 Agents' },
  { id: 'papers', label: 'Research & RAG', icon: BookOpen, badge: 'ChromaDB' },
  { id: 'graph', label: 'Knowledge Graph', icon: Share2, badge: 'Interactive' },
  { id: 'novelty', label: 'Novelty & Gaps', icon: Sparkles },
  { id: 'roadmap', label: 'Learning Roadmap', icon: CalendarRange },
  { id: 'docs', label: 'Documentation', icon: FileText },
  { id: 'viva', label: 'Viva-Voce Simulator', icon: Award, badge: 'Practice' },
  { id: 'projects_manager', label: 'Saved Projects', icon: FolderKanban },
];

export default function Sidebar({ currentTab, setTab }) {
  return (
    <aside className="w-64 shrink-0 hidden md:block border-r border-zinc-800/80 bg-zinc-950 min-h-[calc(100vh-3.5rem)] p-3.5">
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
          Mentorship Modules
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-zinc-800 text-white font-semibold border border-zinc-700/80 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${
                  isActive ? 'bg-zinc-700 text-zinc-200 border-zinc-600' : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
        <div className="flex items-center space-x-2 text-zinc-300 text-xs font-semibold mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Engine Operational</span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          ChromaDB vector store & live arXiv integration active.
        </p>
      </div>
    </aside>
  );
}
