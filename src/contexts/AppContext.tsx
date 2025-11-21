import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getMetaBundle } from '../api/meta';
import { proposalsReceivedList } from '../api/proposal';

interface AppContextValue {
  genres: string[];
  regions: string[];
  spaceCategories: string[];
  loadingMeta: boolean;
  proposalCount: number;
  loadingProposalCount: boolean;
  refreshMeta: () => Promise<void>;
  refreshProposalCount: () => Promise<void>;
}

const AppContext = createContext<AppContextValue>({
  genres: [],
  regions: [],
  spaceCategories: [],
  loadingMeta: true,
  proposalCount: 0,
  loadingProposalCount: true,
  refreshMeta: async () => {},
  refreshProposalCount: async () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [genres, setGenres] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [spaceCategories, setSpaceCategories] = useState<string[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [proposalCount, setProposalCount] = useState(0);
  const [loadingProposalCount, setLoadingProposalCount] = useState(true);

  const fetchMeta = useCallback(async () => {
    setLoadingMeta(true);
    try {
      const bundle = await getMetaBundle();
      setGenres(bundle.genres);
      setRegions(bundle.regions);
      setSpaceCategories(bundle.spaceCategories);
    } catch (error) {
      console.error('메타 데이터 로드시 실패', error);
    } finally {
      setLoadingMeta(false);
    }
  }, []);

  const fetchProposalCount = useCallback(async () => {
    setLoadingProposalCount(true);
    try {
      const proposals = await proposalsReceivedList();
      setProposalCount(0);
    } catch (error) {
      if (isUnauthorized(error)) {
        setProposalCount(0);
      } else {
        console.error('제안함 카운트 로드시 실패', error);
      }
    } finally {
      setLoadingProposalCount(false);
    }
  }, []);

  useEffect(() => {
    // 한국어 주석: 앱 진입 시점에 메타/제안 데이터를 동시에 프리패치해 모든 화면이 동일한 소스를 보게 한다.
    fetchMeta();
    fetchProposalCount();
  }, [fetchMeta, fetchProposalCount]);

  const value = useMemo<AppContextValue>(
    () => ({
      genres,
      regions,
      spaceCategories,
      loadingMeta,
      proposalCount,
      loadingProposalCount,
      refreshMeta: fetchMeta,
      refreshProposalCount: fetchProposalCount,
    }),
    [fetchMeta, fetchProposalCount, genres, loadingMeta, proposalCount, regions, spaceCategories, loadingProposalCount],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);
const isUnauthorized = (error: unknown) => {
  const response = (error as { response?: { status?: number } })?.response;
  return response?.status === 401;
};
