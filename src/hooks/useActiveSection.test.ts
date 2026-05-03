import { renderHook, act } from '@testing-library/react';
import { useActiveSection } from './useActiveSection';

// We need to mock the constant SECTION_IDS
jest.mock('@/constants', () => ({
  SECTION_IDS: ['hero', 'about', 'contact'],
}));

describe('useActiveSection', () => {
  let mockIntersectionObserver: jest.Mock;
  let mockObserve: jest.Mock;
  let mockDisconnect: jest.Mock;

  beforeEach(() => {
    document.body.innerHTML = '';
    mockObserve = jest.fn();
    mockDisconnect = jest.fn();

    mockIntersectionObserver = jest.fn().mockImplementation((callback) => {
      (global as any).triggerIntersection = callback;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
      };
    });

    global.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete (global as any).triggerIntersection;
  });

  it('initializes with the first section ID', () => {
    const { result } = renderHook(() => useActiveSection());
    expect(result.current).toBe('hero');
  });

  it('observes existing section elements on mount', () => {
    const heroEl = document.createElement('div');
    heroEl.id = 'hero';
    const contactEl = document.createElement('div');
    contactEl.id = 'contact';
    
    document.body.appendChild(heroEl);
    document.body.appendChild(contactEl);

    renderHook(() => useActiveSection());

    expect(mockObserve).toHaveBeenCalledTimes(2);
    expect(mockObserve).toHaveBeenCalledWith(heroEl);
    expect(mockObserve).toHaveBeenCalledWith(contactEl);
    // 'about' element doesn't exist, so it shouldn't be observed
  });

  it('updates active section when an element intersects', () => {
    const aboutEl = document.createElement('div');
    aboutEl.id = 'about';
    document.body.appendChild(aboutEl);

    const { result } = renderHook(() => useActiveSection());

    // Trigger intersection
    const entry = { isIntersecting: true, target: aboutEl };
    act(() => {
      (global as any).triggerIntersection([entry]);
    });

    expect(result.current).toBe('about');
  });

  it('does not update active section when an element is not intersecting', () => {
    const aboutEl = document.createElement('div');
    aboutEl.id = 'about';
    document.body.appendChild(aboutEl);

    const { result } = renderHook(() => useActiveSection());

    // Initially 'hero'
    expect(result.current).toBe('hero');

    // Trigger non-intersection
    const entry = { isIntersecting: false, target: aboutEl };
    act(() => {
      (global as any).triggerIntersection([entry]);
    });

    // Should still be 'hero'
    expect(result.current).toBe('hero');
  });

  it('disconnects observer on unmount', () => {
    const { unmount } = renderHook(() => useActiveSection());

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });
});
