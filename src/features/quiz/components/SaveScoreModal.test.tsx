import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SaveScoreModal } from './SaveScoreModal';

import { leaderboardService } from '@/services/leaderboardService';

// Mock dependencies
jest.mock('@/services/leaderboardService', () => ({
  leaderboardService: {
    saveScore: jest.fn(),
  },
}));

jest.mock('@/firebase', () => ({
  isFirebaseConfigured: true,
}));

jest.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: jest.fn(() => ({
    trackEvent: jest.fn(),
  })),
}));

describe('SaveScoreModal', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    score: 8,
    total: 10,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal with score', () => {
    render(<SaveScoreModal {...defaultProps} />);
    expect(screen.getByText('📊 Save to Leaderboard')).toBeInTheDocument();
    expect(screen.getByText('8/10')).toBeInTheDocument();
  });

  it('handles name input changes and restricts characters', async () => {
    const user = userEvent.setup();
    render(<SaveScoreModal {...defaultProps} />);
    
    const input = screen.getByPlaceholderText(/Your name/i) as HTMLInputElement;
    
    // Type a valid name
    await user.type(input, 'Gaurav 123!');
    // Numbers and symbols should be stripped based on regex: /[^a-zA-Z\u00C0-\u024F\s'-]/g
    expect(input.value).toBe('Gaurav ');
  });

  it('saves the score and shows success message', async () => {
    const user = userEvent.setup();
    (leaderboardService.saveScore as jest.Mock).mockResolvedValueOnce({});
    
    render(<SaveScoreModal {...defaultProps} />);
    
    const input = screen.getByPlaceholderText(/Your name/i);
    await user.type(input, 'Gaurav');
    
    const saveBtn = screen.getByRole('button', { name: /Save Score/i });
    await user.click(saveBtn);
    
    expect(leaderboardService.saveScore).toHaveBeenCalledWith('Gaurav', 8, 10);
    expect(screen.getByText(/Score saved to leaderboard!/i)).toBeInTheDocument();
    expect(screen.getByText(/Gaurav · 8\/10/i)).toBeInTheDocument();
  });

  it('handles save error gracefully by still showing success (non-blocking)', async () => {
    const user = userEvent.setup();
    (leaderboardService.saveScore as jest.Mock).mockRejectedValueOnce(new Error('Firebase Error'));
    
    render(<SaveScoreModal {...defaultProps} />);
    
    const saveBtn = screen.getByRole('button', { name: /Save Score/i });
    await user.click(saveBtn);
    
    // According to code, it marks as saved even if error occurs to not block user
    expect(screen.getByText(/Score saved to leaderboard!/i)).toBeInTheDocument();
  });

  it('closes the modal when Skip is clicked', async () => {
    const user = userEvent.setup();
    render(<SaveScoreModal {...defaultProps} />);
    
    const skipBtn = screen.getByRole('button', { name: /Skip/i });
    await user.click(skipBtn);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes the modal from success state', async () => {
    const user = userEvent.setup();
    (leaderboardService.saveScore as jest.Mock).mockResolvedValueOnce({});
    
    render(<SaveScoreModal {...defaultProps} />);
    
    const saveBtn = screen.getByRole('button', { name: /Save Score/i });
    await user.click(saveBtn);
    
    const closeBtn = screen.getByRole('button', { name: /Close/i });
    await user.click(closeBtn);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});
