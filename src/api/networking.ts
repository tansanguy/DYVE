import { apiClient } from './client';

export interface ArtistProfile {
  id: number;
  name: string;
  genre?: string;
  bio?: string;
  avatar_url?: string;
}

export interface SpaceProfile {
  id: number;
  name: string;
  type?: string;
  capacity?: number;
  location?: string;
  description?: string;
  image_url?: string;
}

export async function getArtists() {
  const { data } = await apiClient.get<ArtistProfile[]>('/api/artists/');
  return data;
}

export async function getSpaces() {
  const { data } = await apiClient.get<SpaceProfile[]>('/api/spaces/');
  return data;
}
