import { render, screen, fireEvent } from '@testing-library/react';
import { QuizScore } from './QuizScore';
import { isFirebaseConfigured } from '@/firebase';

// Mock dependencies
jest.mock('@/firebase', () => ({
  isFirebaseConfigured: true,
}));

jest.mock('./Leaderboard', () => ({
  Leaderboard: () => <div data-testid="mock-leaderboard" />,
}));

jest.mock('./SaveScoreModal', () => ({
  SaveScoreModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="mock-save-modal">
      <button onClick={onClose}>Close Mock Modal</button>
    </div>
  ),
}));

describe('QuizScore', () => {
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders perfect score message', () => {
    render(<QuizScore score={10} total={10} onRetry={mockOnRetry} />);
    expect(screen.getByText('10/10')).toBeInTheDocument();
    expect(screen.getByText(/TitlePerfect/i)).toBeInTheDocument();
    expect(screen.getByText(/MsgPerfect/i)).toBeInTheDocument();
  });

  it('renders good score message', () => {
    render(<QuizScore score={7} total={10} onRetry={mockOnRetry} />);
    expect(screen.getByText('7/10')).toBeInTheDocument();
    expect(screen.getByText(/TitleGreat/i)).toBeInTheDocument();
    expect(screen.getByText(/MsgGreat/i)).toBeInTheDocument();
  });

  it('renders keep learning message for low scores', () => {
    render(<QuizScore score={2} total={10} onRetry={mockOnRetry} />);
    expect(screen.getByText('2/10')).toBeInTheDocument();
    expect(screen.getByText(/TitleKeep/i)).toBeInTheDocument();
    expect(screen.getByText(/MsgKeep/i)).toBeInTheDocument();
  });

  it('triggers onRetry when button is clicked', () => {
    render(<QuizScore score={5} total={10} onRetry={mockOnRetry} />);
    const retryBtn = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(retryBtn);
    expect(mockOnRetry).toHaveBeenCalled();
  });

  it('shows save modal initially and allows closing it', () => {
    render(<QuizScore score={8} total={10} onRetry={mockOnRetry} />);
    expect(screen.getByTestId('mock-save-modal')).toBeInTheDocument();
    
    const closeBtn = screen.getByText('Close Mock Modal');
    fireEvent.click(closeBtn);
    
    expect(screen.queryByTestId('mock-save-modal')).not.toBeInTheDocument();
  });

  it('does not show save modal if firebase is not configured', () => {
    // Override mock for this test
    const firebaseModule = require('@/firebase');
    const originalValue = firebaseModule.isFirebaseConfigured;
    Object.defineProperty(firebaseModule, 'isFirebaseConfigured', { value: false, writable: true });
    
    render(<QuizScore score={8} total={10} onRetry={mockOnRetry} />);
    expect(screen.queryByTestId('mock-save-modal')).not.toBeInTheDocument();
    
    // Reset
    Object.defineProperty(firebaseModule, 'isFirebaseConfigured', { value: originalValue });
  });
});
