import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Timeline } from './Timeline';

describe('Timeline Component Integration', () => {
  it('expands accordion panels on click', async () => {
    const user = userEvent.setup();
    render(<Timeline />);

    const buttons = await screen.findAllByRole('button');
    const firstButton = buttons[0];
    const secondButton = buttons[1];
    
    // Assert initial active state
    expect(firstButton).toHaveAttribute('aria-pressed', 'true');
    expect(secondButton).toHaveAttribute('aria-pressed', 'false');

    // User clicks the panel
    await user.click(secondButton);

    // Assert active state changed
    expect(secondButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('supports keyboard navigation', async () => {
    render(<Timeline />);

    const buttons = await screen.findAllByRole('button');
    
    // Start at index 0
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    
    // Use fireEvent to avoid the focus-moving side effect of handleSelect 
    // that occurs in the real component when a phase is selected.
    fireEvent.keyDown(buttons[0], { key: 'ArrowDown' });
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'true');
    
    fireEvent.keyDown(buttons[1], { key: 'ArrowUp' });
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');

    fireEvent.keyDown(buttons[0], { key: 'Enter' });
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');

    fireEvent.keyDown(buttons[0], { key: ' ' });
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
  });
});
