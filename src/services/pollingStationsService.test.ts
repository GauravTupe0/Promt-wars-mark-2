import { fetchRealPollingStations, buildPollingStations } from './pollingStationsService';

describe('pollingStationsService', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  const userPosition = { lat: 51.5074, lng: -0.1278 };

  describe('fetchRealPollingStations', () => {
    it('returns filtered and sorted list of real polling stations', async () => {
      const mockResponse = {
        elements: [
          {
            id: 1,
            type: 'node',
            lat: 51.5084,
            lon: -0.1268,
            tags: { name: 'Test School', amenity: 'school', 'addr:street': 'Main St', 'addr:city': 'London' },
          },
          {
            id: 2,
            type: 'way',
            center: { lat: 51.5094, lon: -0.1258 },
            tags: { name: 'Test Library', amenity: 'library' }, // No address tags
          },
          {
            id: 3,
            type: 'node', // No coords - should be filtered out
            tags: { name: 'Ghost Station', amenity: 'townhall' },
          },
          {
            id: 4,
            type: 'node',
            lat: 51.5064,
            lon: -0.1288,
            tags: { amenity: 'community_centre' }, // No name - should be filtered out
          },
          {
            id: 5,
            type: 'node',
            lat: 51.6074, // Far away
            lon: -0.2278,
            tags: { name: 'Far Station', building: 'government', 'addr:housenumber': '10', 'addr:street': 'High St', 'addr:suburb': 'Suburbia' },
          },
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchRealPollingStations(userPosition);

      expect(global.fetch).toHaveBeenCalledWith('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: expect.stringContaining('data='),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      // Should return 3 valid stations, sorted by distance
      expect(result.length).toBe(3);
      
      // Nearest first (id 1)
      expect(result[0].id).toBe('osm-1');
      expect(result[0].name).toBe('Test School');
      expect(result[0].type).toBe('School / College');
      expect(result[0].address).toBe('Main St, London');
      expect(result[0].lat).toBe(51.5084);
      expect(result[0].lng).toBe(-0.1268);
      
      // Then id 2
      expect(result[1].id).toBe('osm-2');
      expect(result[1].name).toBe('Test Library');
      expect(result[1].type).toBe('Public Library');
      expect(result[1].address).toBe('Address unavailable');
      expect(result[1].lat).toBe(51.5094);
      expect(result[1].lng).toBe(-0.1258);
      
      // Then id 5 (far away)
      expect(result[2].id).toBe('osm-5');
      expect(result[2].name).toBe('Far Station');
      expect(result[2].type).toBe('Government Building');
      expect(result[2].address).toBe('10, High St, Suburbia');
    });

    it('classifies types correctly', async () => {
      const mockTypes = [
        { id: 1, lat: 0, lon: 0, tags: { name: 'A', amenity: 'college' } },
        { id: 2, lat: 0, lon: 0, tags: { name: 'B', amenity: 'place_of_worship' } },
        { id: 3, lat: 0, lon: 0, tags: { name: 'C', amenity: 'public_building' } },
        { id: 4, lat: 0, lon: 0, tags: { name: 'D', government: 'yes' } },
        { id: 5, lat: 0, lon: 0, tags: { name: 'E', amenity: 'other' } },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ elements: mockTypes }),
      });

      const result = await fetchRealPollingStations(userPosition);
      
      expect(result.find(r => r.name === 'A')?.type).toBe('School / College');
      expect(result.find(r => r.name === 'B')?.type).toBe('Place of Worship');
      expect(result.find(r => r.name === 'C')?.type).toBe('Public Building');
      expect(result.find(r => r.name === 'D')?.type).toBe('Government Building');
      expect(result.find(r => r.name === 'E')?.type).toBe('Polling Centre'); // Default
    });

    it('throws error when API fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchRealPollingStations(userPosition)).rejects.toThrow('Overpass API request failed');
    });
  });

  describe('buildPollingStations', () => {
    it('returns fallback stations sorted by distance', () => {
      const result = buildPollingStations(userPosition);

      expect(result.length).toBe(5);
      expect(result[0].address).toBe('Address unavailable');
      
      // Verify sorting by distance
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].distanceKm).toBeLessThanOrEqual(result[i+1].distanceKm);
      }
    });
  });
});
