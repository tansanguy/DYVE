import { apiClient } from './client';
import { FakeLoginResponse } from '../types/auth';

export async function fakeLogin() {
  const { data } = await apiClient.post<FakeLoginResponse>('/api/auth/fake-login/');
  return data;
}
