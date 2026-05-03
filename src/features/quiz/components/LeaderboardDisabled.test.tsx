import { render } from '@testing-library/react';

// Mock Firebase config to be false BEFORE importing the component
jest.mock('@/firebase', () => ({
  isFirebaseConfigured: false,
}));

import { Leaderboard } from './Leaderboard';

describe('Leaderboard Component (Disabled)', () => {
  it('returns null when Firebase is not configured', () => {
    const { container } = render(<Leaderboard />);
    expect(container.firstChild).toBeNull();
  });
});
