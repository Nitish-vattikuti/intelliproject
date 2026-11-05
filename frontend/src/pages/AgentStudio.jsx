import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Play, 
  RefreshCw, 
  Cpu, 
  Layers, 
  Edit3, 
  Compass, 
  Check, 
  Code, 
  BookOpen, 
  ShieldCheck, 
  CalendarRange, 
  Award,
  Zap,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { runMultiAgentPipeline, mentorCustomProject, getSystemStatus } from '../services/api';

export default function AgentStudio({ onSelectProject, orchestrationResult, setOrchestrationResult, onNavigate }) {
  const [activeMode, setActiveMode] = useState('custom');

  // Custom Project Mode Inputs
  const [customTitle, setCustomTitle] = useState('');
  const [customDomain, setCustomDomain] = useState('Artificial Intelligence');
  const [customDescription, setCustomDescription] = useState('');
  const [customTechStack, setCustomTechStack] = useState('');
  const [durationWeeks, setDurationWeeks] = useState(16);
  const [difficulty, setDifficulty] = useState('Advanced');

  // Recommendation Mode Inputs
  const [skills, setSkills] = useState('');
  const [domain, setDomain] = useState('Artificial Intelligence');
  const [interest, setInterest] = useState('');

  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const s = await getSystemStatus();
        setSystemStatus(s);
      } catch (e) {
        console.error("Status check:", e);
      }
    }
    checkStatus();
  }, []);

  const quickPresets = [
    {
      title: "Real-Time Autonomous Drone Navigation using Visual SLAM and Deep Reinforcement Learning",
      domain: "Computer Vision & Robotics",
      description: "An autonomous aerial vehicle system that navigates GPS-denied indoor environments using stereo-camera visual SLAM, TinyML depth estimation, and continuous PPO policy execution.",
      tech: "Python, PyTorch, ROS 2, OpenCV, Gazebo, FastRTPS"
    },
    {
      title: "Zero-Knowledge Rollup Protocol for Decentralized Healthcare Data Verification",
      domain: "Blockchain & Cybersecurity",
      description: "A privacy-preserving cryptographic framework utilizing zk-SNARKs and smart contracts to verify electronic medical record integrity without exposing sensitive patient health information.",
      tech: "Solidity, Circom, Rust, Next.js, ethers.js, IPFS"
    },
    {
      title: "Transformer-Based Early Diabetic Retinopathy Screening with Explainable AI (XAI)",
      domain: "Healthcare Tech",
      description: "A clinical decision support tool deploying Vision Transformers (ViT) and Grad-CAM saliency heatmaps on fundus photography to deliver interpretable disease staging to ophthalmologists.",
      tech: "Python, PyTorch, Vision Transformer, FastAPI, React, Docker"
    }
  ];

  const handleApplyPreset = (p) => {
    setCustomTitle(p.title);
    setCustomDomain(p.domain);
    setCustomDescription(p.description);
    setCustomTechStack(p.tech);
  };

  const handleRunCustomMentor = async () => {
    if (!customTitle.trim()) {
      setError("Please enter a project title to proceed.");
      return;
    }
    setIsRunning(true);
    setError(null);

    try {
      const skillsArray = customTechStack
        ? customTechStack.split(',').map((s) => s.trim()).filter(Boolean)
        : ["Python", "FastAPI", "Machine Learning"];

      const res = await mentorCustomProject({
        title: customTitle,
        domain: customDomain,
        description: customDescription || `A comprehensive ${customDomain} engineering project focused on ${customTitle}.`,
        skills: skillsArray,
        duration_weeks: durationWeeks
      });

      setOrchestrationResult(res);

      if (res.selected_project) {
        onSelectProject(res.selected_project);
      }

      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });

      setTimeout(() => {
        if (onNavigate) {
          onNavigate('dashboard');
        }
      }, 800);

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.detail || err.message || "Failed to run agent pipeline. Please ensure the backend server is running.";
      setError(errorMsg);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunRecommendation = async () => {
    setIsRunning(true);
    setError(null);

    try {
      const skillsArray = skills
        ? skills.split(',').map((s) => s.trim()).filter(Boolean)
        : ["Python", "FastAPI", "Machine Learning"];

      const res = await runMultiAgentPipeline({
        skills: skillsArray,
        domain: domain,
        interest: interest || `${domain} Research`,
        duration_weeks: durationWeeks,
        difficulty: difficulty
      });

      setOrchestrationResult(res);

      if (res.selected_project) {
        onSelectProject(res.selected_project);
      }

      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.detail || err.message || "Failed to run recommendation pipeline. Please check backend connection.";
      setError(errorMsg);
    } finally {
      setIsRunning(false);
    }
  };

  const agentSteps = [
    { id: 1, name: "Planner Agent", desc: "Decomposes goals and builds execution DAG" },
    { id: 2, name: "Literature RAG Agent", desc: "Fetches live papers from arXiv & indexes to ChromaDB" },
    { id: 3, name: "Recommendation Agent", desc: "Synthesizes architectural framework & deliverables" },
    { id: 4, name: "Novelty Agent", desc: "Calculates innovation score & baseline contrasts" },
    { id: 5, name: "Research Gap Agent", desc: "Pinpoints unexplored limitations in prior literature" },
    { id: 6, name: "Roadmap Agent", desc: "Constructs custom week-by-week technical Gantt schedule" },
    { id: 7, name: "Documentation Agent", desc: "Drafts IEEE abstract, problem statement & thesis outlines" },
    { id: 8, name: "Viva Agent", desc: "Generates external examiner questions & defense rubrics" }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-zinc-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Multi-Agent Intake Studio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
            Project Configuration & Multi-Agent Engine
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure your capstone project specifications to activate the 8-agent mentorship pipeline.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center p-1 bg-zinc-900 rounded-xl border border-zinc-800 shrink-0">
          <button
            onClick={() => setActiveMode('custom')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeMode === 'custom'
                ? 'bg-zinc-800 text-white font-semibold border border-zinc-700'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Enter My Project</span>
          </button>
          <button
            onClick={() => setActiveMode('recommend')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeMode === 'recommend'
                ? 'bg-zinc-800 text-white font-semibold border border-zinc-700'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Recommend Proposals</span>
          </button>
        </div>
      </div>

      {/* Engine Status Banner */}
      {systemStatus && !systemStatus.gemini_connected && (
        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between text-xs text-zinc-300">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong>Gemini API Key not set:</strong> Click <em>Engine Settings</em> in the top navigation to add your free Google AI Studio key for live dynamic AI synthesis. (Live arXiv search and ChromaDB vector indexing remain fully active).
            </span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-zinc-400 hover:text-white text-xs">Dismiss</button>
        </div>
      )}

      {/* Mode A: Enter My Project Details */}
      {activeMode === 'custom' && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-800">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                Capstone Project Specifications
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Provide your topic, methodology, and tech stack to receive full lifecycle mentorship.
              </p>
            </div>

            {/* Quick Inspiration */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-zinc-500 text-[11px] hidden sm:inline">Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {quickPresets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] border border-zinc-700 transition"
                  >
                    Preset {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-medium text-zinc-300">
                Project Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Distributed Consensus Engine for Edge IoT Devices"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            {/* Domain */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">
                Research Domain
              </label>
              <select
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500"
              >
                <option value="Artificial Intelligence">Artificial Intelligence & Deep Learning</option>
                <option value="Natural Language Processing">Natural Language Processing (NLP)</option>
                <option value="Computer Vision">Computer Vision & Robotics</option>
                <option value="Blockchain & Cybersecurity">Cybersecurity & Distributed Systems</option>
                <option value="Internet of Things">IoT, Embedded & Edge Computing</option>
                <option value="Cloud Computing & DevOps">Cloud Native & Distributed Systems</option>
                <option value="Healthcare Tech">Healthcare & Biomedical Informatics</option>
                <option value="Software Engineering">Software Architecture & Systems</option>
              </select>
            </div>

            {/* Tech Stack */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">
                Core Technologies (comma-separated)
              </label>
              <input
                type="text"
                value={customTechStack}
                onChange={(e) => setCustomTechStack(e.target.value)}
                placeholder="e.g. Python, PyTorch, FastAPI, React, PostgreSQL"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-medium text-zinc-300">
                Problem Description & Methodology
              </label>
              <textarea
                rows={3}
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Briefly describe what problem you are solving, the proposed technical methodology, and planned algorithms..."
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 resize-none leading-relaxed"
              />
            </div>

            {/* Duration */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">
                Project Duration
              </label>
              <select
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500"
              >
                <option value={8}>8 Weeks (Accelerated Term)</option>
                <option value={12}>12 Weeks (Semester Sprint)</option>
                <option value={16}>16 Weeks (Standard Capstone Term)</option>
                <option value={24}>24 Weeks (Two-Semester Research)</option>
              </select>
            </div>

            {/* Difficulty Target */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">
                Target Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500"
              >
                <option value="Intermediate">Intermediate (Industry Ready App)</option>
                <option value="Advanced">Advanced (Novel Architecture)</option>
                <option value="Research Grade">Research Grade (Targeting IEEE/Springer)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleRunCustomMentor}
              disabled={isRunning}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition disabled:opacity-50 flex items-center space-x-2"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Executing 8 Agents...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Mentorship Engine</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Mode B: Recommend Proposals */}
      {activeMode === 'recommend' && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-zinc-100 pb-2 border-b border-zinc-800">
            Student Profile & Skill Intake
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Your Current Skills</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Python, SQL, React, TensorFlow"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Target Domain</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500"
              >
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Natural Language Processing">Natural Language Processing</option>
                <option value="Computer Vision">Computer Vision</option>
                <option value="Cybersecurity">Cybersecurity & Distributed Systems</option>
                <option value="Internet of Things">Internet of Things (IoT)</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-medium text-zinc-300">Specific Technical Interests</label>
              <input
                type="text"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                placeholder="e.g. Multi-agent systems, edge computing, privacy-preserving AI"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleRunRecommendation}
              disabled={isRunning}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition disabled:opacity-50 flex items-center space-x-2"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Proposals...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Synthesize Project Ideas</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Real Execution Trace */}
      {orchestrationResult?.execution_trace && (
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h4 className="text-xs font-semibold text-zinc-200">
              LangGraph Multi-Agent Execution Trace ({orchestrationResult.orchestration_summary?.total_pipeline_time_ms || 0} ms)
            </h4>
            <span className="text-[11px] text-zinc-400 font-mono">
              Framework: LangGraph StateGraph
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {orchestrationResult.execution_trace.map((step, idx) => (
              <div key={idx} className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Step 0{step.step}</span>
                  <span className="text-emerald-500">{step.latency_ms}ms</span>
                </div>
                <div className="font-semibold text-zinc-200">{step.agent}</div>
                <div className="text-[11px] text-zinc-400 leading-snug">{step.action}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
