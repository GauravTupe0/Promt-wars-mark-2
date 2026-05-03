import { useAppStore } from './useAppStore';

describe('useAppStore', () => {
  const initialState = useAppStore.getState();

  beforeEach(() => {
    useAppStore.setState(initialState, true);
  });

  it('initializes with default values', () => {
    const state = useAppStore.getState();
    expect(state.isMenuOpen).toBe(false);
    expect(state.language).toBe('en');
  });

  it('toggles menu state correctly', () => {
    useAppStore.getState().toggleMenu();
    expect(useAppStore.getState().isMenuOpen).toBe(true);

    useAppStore.getState().toggleMenu();
    expect(useAppStore.getState().isMenuOpen).toBe(false);
  });

  it('closes menu state correctly', () => {
    useAppStore.getState().toggleMenu(); // open it first
    expect(useAppStore.getState().isMenuOpen).toBe(true);

    useAppStore.getState().closeMenu();
    expect(useAppStore.getState().isMenuOpen).toBe(false);

    useAppStore.getState().closeMenu(); // calling again should do nothing
    expect(useAppStore.getState().isMenuOpen).toBe(false);
  });

  it('sets language correctly', () => {
    useAppStore.getState().setLanguage('hi');
    expect(useAppStore.getState().language).toBe('hi');
  });
});
