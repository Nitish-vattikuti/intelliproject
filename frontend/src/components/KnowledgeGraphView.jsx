import React, { useRef, useEffect, useState, useMemo } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Filter, Maximize2, Move } from 'lucide-react';

export default function KnowledgeGraphView({ graphData, onNodeSelect }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Dynamic categories from data
  const categories = useMemo(() => {
    if (!graphData?.nodes) return ['All'];
    const set = new Set();
    graphData.nodes.forEach(n => {
      if (n.category) set.add(n.category);
    });
    return ['All', ...Array.from(set)];
  }, [graphData]);

  // Node positions state
  const nodesPosRef = useRef([]);

  useEffect(() => {
    if (!graphData || !graphData.nodes) return;

    const width = 860;
    const height = 520;
    const centerX = width / 2;
    const centerY = height / 2;

    // Concentric or force layout by level
    const initialPositions = graphData.nodes.map((node, index) => {
      const level = node.level || 2;
      const radius = level === 1 ? 80 : (level === 2 ? 175 : (level === 3 ? 260 : 330));
      const nodesAtLevel = graphData.nodes.filter(n => (n.level || 2) === level);
      const countAtLevel = nodesAtLevel.length;
      const indexAtLevel = nodesAtLevel.findIndex(n => n.id === node.id);
      
      const angle = (indexAtLevel / (countAtLevel || 1)) * 2 * Math.PI + (level * 0.45);
      return {
        ...node,
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 15,
        y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 15,
        vx: 0,
        vy: 0,
        radius: level === 1 ? 24 : (level === 2 ? 18 : 14)
      };
    });

    nodesPosRef.current = initialPositions;
  }, [graphData]);

  // Simulation and render loop with High-DPI support
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = 860;
    const displayHeight = 520;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;

    const render = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Background canvas fill
      ctx.fillStyle = '#0c0c11';
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      // Subtle engineering dot grid
      ctx.save();
      ctx.translate(pan.x % (24 * zoom), pan.y % (24 * zoom));
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      const gridSize = 24 * zoom;
      for (let x = 0; x < displayWidth; x += gridSize) {
        for (let y = 0; y < displayHeight; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      const nodes = nodesPosRef.current;
      const edges = graphData?.edges || [];

      // Filter nodes
      const filteredNodeIds = new Set(
        nodes
          .filter(n => filterCategory === 'All' || n.category === filterCategory)
          .map(n => n.id)
      );

      // Draw Edges with arrowheads
      edges.forEach(edge => {
        if (!filteredNodeIds.has(edge.source) || !filteredNodeIds.has(edge.target)) return;
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);

        if (sourceNode && targetNode) {
          const isHighlighted = selectedNode && (selectedNode.id === sourceNode.id || selectedNode.id === targetNode.id);
          
          ctx.beginPath();
          ctx.strokeStyle = isHighlighted ? '#818cf8' : 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = isHighlighted ? 1.8 : 1;
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.stroke();

          // Arrowhead
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const angle = Math.atan2(dy, dx);
          const dist = Math.hypot(dx, dy);
          
          if (dist > targetNode.radius + 10) {
            const arrowX = targetNode.x - Math.cos(angle) * (targetNode.radius + 3);
            const arrowY = targetNode.y - Math.sin(angle) * (targetNode.radius + 3);
            const arrowSize = isHighlighted ? 6 : 4;

            ctx.beginPath();
            ctx.fillStyle = isHighlighted ? '#818cf8' : 'rgba(255, 255, 255, 0.2)';
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(arrowX - arrowSize * Math.cos(angle - Math.PI / 6), arrowY - arrowSize * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(arrowX - arrowSize * Math.cos(angle + Math.PI / 6), arrowY - arrowSize * Math.sin(angle + Math.PI / 6));
            ctx.closePath();
            ctx.fill();
          }

          // Relation label on midpoint if highlighted
          if (isHighlighted && edge.relation) {
            const midX = (sourceNode.x + targetNode.x) / 2;
            const midY = (sourceNode.y + targetNode.y) / 2;

            // Pill background
            ctx.fillStyle = '#16161e';
            const textWidth = ctx.measureText(edge.relation).width + 8;
            ctx.fillRect(midX - textWidth / 2, midY - 7, textWidth, 14);
            ctx.strokeStyle = '#272733';
            ctx.lineWidth = 1;
            ctx.strokeRect(midX - textWidth / 2, midY - 7, textWidth, 14);

            ctx.fillStyle = '#a1a1aa';
            ctx.font = '500 9px JetBrains Mono, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(edge.relation, midX, midY);
          }
        }
      });

      // Draw Nodes
      nodes.forEach(node => {
        if (!filteredNodeIds.has(node.id)) return;
        const isSelected = selectedNode?.id === node.id;

        // Selection highlight ring (clean, no fuzzy glow)
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 4, 0, 2 * Math.PI);
          ctx.strokeStyle = '#f4f4f5';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Circle body (matte fill)
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        ctx.fillStyle = node.color || '#6366f1';
        ctx.fill();

        ctx.strokeStyle = '#121217';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node Label
        ctx.font = `${node.level === 1 ? '600 11px' : '500 10px'} Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Label pill background for legibility
        const labelText = node.label;
        const labelWidth = ctx.measureText(labelText).width + 6;
        const labelY = node.y + node.radius + 5;

        ctx.fillStyle = 'rgba(12, 12, 17, 0.85)';
        ctx.fillRect(node.x - labelWidth / 2, labelY - 2, labelWidth, 14);

        ctx.fillStyle = isSelected ? '#ffffff' : '#d4d4d8';
        ctx.fillText(labelText, node.x, labelY);
      });

      ctx.restore();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [graphData, pan, zoom, selectedNode, filterCategory]);

  // Mouse event handlers
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - pan.y) / zoom;

    const clicked = nodesPosRef.current.find(n => {
      const dist = Math.hypot(n.x - mouseX, n.y - mouseY);
      return dist <= n.radius + 4;
    });

    if (clicked) {
      setDraggedNode(clicked);
      setSelectedNode(clicked);
      if (onNodeSelect) onNodeSelect(clicked);
    } else {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e) => {
    if (draggedNode) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseY = (e.clientY - rect.top - pan.y) / zoom;
      draggedNode.x = mouseX;
      draggedNode.y = mouseY;
    } else if (isDragging) {
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };

  return (
    <div ref={containerRef} className="relative rounded-2xl glass-panel overflow-hidden border border-zinc-800 shadow-xl">
      
      {/* Top Filter Bar */}
      <div className="absolute top-3.5 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center space-x-1 bg-zinc-900/90 backdrop-blur-md p-1 rounded-xl border border-zinc-800 pointer-events-auto">
          <Filter className="w-3.5 h-3.5 text-zinc-500 ml-1.5 mr-0.5" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                filterCategory === cat
                  ? 'bg-zinc-100 text-zinc-900 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center space-x-1 bg-zinc-900/90 backdrop-blur-md p-1 rounded-xl border border-zinc-800 pointer-events-auto">
          <button
            onClick={() => setZoom(z => Math.min(z * 1.15, 2.2))}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z * 0.85, 0.45))}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
            title="Reset Canvas"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '520px', cursor: isDragging ? 'grabbing' : (draggedNode ? 'grabbing' : 'grab') }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 max-w-sm p-4 bg-zinc-900/95 backdrop-blur-md rounded-xl border border-zinc-800 shadow-xl text-left pointer-events-auto animate-fade-in">
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border"
              style={{
                backgroundColor: `${selectedNode.color}15`,
                color: selectedNode.color,
                borderColor: `${selectedNode.color}35`
              }}
            >
              {selectedNode.category}
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-xs text-zinc-400 hover:text-zinc-200"
            >
              ✕
            </button>
          </div>
          <h4 className="text-sm font-semibold text-white">{selectedNode.label}</h4>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            {selectedNode.description || `Structural node in project ontology. Connected across system relations.`}
          </p>
        </div>
      )}

      {/* Legend Footer */}
      <div className="absolute bottom-3 right-4 flex items-center space-x-3 text-[11px] text-zinc-400 bg-zinc-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-zinc-800 pointer-events-none">
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#6366f1]"></span>
          <span>Arch</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
          <span>Algorithm</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#38bdf8]"></span>
          <span>Tech</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#f43f5e]"></span>
          <span>Data</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
          <span>Eval</span>
        </span>
      </div>

    </div>
  );
}
