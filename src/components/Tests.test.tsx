import { render, screen } from '@testing-library/react';
import React from 'react';

import { Tests } from './Tests';

const mockIntersectionObserver = jest.fn();

describe('Tests Component', () => {
  beforeEach(() => {
    mockIntersectionObserver.mockImplementation((callback) => ({
      observe: jest.fn(() => {
        callback([{ isIntersecting: true }]);
      }),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('renders quality assurance metrics', () => {
    render(<Tests />);
    expect(screen.getByText(/Quality Assurance/i)).toBeInTheDocument();
    expect(screen.getByText(/automated checks/i)).toBeInTheDocument();
  });

  it('renders category score cards', () => {
    render(<Tests />);
    expect(screen.getAllByText(/Security/i).length).toBeGreaterThan(0);
  });

  it('handles non-intersecting state', () => {
    mockIntersectionObserver.mockImplementation((callback) => ({
      observe: jest.fn(() => {
        callback([{ isIntersecting: false }]);
      }),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    render(<Tests />);
    const fills = document.querySelectorAll('.cat-fill');
    fills.forEach(fill => {
      expect((fill as HTMLElement).style.width).toBe('0%');
    });
  });
});
