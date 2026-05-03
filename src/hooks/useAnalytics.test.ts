import { renderHook } from '@testing-library/react';
import { useAnalytics } from './useAnalytics';
import { logEvent } from 'firebase/analytics';

// Define a mutable mock state that is hoisted correctly by Jest
const mockFirebaseState = {
  configured: true,
  analytics: {}
};

// Mock Firebase using getters to allow dynamic state changes during tests
jest.mock('@/firebase', () => ({
  get analytics() { return mockFirebaseState.configured ? mockFirebaseState.analytics : null; },
  get isFirebaseConfigured() { return mockFirebaseState.configured; },
}));

// Mock Firebase Analytics
jest.mock('firebase/analytics', () => ({
  logEvent: jest.fn(),
}));

describe('useAnalytics hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFirebaseState.configured = true;
  });

  it('tracks page views when activeSection changes', () => {
    const { rerender } = renderHook(({ section }) => useAnalytics(section), {
      initialProps: { section: 'home' }
    });
    
    expect(logEvent).toHaveBeenCalledWith(expect.anything(), 'page_view', expect.objectContaining({
      page_title: 'home'
    }));

    rerender({ section: 'about' });
    expect(logEvent).toHaveBeenCalledWith(expect.anything(), 'page_view', expect.objectContaining({
      page_title: 'about'
    }));
  });

  it('tracks custom events', () => {
    const { result } = renderHook(() => useAnalytics());
    result.current.trackEvent('test_event', { foo: 'bar' });
    expect(logEvent).toHaveBeenCalledWith(expect.anything(), 'test_event', { foo: 'bar' });
  });

  it('tracks errors', () => {
    const { result } = renderHook(() => useAnalytics());
    result.current.trackError('test error', 'TestComponent');
    expect(logEvent).toHaveBeenCalledWith(expect.anything(), 'app_error', {
      error_message: 'test error',
      component_name: 'TestComponent'
    });
  });

  describe('when firebase is not configured', () => {
    it('does not throw when tracking events', () => {
      mockFirebaseState.configured = false;
      const { result } = renderHook(() => useAnalytics());
      
      expect(() => result.current.trackEvent('any')).not.toThrow();
      expect(logEvent).not.toHaveBeenCalled();
    });

    it('does not track page views', () => {
      mockFirebaseState.configured = false;
      renderHook(() => useAnalytics('home'));
      
      expect(logEvent).not.toHaveBeenCalled();
    });
  });
});
