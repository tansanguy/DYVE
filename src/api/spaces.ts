import { apiClient } from './client';

export interface SpaceProfile {
  id: number;
  name: string;
  category?: string | null;
  type?: string | null;
  genres?: string | null;
  location?: string | null;
  region?: string | null;
  address?: string | null;
  capacity?: number | null;
  description?: string | null;
  equipments?: string | string[] | null;
  contact?: string | null;
  phone?: string | null;
  image_url?: string | null;
}

export interface SpaceListParams {
  category?: string;
  region?: string;
}

export interface SpaceProfilePayload {
  id?: number;
  name: string;
  category?: string;
  genres?: string;
  region: string;
  address: string;
  description?: string;
  capacity?: number;
  equipments?: string | string[];
  contact?: string;
  image_url?: string;
  phone?: string;
}

export async function getSpaces(params?: SpaceListParams) {
  const { data } = await apiClient.get<SpaceProfile[]>('/api/spaces/', { params });
  return data;
}

export async function getSpaceDetail(id: number) {
  const { data } = await apiClient.get<SpaceProfile>(`/api/spaces/${id}/`);
  return data;
}

// 한국어 주석: 공간 프로필 등록/수정은 JSON 본문으로만 처리해 백엔드 스펙과 일치시킨다.
export async function createSpaceProfile(payload: SpaceProfilePayload) {
  const { data } = await apiClient.post<SpaceProfile>('/api/spaces/profile/', payload);
  return data;
}

export async function updateSpaceProfile(payload: SpaceProfilePayload) {
  const { data } = await apiClient.put<SpaceProfile>('/api/spaces/profile/', payload);
  return data;
}

export async function createSpace(payload: SpaceProfilePayload) {
  const { data } = await apiClient.post<SpaceProfile>('/api/spaces/profile/', payload);
  return data;
}
