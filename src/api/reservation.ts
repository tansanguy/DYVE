import { apiClient } from './client';

export interface ReservationPayload {
  event: number;
  quantity: number;
  seat: string;
}

export interface ReservationResponse {
  id: number;
  user: number;
  event: number;
  quantity: number;
  seat: string;
  entry_type: string;
  price: number;
  qr_code: string;
  reservation_code: string;
  created_at: string;
  updated_at: string;
}

export async function createReservation(payload: ReservationPayload) {
  const response = await apiClient.post<ReservationResponse>('/api/reservations/', payload);
  return response.data;
}
