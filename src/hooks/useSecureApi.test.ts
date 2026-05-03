import { renderHook, act } from '@testing-library/react';
import DOMPurify from 'dompurify';

import { useSecureApi } from './useSecureApi';

jest.mock('dompurify', () => ({
  sanitize: jest.fn((str) => str), // By default just pass through
}));

describe('useSecureApi', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    window.sessionStorage.clear();
    jest.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useSecureApi());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('performs a successful fetch and sanitizes response', async () => {
    const mockData = { message: 'Hello' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });
    (DOMPurify.sanitize as jest.Mock).mockReturnValueOnce(JSON.stringify(mockData));

    const { result } = renderHook(() => useSecureApi());

    let data;
    await act(async () => {
      data = await result.current.fetchSecure('/api/data');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/data', expect.objectContaining({
      headers: expect.any(Headers),
      credentials: 'same-origin',
    }));
    
    // Check headers
    const callArgs = (global.fetch as jest.Mock).mock.calls[0];
    const headers = callArgs[1].headers as Headers;
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('Accept')).toBe('application/json');
    expect(headers.has('Authorization')).toBe(false);

    expect(DOMPurify.sanitize).toHaveBeenCalledWith(JSON.stringify(mockData));
    expect(data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('injects auth token when requireAuth is true', async () => {
    window.sessionStorage.setItem('auth_token', 'test-token');
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const { result } = renderHook(() => useSecureApi());

    await act(async () => {
      await result.current.fetchSecure('/api/data', { requireAuth: true });
    });

    const callArgs = (global.fetch as jest.Mock).mock.calls[0];
    const headers = callArgs[1].headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('handles API errors correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const { result } = renderHook(() => useSecureApi());

    let data;
    await act(async () => {
      data = await result.current.fetchSecure('/api/data');
    });

    expect(data).toBe(null);
    expect(result.current.error).toBe('API Error: 404 Not Found');
    expect(result.current.loading).toBe(false);
  });

  it('handles network errors correctly', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Failed'));

    const { result } = renderHook(() => useSecureApi());

    let data;
    await act(async () => {
      data = await result.current.fetchSecure('/api/data');
    });

    expect(data).toBe(null);
    expect(result.current.error).toBe('Network Failed');
    expect(result.current.loading).toBe(false);
  });

  it('handles unknown errors correctly', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce('String Error');

    const { result } = renderHook(() => useSecureApi());

    let data;
    await act(async () => {
      data = await result.current.fetchSecure('/api/data');
    });

    expect(data).toBe(null);
    expect(result.current.error).toBe('An unknown network error occurred.');
    expect(result.current.loading).toBe(false);
  });
});
