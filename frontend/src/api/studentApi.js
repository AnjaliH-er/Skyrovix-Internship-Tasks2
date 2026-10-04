// ============================================================================
// Frontend Student API Client
// Connects to Express REST Backend (/api/students)
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/students';

/**
 * Helper to handle fetch responses and parse error messages
 */
async function handleResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.errors = data?.errors || null;
    throw error;
  }

  return data;
}

/**
 * Fetch all students with optional query parameters (search, filter, pagination, sort)
 */
export async function getStudents(params = {}) {
  const query = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  const url = queryString ? `${API_BASE_URL}?${queryString}` : API_BASE_URL;

  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' }
  });
  return handleResponse(response);
}

/**
 * Fetch dashboard aggregated metrics and recent students
 */
export async function getDashboardStats() {
  const response = await fetch(`${API_BASE_URL}/stats`, {
    headers: { 'Accept': 'application/json' }
  });
  return handleResponse(response);
}

/**
 * Fetch a single student by numeric ID or student_id string
 */
export async function getStudentById(id) {
  const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
    headers: { 'Accept': 'application/json' }
  });
  return handleResponse(response);
}

/**
 * Create a new student record
 */
export async function createStudent(studentData) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(studentData)
  });
  return handleResponse(response);
}

/**
 * Update an existing student record
 */
export async function updateStudent(id, studentData) {
  const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(studentData)
  });
  return handleResponse(response);
}

/**
 * Permanently delete a student record
 */
export async function deleteStudent(id) {
  const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' }
  });
  return handleResponse(response);
}

/**
 * Reset database to default sample seed data
 */
export async function resetDatabase() {
  const response = await fetch(`${API_BASE_URL}/reset`, {
    method: 'POST',
    headers: { 'Accept': 'application/json' }
  });
  return handleResponse(response);
}
