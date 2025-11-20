import { apiClient } from './client';

export interface MyPageSummary {
  id: number;
  name: string;
  email: string;
  is_artist: boolean;
  is_space_owner: boolean;
}

export interface MyProfile {
  name: string;
  email: string;
  phone?: string;
  instagram?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  instagram?: string;
}

export interface NotificationSettings {
  performance_updates: boolean;
  suggestions: boolean;
  booking_confirm: boolean;
  marketing: boolean;
}

export interface ReservationHistory {
  id: number;
  event_title: string;
  event_date: string;
  status: string;
  created_at: string;
}

export interface SettlementHistory {
  id: number;
  title: string;
  amount: number;
  status: string;
  settled_at: string;
}

export async function getMySummary() {
  const { data } = await apiClient.get<MyPageSummary>('/api/mypage/');
  return data;
}

export async function getMyProfile() {
  const { data } = await apiClient.get<MyProfile>('/api/mypage/profile/');
  return data;
}

export async function updateMyProfile(payload: UpdateProfilePayload) {
  const { data } = await apiClient.patch<MyProfile>('/api/mypage/profile/', payload);
  return data;
}

export async function getMyNotifications() {
  const { data } = await apiClient.get<NotificationSettings>('/api/mypage/notifications/');
  return data;
}

export async function updateMyNotifications(payload: Partial<NotificationSettings>) {
  const { data } = await apiClient.patch<NotificationSettings>('/api/mypage/notifications/', payload);
  return data;
}

export async function getMyReservations() {
  const { data } = await apiClient.get<ReservationHistory[]>('/api/mypage/reservations/');
  return data;
}

export async function getMySettlements() {
  const { data } = await apiClient.get<SettlementHistory[]>('/api/mypage/settlements/');
  return data;
}
