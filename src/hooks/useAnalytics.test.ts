import { renderHook } from '@testing-library/react';
import { useAnalytics } from './useAnalytics';
import { logEvent } from 'firebase/analytics';

// Mock Firebase
jest.mock('firebase/analytics', () => ({
  logEvent: jest.fn(),
}));

jest.mock('@/firebase', () => ({
  analytics: {},
  isFirebaseConfigured: true,
}));

describe('useAnalytics hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
});
