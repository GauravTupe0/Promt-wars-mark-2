import toast from 'react-hot-toast';

import { apiClient } from './apiClient';

jest.mock('react-hot-toast');

describe('apiClient', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('fetches successfully and returns JSON', async () => {
      const mockData = { id: 1, name: 'Test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiClient.get('/api/test');
      
      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        headers: { Accept: 'application/json' },
      });
      expect(result).toEqual(mockData);
    });

    it('throws error and shows toast on non-ok response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ detail: 'Resource not found' }),
      });

      await expect(apiClient.get('/api/test')).rejects.toThrow('Resource not found');
      expect(toast.error).toHaveBeenCalledWith('Resource not found', { id: 'api-error' });
    });

    it('throws generic error when JSON parsing fails on non-ok response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json: async () => { throw new Error('Parse error'); },
      });

      await expect(apiClient.get('/api/test')).rejects.toThrow('API Error: 500 Server Error');
      expect(toast.error).toHaveBeenCalledWith('API Error: 500 Server Error', { id: 'api-error' });
    });

    it('throws network error and shows toast when fetch throws Failed to fetch', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

      await expect(apiClient.get('/api/test')).rejects.toThrow('Network connection failed. Please check your internet.');
      expect(toast.error).toHaveBeenCalledWith('Network connection failed. Please check your internet.', { id: 'network-error' });
    });
  });

  describe('validatedGet', () => {
    it('returns parsed data if validation succeeds', async () => {
      const mockData = { id: 1 };
      const mockSchema = {
        parse: jest.fn().mockReturnValue(mockData),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiClient.validatedGet('/api/test', mockSchema);
      
      expect(result).toEqual(mockData);
      expect(mockSchema.parse).toHaveBeenCalledWith(mockData);
    });

    it('throws error if validation fails', async () => {
      const mockData = { id: 1 };
      const mockError = new Error('Validation failed');
      const mockSchema = {
        parse: jest.fn().mockImplementation(() => { throw mockError; }),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await expect(apiClient.validatedGet('/api/test', mockSchema)).rejects.toThrow('Validation failed');
    });
  });

  describe('buildUrl', () => {
    it('appends params correctly to the url', () => {
      const baseUrl = 'https://example.com/api';
      const params = {
        lat: 28.6139,
        lon: 77.2090,
        format: 'json',
        active: true,
      };

      const result = apiClient.buildUrl(baseUrl, params);
      
      expect(result).toBe('https://example.com/api?lat=28.6139&lon=77.209&format=json&active=true');
    });
  });
});
