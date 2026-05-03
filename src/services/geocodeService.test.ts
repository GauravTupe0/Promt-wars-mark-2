import { reverseGeocode } from './geocodeService';
import { apiClient } from './apiClient';

jest.mock('./apiClient', () => ({
  apiClient: {
    buildUrl: jest.fn(),
    get: jest.fn(),
  },
}));

describe('geocodeService', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('reverseGeocode', () => {
    const lat = 28.6139;
    const lon = 77.2090;
    const cacheKey = `elected_geocode_cache_28.614_77.209`;

    it('returns city from successful API call and caches it', async () => {
      const mockResponse = {
        address: { city: 'New Delhi' },
        display_name: 'New Delhi, India',
      };
      
      (apiClient.buildUrl as jest.Mock).mockReturnValue('https://nominatim.example.com/reverse');
      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await reverseGeocode(lat, lon);

      expect(apiClient.buildUrl).toHaveBeenCalledWith(expect.any(String), {
        lat: String(lat),
        lon: String(lon),
        format: 'json',
      });
      expect(apiClient.get).toHaveBeenCalledWith('https://nominatim.example.com/reverse', {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'CivicGuide-App/1.0',
        },
      });
      expect(result).toBe('New Delhi');

      const cached = localStorage.getItem(cacheKey);
      expect(cached).toBeTruthy();
      const parsed = JSON.parse(cached as string);
      expect(parsed.name).toBe('New Delhi');
    });

    it('returns town if city is not available', async () => {
      const mockResponse = {
        address: { town: 'Gurgaon' },
      };
      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await reverseGeocode(lat, lon);
      expect(result).toBe('Gurgaon');
    });

    it('returns village if city and town are not available', async () => {
      const mockResponse = {
        address: { village: 'Small Village' },
      };
      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await reverseGeocode(lat, lon);
      expect(result).toBe('Small Village');
    });

    it('returns county if nothing else is available', async () => {
      const mockResponse = {
        address: { county: 'Some County' },
      };
      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await reverseGeocode(lat, lon);
      expect(result).toBe('Some County');
    });

    it('returns Your Area as fallback if no recognized address fields', async () => {
      const mockResponse = {
        address: { state: 'Some State' },
      };
      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await reverseGeocode(lat, lon);
      expect(result).toBe('Your Area');
    });

    it('returns cached value if valid', async () => {
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        name: 'Cached City',
      }));

      const result = await reverseGeocode(lat, lon);

      expect(apiClient.get).not.toHaveBeenCalled();
      expect(result).toBe('Cached City');
    });

    it('fetches new value if cache is expired', async () => {
      const expiredTimestamp = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: expiredTimestamp,
        name: 'Old City',
      }));

      const mockResponse = {
        address: { city: 'New City' },
      };
      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await reverseGeocode(lat, lon);

      expect(apiClient.get).toHaveBeenCalled();
      expect(result).toBe('New City');
    });

    it('handles localStorage errors during read gracefully', async () => {
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = jest.fn(() => { throw new Error('Read error'); });

      const mockResponse = {
        address: { city: 'API City' },
      };
      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await reverseGeocode(lat, lon);

      expect(result).toBe('API City');
      
      localStorage.getItem = originalGetItem;
    });

    it('handles localStorage errors during write gracefully', async () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => { throw new Error('Write error'); });

      const mockResponse = {
        address: { city: 'API City' },
      };
      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await reverseGeocode(lat, lon);

      expect(result).toBe('API City'); // Still returns correct value despite cache fail
      
      localStorage.setItem = originalSetItem;
    });

    it('returns Your Location on API error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (apiClient.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await reverseGeocode(lat, lon);

      expect(result).toBe('Your Location');
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });
});
