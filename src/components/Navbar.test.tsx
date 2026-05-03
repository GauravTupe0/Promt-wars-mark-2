import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Navbar } from './Navbar';
import { useActiveSection } from '../hooks/useActiveSection';

// Mock dependencies
jest.mock('../hooks/useActiveSection', () => ({
  useActiveSection: jest.fn(),
}));

jest.mock('./GoogleTranslate', () => ({
  GoogleTranslateInit: () => <div data-testid="google-translate" />,
}));

describe('Navbar Component Integration', () => {
  beforeEach(() => {
    (useActiveSection as jest.Mock).mockReturnValue('hero');
    // Mock global object for language switching if needed
    (window as any).__setGoogleTranslateLang = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('toggles mobile menu on button click', async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const toggleButton = screen.getByRole('button', { name: /Toggle navigation/i });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggleButton);

    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    const menu = screen.getByRole('list');
    expect(menu).toHaveClass('open');

    // Click again to close
    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(menu).not.toHaveClass('open');
  });

  it('closes mobile menu when a nav link is clicked', async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const toggleButton = screen.getByRole('button', { name: /Toggle navigation/i });
    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

    // Find and click a link
    const link = screen.getByText('Timeline');
    await user.click(link);

    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('highlights the active section', () => {
    (useActiveSection as jest.Mock).mockReturnValue('timeline');
    render(<Navbar />);

    const activeLink = screen.getByText('Timeline');
    expect(activeLink).toHaveClass('active');
    expect(activeLink).toHaveAttribute('aria-current', 'true');

    const inactiveLink = screen.getByText('Glossary');
    expect(inactiveLink).not.toHaveClass('active');
    expect(inactiveLink).not.toHaveAttribute('aria-current');
  });

  describe('Language Switcher', () => {
    it('toggles language dropdown', async () => {
      const user = userEvent.setup();
      const { container } = render(<Navbar />);

      const langBtn = container.querySelector('#lang-switcher-btn') as HTMLElement;
      expect(langBtn).toHaveAttribute('aria-expanded', 'false');

      await user.click(langBtn);

      expect(langBtn).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      // Click again to close
      await user.click(langBtn);
      expect(langBtn).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('selects a language and closes dropdown', async () => {
      const user = userEvent.setup();
      const { container } = render(<Navbar />);

      const langBtn = container.querySelector('#lang-switcher-btn') as HTMLElement;
      await user.click(langBtn);

      const hindiOption = screen.getByText(/हिन्दी/i);
      await user.click(hindiOption);

      expect(langBtn).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect((window as any).__setGoogleTranslateLang).toHaveBeenCalledWith('hi');
    });

    it('closes language dropdown on Escape key', async () => {
      const user = userEvent.setup();
      const { container } = render(<Navbar />);

      const langBtn = container.querySelector('#lang-switcher-btn') as HTMLElement;
      await user.click(langBtn);
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.keyDown(screen.getByRole('presentation'), { key: 'Escape', code: 'Escape' });

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('handles English restore button click', async () => {
      const user = userEvent.setup();
      const { container } = render(<Navbar />);

      // Mock the restore button in the DOM
      const mockRestoreBtn = document.createElement('button');
      mockRestoreBtn.className = 'goog-te-restore';
      const clickSpy = jest.spyOn(mockRestoreBtn, 'click');
      document.body.appendChild(mockRestoreBtn);

      const langBtn = container.querySelector('#lang-switcher-btn') as HTMLElement;
      await user.click(langBtn);

      const englishOption = screen.getByText(/English/i);
      await user.click(englishOption);

      expect(clickSpy).toHaveBeenCalled();
      document.body.removeChild(mockRestoreBtn);
    });
  });
});
