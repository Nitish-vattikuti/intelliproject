import React, { useState, useEffect } from 'react';
import { 
  Share2, Sparkles, Search, Compass, Info, ArrowRight, Layers, 
  RefreshCw, AlertCircle, CheckCircle2, Cpu, Globe, FolderGit2
} from 'lucide-react';
import KnowledgeGraphView from '../components/KnowledgeGraphView';
import { getKnowledgeGraphData, generateProjectGraph } from '../services/api';

const SAMPLE_PROJECTS = [
  { title: "Autonomous Drone Obstacle Avoidance with Edge AI", domain: "Robotics & Computer Vision" },
  { title: "Federated Learning for Privacy-Preserving Medical Imaging", domain: "Healthcare & Distributed AI" },
  { title: "Vision Transformer for Satellite Image Segmentation", domain: "Remote Sensing & Deep Learning" },
  { title: "Real-Time Fraud Detection via Graph Neural Networks", domain: "FinTech & Graph ML" }
];

export default function KnowledgeGraphPage({ activeProject, onNavigate }) {
  const [graphData, setGraphData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [pathFrom, setPathFrom] = useState('');
  const [pathTo, setPathTo] = useState('');
  const [computedPath, setComputedPath] = useState(null);

  // Generator State
  const [inputTitle, setInputTitle] = useState(activeProject?.title || '');
  const [inputDomain, setInputDomain] = useState(activeProject?.domain || 'Computer Science & Engineering');
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [activeViewMode, setActiveViewMode] = useState(activeProject?.title ? 'project' : 'global');

  const loadGraph = async (projectObj = null, mode = 'project') => {
    try {
      setIsGenerating(true);
      setValidationError(null);
      if (mode === 'global' || (!projectObj && !activeProject?.title)) {
        const data = await getKnowledgeGraphData(null);
        setGraphData(data);
        setActiveViewMode('global');
      } else {
        const targetProj = projectObj || activeProject;
        const data = await getKnowledgeGraphData(targetProj);
        if (data.error || data.valid === false) {
          setValidationError(data.error);
        } else {
          setGraphData(data);
          setActiveViewMode('project');
        }
      }
    } catch (err) {
      console.error("Graph fetch error:", err);
      setValidationError("Failed to load knowledge graph. Check engine connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (activeProject?.title) {
      setInputTitle(activeProject.title);
      setInputDomain(activeProject.domain || 'Computer Science & Engineering');
      loadGraph(activeProject, 'project');
    } else {
      loadGraph(null, 'global');
    }
  }, [activeProject]);

  // Update pathway selector dropdowns when graphData changes
  useEffect(() => {
    if (graphData?.nodes && graphData.nodes.length > 1) {
      setPathFrom(graphData.nodes[0].id);
      setPathTo(graphData.nodes[graphData.nodes.length - 1].id);
      setComputedPath(null);
    }
  }, [graphData]);

  const handleGenerateCustomGraph = async (e) => {
    if (e) e.preventDefault();
    if (!inputTitle.trim()) {
      setValidationError("Please enter a project title or topic.");
      return;
    }

    setIsGenerating(true);
    setValidationError(null);

    try {
      const res = await generateProjectGraph(
        inputTitle.trim(),
        inputDomain.trim(),
        `Engineering project implementation for ${inputTitle}`,
        activeProject?.tech_stack || []
      );

      if (res.error || res.valid === false) {
        setValidationError(res.error || "Input is too brief or ambiguous to generate an ontological graph.");
      } else {
        setGraphData(res);
        setActiveViewMode('project');
        setSelectedNode(null);
      }
    } catch (err) {
      setValidationError("Error generating graph: " + (err.message || "Failed to reach AI engine"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectPreset = (preset) => {
    setInputTitle(preset.title);
    setInputDomain(preset.domain);
    setIsGenerating(true);
    setValidationError(null);
    generateProjectGraph(preset.title, preset.domain, `Engineering implementation for ${preset.title}`)
      .then(res => {
        if (res.valid !== false) {
          setGraphData(res);
          setActiveViewMode('project');
          setSelectedNode(null);
        } else {
          setValidationError(res.error);
        }
      })
      .catch(e => setValidationError(e.message))
      .finally(() => setIsGenerating(false));
  };

  const handleCalculatePath = () => {
    if (!graphData || !graphData.nodes) return;
    const edges = graphData.edges || [];
    const adj = {};
    edges.forEach(e => {
      if (!adj[e.source]) adj[e.source] = [];
      if (!adj[e.target]) adj[e.target] = [];
      adj[e.source].push(e.target);
      adj[e.target].push(e.source);
    });

    const queue = [[pathFrom]];
    const visited = new Set([pathFrom]);
    let found = null;

    while (queue.length > 0) {
      const path = queue.shift();
      const node = path[path.length - 1];

      if (node === pathTo) {
        found = path;
        break;
      }

      for (const neighbor of (adj[node] || [])) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }

    if (found) {
      const idToLabel = {};
      graphData.nodes.forEach(n => idToLabel[n.id] = n.label);
      setComputedPath(found.map(id => idToLabel[id] || id));
    } else {
      setComputedPath(["No direct conceptual edge in this subgraph"]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            <Share2 className="w-4 h-4 text-indigo-400" />
            <span>AI Knowledge Graph & Concept Ontology</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-['Outfit']">
            {activeViewMode === 'project' 
              ? (graphData?.title || `Project Ontology: ${inputTitle || 'Active Project'}`)
              : 'Global Computer Science & AI Ontology'
            }
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Dynamic concept extraction mapping architecture tiers, algorithms, frameworks, and prerequisite dependencies.
          </p>
        </div>

        {/* View Switcher & Stats */}
        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => {
                if (inputTitle) handleGenerateCustomGraph();
                else if (activeProject) loadGraph(activeProject, 'project');
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeViewMode === 'project' 
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Project Graph</span>
            </button>
            <button
              onClick={() => loadGraph(null, 'global')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeViewMode === 'global' 
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Global CS Taxonomy</span>
            </button>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-zinc-300">
            <span className="glass-panel px-3 py-1.5 rounded-xl border border-zinc-800 font-mono text-[11px]">
              {graphData?.stats?.total_nodes || 0} Entities
            </span>
            <span className="glass-panel px-3 py-1.5 rounded-xl border border-zinc-800 font-mono text-[11px]">
              {graphData?.stats?.total_edges || 0} Edges
            </span>
          </div>
        </div>
      </div>

      {/* Generator & Project Input Form */}
      <div className="glass-panel p-4 md:p-5 rounded-2xl border border-zinc-800 space-y-3 shadow-sm">
        <form onSubmit={handleGenerateCustomGraph} className="flex flex-col md:flex-row gap-2.5">
          <div className="flex-1">
            <input
              type="text"
              value={inputTitle}
              onChange={(e) => {
                setInputTitle(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Enter specific engineering project topic (e.g., Autonomous Drone Obstacle Avoidance)..."
              className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
            />
          </div>

          <div className="w-full md:w-64">
            <input
              type="text"
              value={inputDomain}
              onChange={(e) => setInputDomain(e.target.value)}
              placeholder="Domain (e.g. Robotics & AI)"
              className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating || !inputTitle.trim()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition flex items-center justify-center space-x-1.5 disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{isGenerating ? 'AI Reasoning...' : 'Generate Project Ontology'}</span>
          </button>
        </form>

        {/* Validation Warning Alert */}
        {validationError && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div className="leading-relaxed">
              <strong className="block text-amber-200 mb-0.5">Input Specification Notice:</strong>
              {validationError}
            </div>
          </div>
        )}

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
          <span className="text-[11px] text-zinc-500 font-medium mr-1">Quick Presets:</span>
          {SAMPLE_PROJECTS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(p)}
              disabled={isGenerating}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 text-[11px] transition cursor-pointer"
            >
              {p.title.length > 32 ? `${p.title.slice(0, 32)}...` : p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Project Summary Banner if available */}
      {graphData?.project_summary && (
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <p className="leading-relaxed font-sans">{graphData.project_summary}</p>
        </div>
      )}

      {/* Main Interactive Canvas */}
      <KnowledgeGraphView 
        graphData={graphData} 
        onNodeSelect={(node) => setSelectedNode(node)} 
      />

      {/* Conceptual Pathway Explorer & Subgraph Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Pathway Finder */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Ontological Multi-Hop Traversal</span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Find the shortest conceptual dependency pathway connecting any two disparate components or technologies in this ontology.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">Start Entity</label>
              <select
                value={pathFrom}
                onChange={(e) => setPathFrom(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              >
                {graphData?.nodes?.map(n => (
                  <option key={n.id} value={n.id}>{n.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">Target Entity</label>
              <select
                value={pathTo}
                onChange={(e) => setPathTo(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              >
                {graphData?.nodes?.map(n => (
                  <option key={n.id} value={n.id}>{n.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleCalculatePath}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
          >
            <span>Trace Conceptual Path</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {computedPath && (
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-2 animate-fade-in">
              <span className="font-semibold text-zinc-300 block text-[11px] uppercase tracking-wider">
                Discovered Conceptual Chain:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {computedPath.map((step, i) => (
                  <React.Fragment key={i}>
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700 font-medium">
                      {step}
                    </span>
                    {i < computedPath.length - 1 && (
                      <span className="text-zinc-600 font-bold">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Selected Entity Inspector */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Info className="w-4 h-4" />
            <span>Entity Relationship Inspector</span>
          </div>

          {selectedNode ? (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-white font-['Outfit']">{selectedNode.label}</h4>
                <span 
                  className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: `${selectedNode.color}20`, color: selectedNode.color }}
                >
                  {selectedNode.category}
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                {selectedNode.description || `Classified as a Level ${selectedNode.level || 2} node in this engineering ontology. Connected to surrounding components, algorithms, and evaluation metrics.`}
              </p>

              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="text-[11px] font-semibold text-zinc-400 block">Connected Adjacent Concepts:</span>
                <div className="flex flex-wrap gap-1.5">
                  {graphData?.edges
                    ?.filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map((edge, idx) => {
                      const otherId = edge.source === selectedNode.id ? edge.target : edge.source;
                      const otherNode = graphData.nodes?.find(n => n.id === otherId);
                      return (
                        <span 
                          key={idx}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700/60 flex items-center space-x-1"
                        >
                          <span className="text-indigo-400 font-mono text-[9px]">{edge.relation}</span>
                          <span>·</span>
                          <span>{otherNode?.label || otherId}</span>
                        </span>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-zinc-500 text-xs">
              Click on any node in the canvas above to inspect its taxonomic hierarchy and adjacent edges.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
