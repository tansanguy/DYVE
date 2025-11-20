import { apiClient } from './client';

export interface SpaceProfile {
  id: number;
  name: string;
  category?: string | null;
  type?: string | null;
  location?: string | null;
  capacity?: number | null;
  description?: string | null;
  equipment?: string | null;
  contact?: string | null;
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
  location?: string;
  capacity?: number;
  description?: string;
  equipment?: string;
  contact?: string;
}

const buildSpaceFormData = (payload: SpaceProfilePayload, imageFile?: File | null) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    formData.append(key, String(value));
  });
  if (imageFile) {
    formData.append('image', imageFile);
  }
  return formData;
};

export async function getSpaces(params?: SpaceListParams) {
  const { data } = await apiClient.get<SpaceProfile[]>('/api/spaces/', { params });
  return data;
}

export async function getSpaceDetail(id: number) {
  const { data } = await apiClient.get<SpaceProfile>(`/api/spaces/${id}/`);
  return data;
}

// 한국어 주석: 공간 등록 화면과 네트워킹 화면 둘 다 동일한 형식으로 공간 프로필을 만들 수 있도록 FormData 헬퍼를 재사용한다.
export async function createSpaceProfile(payload: SpaceProfilePayload, imageFile?: File | null) {
  const body = buildSpaceFormData(payload, imageFile);
  const { data } = await apiClient.post<SpaceProfile>('/api/spaces/profile/', body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function updateSpaceProfile(payload: SpaceProfilePayload, imageFile?: File | null) {
  const body = buildSpaceFormData(payload, imageFile);
  const { data } = await apiClient.put<SpaceProfile>('/api/spaces/profile/', body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function createSpace(payload: SpaceProfilePayload, imageFile?: File | null) {
  const body = buildSpaceFormData(payload, imageFile);
  const { data } = await apiClient.post<SpaceProfile>('/api/spaces/', body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
