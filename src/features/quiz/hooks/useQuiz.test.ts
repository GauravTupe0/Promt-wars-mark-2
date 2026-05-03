import { renderHook, act } from '@testing-library/react';
import { useQuiz } from './useQuiz';

describe('useQuiz hook', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useQuiz());
    expect(result.current.questionIndex).toBe(0);
    expect(result.current.score).toBe(0);
    expect(result.current.isAnswered).toBe(false);
  });

  it('updates score on correct answer', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.handleAnswer(true);
    });
    expect(result.current.score).toBe(1);
    expect(result.current.isAnswered).toBe(true);
  });

  it('advances question when isCorrect is null', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.handleAnswer(null);
    });
    expect(result.current.questionIndex).toBe(1);
    expect(result.current.isAnswered).toBe(false);
  });

  it('resets state on retry', () => {
    const { result } = renderHook(() => useQuiz());
    act(() => {
      result.current.handleAnswer(true);
      result.current.handleRetry();
    });
    expect(result.current.score).toBe(0);
    expect(result.current.questionIndex).toBe(0);
  });

  it('calculates pip classes correctly', () => {
    const { result } = renderHook(() => useQuiz());
    expect(result.current.getPipClass(0)).toBe('quiz-pip current');
    expect(result.current.getPipClass(1)).toBe('quiz-pip');
    
    act(() => {
      result.current.handleAnswer(null);
    });
    
    expect(result.current.getPipClass(0)).toBe('quiz-pip done');
    expect(result.current.getPipClass(1)).toBe('quiz-pip current');
  });
});
