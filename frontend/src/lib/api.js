const API_BASE = '/api/v1';

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = `Server error (${response.status})`;
    try {
      const errData = await response.json();
      if (errData && errData.detail) {
        errorMsg = typeof errData.detail === 'string' ? errData.detail : JSON.stringify(errData.detail);
      }
    } catch (_) {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export const api = {
  // Health
  getHealth: async () => {
    const res = await fetch('/health');
    return handleResponse(res);
  },

  // Subjects
  getSubjects: async () => {
    const res = await fetch(`${API_BASE}/subjects`);
    return handleResponse(res);
  },
  createSubject: async (data) => {
    const res = await fetch(`${API_BASE}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateSubject: async (id, data) => {
    const res = await fetch(`${API_BASE}/subjects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteSubject: async (id) => {
    const res = await fetch(`${API_BASE}/subjects/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },
  addUnit: async (subjectId, data) => {
    const res = await fetch(`${API_BASE}/subjects/${subjectId}/units`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  addTopic: async (subjectId, unitId, data) => {
    const res = await fetch(`${API_BASE}/subjects/${subjectId}/units/${unitId}/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  toggleTopic: async (topicId) => {
    const res = await fetch(`${API_BASE}/subjects/topics/${topicId}/toggle`, {
      method: 'POST',
    });
    return handleResponse(res);
  },

  // Resources
  getResources: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.subject_id) query.append('subject_id', params.subject_id);
    if (params.file_type) query.append('file_type', params.file_type);
    if (params.search) query.append('search', params.search);
    if (params.bookmarked !== undefined) query.append('bookmarked', params.bookmarked);
    
    const res = await fetch(`${API_BASE}/resources?${query.toString()}`);
    return handleResponse(res);
  },
  uploadResource: async (formData) => {
    const res = await fetch(`${API_BASE}/resources/upload`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(res);
  },
  getResource: async (id) => {
    const res = await fetch(`${API_BASE}/resources/${id}`);
    return handleResponse(res);
  },
  updateResource: async (id, data) => {
    const res = await fetch(`${API_BASE}/resources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteResource: async (id) => {
    const res = await fetch(`${API_BASE}/resources/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },
  getDownloadUrl: (id) => `${API_BASE}/resources/${id}/download`,

  // Assistant
  getAssistantStatus: async () => {
    const res = await fetch(`${API_BASE}/assistant/status`);
    return handleResponse(res);
  },
  getAssistantSessions: async () => {
    const res = await fetch(`${API_BASE}/assistant/sessions`);
    return handleResponse(res);
  },
  askAssistant: async (data) => {
    const res = await fetch(`${API_BASE}/assistant/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Notes
  getNotes: async () => {
    const res = await fetch(`${API_BASE}/notes`);
    return handleResponse(res);
  },
  generateNotes: async (data) => {
    const res = await fetch(`${API_BASE}/notes/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateNote: async (id, data) => {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteNote: async (id) => {
    const res = await fetch(`${API_BASE}/notes/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Quizzes
  generateQuiz: async (data) => {
    const res = await fetch(`${API_BASE}/quizzes/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  getQuiz: async (id) => {
    const res = await fetch(`${API_BASE}/quizzes/${id}`);
    return handleResponse(res);
  },
  submitQuiz: async (data) => {
    const res = await fetch(`${API_BASE}/quizzes/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  getQuizAttempts: async () => {
    const res = await fetch(`${API_BASE}/quizzes/attempts/history`);
    return handleResponse(res);
  },

  // Flashcards
  getFlashcards: async (subjectId = null) => {
    const url = subjectId ? `${API_BASE}/flashcards?subject_id=${subjectId}` : `${API_BASE}/flashcards`;
    const res = await fetch(url);
    return handleResponse(res);
  },
  createFlashcard: async (data) => {
    const res = await fetch(`${API_BASE}/flashcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  generateFlashcards: async (data) => {
    const res = await fetch(`${API_BASE}/flashcards/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  toggleFlashcardStar: async (id) => {
    const res = await fetch(`${API_BASE}/flashcards/${id}/star`, { method: 'POST' });
    return handleResponse(res);
  },
  deleteFlashcard: async (id) => {
    const res = await fetch(`${API_BASE}/flashcards/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Planner
  getTasks: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.task_date) query.append('task_date', params.task_date);
    if (params.is_completed !== undefined) query.append('is_completed', params.is_completed);
    if (params.task_type) query.append('task_type', params.task_type);
    const res = await fetch(`${API_BASE}/planner/tasks?${query.toString()}`);
    return handleResponse(res);
  },
  createTask: async (data) => {
    const res = await fetch(`${API_BASE}/planner/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateTask: async (id, data) => {
    const res = await fetch(`${API_BASE}/planner/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteTask: async (id) => {
    const res = await fetch(`${API_BASE}/planner/tasks/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },
  getDeadlines: async () => {
    const res = await fetch(`${API_BASE}/planner/deadlines`);
    return handleResponse(res);
  },
  getTimetable: async () => {
    const res = await fetch(`${API_BASE}/planner/timetable`);
    return handleResponse(res);
  },

  // Analytics
  getAnalytics: async () => {
    const res = await fetch(`${API_BASE}/analytics`);
    return handleResponse(res);
  },
};
