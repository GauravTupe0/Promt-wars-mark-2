import { renderHook, act } from '@testing-library/react';
import { useFetch } from './useFetch';

describe('useFetch', () => {
  beforeEach(() => {
    sessionStorage.clear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initialises with correct default state', () => {
    const { result } = renderHook(() => useFetch());
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('does nothing if url is empty', async () => {
    const { result } = renderHook(() => useFetch());
    await act(async () => {
      await result.current.fetchData('');
    });
    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('fetches data successfully and caches it', async () => {
    const mockData = { message: 'success' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useFetch());

    await act(async () => {
      await result.current.fetchData('https://api.example.com/data');
    });

    expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/data', {});
    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    // Verify it was cached
    const cached = sessionStorage.getItem('fetch_cache_https://api.example.com/data');
    expect(cached).toBe(JSON.stringify(mockData));
  });

  it('uses cached data if available and skips fetch', async () => {
    const mockData = { message: 'cached' };
    sessionStorage.setItem('fetch_cache_https://api.example.com/data', JSON.stringify(mockData));

    const { result } = renderHook(() => useFetch());

    await act(async () => {
      await result.current.fetchData('https://api.example.com/data');
    });

    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.data).toEqual(mockData);
  });

  it('handles fetch error correctly', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useFetch());

    await act(async () => {
      await result.current.fetchData('https://api.example.com/data');
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Network error');
    expect(result.current.loading).toBe(false);
  });

  it('handles non-ok response status', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useFetch());

    await act(async () => {
      await result.current.fetchData('https://api.example.com/data');
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Request failed with status 404');
    expect(result.current.loading).toBe(false);
  });
});
