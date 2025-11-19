import { apiClient } from './client';

export interface CreateEventPayload {
  title: string;
  description?: string;
  genre?: string;
  date: string;
  time: string;
  venue_name: string;
  address?: string;
  region?: string;
  price?: number;
  is_free?: boolean;
  entry_type?: string;
  total_seats?: number;
  seat_rows?: number;
  seat_cols?: number;
  allow_dyve_reservation?: boolean;
}

export interface CreateSpacePayload {
  name: string;
  location?: string;
  capacity?: number;
  description?: string;
  equipment?: string;
}

export async function createEvent(payload: CreateEventPayload, imageFile?: File | null) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  if (imageFile) {
    formData.append('image', imageFile);
  }
  const response = await apiClient.post('/api/events/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function createSpace(payload: CreateSpacePayload, imageFile?: File | null) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  if (imageFile) {
    formData.append('image', imageFile);
  }
  const response = await apiClient.post('/api/spaces/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}
