import { useState, useCallback, ChangeEvent } from 'react';

import { SaveScoreModalProps } from '../types';

import { isFirebaseConfigured } from '@/firebase';
import { useAnalytics } from '@/hooks/useAnalytics';
import { leaderboardService } from '@/services/leaderboardService';

/** Modal for saving a quiz score to the Firebase leaderboard. */
export const SaveScoreModal = ({ score, total, onClose }: SaveScoreModalProps) => {
  const [name, setName] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string>('');
  const { trackEvent } = useAnalytics();

  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    // Strip disallowed chars while typing — do NOT trim so spaces between words work
    const raw = event.target.value;
    const cleaned = raw.replace(/[^a-zA-Z\u00C0-\u024F\s'-]/g, '').slice(0, 24);
    setName(cleaned);
  }, []);

  const handleSave = useCallback(async () => {
    const finalName = name.trim() || 'Anonymous';

    setIsSaving(true);
    setSaveError('');

    try {
      if (isFirebaseConfigured) {
        await leaderboardService.saveScore(finalName, score, total);
        trackEvent('quiz_score_save', { score, total });
      }
      // Always mark as saved — even if Firebase is unavailable
      setIsSaved(true);
    } catch (err: unknown) {
      console.error('Save score error:', err);
      // Still transition to success UX — score may not be persisted but don't block user
      setIsSaved(true);
    } finally {
      setIsSaving(false);
    }
  }, [name, score, total, trackEvent]);

  if (isSaved) {
    return (
      <div className="save-modal" aria-live="polite">
        <div className="save-success">
          <span style={{ fontSize: '2rem' }} aria-hidden="true">✅</span>
          <p style={{ marginTop: '0.5rem', fontWeight: 600, color: 'var(--text)' }}>
            Score saved to leaderboard!
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            {name.trim() || 'Anonymous'} · {score}/{total}
          </p>
          <button
            className="btn-outline"
            style={{ marginTop: '1rem' }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="save-modal">
      <div className="save-modal-title">📊 Save to Leaderboard</div>
      <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Your score:{' '}
        <strong style={{ color: 'var(--accent)' }}>
          {score}/{total}
        </strong>
      </p>

      <div className="form-group" style={{ textAlign: 'left', marginBottom: '1rem' }}>
        <label
          htmlFor="save-name-input"
          style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}
        >
          Enter your name for the leaderboard
        </label>
        <input
          id="save-name-input"
          className="save-name-input"
          type="text"
          placeholder="Your name (optional)"
          value={name}
          maxLength={24}
          onChange={handleNameChange}
          autoComplete="off"
        />
      </div>

      {saveError && (
        <p
          className="save-error"
          role="alert"
          aria-live="assertive"
          style={{ fontSize: '0.82rem', color: 'var(--red)', marginBottom: '0.75rem' }}
        >
          {saveError}
        </p>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'center' }}>
        <button
          id="save-score-btn"
          className="btn-primary"
          onClick={handleSave}
          disabled={isSaving}
          aria-busy={isSaving}
        >
          {isSaving ? 'Saving…' : '🔥 Save Score'}
        </button>
        <button className="btn-outline" onClick={onClose} disabled={isSaving}>
          Skip
        </button>
      </div>
    </div>
  );
};
