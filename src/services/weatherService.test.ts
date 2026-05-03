import { apiClient } from './apiClient';
import { fetchWeather } from './weatherService';

jest.mock('./apiClient', () => ({
  apiClient: {
    buildUrl: jest.fn(),
    get: jest.fn(),
  },
}));

describe('weatherService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  describe('fetchWeather', () => {
    const lat = 28.6139;
    const lon = 77.2090;
    const cacheKey = `elected_weather_cache_28.61_77.21`;

    const mockWeatherData = {
      temperature: 25,
      weathercode: 0,
      windspeed: 10,
      winddirection: 180,
      is_day: 1,
      time: '2026-05-03T10:00',
    };

    const mockResponse = {
      current_weather: mockWeatherData,
      latitude: lat,
      longitude: lon,
      generationtime_ms: 10,
      utc_offset_seconds: 19800,
      timezone: 'Asia/Kolkata',
      timezone_abbreviation: 'IST',
      elevation: 200,
    };

    it('returns weather data from successful API call and caches it', async () => {
      (apiClient.buildUrl as jest.Mock).mockReturnValue('https://api.open-meteo.com/v1/forecast');
      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await fetchWeather(lat, lon);

      expect(apiClient.buildUrl).toHaveBeenCalledWith(expect.any(String), {
        latitude: String(lat),
        longitude: String(lon),
        current_weather: 'true',
        timezone: 'auto',
      });
      expect(apiClient.get).toHaveBeenCalledWith('https://api.open-meteo.com/v1/forecast');
      expect(result).toEqual(mockWeatherData);

      const cached = sessionStorage.getItem(cacheKey);
      expect(cached).toBeTruthy();
      const parsed = JSON.parse(cached as string);
      expect(parsed.data).toEqual(mockWeatherData);
    });

    it('returns cached value if valid', async () => {
      sessionStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: { ...mockWeatherData, temperature: 30 },
      }));

      const result = await fetchWeather(lat, lon);

      expect(apiClient.get).not.toHaveBeenCalled();
      expect(result.temperature).toBe(30);
    });

    it('fetches new value if cache is expired', async () => {
      const expiredTimestamp = Date.now() - (15 * 60 * 1000); // 15 mins ago
      sessionStorage.setItem(cacheKey, JSON.stringify({
        timestamp: expiredTimestamp,
        data: { ...mockWeatherData, temperature: 30 },
      }));

      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await fetchWeather(lat, lon);

      expect(apiClient.get).toHaveBeenCalled();
      expect(result.temperature).toBe(25);
    });

    it('handles sessionStorage errors during read gracefully', async () => {
      const originalGetItem = sessionStorage.getItem;
      sessionStorage.getItem = jest.fn(() => { throw new Error('Read error'); });

      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await fetchWeather(lat, lon);

      expect(result).toEqual(mockWeatherData);
      
      sessionStorage.getItem = originalGetItem;
    });

    it('handles sessionStorage errors during write gracefully', async () => {
      const originalSetItem = sessionStorage.setItem;
      sessionStorage.setItem = jest.fn(() => { throw new Error('Write error'); });

      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await fetchWeather(lat, lon);

      expect(result).toEqual(mockWeatherData); // Still returns correct value despite cache fail
      
      sessionStorage.setItem = originalSetItem;
    });

    it('re-throws error on API error', async () => {
      const apiError = new Error('API Error');
      (apiClient.get as jest.Mock).mockRejectedValueOnce(apiError);

      await expect(fetchWeather(lat, lon)).rejects.toThrow('API Error');
    });
  });
});
