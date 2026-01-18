const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = {
  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async get(endpoint: string) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    return response.json();
  },

  async postWithAuth(endpoint: string, data: any) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

export const auth = {
  async signup(email: string, password: string, name: string, role: string) {
    return apiClient.post('/api/auth/signup', {
      email,
      password,
      name,
      role,
    });
  },

  async login(email: string, password: string, role: string) {
    return apiClient.post('/api/auth/login', {
      email,
      password,
      role,
    });
  },

  async verify() {
    return apiClient.get('/api/auth/verify');
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
