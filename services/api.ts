// API base URL
const API_URL = '/api';

// Common fetch options
const getOptions: RequestInit = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  cache: 'no-store',
};

// Services (EditableTable)
export const serviceApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/services`, getOptions);
    return handleResponse(response);
  },
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/services/${id}`, getOptions);
    return handleResponse(response);
  },
  create: async (data: any) => {
    const response = await fetch(`${API_URL}/services`, postOptions(data));
    return handleResponse(response);
  },
  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/services/${id}`, putOptions(data));
    return handleResponse(response);
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/services/${id}`, deleteOptions);
    return handleResponse(response);
  },
};

// Extra Services (ExtraTables) with categories (standard, vip)
export const extraServiceApi = {
  getAll: async (category?: string) => {
    const url = category ? `${API_URL}/extra-services?category=${encodeURIComponent(category)}` : `${API_URL}/extra-services`;
    const response = await fetch(url, getOptions);
    return handleResponse(response);
  },
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/extra-services/${id}`, getOptions);
    return handleResponse(response);
  },
  create: async (data: any) => {
    const response = await fetch(`${API_URL}/extra-services`, postOptions(data));
    return handleResponse(response);
  },
  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/extra-services/${id}`, putOptions(data));
    return handleResponse(response);
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/extra-services/${id}`, deleteOptions);
    return handleResponse(response);
  },
};

// Final Call Girls table
export const finalCallGirlsApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/final-call-girls`, getOptions);
    return handleResponse(response);
  },
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/final-call-girls/${id}`, getOptions);
    return handleResponse(response);
  },
  create: async (data: any) => {
    const response = await fetch(`${API_URL}/final-call-girls`, postOptions(data));
    return handleResponse(response);
  },
  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/final-call-girls/${id}`, putOptions(data));
    return handleResponse(response);
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/final-call-girls/${id}`, deleteOptions);
    return handleResponse(response);
  },
};

const postOptions = (body: any): RequestInit => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

const putOptions = (body: any): RequestInit => ({
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

const deleteOptions: RequestInit = {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
};

// Handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Test database connection
export const testConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/test`, getOptions);
    return handleResponse(response);
  } catch (error) {
    console.error('Test connection failed:', error);
    throw error;
  }
};

// Profile API
export const profileApi = {
  // Get all profiles
  getAll: async () => {
    const response = await fetch(`${API_URL}/profiles`, getOptions);
    return handleResponse(response);
  },

  // Get single profile
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/profiles/${id}`, getOptions);
    return handleResponse(response);
  },

  // Create profile
  create: async (data: any) => {
    const response = await fetch(
      `${API_URL}/profiles`,
      postOptions(data)
    );
    return handleResponse(response);
  },

  // Update profile
  update: async (id: string, data: any) => {
    const response = await fetch(
      `${API_URL}/profiles/${id}`,
      putOptions(data)
    );
    return handleResponse(response);
  },

  // Delete profile
  delete: async (id: string) => {
    const response = await fetch(
      `${API_URL}/profiles/${id}`,
      deleteOptions
    );
    return handleResponse(response);
  },
};

// High Profile Call Girls API (separate from regular profiles)
export const highProfileCallGirlsApi = {
  // Get all high profile call girls
  getAll: async () => {
    const response = await fetch(`${API_URL}/high-profile-call-girls`, getOptions);
    return handleResponse(response);
  },

  // Get single high profile call girl
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/high-profile-call-girls/${id}`, getOptions);
    return handleResponse(response);
  },

  // Create high profile call girl
  create: async (data: any) => {
    const response = await fetch(
      `${API_URL}/high-profile-call-girls`,
      postOptions(data)
    );
    return handleResponse(response);
  },

  // Update high profile call girl
  update: async (id: string, data: any) => {
    const response = await fetch(
      `${API_URL}/high-profile-call-girls/${id}`,
      putOptions(data)
    );
    return handleResponse(response);
  },

  // Delete high profile call girl
  delete: async (id: string) => {
    const response = await fetch(
      `${API_URL}/high-profile-call-girls/${id}`,
      deleteOptions
    );
    return handleResponse(response);
  },
};

// Example of using the API in a component:
/*
import { profileApi, testConnection } from '@/services/api';

// In your component:
const fetchProfiles = async () => {
  try {
    const profiles = await profileApi.getAll();
    console.log('Profiles:', profiles);
  } catch (error) {
    console.error('Failed to fetch profiles:', error);
  }
};

// Test connection
const testDbConnection = async () => {
  try {
    const result = await testConnection();
    console.log('Connection test:', result);
  } catch (error) {
    console.error('Connection test failed:', error);
  }
};
*/
