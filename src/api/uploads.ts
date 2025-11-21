import { apiClient } from './client';

export interface UploadResponse {
  url: string;
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post<UploadResponse>('/api/uploads/image/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!data?.url) {
    throw new Error('이미지 업로드에 실패했습니다.');
  }

  return data.url;
}
