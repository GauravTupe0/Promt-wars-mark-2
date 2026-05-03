import { renderHook } from '@testing-library/react';

import { useScrollReveal } from './useScrollReveal';

describe('useScrollReveal', () => {
  let mockIntersectionObserver: jest.Mock;
  let mockObserve: jest.Mock;
  let mockUnobserve: jest.Mock;
  let mockDisconnect: jest.Mock;

  let mockMutationObserver: jest.Mock;
  let mockMutationObserve: jest.Mock;
  let mockMutationDisconnect: jest.Mock;

  beforeEach(() => {
    // Reset document
    document.body.innerHTML = '';
    
    mockObserve = jest.fn();
    mockUnobserve = jest.fn();
    mockDisconnect = jest.fn();
    
    mockIntersectionObserver = jest.fn().mockImplementation((callback) => {
      // Expose callback so we can simulate intersections
      (global as any).triggerIntersection = callback;
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
      };
    });
    
    mockMutationObserve = jest.fn();
    mockMutationDisconnect = jest.fn();
    
    mockMutationObserver = jest.fn().mockImplementation((callback) => {
      // Expose callback so we can simulate DOM mutations
      (global as any).triggerMutation = callback;
      return {
        observe: mockMutationObserve,
        disconnect: mockMutationDisconnect,
      };
    });

    global.IntersectionObserver = mockIntersectionObserver;
    global.MutationObserver = mockMutationObserver as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete (global as any).triggerIntersection;
    delete (global as any).triggerMutation;
  });

  it('sets up observers on mount', () => {
    renderHook(() => useScrollReveal());

    expect(mockIntersectionObserver).toHaveBeenCalled();
    expect(mockMutationObserver).toHaveBeenCalled();
    expect(mockMutationObserve).toHaveBeenCalledWith(document.body, {
      childList: true,
      subtree: true,
    });
  });

  it('observes existing elements with .reveal class', () => {
    const el1 = document.createElement('div');
    el1.classList.add('reveal');
    const el2 = document.createElement('div');
    el2.classList.add('reveal');
    document.body.appendChild(el1);
    document.body.appendChild(el2);

    renderHook(() => useScrollReveal());

    expect(mockObserve).toHaveBeenCalledTimes(2);
    expect(mockObserve).toHaveBeenCalledWith(el1);
    expect(mockObserve).toHaveBeenCalledWith(el2);
  });

  it('adds .visible class and unobserves when intersected', () => {
    const el = document.createElement('div');
    el.classList.add('reveal');
    document.body.appendChild(el);

    renderHook(() => useScrollReveal());

    // Simulate intersection
    const entry = { isIntersecting: true, target: el };
    (global as any).triggerIntersection([entry]);

    expect(el.classList.contains('visible')).toBe(true);
    expect(mockUnobserve).toHaveBeenCalledWith(el);
  });

  it('does not add .visible if not intersecting', () => {
    const el = document.createElement('div');
    el.classList.add('reveal');
    document.body.appendChild(el);

    renderHook(() => useScrollReveal());

    // Simulate non-intersection
    const entry = { isIntersecting: false, target: el };
    (global as any).triggerIntersection([entry]);

    expect(el.classList.contains('visible')).toBe(false);
    expect(mockUnobserve).not.toHaveBeenCalled();
  });

  it('re-runs querySelectorAll on DOM mutation', () => {
    renderHook(() => useScrollReveal());

    expect(mockObserve).not.toHaveBeenCalled(); // No elements initially

    // Add element to DOM
    const el = document.createElement('div');
    el.classList.add('reveal');
    document.body.appendChild(el);

    // Simulate DOM mutation
    (global as any).triggerMutation();

    expect(mockObserve).toHaveBeenCalledWith(el);
  });

  it('cleans up observers on unmount', () => {
    const { unmount } = renderHook(() => useScrollReveal());

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
    expect(mockMutationDisconnect).toHaveBeenCalled();
  });
});
