import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { HelpButton } from './HelpButton';

// Mock useFocusTrap hook
jest.mock('@/hooks/useFocusTrap', () => ({
  useFocusTrap: jest.fn(),
}));

describe('HelpButton Component', () => {
  let locationSpy: jest.SpyInstance;

  beforeEach(() => {
    // We cannot easily mock window.location.href directly in JSDOM
    // But we can check if the menu closes as a proxy for the action being called
    // Or we can try to mock the assignment
  });

  it('toggles the help menu when the SOS button is clicked', async () => {
    render(<HelpButton />);
    
    const trigger = screen.getByLabelText(/Open emergency help menu/i);
    fireEvent.click(trigger);
    
    expect(screen.getByText(/Emergency Help Options/i)).toBeInTheDocument();
    expect(screen.getByText(/Call Police/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByLabelText(/Close emergency menu/i));
    expect(screen.queryByText(/Emergency Help Options/i)).not.toBeInTheDocument();
  });

  it('closes the menu when an option is selected', async () => {
    const user = userEvent.setup();
    render(<HelpButton />);
    
    // Open menu
    fireEvent.click(screen.getByLabelText(/Open emergency help menu/i));
    
    // Mock the window.location.href assignment behavior if possible, 
    // or just verify the side effect we can control (menu closing)
    const policeBtn = screen.getByRole('button', { name: /Call Police/i });
    
    // Silence the actual location change if it errors in JSDOM
    const originalHref = window.location.href;
    try {
      await user.click(policeBtn);
    } catch (e) {
      // Ignore JSDOM location errors
    }
    
    // The menu should be closed after selection
    expect(screen.queryByText(/Emergency Help Options/i)).not.toBeInTheDocument();
  });

  it('closes the menu when pressing Escape', () => {
    render(<HelpButton />);
    
    // Open menu
    fireEvent.click(screen.getByLabelText(/Open emergency help menu/i));
    expect(screen.getByText(/Emergency Help Options/i)).toBeInTheDocument();
    
    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText(/Emergency Help Options/i)).not.toBeInTheDocument();
  });

  it('closes the menu when clicking outside', () => {
    render(<HelpButton />);
    
    // Open menu
    fireEvent.click(screen.getByLabelText(/Open emergency help menu/i));
    expect(screen.getByText(/Emergency Help Options/i)).toBeInTheDocument();
    
    // Click outside
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText(/Emergency Help Options/i)).not.toBeInTheDocument();
  });
});
