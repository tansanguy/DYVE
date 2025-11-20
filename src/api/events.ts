import type { CreateEventPayload, EventDetail, EventSummary } from '../types/Event';
import { apiClient } from './client';

export interface EventListParams {
  region?: string;
  genre?: string;
  is_free?: boolean;
  allow_dyve_reservation?: boolean;
}

export async function getEvents(params?: EventListParams) {
  const response = await apiClient.get<EventSummary[]>('/api/events/', { params });
  return response.data;
}

export async function getEventDetail(eventId: number) {
  const response = await apiClient.get<EventDetail>(`/api/events/${eventId}/`);
  return response.data;
}

// 한국어 주석: 포스터 이미지를 함께 업로드해야 하므로 FormData 변환을 공통 함수로 분리한다.
export async function createEvent(payload: CreateEventPayload, imageFile?: File | null) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    formData.append(key, String(value));
  });
  if (imageFile) {
    formData.append('image', imageFile);
  }
  const response = await apiClient.post<EventDetail>('/api/events/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export type { EventDetail, EventSummary } from '../types/Event';
