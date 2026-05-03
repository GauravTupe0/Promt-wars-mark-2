import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AIChat } from './AIChat';

describe('AIChat Component', () => {
  it('renders chat heading', () => {
    render(<AIChat />);
    expect(screen.getByText(/AI Civic Assistant/i)).toBeInTheDocument();
  });

  it('renders input area', () => {
    render(<AIChat />);
    expect(screen.getByPlaceholderText(/Ask a question about voting/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('allows user to send a message by pressing Enter', async () => {
    const user = userEvent.setup({ delay: null });
    render(<AIChat />);
    
    const input = screen.getByPlaceholderText(/Ask a question about voting/i);
    await user.type(input, 'Hello{enter}');
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('ignores empty messages', async () => {
    const user = userEvent.setup();
    render(<AIChat />);
    
    const sendBtn = screen.getByRole('button', { name: /send message/i });
    await user.click(sendBtn);
    
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  it('simulates AI response after 1 second', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<AIChat />);
    
    const input = screen.getByPlaceholderText(/Ask a question about voting/i);
    await user.type(input, 'Hello');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    // Fast-forward time
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText(/How can I assist you with the election process/i)).toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });

  it('sanitizes user input and removes dangerous tags', async () => {
    const user = userEvent.setup();
    render(<AIChat />);
    
    const input = screen.getByPlaceholderText(/Ask a question about voting/i);
    const maliciousScript = '<img src=x onerror=alert(1)> Hello World';
    await user.type(input, maliciousScript);
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    // The text content should be present, but the script should be gone
    const msg = screen.getByRole('article', { name: /you said/i });
    expect(msg.innerHTML).toContain('Hello World');
    expect(msg.innerHTML).not.toContain('onerror');
  });
});
