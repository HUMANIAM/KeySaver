import { clearPassphrase } from '../shared/utils/encryption';

const API_URL = import.meta.env.VITE_API_URL;

// Session timeout callback - set by App component
let onSessionTimeout: (() => void) | null = null;

export const setSessionTimeoutCallback = (callback: () => void) => {
  onSessionTimeout = callback;
};

// Auth token management
export const getToken = () => localStorage.getItem('authToken');
export const setToken = (token: string) => localStorage.setItem('authToken', token);
export const clearToken = () => localStorage.removeItem('authToken');

// Handle session timeout (401 response)
const handleSessionTimeout = () => {
  clearToken();
  clearPassphrase();
  onSessionTimeout?.();
};

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() && { 'Authorization': `Bearer ${getToken()}` })
});

/**
 * Handle API response: parse JSON and extract data
 * Throws error if response is not ok
 */
const handleResponse = async (res: Response) => {
  const parseJsonSafely = async () => {
    try {
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return null;
      }
      return await res.json();
    } catch {
      return null;
    }
  };

  if (!res.ok) {
    // Handle 401 Unauthorized - session expired
    if (res.status === 401) {
      handleSessionTimeout();
    }
    
    const errorBody = await parseJsonSafely();
    const message =
      (errorBody && (errorBody.error || errorBody.message)) ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  const response = await parseJsonSafely();
  if (!response) {
    return null;
  }
  return response.data || response;
};

// Auth endpoints
export const sendAuthLink = async (email: string) => {
  const res = await fetch(`${API_URL}/auth/send-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return handleResponse(res);
};

export const verifyToken = async (token: string) => {
  const res = await fetch(`${API_URL}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  return handleResponse(res);
};

export const setValidator = async (validator: string) => {
  const res = await fetch(`${API_URL}/auth/set-validator`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ validator })
  });
  return handleResponse(res);
};

export const getUserValidator = async () => {
  const res = await fetch(`${API_URL}/auth/user-validator`, {
    headers: getHeaders()
  });
  return handleResponse(res);
};

// Key management endpoints
export const fetchKeys = async () => {
  const res = await fetch(`${API_URL}/keys`, { headers: getHeaders() });
  return handleResponse(res);
};

export const createKey = async (key: string, value: string, tags: string[]) => {
  const res = await fetch(`${API_URL}/keys`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ key, value, tags })
  });
  return handleResponse(res);
};

export const updateKey = async (id: number, key: string, value: string, tags: string[]) => {
  const res = await fetch(`${API_URL}/keys/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ key, value, tags })
  });
  return handleResponse(res);
};

export const deleteKey = async (id: number) => {
  const res = await fetch(`${API_URL}/keys/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return handleResponse(res);
};
