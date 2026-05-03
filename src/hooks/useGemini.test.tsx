import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';

import { useGeminiQuery, prefetchGeminiData } from './useGemini';

describe('useGemini', () => {
  let queryClient: QueryClient;
  
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  describe('useGeminiQuery', () => {
    it('fetches data successfully', async () => {
      const mockResponse = { text: 'Gemini response' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useGeminiQuery('test prompt'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'test prompt' }),
      });
    });

    it('handles API errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      const { result } = renderHook(() => useGeminiQuery('test prompt'), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(new Error('Gemini API Error'));
    });
  });

  describe('prefetchGeminiData', () => {
    it('prefetches data correctly', async () => {
      const mockResponse = { text: 'prefetched data' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await prefetchGeminiData(queryClient, 'prefetch prompt');

      expect(global.fetch).toHaveBeenCalledWith('/api/gemini', expect.any(Object));
      
      // Verify data is in cache
      const cachedData = queryClient.getQueryData(['gemini', 'prefetch prompt']);
      expect(cachedData).toEqual(mockResponse);
    });
  });
});
