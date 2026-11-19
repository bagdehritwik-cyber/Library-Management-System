const API_BASE = '/api';

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

export const api = {
  // Dashboard
  async getDashboard() {
    const res = await fetch(`${API_BASE}/dashboard`);
    return handleResponse(res);
  },

  // Items
  async getItems({ search = '', type = 'All', status = 'all' } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (type && type !== 'All') params.append('type', type);
    if (status && status !== 'all') params.append('status', status);

    const res = await fetch(`${API_BASE}/items?${params.toString()}`);
    return handleResponse(res);
  },

  async getItem(id) {
    const res = await fetch(`${API_BASE}/items/${id}`);
    return handleResponse(res);
  },

  async addItem(itemData) {
    const res = await fetch(`${API_BASE}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });
    return handleResponse(res);
  },

  async deleteItem(id) {
    const res = await fetch(`${API_BASE}/items/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  // Members
  async getMembers() {
    const res = await fetch(`${API_BASE}/members`);
    return handleResponse(res);
  },

  async getMember(id) {
    const res = await fetch(`${API_BASE}/members/${id}`);
    return handleResponse(res);
  },

  async addMember(name) {
    const res = await fetch(`${API_BASE}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    return handleResponse(res);
  },

  async deleteMember(id) {
    const res = await fetch(`${API_BASE}/members/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  // Transactions
  async issueItem(itemId, memberId) {
    const res = await fetch(`${API_BASE}/transactions/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, memberId })
    });
    return handleResponse(res);
  },

  async previewReturn(itemId, daysKept) {
    const res = await fetch(`${API_BASE}/transactions/preview-return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, daysKept })
    });
    return handleResponse(res);
  },

  async returnItem(itemId, daysKept) {
    const res = await fetch(`${API_BASE}/transactions/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, daysKept })
    });
    return handleResponse(res);
  },

  // OOP Concepts
  async getOOPConcepts() {
    const res = await fetch(`${API_BASE}/oop-concepts`);
    return handleResponse(res);
  },

  async getCPPSourceCode() {
    const res = await fetch(`${API_BASE}/oop-concepts/source-code`);
    return handleResponse(res);
  }
};
