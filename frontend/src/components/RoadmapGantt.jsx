import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, Wrench, ChevronRight, Calendar } from 'lucide-react';

export default function RoadmapGantt({ roadmap }) {
  const [completedTasks, setCompletedTasks] = useState(new Set([1, 2]));
  const [activePhaseFilter, setActivePhaseFilter] = useState('All');

  const tasks = roadmap?.weekly_tasks || [];
  const phases = roadmap?.phases || [];

  const toggleTask = (weekNum) => {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(weekNum)) {
        next.delete(weekNum);
      } else {
        next.add(weekNum);
      }
      return next;
    });
  };

  const phaseList = React.useMemo(() => {
    if (phases && phases.length > 0) {
      return ['All', ...phases.map(p => p.phase_name.split(':')[0].trim())];
    }
    const set = new Set();
    tasks.forEach(t => {
      if (t.phase) set.add(t.phase.split(':')[0].trim());
    });
    return ['All', ...Array.from(set)];
  }, [phases, tasks]);

  const filteredTasks = tasks.filter(t => 
    activePhaseFilter === 'All' || (t.phase && t.phase.includes(activePhaseFilter))
  );

  const progressPercent = Math.round((completedTasks.size / (tasks.length || 1)) * 100);

  return (
    <div className="space-y-6">
      
      {/* Progress Header Card */}
      <div className="glass-panel p-6 rounded-2xl border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
            Project Milestone & Learning Schedule
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Mapped into Capstone Review Gates (Phase 1 Inception through Final Viva Voce)
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="w-full md:w-44 bg-zinc-800/80 rounded-full h-2 overflow-hidden border border-zinc-700/50">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-zinc-300 font-mono whitespace-nowrap">
            {completedTasks.size} / {tasks.length} Weeks ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Review Phase Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {phaseList.map(ph => (
          <button
            key={ph}
            onClick={() => setActivePhaseFilter(ph)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              activePhaseFilter === ph
                ? 'bg-zinc-100 text-zinc-900 font-semibold'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            {ph}
          </button>
        ))}
      </div>

      {/* Timeline Task Cards */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isDone = completedTasks.has(task.week);
          return (
            <div
              key={task.week}
              className={`p-4 rounded-xl transition-all border ${
                isDone 
                  ? 'bg-emerald-950/20 border-emerald-800/40'
                  : 'glass-panel border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                
                {/* Left: Checkbox & Info */}
                <div className="flex items-start space-x-3.5">
                  <button
                    onClick={() => toggleTask(task.week)}
                    className="mt-0.5 text-zinc-500 hover:text-indigo-400 transition"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-600 hover:text-indigo-400" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-bold text-zinc-300 font-mono">
                        WEEK {task.week}
                      </span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-[11px] font-medium text-indigo-400">
                        {task.phase}
                      </span>
                    </div>

                    <h4 className={`text-sm font-semibold mt-0.5 ${isDone ? 'text-zinc-500 line-through' : 'text-white'}`}>
                      {task.title}
                    </h4>

                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {task.learning_focus}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center space-x-1.5 text-[11px] text-zinc-300 bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700/50">
                        <span className="text-zinc-400 font-medium">Deliverable:</span>
                        <span>{task.deliverable}</span>
                      </span>

                      {task.suggested_tools?.map((tool, idx) => (
                        <span key={idx} className="text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 rounded-md font-mono">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Status Badge */}
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap ${
                  isDone 
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {isDone ? 'Completed' : 'Upcoming'}
                </span>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
