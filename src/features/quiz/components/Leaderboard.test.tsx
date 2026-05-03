import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { Leaderboard } from './Leaderboard';
import { leaderboardService } from '@/services/leaderboardService';

// Mock Firebase config
jest.mock('@/firebase', () => ({
  isFirebaseConfigured: true,
}));

// Mock leaderboard service
jest.mock('@/services/leaderboardService', () => ({
  leaderboardService: {
    subscribeToLeaderboard: jest.fn(),
  },
}));

describe('Leaderboard Component', () => {
  const mockSubscribe = leaderboardService.subscribeToLeaderboard as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockSubscribe.mockReturnValue(() => {});
    render(<Leaderboard />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders empty state when no scores are available', () => {
    let callback: (scores: any[]) => void = () => {};
    mockSubscribe.mockImplementation((cb) => {
      callback = cb;
      return () => {};
    });

    render(<Leaderboard />);
    
    act(() => {
      callback([]);
    });

    expect(screen.getByText(/no scores yet/i)).toBeInTheDocument();
  });

  it('renders scores list when data is available', () => {
    let callback: (scores: any[]) => void = () => {};
    mockSubscribe.mockImplementation((cb) => {
      callback = cb;
      return () => {};
    });

    const mockScores = [
      { id: '1', name: 'Alice', score: 10, total: 10 },
      { id: '2', name: '', score: 8, total: 10 },
    ];

    render(<Leaderboard />);
    
    act(() => {
      callback(mockScores);
    });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Anonymous')).toBeInTheDocument();
  });
});
