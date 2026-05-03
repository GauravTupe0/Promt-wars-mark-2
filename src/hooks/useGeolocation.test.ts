import { renderHook, act } from '@testing-library/react';
import { useGeolocation } from './useGeolocation';

describe('useGeolocation', () => {
  const originalGeolocation = global.navigator.geolocation;

  beforeEach(() => {
    // Reset geolocation mock
    Object.defineProperty(global.navigator, 'geolocation', {
      value: {
        getCurrentPosition: jest.fn(),
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(global.navigator, 'geolocation', {
      value: originalGeolocation,
      writable: true,
      configurable: true,
    });
  });

  it('initialises with correct default state', () => {
    const { result } = renderHook(() => useGeolocation());
    expect(result.current.phase).toBe('idle');
    expect(result.current.userPosition).toBeNull();
    expect(typeof result.current.locate).toBe('function');
  });

  it('sets phase to error if geolocation is not supported', () => {
    Object.defineProperty(global.navigator, 'geolocation', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useGeolocation());
    
    act(() => {
      result.current.locate();
    });

    expect(result.current.phase).toBe('error');
    expect(result.current.userPosition).toBeNull();
  });

  it('updates state correctly on successful geolocation', () => {
    const mockPosition = {
      coords: { latitude: 51.5074, longitude: -0.1278 }
    };
    
    const getCurrentPositionMock = jest.fn((success) => {
      success(mockPosition);
    });

    Object.defineProperty(global.navigator, 'geolocation', {
      value: { getCurrentPosition: getCurrentPositionMock },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useGeolocation());
    
    act(() => {
      result.current.locate();
    });

    expect(getCurrentPositionMock).toHaveBeenCalled();
    expect(result.current.phase).toBe('ready');
    expect(result.current.userPosition).toEqual({ lat: 51.5074, lng: -0.1278 });
  });

  it('sets phase to denied when user denies permission', () => {
    const getCurrentPositionMock = jest.fn((success, error) => {
      error({ code: 1, PERMISSION_DENIED: 1 }); // 1 is standard code for PERMISSION_DENIED
    });

    Object.defineProperty(global.navigator, 'geolocation', {
      value: { getCurrentPosition: getCurrentPositionMock },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useGeolocation());
    
    act(() => {
      result.current.locate();
    });

    expect(result.current.phase).toBe('denied');
    expect(result.current.userPosition).toBeNull();
  });

  it('sets phase to error when a different error occurs', () => {
    const getCurrentPositionMock = jest.fn((success, error) => {
      error({ code: 2, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2 });
    });

    Object.defineProperty(global.navigator, 'geolocation', {
      value: { getCurrentPosition: getCurrentPositionMock },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useGeolocation());
    
    act(() => {
      result.current.locate();
    });

    expect(result.current.phase).toBe('error');
    expect(result.current.userPosition).toBeNull();
  });
});
