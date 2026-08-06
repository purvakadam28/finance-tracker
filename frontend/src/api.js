const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}

export const api = {
  register: (email, password) => request('/auth/register', { method: 'POST', body: { email, password } }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),

  getTransactions: (token) => request('/transactions', { token }),
  createTransaction: (token, tx) => request('/transactions', { method: 'POST', body: tx, token }),
  updateTransaction: (token, id, tx) => request(`/transactions/${id}`, { method: 'PUT', body: tx, token }),
  deleteTransaction: (token, id) => request(`/transactions/${id}`, { method: 'DELETE', token }),
  getSummary: (token) => request('/transactions/meta/summary', { token }),
};
