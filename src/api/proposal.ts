import { apiClient } from './client';

export interface Proposal {
  id: number;
  sender: number;
  receiver_artist: number | null;
  receiver_space: number | null;
  content: string;
  status: 'pending' | 'accepted' | 'rejected';
  sent_at: string;
  created_at: string;
  updated_at: string;
}

export async function getReceivedProposals() {
  const response = await apiClient.get<Proposal[]>('/api/proposals/received/');
  return response.data;
}
