import React, { useState } from 'react';
import { FileText, Copy, Download, Check, Sparkles, BookOpen, Layers, CheckCircle2, RefreshCw, Bot, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateDocumentation } from '../services/api';

export default function DocumentationPage({ orchestrationResult, projectData, onNavigate }) {
  const [copied, setCopied] = useState(false);
  const [liveDoc, setLiveDoc] = useState(orchestrationResult?.documentation || null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!projectData) {
    return (
      <div className="space-y-8 animate-fade-in max-w-3xl mx-auto my-16 text-center">
        <div className="glass-panel p-10 rounded-2xl border border-zinc-800 space-y-5 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 text-indigo-400 mx-auto flex items-center justify-center">
            <FileText className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white font-['Outfit']">No Project Configured</h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Enter your project details to synthesize a complete IEEE-formatted abstract, formal problem statement, measurable objectives, and thesis chapter outlines.
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

  const handleGenerateLive = async () => {
    setIsGenerating(true);
    try {
      const res = await generateDocumentation({
        title: projectData.title,
        domain: projectData.domain || "Artificial Intelligence",
        methodology: projectData.methodology || projectData.problem_statement || "Modular architecture",
        tech_stack: projectData.tech_stack || ["Python", "FastAPI"]
      });
      if (res.documentation) {
        setLiveDoc(res.documentation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const techs = (projectData.tech_stack || []).join(', ') || "Python, Modern Frameworks";
  const domain = projectData.domain || "Engineering";
  const title = projectData.title;

  const doc = liveDoc || orchestrationResult?.documentation || {
    ieee_abstract: `In modern engineering applications, robust implementations of ${domain} systems require systematic architecture design and rigorous validation. This research presents ${title}, an advanced engineering solution built using ${techs}. By leveraging a modular architecture, the proposed approach addresses key challenges in scalability, latency, and operational efficiency. We evaluate system performance through empirical benchmarks, demonstrating significant improvements over baseline approaches and providing a reproducible framework for real-world deployment.`,
    problem_statement_section: `Current solutions in the domain of ${domain} often suffer from architectural fragmentation, suboptimal performance, and limited adaptability. Specifically, existing implementations lack unified integration of ${techs}, leading to reliability and throughput bottlenecks in production environments.`,
    objectives_section: [
      `Design and implement a robust system architecture for ${title}.`,
      `Integrate core computational modules leveraging ${techs}.`,
      `Establish validation pipelines and empirical performance metrics in ${domain}.`,
      `Benchmark latency, computational efficiency, and accuracy against state-of-the-art baselines.`,
      `Deliver production-ready modular codebase and comprehensive technical documentation.`
    ],
    scope_and_boundaries: {
      in_scope: [
        `Core architectural design and implementation using ${techs}`,
        `Algorithmic execution and validation for ${domain}`,
        "Automated performance metric benchmarking and evaluation",
        "Modular API design and developer documentation"
      ],
      out_scope: [
        "Proprietary hardware fabrication (assumes standard runtime hardware)",
        "Unrestricted multi-tenant public deployment without authentication"
      ]
    },
    thesis_chapters: {
      ch1_introduction: {
        title: "Chapter 1: Introduction",
        sections: [
          "1.1 Domain Background & Context",
          `1.2 Problem Statement in ${domain}`,
          "1.3 Project Motivation & Objectives",
          "1.4 Proposed Architectural Approach",
          "1.5 Scope and System Boundaries",
          `1.6 Technical Stack Overview (${techs})`,
          "1.7 Thesis Organization"
        ]
      },
      ch2_literature_review: {
        title: "Chapter 2: Literature Review",
        sections: [
          `2.1 Survey of Modern Methodologies in ${domain}`,
          `2.2 Comparative Analysis of Frameworks (${techs})`,
          "2.3 Performance and Scalability Paradigms",
          "2.4 Identified Research and Implementation Gaps",
          "2.5 Summary of Prior Art"
        ]
      },
      ch3_methodology_design: {
        title: "Chapter 3: Methodology & System Architecture",
        sections: [
          "3.1 High-Level System Architecture Design",
          "3.2 Data Flow & Component Sequence Models",
          "3.3 Core Algorithm Formulation",
          "3.4 Database and Vector Storage Schema",
          "3.5 API Specification and Interface Contracts"
        ]
      },
      ch4_implementation_results: {
        title: "Chapter 4: Implementation & Experimental Results",
        sections: [
          "4.1 Development Environment & Setup",
          "4.2 Modular Implementation Details",
          "4.3 Benchmark Setup & Experimental Metrics",
          "4.4 Comparative Performance Analysis",
          "4.5 Discussion of Results & Ablation Studies"
        ]
      },
      ch5_conclusion_future_scope: {
        title: "Chapter 5: Conclusion & Future Scope",
        sections: [
          "5.1 Summary of Contributions",
          "5.2 Key Takeaways & Practical Implications",
          "5.3 Technical Challenges & Known Limitations",
          "5.4 Directions for Future Research & Extensions"
        ]
      }
    }
  };

  const handleCopyAbstract = () => {
    navigator.clipboard.writeText(doc.ieee_abstract);
    setCopied(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const mdContent = `# Project Thesis Documentation
## ${projectData.title}
**Domain:** ${projectData.domain || 'Computer Science'}  
**Tech Stack:** ${(projectData.tech_stack || []).join(', ')}  

---

### IEEE Abstract
${doc.ieee_abstract}

---

### Problem Statement
${doc.problem_statement_section}

---

### Project Objectives
${doc.objectives_section?.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

---

### Scope & Boundaries
#### In-Scope:
${doc.scope_and_boundaries?.in_scope?.map(s => `- ${s}`).join('\n')}

#### Out-of-Scope:
${doc.scope_and_boundaries?.out_scope?.map(s => `- ${s}`).join('\n')}

---

### Thesis Chapter Outlines
${Object.entries(doc.thesis_chapters || {}).map(([k, ch]) => `
#### ${ch.title}
${ch.sections?.map(sec => `- ${sec}`).join('\n')}
`).join('\n')}
`;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectData.title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_Thesis_Doc.md`;
    a.click();
    URL.revokeObjectURL(url);
    confetti({ particleCount: 80, spread: 70 });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Documentation Agent</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-['Outfit']">
            Automated Thesis Documentation Suite
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Publication-grade IEEE abstract and complete thesis structure generated for: <span className="text-indigo-300 font-semibold">{projectData.title}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleGenerateLive}
            disabled={isGenerating}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs border border-zinc-700 flex items-center space-x-1.5 transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating...' : 'Re-synthesize'}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Markdown</span>
          </button>
        </div>
      </div>

      {/* IEEE Abstract Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-zinc-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
              IEEE Standard Abstract (250 Words)
            </h3>
          </div>

          <button
            onClick={handleCopyAbstract}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 border border-zinc-700 flex items-center space-x-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Abstract'}</span>
          </button>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed font-serif italic">
          "{doc.ieee_abstract}"
        </div>
      </div>

      {/* Problem Statement & Measurable Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Problem Statement */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Formal Problem Statement</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {doc.problem_statement_section}
          </p>
        </div>

        {/* Objectives */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Measurable Project Objectives</span>
          </div>
          <ul className="space-y-2 text-xs text-zinc-300">
            {doc.objectives_section?.map((obj, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-snug">{obj}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Scope and Boundaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-3 shadow-sm">
          <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            In-Scope Engineering Deliverables
          </h4>
          <ul className="space-y-2 text-xs text-zinc-300">
            {doc.scope_and_boundaries?.in_scope?.map((item, i) => (
              <li key={i} className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-3 shadow-sm">
          <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
            Project Boundaries & Non-Goals
          </h4>
          <ul className="space-y-2 text-xs text-zinc-300">
            {doc.scope_and_boundaries?.out_scope?.map((item, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-950/40 text-rose-400 border border-rose-800/40 flex items-center justify-center text-[10px] shrink-0 mt-0.5">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Chapters 1-5 Accordion / Outline */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-zinc-800 space-y-5 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-white font-['Outfit']">
            Comprehensive Thesis Chapters (Chapters 1 to 5)
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Structured in compliance with standard undergraduate & graduate engineering thesis formats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(doc.thesis_chapters || {}).map(([key, chapter], idx) => (
            <div
              key={key}
              className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 hover:border-zinc-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-zinc-400">CH 0{idx + 1}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{chapter.title}</h4>
                
                <ul className="mt-2.5 space-y-1 text-[11px] text-zinc-400 list-disc list-inside">
                  {chapter.sections?.map((sec, sIdx) => (
                    <li key={sIdx} className="leading-snug truncate" title={sec}>{sec}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono">
                {chapter.sections?.length || 0} Subsections Outlined
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
