/**
  * Central API Client Service for Portfolio V2
  */

// Helper for HTTP requests
async function fetchJson(url, options = {}) {
  const isFormData = options.body instanceof FormData;
  const defaultHeaders = {
    'Accept': 'application/json',
  };

  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const token = localStorage.getItem('admin_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || 'API request failed');
  }
  return json;
}

// ----------------- ABOUT API -----------------
export async function getAbout() {
  try {
    const json = await fetchJson('/api/about');
    return json.data;
  } catch (err) {
    console.warn('Failed to fetch About from API:', err);
    return null;
  }
}

export async function updateAbout(data) {
  return fetchJson('/api/about', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ----------------- TECH STACKS API -----------------
export async function getTechStacks() {
  try {
    const json = await fetchJson('/api/tech-stacks');
    return json.data || [];
  } catch (err) {
    console.warn('Failed to fetch TechStacks from API:', err);
    return [];
  }
}

export async function createTechStack(data) {
  return fetchJson('/api/tech-stacks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTechStack(id, data) {
  return fetchJson(`/api/tech-stacks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function reorderTechStacks(orders) {
  return fetchJson('/api/tech-stacks/reorder', {
    method: 'POST',
    body: JSON.stringify({ orders }),
  });
}

export async function deleteTechStack(id) {
  return fetchJson(`/api/tech-stacks/${id}`, {
    method: 'DELETE',
  });
}

// ----------------- PROJECTS API -----------------
export async function getProjects() {
  try {
    const json = await fetchJson('/api/projects');
    return json.data || [];
  } catch (err) {
    console.warn('Failed to fetch Projects from API:', err);
    return [];
  }
}

export async function getFeaturedProjects() {
  try {
    const json = await fetchJson('/api/projects?featured=true');
    return json.data || [];
  } catch (err) {
    console.warn('Failed to fetch Featured Projects from API:', err);
    return [];
  }
}

export async function createProject(data) {
  const isFormData = data instanceof FormData;
  return fetchJson('/api/projects', {
    method: 'POST',
    body: isFormData ? data : JSON.stringify(data),
  });
}

export async function updateProject(id, data) {
  const isFormData = data instanceof FormData;
  
  if (isFormData) {
    data.append('_method', 'PUT');
    return fetchJson(`/api/projects/${id}`, {
      method: 'POST',
      body: data,
    });
  }

  return fetchJson(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function reorderProjects(orders) {
  return fetchJson('/api/projects/reorder', {
    method: 'POST',
    body: JSON.stringify({ orders }),
  });
}

export async function deleteProject(id) {
  return fetchJson(`/api/projects/${id}`, {
    method: 'DELETE',
  });
}

// ----------------- MESSAGES API (LIVE CHAT) -----------------
export async function getMessages() {
  try {
    const json = await fetchJson('/api/messages');
    return json.data || [];
  } catch (err) {
    console.warn('Failed to fetch messages from API:', err);
    return [];
  }
}

export async function sendMessage(data) {
  return fetchJson('/api/messages', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ----------------- AUTH API -----------------
export async function loginAdmin(email, password) {
  return fetchJson('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutAdmin() {
  return fetchJson('/api/logout', {
    method: 'POST',
  });
}
