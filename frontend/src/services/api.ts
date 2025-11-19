const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Auth token management
export const getToken = () => localStorage.getItem('authToken');
export const setToken = (token: string) => localStorage.setItem('authToken', token);
export const clearToken = () => localStorage.removeItem('authToken');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() && { 'Authorization': `Bearer ${getToken()}` })
});

// Auth endpoints
export const sendAuthLink = async (email: string) => {
  const res = await fetch(`${API_URL}/auth/send-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw new Error((await res.json()).error);
  const response = await res.json();
  return response.data || response;
};

export const verifyToken = async (token: string) => {
  const res = await fetch(`${API_URL}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  if (!res.ok) throw new Error((await res.json()).error);
  const response = await res.json();
  return response.data || response;
};

export const setValidator = async (validator: string) => {
  const res = await fetch(`${API_URL}/auth/set-validator`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ validator })
  });
  if (!res.ok) throw new Error((await res.json()).error);
  const response = await res.json();
  return response.data || response;
};

// Key management endpoints
export const fetchKeys = async () => {
  const res = await fetch(`${API_URL}/keys`, { headers: getHeaders() });
  if (!res.ok) throw new Error((await res.json()).error);
  const response = await res.json();
  // Unwrap standardized response format: { data: { keys: [...] } } -> { keys: [...] }
  return response.data || response;
};

export const createKey = async (key: string, value: string, tags: string[]) => {
  const res = await fetch(`${API_URL}/keys`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ key, value, tags })
  });
  if (!res.ok) throw new Error((await res.json()).error);
  const response = await res.json();
  return response.data || response;
};

export const updateKey = async (id: number, key: string, value: string, tags: string[]) => {
  const res = await fetch(`${API_URL}/keys/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ key, value, tags })
  });
  if (!res.ok) throw new Error((await res.json()).error);
  const response = await res.json();
  return response.data || response;
};

export const deleteKey = async (id: number) => {
  const res = await fetch(`${API_URL}/keys/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error((await res.json()).error);
  const response = await res.json();
  return response.data || response;
};
