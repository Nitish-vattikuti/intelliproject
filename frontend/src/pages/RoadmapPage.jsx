import React, { useState, useEffect } from 'react';
import { CalendarRange, Sparkles, Clock, CheckCircle2, RefreshCw, Bot, ArrowRight } from 'lucide-react';
import RoadmapGantt from '../components/RoadmapGantt';
import { generateRoadmap } from '../services/api';

export default function RoadmapPage({ orchestrationResult, projectData, onNavigate }) {
  const [liveRoadmap, setLiveRoadmap] = useState(orchestrationResult?.roadmap || null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (orchestrationResult?.roadmap) {
      setLiveRoadmap(orchestrationResult.roadmap);
    } else if (projectData?.title && !liveRoadmap) {
      handleRegenerate();
    }
  }, [orchestrationResult, projectData]);

  if (!projectData) {
    return (
      <div className="space-y-8 animate-fade-in max-w-3xl mx-auto my-16 text-center">
        <div className="glass-panel p-10 rounded-2xl border border-zinc-800 space-y-5 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 text-indigo-400 mx-auto flex items-center justify-center">
            <CalendarRange className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white font-['Outfit']">No Project Configured</h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Enter your project details to construct an autonomous, week-by-week implementation roadmap aligned with academic capstone review gates.
          </p>
          <button
            onClick={() => onNavigate && onNavigate('orchestrator')}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm flex items-center space-x-2 mx-auto transition cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Enter Project Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  const handleRegenerate = async () => {
    setIsLoading(true);
    try {
      const res = await generateRoadmap(
        projectData.title,
        projectData.tech_stack || ["Python", "FastAPI"],
        16
      );
      if (res && (res.weekly_tasks || res.phases)) {
        setLiveRoadmap(res);
      } else if (res && res.roadmap) {
        setLiveRoadmap(res.roadmap);
      }
    } catch (err) {
      console.error("Roadmap generation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // If live or orchestrated roadmap exists, use it. Otherwise, construct clean dynamic template
  const primaryTech = projectData.tech_stack?.[0] || "Core Framework";
  const secTech = projectData.tech_stack?.[1] || "Backend API";
  const otherTech = projectData.tech_stack?.slice(2).join(', ') || "Dev Tools";

  const roadmap = liveRoadmap || {
    phases: [
      { phase_name: "Phase 1: Inception & Architectural Design", weeks: "Weeks 1-2", focus: `Problem definition for ${projectData.title}, feasibility study, and specification` },
      { phase_name: "Phase 2: Literature Review & Data Engineering", weeks: "Weeks 3-5", focus: `Prior art analysis, benchmark curation, and data modeling with ${primaryTech}` },
      { phase_name: "Phase 3: Core Algorithm & Backend Implementation", weeks: "Weeks 6-9", focus: `Core computational logic, pipeline optimization, and API endpoints in ${secTech}` },
      { phase_name: "Phase 4: Full-Stack Integration & Interface Design", weeks: "Weeks 10-12", focus: `Interactive dashboard, visual telemetry, and end-to-end integration (${otherTech})` },
      { phase_name: "Phase 5: Empirical Benchmarking & Research Paper", weeks: "Weeks 13-14", focus: "Accuracy, latency, and throughput evaluation; IEEE paper manuscript drafting" },
      { phase_name: "Phase 6: Final Documentation & Viva-Voce Defense", weeks: "Weeks 15-16", focus: "Thesis chapter binding, defense rehearsal drills, and project demonstration" }
    ],
    weekly_tasks: [
      {
        week: 1,
        phase: "Phase 1: Inception",
        title: `Requirements Specification for ${projectData.title}`,
        learning_focus: "Formalizing problem scope, constraints, and measurable deliverables",
        deliverable: "Project Synopsis & Requirements Document",
        suggested_tools: ["LaTeX", "Overleaf", "Notion"]
      },
      {
        week: 2,
        phase: "Phase 1: Inception",
        title: "Architecture Specification & Repository Scaffolding",
        learning_focus: `Component modularization and environment initialization for ${primaryTech}`,
        deliverable: "System architecture diagram & Git repository baseline",
        suggested_tools: ["Git", "GitHub", "Draw.io", primaryTech]
      },
      {
        week: 3,
        phase: "Phase 2: Literature & Data",
        title: "Literature Survey & Prior Art Synthesis",
        learning_focus: "Reviewing peer-reviewed literature on arXiv and IEEE Xplore",
        deliverable: "Comparative survey table with 10+ cited publications",
        suggested_tools: ["arXiv", "IEEE Xplore", "Zotero"]
      },
      {
        week: 4,
        phase: "Phase 2: Literature & Data",
        title: "Data Schema & Pipeline Modeling",
        learning_focus: "Designing entity representations, dataset schemas, and ingestion scripts",
        deliverable: "Cleaned data corpus and preprocessing pipeline",
        suggested_tools: ["Python", "Pandas", "JSON"]
      },
      {
        week: 5,
        phase: "Phase 2: Literature & Data",
        title: "Baseline Implementation & Phase 1 Review Gate",
        learning_focus: "Establishing experimental baselines and initial acceptance criteria",
        deliverable: "Phase 1 Milestone Presentation Deck",
        suggested_tools: ["PowerPoint", "LaTeX Beamer"]
      },
      {
        week: 6,
        phase: "Phase 3: Core Implementation",
        title: `Core Algorithmic Engine with ${primaryTech}`,
        learning_focus: `Developing the primary algorithm and data flows using ${primaryTech}`,
        deliverable: "Modular core processing engine with unit tests",
        suggested_tools: [primaryTech, "PyTest"]
      },
      {
        week: 7,
        phase: "Phase 3: Core Implementation",
        title: `Backend Services & APIs with ${secTech}`,
        learning_focus: `Building REST endpoints, service routing, and validation in ${secTech}`,
        deliverable: "Tested backend service layer with API contracts",
        suggested_tools: [secTech, "Postman"]
      },
      {
        week: 8,
        phase: "Phase 3: Core Implementation",
        title: "Optimization & Edge Case Hardening",
        learning_focus: "Memory profiling, algorithmic optimization, and exception handling",
        deliverable: "Optimized computational pipeline with benchmark metrics",
        suggested_tools: ["cProfile", "Locust"]
      },
      {
        week: 9,
        phase: "Phase 3: Core Implementation",
        title: "Core Milestone Demo & Midterm Review Gate",
        learning_focus: "Validating core deliverables against initial specifications",
        deliverable: "Functional backend demonstration and progress report",
        suggested_tools: ["Markdown", "Git"]
      },
      {
        week: 10,
        phase: "Phase 4: Full-Stack Integration",
        title: "User Interface & Control Dashboard",
        learning_focus: "Developing responsive UI components, control panels, and status displays",
        deliverable: "Interactive frontend interface communicating with backend",
        suggested_tools: ["React", "CSS", "Vite"]
      },
      {
        week: 11,
        phase: "Phase 4: Full-Stack Integration",
        title: "Interactive Visualizations & Telemetry",
        learning_focus: "Rendering real-time graphs, output visualizations, and performance metrics",
        deliverable: "Integrated visualization dashboard widgets",
        suggested_tools: ["Canvas", "Chart.js"]
      },
      {
        week: 12,
        phase: "Phase 4: Full-Stack Integration",
        title: "End-to-End System Testing & Phase 2 Gate",
        learning_focus: "Integration testing, user scenarios, and edge case resilience",
        deliverable: "Complete end-to-end working prototype",
        suggested_tools: ["PyTest", "Cypress", "Docker"]
      },
      {
        week: 13,
        phase: "Phase 5: Evaluation & Paper",
        title: "Empirical Benchmarking & Performance Metrics",
        learning_focus: "Measuring latency, accuracy, resource efficiency, and ablation trials",
        deliverable: "Empirical benchmark evaluation graphs and comparative tables",
        suggested_tools: ["Matplotlib", "Seaborn"]
      },
      {
        week: 14,
        phase: "Phase 5: Evaluation & Paper",
        title: "IEEE Conference Paper Manuscript Drafting",
        learning_focus: "Structuring academic manuscript: Abstract, Methodology, Results, Discussion",
        deliverable: "Complete 6-page IEEE conference paper draft",
        suggested_tools: ["LaTeX", "Overleaf"]
      },
      {
        week: 15,
        phase: "Phase 6: Final Deliverables",
        title: "Viva-Voce Mock Defense Rehearsal",
        learning_focus: "Practicing technical defense, addressing architectural edge cases",
        deliverable: "Final viva defense slide deck and question prep notes",
        suggested_tools: ["Viva Simulator", "Google Slides"]
      },
      {
        week: 16,
        phase: "Phase 6: Final Deliverables",
        title: "Final Thesis Archival & Viva Voce",
        learning_focus: "Final thesis compilation, repository release, and demonstration rehearsal",
        deliverable: "Final Bound Thesis and Successful University Viva-Voce Defense",
        suggested_tools: ["PDF Export", "GitHub"]
      }
    ]
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            <CalendarRange className="w-4 h-4 text-indigo-400" />
            <span>Learning Roadmap Agent</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-['Outfit']">
            Project Learning & Milestone Roadmap
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Progressive 16-week engineering schedule structured into sequential review gates for: <span className="text-indigo-300 font-semibold">{projectData.title}</span>
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs border border-zinc-700 flex items-center space-x-2 transition disabled:opacity-50 shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Regenerating Roadmap...' : 'Regenerate Roadmap'}</span>
        </button>
      </div>

      <RoadmapGantt roadmap={roadmap} />

    </div>
  );
}
