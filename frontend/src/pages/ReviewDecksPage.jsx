import React, { useState, useEffect } from 'react';
import { 
  Presentation, Download, FileText, CheckCircle2, ChevronRight, 
  ChevronLeft, Award, Users, BookOpen, Layers, ShieldCheck, Sparkles,
  Calendar, ExternalLink
} from 'lucide-react';
import { getReviewMetadata, getReviewDeck, exportReviewPptx, getSynchronizedThesisDrafts } from '../services/api';

export default function ReviewDecksPage({ activeProject }) {
  const [metadata, setMetadata] = useState(null);
  const [selectedReviewId, setSelectedReviewId] = useState('p1r1');
  const [deckData, setDeckData] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isThesisModalOpen, setIsThesisModalOpen] = useState(false);
  const [thesisDrafts, setThesisDrafts] = useState(null);
  const [activeThesisChapter, setActiveThesisChapter] = useState('ch1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const meta = await getReviewMetadata();
        setMetadata(meta);

        const deck = await getReviewDeck(selectedReviewId, activeProject);
        setDeckData(deck);

        const drafts = await getSynchronizedThesisDrafts(activeProject);
        setThesisDrafts(drafts);
      } catch (err) {
        console.error("Failed to load review data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedReviewId, activeProject]);

  const handleExportPPTX = async () => {
    try {
      setIsExporting(true);
      await exportReviewPptx(selectedReviewId, activeProject);
    } catch (e) {
      alert("Failed to export PPTX: " + e.message);
    } finally {
      setIsExporting(false);
    }
  };

  const currentSlide = deckData?.slides?.[currentSlideIndex] || null;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Engineering Capstone Framework
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
              Review Presentation Framework & Thesis Synchronizer
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Standardized format for all 6 review milestones and final thesis chapters.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsThesisModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-medium transition"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Thesis Drafts</span>
            </button>
            <button
              onClick={handleExportPPTX}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Generating PPTX...' : 'Export PPTX Deck'}</span>
            </button>
          </div>
        </div>

        {/* 3 Core Rules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 pt-4 border-t border-zinc-800">
          <div className="flex items-start gap-2.5 bg-zinc-950/60 rounded-lg p-2.5 border border-zinc-800">
            <div className="w-5 h-5 rounded bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-[10px] shrink-0">
              01
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-200">One Deck Per Review</div>
              <div className="text-[11px] text-zinc-400">10 slides per milestone. Focused on specific gate deliverables.</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-zinc-950/60 rounded-lg p-2.5 border border-zinc-800">
            <div className="w-5 h-5 rounded bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-[10px] shrink-0">
              02
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-200">Structured Template, Live Content</div>
              <div className="text-[11px] text-zinc-400">Fixed evaluation rubric; content populated from active project data.</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-zinc-950/60 rounded-lg p-2.5 border border-zinc-800">
            <div className="w-5 h-5 rounded bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-[10px] shrink-0">
              03
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-200">Every Slide Feeds Thesis</div>
              <div className="text-[11px] text-zinc-400">Slide contents map 1-to-1 with Thesis Chapters 1 to 5.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Milestone Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {metadata?.reviews?.map((rev) => {
          const isSelected = selectedReviewId === rev.id;
          return (
            <button
              key={rev.id}
              onClick={() => {
                setSelectedReviewId(rev.id);
                setCurrentSlideIndex(0);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition border flex items-center gap-2 ${
                isSelected
                  ? 'bg-zinc-800 text-white border-zinc-600 font-semibold'
                  : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-800'
              }`}
            >
              <Presentation className="w-3.5 h-3.5 text-zinc-400" />
              <span>{rev.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                {rev.slide_count} slides
              </span>
            </button>
          );
        })}
      </div>

      {/* Slide Canvas */}
      {loading ? (
        <div className="h-80 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="text-xs text-zinc-400">Loading slide preview...</div>
        </div>
      ) : currentSlide ? (
        <div className="space-y-3">
          
          {/* Slide Stage Card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 min-h-[460px] flex flex-col justify-between">
            
            {/* Top Bar inside Slide */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 flex items-center justify-center font-bold text-xs">
                  {String(currentSlide.slide_number).padStart(2, '0')}
                </span>
                <div>
                  <h2 className="text-lg font-bold text-zinc-100">
                    {currentSlide.title}
                  </h2>
                  <div className="text-[11px] text-zinc-500">
                    Review {deckData?.review_info?.review_num} · Slide {currentSlide.slide_number} of {deckData?.total_slides}
                  </div>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-zinc-900 text-zinc-400 border border-zinc-800 rounded text-[11px] font-semibold tracking-wide uppercase">
                {currentSlide.gate_label || deckData?.review_info?.gate_label}
              </span>
            </div>

            {/* Slide Body */}
            <div className="flex-1 py-1">
              {currentSlide.slide_number === 1 && (
                <div className="space-y-5">
                  <div className="border-l-2 border-indigo-500 pl-3">
                    <h3 className="text-xl font-bold text-zinc-100">{currentSlide.content.project_title}</h3>
                    <p className="text-xs text-zinc-400 mt-1">Area of Specialization: {currentSlide.content.domain || 'Computer Science & Engineering'} · University Capstone Milestone</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3.5">
                      <div className="text-xs font-semibold text-zinc-300 mb-2.5 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-zinc-400" /> Project Specifications
                      </div>
                      <div className="space-y-1.5">
                        {currentSlide.content.overview_bullets?.map((b, idx) => (
                          <div key={idx} className="flex items-center text-xs bg-zinc-950 p-2 rounded border border-zinc-800/80 text-zinc-300">
                            • {b}
                          </div>
                        )) || (
                          <div className="text-xs text-zinc-400">Undergraduate Engineering Capstone Milestone</div>
                        )}
                      </div>
                    </div>

                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3.5 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-zinc-400" /> Academic Affiliation
                        </div>
                        <div className="text-xs text-zinc-300 font-medium">{currentSlide.content.guide_name}</div>
                        <div className="text-[11px] text-zinc-400 mt-1">{currentSlide.content.department}</div>
                      </div>
                      <div className="mt-4 pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                        <span>Milestone: <strong className="text-zinc-300">{currentSlide.content.date}</strong></span>
                        <span>Track: <strong className="text-zinc-300">Capstone Review</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentSlide.slide_number === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold text-zinc-300 mb-1.5">Problem Statement</div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {currentSlide.content.problem_description}
                      </p>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold text-zinc-300 mb-1.5">Proposed Technical Solution</div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {currentSlide.content.solution_statement}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {currentSlide.slide_number === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-2">
                    <div className="text-xs font-semibold text-zinc-300">Motivation</div>
                    <ul className="space-y-1.5 text-xs text-zinc-400">
                      {currentSlide.content.motivation_points?.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-1.5 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-2">
                    <div className="text-xs font-semibold text-zinc-300">Practical Need</div>
                    <ul className="space-y-1.5 text-xs text-zinc-400">
                      {currentSlide.content.need_points?.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-1.5 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {currentSlide.slide_number === 4 && (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
                  <div className="text-xs font-semibold text-zinc-300">Core Deliverables & Objectives Checklist</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {currentSlide.content.objectives_list?.map((obj, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 bg-zinc-950 p-2.5 rounded border border-zinc-800/80">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-zinc-300 leading-snug">{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentSlide.slide_number === 5 && (
                <div className="space-y-3">
                  <p className="text-xs text-zinc-400 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                    {currentSlide.content.architecture_summary}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {currentSlide.content.pipeline_stages?.map((st, idx) => (
                      <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5">
                        <span className="text-[10px] font-semibold text-zinc-500 uppercase">
                          Stage {idx + 1}
                        </span>
                        <div className="font-semibold text-xs text-zinc-200 mt-0.5">{st.stage}</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">{st.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentSlide.slide_number === 6 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-2">
                    <div className="text-xs font-semibold text-zinc-300">In Scope</div>
                    <ul className="space-y-1.5 text-xs text-zinc-400">
                      {currentSlide.content.in_scope?.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-2">
                    <div className="text-xs font-semibold text-zinc-300">Out of Scope</div>
                    <ul className="space-y-1.5 text-xs text-zinc-400">
                      {currentSlide.content.out_scope?.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {currentSlide.slide_number === 7 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {Object.entries(currentSlide.content).map(([k, v]) => (
                    <div key={k} className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5">
                      <span className="text-[10px] font-semibold text-zinc-500 uppercase">
                        {k.replace('_', ' ')}
                      </span>
                      <div className="text-xs font-medium text-zinc-200 mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>
              )}

              {currentSlide.slide_number === 8 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-zinc-900/80">
                        <th className="py-2 px-3 text-zinc-300 font-semibold">Research Work</th>
                        <th className="py-2 px-3 text-zinc-300 font-semibold">Approach</th>
                        <th className="py-2 px-3 text-zinc-300 font-semibold">Limitation</th>
                        <th className="py-2 px-3 text-zinc-300 font-semibold">Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {currentSlide.content.table_rows?.map((row, idx) => (
                        <tr key={idx} className="hover:bg-zinc-900/40">
                          <td className="py-2 px-3 font-medium text-zinc-200">{row.work}</td>
                          <td className="py-2 px-3 text-zinc-400">{row.approach}</td>
                          <td className="py-2 px-3 text-zinc-500">{row.limitation}</td>
                          <td className="py-2 px-3">
                            <a 
                              href={row.citation} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 font-mono text-[11px]"
                            >
                              arXiv <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {currentSlide.slide_number === 9 && (
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-zinc-300">
                    Milestone Schedule
                  </div>
                  <div className="space-y-2">
                    {currentSlide.content.timeline_phases?.map((ph, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800 text-xs">
                        <div className="font-medium text-zinc-200">{ph.phase}</div>
                        <div className="text-zinc-400 text-center">{ph.tasks}</div>
                        <div className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded font-mono text-[11px]">
                          {ph.months}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentSlide.slide_number === 10 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3.5 space-y-2">
                    <div className="text-xs font-semibold text-zinc-300">Core Functional Modules</div>
                    {currentSlide.content.team_assignments?.map((m) => (
                      <div key={m.id} className="text-xs flex items-center justify-between border-b border-zinc-800/60 pb-1">
                        <span className="text-zinc-200">{m.name}</span>
                        <span className="text-zinc-500 text-[11px]">{m.role}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3.5 space-y-2">
                    <div className="text-xs font-semibold text-zinc-300">Thesis Chapter Mapping</div>
                    {currentSlide.content.report_chapters?.map((ch, idx) => (
                      <div key={idx} className="text-xs border-b border-zinc-800/60 pb-1">
                        <span className="text-zinc-200 font-medium">{ch.chapter}</span>
                        <p className="text-[11px] text-zinc-500">{ch.focus}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentSlide.slide_number > 10 && (
                <div className="p-5 bg-zinc-900/40 rounded-lg border border-zinc-800 text-center space-y-1.5">
                  <div className="text-sm font-semibold text-zinc-200">{currentSlide.content.deliverable}</div>
                  <div className="text-xs text-zinc-400">{currentSlide.content.focus}</div>
                </div>
              )}
            </div>

            {/* Bottom Footer: Thesis Mapping */}
            <div className="border-t border-zinc-800 pt-3 mt-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 font-medium">
                  Maps to: <strong className="text-zinc-200">{currentSlide.thesis_mapping}</strong>
                </span>
              </div>

              <div className="text-zinc-500 text-xs">
                Slide {currentSlide.slide_number} / {deckData?.total_slides}
              </div>
            </div>

          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg p-2.5">
            <button
              onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
              disabled={currentSlideIndex === 0}
              className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 rounded text-xs font-medium transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>

            <div className="flex items-center gap-1">
              {deckData?.slides?.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-5 h-5 rounded text-[10px] font-medium transition ${
                    currentSlideIndex === idx
                      ? 'bg-zinc-700 text-white'
                      : 'bg-zinc-950 text-zinc-500 hover:bg-zinc-800'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentSlideIndex(Math.min((deckData?.slides?.length || 1) - 1, currentSlideIndex + 1))}
              disabled={currentSlideIndex === (deckData?.slides?.length || 1) - 1}
              className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 rounded text-xs font-medium transition"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      ) : null}

      {/* Thesis Drafts Modal */}
      {isThesisModalOpen && thesisDrafts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
            
            <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-zinc-100">
                  Synchronized Thesis Chapters
                </h3>
              </div>
              <button 
                onClick={() => setIsThesisModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-200 text-xs px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex items-center gap-1.5 px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
              {['ch1', 'ch2', 'ch3', 'ch4', 'ch5'].map((ch, idx) => (
                <button
                  key={ch}
                  onClick={() => setActiveThesisChapter(ch)}
                  className={`px-3 py-1 rounded text-xs font-medium transition ${
                    activeThesisChapter === ch
                      ? 'bg-zinc-800 text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Chapter {idx + 1}
                </button>
              ))}
            </div>

            <div className="flex-1 p-5 overflow-y-auto font-mono text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap bg-zinc-950">
              {thesisDrafts[activeThesisChapter]}
            </div>

            <div className="p-3 border-t border-zinc-800 bg-zinc-950 flex justify-end">
              <button
                onClick={() => {
                  const blob = new Blob([thesisDrafts[activeThesisChapter]], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Thesis_${activeThesisChapter.toUpperCase()}_Draft.md`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-medium"
              >
                <Download className="w-3.5 h-3.5" /> Download Markdown
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
