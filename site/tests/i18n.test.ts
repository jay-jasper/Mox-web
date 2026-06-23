import { describe, it, expect } from 'vitest';
import { t, type Locale } from '../src/i18n';

describe('i18n', () => {
  it('returns the zh string by default', () => {
    expect(t('zh', 'nav.download')).toBe('下载');
  });
  it('returns the en string', () => {
    expect(t('en', 'nav.download')).toBe('Download');
  });
  it('falls back to the raw key when missing', () => {
    expect(t('en' as Locale, 'nonexistent.key')).toBe('nonexistent.key');
  });
});
