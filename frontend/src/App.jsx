import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';
import Dashboard from './pages/Dashboard';
import AgentStudio from './pages/AgentStudio';
import ResearchHub from './pages/ResearchHub';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import NoveltyPage from './pages/NoveltyPage';
import RoadmapPage from './pages/RoadmapPage';
import DocumentationPage from './pages/DocumentationPage';
import VivaPrepPage from './pages/VivaPrepPage';
import ProjectsManager from './pages/ProjectsManager';
import ReviewDecksPage from './pages/ReviewDecksPage';
import { listProjects, saveProject } from './services/api';


export default function App() {
  const [currentTab, setCurrentTab] = useState('orchestrator');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Global Project State - defaults to null until user enters details or loads existing project
  const [selectedProject, setSelectedProject] = useState(null);
  const [orchestrationResult, setOrchestrationResult] = useState(null);

  // Check for existing saved projects on load
  useEffect(() => {
    async function initProjects() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const requestedTab = urlParams.get('tab');
        const existing = await listProjects();
        if (existing && existing.length > 0) {
          // Filter out any lingering hardcoded demo projects
          const validProjects = existing.filter(p => !p.title.includes("IntelliProject: Agentic AI-Based"));
          if (validProjects.length > 0) {
            setSelectedProject(validProjects[0]);
            setCurrentTab(requestedTab || 'dashboard');
          } else {
            setSelectedProject(null);
            setCurrentTab(requestedTab || 'orchestrator');
          }
        } else {
          setSelectedProject(null);
          setCurrentTab(requestedTab || 'orchestrator');
        }
      } catch (e) {
        console.log("DB init notice:", e);
        setSelectedProject(null);
        setCurrentTab('orchestrator');
      }
    }
    initProjects();
  }, []);

  const handleStartNewProject = () => {
    setSelectedProject(null);
    setOrchestrationResult(null);
    setCurrentTab('orchestrator');
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar 
        activeProject={selectedProject}
        onNewProject={handleStartNewProject}
        onOpenProjectsManager={() => setCurrentTab('projects_manager')}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <Sidebar 
          currentTab={currentTab} 
          setTab={setCurrentTab} 
          hasActiveProject={!!selectedProject}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {currentTab === 'dashboard' && (
            <Dashboard 
              onNavigate={setCurrentTab}
              projectData={selectedProject}
              orchestrationResult={orchestrationResult}
            />
          )}

          {currentTab === 'reviews' && (
            <ReviewDecksPage 
              activeProject={selectedProject}
            />
          )}


          {currentTab === 'orchestrator' && (
            <AgentStudio 
              onSelectProject={(proj) => {
                setSelectedProject(proj);
                saveProject({
                  title: proj.title,
                  domain: proj.domain || "Artificial Intelligence",
                  problem_statement: proj.problem_statement || proj.tagline || proj.description,
                  methodology: proj.methodology,
                  tech_stack: proj.tech_stack,
                  novelty_score: proj.novelty_score || 92.0
                }).catch(() => {});
              }}
              orchestrationResult={orchestrationResult}
              setOrchestrationResult={setOrchestrationResult}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'papers' && (
            <ResearchHub 
              activeProject={selectedProject} 
              orchestrationResult={orchestrationResult}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'graph' && (
            <KnowledgeGraphPage 
              activeProject={selectedProject}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'novelty' && (
            <NoveltyPage 
              projectData={selectedProject}
              orchestrationResult={orchestrationResult}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'roadmap' && (
            <RoadmapPage 
              orchestrationResult={orchestrationResult}
              projectData={selectedProject}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'docs' && (
            <DocumentationPage 
              orchestrationResult={orchestrationResult}
              projectData={selectedProject}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'viva' && (
            <VivaPrepPage 
              orchestrationResult={orchestrationResult}
              projectData={selectedProject}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'projects_manager' && (
            <ProjectsManager 
              activeProject={selectedProject}
              onSelectProject={(proj) => {
                setSelectedProject(proj);
                setCurrentTab('dashboard');
              }}
              onNewProject={handleStartNewProject}
            />
          )}
        </main>

      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

    </div>
  );
}
