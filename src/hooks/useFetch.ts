import { useEffect, useRef, useState } from 'react';

type UseFetchOptions<T> = {
  enabled?: boolean;
  fetcher?: typeof fetch;
  mockData?: T;
  mockDelay?: number;
};

type UseFetchState<T> = {
  data?: T;
  loading: boolean;
  error?: Error;
};

const useFetch = <T,>(
  url: string,
  { enabled = true, fetcher = fetch, mockData, mockDelay = 0 }: UseFetchOptions<T> = {},
): UseFetchState<T> => {
  const [state, setState] = useState<UseFetchState<T>>({
    data: mockData,
    loading: Boolean(enabled),
  });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    let aborted = false;

    const updateState = (payload: Partial<UseFetchState<T>>) => {
      if (!mountedRef.current || aborted) return;
      setState((prev) => ({ ...prev, ...payload }));
    };

    const fetchData = async () => {
      updateState({ loading: true, error: undefined });

      const shouldMock = url.startsWith('mock:');
      if (shouldMock && mockData !== undefined) {
        if (mockDelay) {
          await new Promise((res) => setTimeout(res, mockDelay));
        }
        updateState({ data: mockData, loading: false });
        return;
      }

      try {
        const response = await fetcher(url);
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        const json = (await response.json()) as T;
        updateState({ data: json, loading: false });
      } catch (error) {
        updateState({ error: error as Error, loading: false, data: mockData });
      }
    };

    fetchData();

    return () => {
      aborted = true;
    };
  }, [enabled, fetcher, mockData, mockDelay, url]);

  return state;
};

export default useFetch;
