const API_BASE_URL = '/api';

export interface Profile {
  _id?: string;
  heading: string;
  description: string;
  location: string;
  contactNumber: string;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const fetchProfiles = async (): Promise<Profile[]> => {
  const response = await fetch(`${API_BASE_URL}/profiles`);
  if (!response.ok) {
    throw new Error('Failed to fetch profiles');
  }
  return response.json();
};

export const fetchProfile = async (id: string): Promise<Profile> => {
  const response = await fetch(`${API_BASE_URL}/profiles/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  return response.json();
};

export const createProfile = async (profileData: Omit<Profile, '_id'>): Promise<Profile> => {
  const response = await fetch(`${API_BASE_URL}/profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create profile');
  }
  
  return response.json();
};

export const updateProfile = async (id: string, profileData: Partial<Profile>): Promise<Profile> => {
  const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update profile');
  }
  
  return response.json();
};

export const deleteProfile = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete profile');
  }
};
