import { GeolocationSchema, WeatherSchema, LeaderboardSubmissionSchema } from './validation';

describe('validation utils', () => {
  describe('GeolocationSchema', () => {
    it('validates correct coordinates', () => {
      const result = GeolocationSchema.safeParse({ lat: 45, lng: -90 });
      expect(result.success).toBe(true);
    });

    it('rejects invalid latitude', () => {
      const result = GeolocationSchema.safeParse({ lat: 91, lng: 0 });
      expect(result.success).toBe(false);
    });

    it('rejects invalid longitude', () => {
      const result = GeolocationSchema.safeParse({ lat: 0, lng: 181 });
      expect(result.success).toBe(false);
    });

    it('rejects missing fields', () => {
      const result = GeolocationSchema.safeParse({ lat: 0 });
      expect(result.success).toBe(false);
    });
  });

  describe('WeatherSchema', () => {
    it('validates correct weather data', () => {
      const result = WeatherSchema.safeParse({
        temperature: 20.5,
        weathercode: 1,
        windspeed: 10,
        time: '2026-05-03T10:00:00Z',
      });
      expect(result.success).toBe(true);
    });

    it('rejects negative weathercode', () => {
      const result = WeatherSchema.safeParse({
        temperature: 20.5,
        weathercode: -1,
        windspeed: 10,
        time: '2026-05-03T10:00:00Z',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid datetime string', () => {
      const result = WeatherSchema.safeParse({
        temperature: 20.5,
        weathercode: 1,
        windspeed: 10,
        time: 'invalid-time',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('LeaderboardSubmissionSchema', () => {
    it('validates correct submission', () => {
      const result = LeaderboardSubmissionSchema.safeParse({
        name: 'John Doe',
        score: 80,
        total: 100,
      });
      expect(result.success).toBe(true);
    });

    it('rejects name with invalid characters', () => {
      const result = LeaderboardSubmissionSchema.safeParse({
        name: 'John_Doe@!',
        score: 80,
        total: 100,
      });
      expect(result.success).toBe(false);
    });

    it('rejects name that is too long', () => {
      const result = LeaderboardSubmissionSchema.safeParse({
        name: 'A'.repeat(33),
        score: 80,
        total: 100,
      });
      expect(result.success).toBe(false);
    });

    it('rejects score out of range', () => {
      expect(LeaderboardSubmissionSchema.safeParse({ name: 'A', score: -1, total: 100 }).success).toBe(false);
      expect(LeaderboardSubmissionSchema.safeParse({ name: 'A', score: 101, total: 100 }).success).toBe(false);
    });

    it('rejects total out of range', () => {
      expect(LeaderboardSubmissionSchema.safeParse({ name: 'A', score: 10, total: 0 }).success).toBe(false);
      expect(LeaderboardSubmissionSchema.safeParse({ name: 'A', score: 10, total: 101 }).success).toBe(false);
    });
  });
});
