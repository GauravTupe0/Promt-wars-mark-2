import { query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

import { leaderboardService } from './leaderboardService';

// Mutable state for dynamic mocking
const mockFirebaseState = {
  configured: true,
  db: {}
};

// Mock dependencies
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  onSnapshot: jest.fn(),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

jest.mock('@/firebase', () => ({
  get db() { return mockFirebaseState.db; },
  get isFirebaseConfigured() { return mockFirebaseState.configured; },
}));

describe('leaderboardService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFirebaseState.configured = true;
  });

  describe('subscribeToLeaderboard', () => {
    it('returns an empty array and a no-op function if firebase is not configured', () => {
      mockFirebaseState.configured = false;
      
      const callback = jest.fn();
      const unsub = leaderboardService.subscribeToLeaderboard(callback);
      
      expect(callback).toHaveBeenCalledWith([]);
      expect(typeof unsub).toBe('function');
      unsub(); // Ensure it doesn't throw
    });

    it('sets up a snapshot listener and returns unsubscribe function', () => {
      const mockUnsubscribe = jest.fn();
      (onSnapshot as jest.Mock).mockImplementation(() => {
        return mockUnsubscribe;
      });

      const callback = jest.fn();
      const unsub = leaderboardService.subscribeToLeaderboard(callback);
      
      expect(query).toHaveBeenCalled();
      expect(onSnapshot).toHaveBeenCalled();
      expect(unsub).toBe(mockUnsubscribe);
    });

    it('handles snapshot updates and maps data', () => {
      (onSnapshot as jest.Mock).mockImplementation((_q, callback) => {
        // Immediately invoke callback with mock data
        callback({
          docs: [
            { id: '1', data: () => ({ name: 'Alice', score: 10, total: 10 }) },
            { id: '2', data: () => ({ name: 'Bob', score: 8, total: 10 }) },
          ]
        });
        return jest.fn();
      });

      const callback = jest.fn();
      leaderboardService.subscribeToLeaderboard(callback);
      
      expect(callback).toHaveBeenCalledWith([
        { id: '1', name: 'Alice', score: 10, total: 10 },
        { id: '2', name: 'Bob', score: 8, total: 10 },
      ]);
    });

    it('handles errors in snapshot listener', () => {
      (onSnapshot as jest.Mock).mockImplementation((_q, _callback, errorCallback) => {
        errorCallback(new Error('Test Error'));
        return jest.fn();
      });

      const callback = jest.fn();
      leaderboardService.subscribeToLeaderboard(callback);
      
      expect(callback).toHaveBeenCalledWith([]);
    });
  });

  describe('saveScore', () => {
    it('throws error if firebase is not configured', async () => {
      mockFirebaseState.configured = false;
      await expect(leaderboardService.saveScore('Alice', 10, 10)).rejects.toThrow('Firebase not configured');
    });

    it('adds a document to the quizScores collection', async () => {
      (addDoc as jest.Mock).mockResolvedValue({ id: '123' });
      (serverTimestamp as jest.Mock).mockReturnValue('mock-timestamp');
      
      await leaderboardService.saveScore(' Alice ', 10, 10);
      
      expect(addDoc).toHaveBeenCalled();
      const args = (addDoc as jest.Mock).mock.calls[0];
      expect(args[1]).toEqual({
        name: 'Alice',
        score: 10,
        total: 10,
        createdAt: 'mock-timestamp',
      });
    });

    it('uses Anonymous if name is empty', async () => {
      (addDoc as jest.Mock).mockResolvedValue({ id: '123' });
      await leaderboardService.saveScore('   ', 5, 10);
      const args = (addDoc as jest.Mock).mock.calls[0];
      expect(args[1].name).toBe('Anonymous');
    });
  });
});
