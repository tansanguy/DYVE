import type { Artist } from '../types/Artist';
import { apiClient } from './client';

export interface ArtistListParams {
  genre?: string;
  region?: string;
}

export interface ArtistProfilePayload {
  name: string;
  category?: string;
  genres?: string;
  region?: string;
  equipments?: string;
  history?: string;
  bio?: string;
  instagram?: string;
  portfolio_url?: string;
  image_url?: string;
  phone?: string;
}

export async function getArtists(params?: ArtistListParams) {
  const { data } = await apiClient.get<Artist[]>('/api/artists/', { params });
  return data;
}

export async function getArtistDetail(id: number) {
  const { data } = await apiClient.get<Artist>(`/api/artists/${id}/`);
  return data;
}

// 한국어 주석: 프로필 작성/수정 시 동일한 payload를 써서 폼 관리와 API 연결을 단순화한다.
export async function createArtistProfile(payload: ArtistProfilePayload) {
  const { data } = await apiClient.post<Artist>('/api/artists/profile/', payload);
  return data;
}

export async function updateArtistProfile(payload: ArtistProfilePayload) {
  const { data } = await apiClient.put<Artist>('/api/artists/profile/', payload);
  return data;
}
