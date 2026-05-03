import { renderHook } from '@testing-library/react';
import { RefObject } from 'react';

import { useFocusTrap } from './useFocusTrap';

describe('useFocusTrap hook', () => {
  let container: HTMLDivElement;
  let btn1: HTMLButtonElement;
  let btn2: HTMLButtonElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <button id="btn1">One</button>
      <button id="btn2">Two</button>
    `;
    document.body.appendChild(container);
    btn1 = document.getElementById('btn1') as HTMLButtonElement;
    btn2 = document.getElementById('btn2') as HTMLButtonElement;
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('traps focus when active', () => {
    const ref: RefObject<HTMLDivElement> = { current: container };
    
    renderHook(() => useFocusTrap(ref, true));
    
    // Should focus first element on mount
    expect(document.activeElement).toBe(btn1);

    // Simulate Tab on last element
    btn2.focus();
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    container.dispatchEvent(event);
    
    // Tab on last element calls firstElement.focus()
    expect(document.activeElement).toBe(btn1);
  });

  it('wraps focus backwards on Shift+Tab from first element', () => {
    const ref: RefObject<HTMLDivElement> = { current: container };
    renderHook(() => useFocusTrap(ref, true));
    
    btn1.focus();
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true });
    container.dispatchEvent(event);
    
    expect(document.activeElement).toBe(btn2);
  });

  it('restores focus on cleanup', () => {
    const triggerBtn = document.createElement('button');
    document.body.appendChild(triggerBtn);
    triggerBtn.focus();
    
    const ref: RefObject<HTMLDivElement> = { current: container };
    const { unmount } = renderHook(() => useFocusTrap(ref, true));
    
    expect(document.activeElement).toBe(btn1);
    
    unmount();
    
    expect(document.activeElement).toBe(triggerBtn);
    document.body.removeChild(triggerBtn);
  });

  it('does nothing when inactive', () => {
    const ref: RefObject<HTMLDivElement> = { current: container };
    const triggerBtn = document.createElement('button');
    document.body.appendChild(triggerBtn);
    triggerBtn.focus();
    
    renderHook(() => useFocusTrap(ref, false));
    
    expect(document.activeElement).toBe(triggerBtn);
    document.body.removeChild(triggerBtn);
  });

  it('ignores non-Tab keys', () => {
    const ref: RefObject<HTMLDivElement> = { current: container };
    renderHook(() => useFocusTrap(ref, true));
    
    btn2.focus();
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    container.dispatchEvent(event);
    
    expect(document.activeElement).toBe(btn2);
  });
});
