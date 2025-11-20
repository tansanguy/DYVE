import { apiClient } from './client';

export interface MetaGenresResponse {
  genres: string[];
}

export interface MetaRegionsResponse {
  regions: string[];
}

export interface MetaSpaceCategoriesResponse {
  space_categories: string[];
}

export interface MetaBundle {
  genres: string[];
  regions: string[];
  spaceCategories: string[];
}

export async function getMetaGenres() {
  const { data } = await apiClient.get<MetaGenresResponse>('/api/meta/genres/');
  return data.genres;
}

export async function getMetaRegions() {
  const { data } = await apiClient.get<MetaRegionsResponse>('/api/meta/regions/');
  return data.regions;
}

export async function getMetaSpaceCategories() {
  const { data } = await apiClient.get<MetaSpaceCategoriesResponse>('/api/meta/space-categories/');
  return data.space_categories;
}

// 한국어 주석: 앱 최초 진입 시 세 가지 메타 데이터를 동시에 프리패치한다.
export async function getMetaBundle(): Promise<MetaBundle> {
  const [genres, regions, spaceCategories] = await Promise.all([getMetaGenres(), getMetaRegions(), getMetaSpaceCategories()]);
  return { genres, regions, spaceCategories };
}
