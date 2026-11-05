const BASE_URL = '/api';

export async function fetchHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  return res.json();
}

export async function getSystemStatus() {
  const res = await fetch(`${BASE_URL}/settings/status`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateApiKey(apiKey) {
  const res = await fetch(`${BASE_URL}/settings/api-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}


export async function runMultiAgentPipeline(profile) {
  const res = await fetch(`${BASE_URL}/agents/orchestrate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function mentorCustomProject(customInput) {
  const res = await fetch(`${BASE_URL}/agents/custom-mentor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customInput),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function searchPapers(query, top_k = 5) {
  const res = await fetch(`${BASE_URL}/agents/papers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, top_k }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function askRAG(question, top_k = 4) {
  const res = await fetch(`${BASE_URL}/agents/papers/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, top_k }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function checkNovelty(title, methodology) {
  const res = await fetch(`${BASE_URL}/agents/novelty`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, methodology }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function verifyNovelty(title, domain, methodology, tech_stack) {
  const res = await fetch(`${BASE_URL}/agents/novelty`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, methodology: methodology || domain }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getKnowledgeGraphData(project = null) {
  let url = `${BASE_URL}/graph/data`;
  if (project?.title) {
    const params = new URLSearchParams();
    if (project.id) params.append('project_id', project.id);
    params.append('title', project.title);
    if (project.domain) params.append('domain', project.domain);
    if (project.problem_statement) params.append('description', project.problem_statement);
    url += `?${params.toString()}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function generateProjectGraph(title, domain = '', description = '', tech_stack = []) {
  const res = await fetch(`${BASE_URL}/graph/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, domain, description, tech_stack }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getGraphNeighbors(nodeId) {
  const res = await fetch(`${BASE_URL}/graph/neighbors/${nodeId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function generateRoadmap(title, tech_stack, duration_weeks = 16) {
  const res = await fetch(`${BASE_URL}/agents/roadmap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, tech_stack, duration_weeks }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function generateDocumentation(payload) {
  const res = await fetch(`${BASE_URL}/agents/docs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function generateVivaQuestions(title, tech_stack) {
  const res = await fetch(`${BASE_URL}/agents/viva/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, tech_stack }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function evaluateVivaAnswer(question, model_answer, student_answer) {
  const res = await fetch(`${BASE_URL}/agents/viva/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, model_answer, student_answer }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function listProjects() {
  const res = await fetch(`${BASE_URL}/projects`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function saveProject(project) {
  const res = await fetch(`${BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteProject(projectId) {
  const res = await fetch(`${BASE_URL}/projects/${projectId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// --- MVGR Review Presentation Framework APIs ---

export async function getReviewMetadata() {
  const res = await fetch(`${BASE_URL}/reviews/metadata`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getReviewDeck(reviewId = 'p1r1', project = null) {
  let url = `${BASE_URL}/reviews/${reviewId}/deck`;
  const params = new URLSearchParams();
  if (project?.id) params.append('project_id', project.id);
  if (project?.title) params.append('title', project.title);
  if (project?.domain) params.append('domain', project.domain);
  if (project?.problem_statement) params.append('problem_statement', project.problem_statement);
  if (params.toString()) url += `?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function exportReviewPptx(reviewId = 'p1r1', project = null) {
  let url = `${BASE_URL}/reviews/${reviewId}/export-pptx`;
  const params = new URLSearchParams();
  if (project?.id) params.append('project_id', project.id);
  if (project?.title) params.append('title', project.title);
  if (project?.domain) params.append('domain', project.domain);
  if (project?.problem_statement) params.append('problem_statement', project.problem_statement);
  if (params.toString()) url += `?${params.toString()}`;

  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error(await res.text());
  const blob = await res.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  const cleanTitle = (project?.title || 'Capstone').slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_');
  a.download = `${cleanTitle}_${reviewId.toUpperCase()}_Presentation.pptx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
}

export async function getSynchronizedThesisDrafts(project = null) {
  let url = `${BASE_URL}/reviews/thesis/drafts`;
  const params = new URLSearchParams();
  if (project?.id) params.append('project_id', project.id);
  if (project?.title) params.append('title', project.title);
  if (project?.domain) params.append('domain', project.domain);
  if (project?.problem_statement) params.append('problem_statement', project.problem_statement);
  if (params.toString()) url += `?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getEvaluationMetrics() {
  const res = await fetch(`${BASE_URL}/ml/metrics`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

