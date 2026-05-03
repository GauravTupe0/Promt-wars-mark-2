import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Glossary } from './Glossary';

describe('Glossary Component Integration', () => {
  it('filters glossary terms based on user search input', async () => {
    const user = userEvent.setup();
    render(<Glossary />);

    const searchInput = screen.getByPlaceholderText(/Search terms/i);
    expect(searchInput).toBeInTheDocument();

    expect(screen.getByText('EVM')).toBeInTheDocument();
    expect(screen.getByText('Lok Sabha')).toBeInTheDocument();

    // Type a specific term
    await user.type(searchInput, 'EVM');

    // Wait for debounce and verify filtered results
    await waitFor(() => {
      expect(screen.queryByText('Lok Sabha')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('EVM')).toBeInTheDocument();
  });
});
