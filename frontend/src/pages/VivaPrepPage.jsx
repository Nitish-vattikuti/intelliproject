import React, { useState, useEffect } from 'react';
import { Award, Sparkles, RefreshCw, Bot, ArrowRight } from 'lucide-react';
import VivaSimulator from '../components/VivaSimulator';
import { generateVivaQuestions } from '../services/api';

export default function VivaPrepPage({ orchestrationResult, projectData, onNavigate }) {
  const [questions, setQuestions] = useState(orchestrationResult?.viva_questions || []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (orchestrationResult?.viva_questions && orchestrationResult.viva_questions.length > 0) {
      setQuestions(orchestrationResult.viva_questions);
    }
  }, [orchestrationResult]);

  if (!projectData) {
    return (
      <div className="space-y-8 animate-fade-in max-w-3xl mx-auto my-16 text-center">
        <div className="glass-panel p-10 rounded-2xl border border-zinc-800 space-y-5 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 text-indigo-400 mx-auto flex items-center justify-center">
            <Award className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white font-['Outfit']">No Project Configured</h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Enter your project details to generate university external examiner defense questions and test your oral defense readiness.
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

  const activeTitle = projectData.title;
  const activeStack = projectData.tech_stack || ["Python", "FastAPI"];

  const handleGenerateQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await generateVivaQuestions(activeTitle, activeStack);
      if (res.questions && res.questions.length > 0) {
        setQuestions(res.questions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // If questions empty on load, auto-trigger generation for active project
  useEffect(() => {
    if (questions.length === 0 && activeTitle) {
      handleGenerateQuestions();
    }
  }, [activeTitle]);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-indigo-400" />
            <span>Viva Agent & Defense Panel</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-['Outfit']">
            AI Viva-Voce Examination Simulator
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            External committee defense drill simulator customized for: <span className="text-indigo-300 font-semibold">{activeTitle}</span>
          </p>
        </div>

        <button
          onClick={handleGenerateQuestions}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs border border-zinc-700 flex items-center space-x-2 transition disabled:opacity-50 shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Generating Questions...' : 'Generate New Questions'}</span>
        </button>
      </div>

      {/* Simulator Component */}
      <VivaSimulator 
        questions={questions} 
        onGenerateQuestions={handleGenerateQuestions}
        isLoadingQuestions={isLoading}
      />

    </div>
  );
}
