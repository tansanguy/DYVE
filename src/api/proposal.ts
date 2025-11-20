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

export interface ProposalCreatePayload {
  receiver_artist: number | null;
  receiver_space: number | null;
  content: string;
}

export async function getReceivedProposals() {
  const response = await apiClient.get<Proposal[]>('/api/proposals/received/');
  return response.data;
}

export async function proposalsReceivedList() {
  return getReceivedProposals();
}

// 한국어 주석: 아티스트/공간 각각에 맞춰 한쪽 ID만 채워보내도록 payload를 강제한다.
export async function proposalsCreate(payload: ProposalCreatePayload) {
  const response = await apiClient.post<Proposal>('/api/proposals/send/', payload);
  return response.data;
}

export const createProposal = proposalsCreate;
