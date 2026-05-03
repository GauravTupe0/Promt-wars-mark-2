import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  it('initialises with initialValue if localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('initialises with stored value if localStorage has data', () => {
    window.localStorage.setItem('testKey', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));
    expect(result.current[0]).toBe('stored');
  });

  it('updates state and localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));
    
    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(window.localStorage.getItem('testKey')).toBe(JSON.stringify('newValue'));
  });

  it('supports functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 1));
    
    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
    expect(window.localStorage.getItem('testKey')).toBe(JSON.stringify(2));
  });

  it('handles JSON.parse error gracefully and uses initialValue', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    window.localStorage.setItem('testKey', 'invalid-json');
    
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));
    
    expect(result.current[0]).toBe('initial');
    expect(consoleWarnSpy).toHaveBeenCalled();
    
    consoleWarnSpy.mockRestore();
  });

  it('handles localStorage setItem error gracefully', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    const originalLocalStorage = window.localStorage;
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => {
          throw new Error('Storage Full');
        }),
      },
      writable: true,
    });
    
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));
    
    act(() => {
      result.current[1]('newValue');
    });

    // State still updates even if localStorage fails
    expect(result.current[0]).toBe('newValue');
    expect(consoleWarnSpy).toHaveBeenCalled();
    
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });
    consoleWarnSpy.mockRestore();
  });
});
