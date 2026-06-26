import { describe, it, expect } from 'vitest';

import { getShareLink } from '../src/components/utils';

describe('getShareLink', () => {
  const link = 'https://example.org/view';
  const thumb = 'https://example.org/thumb.jpg';

  it('builds a mailto link for envelope', () => {
    expect(getShareLink(undefined, link, 'Title', 'envelope', thumb)).toBe(
      `mailto:?subject=Title&body=Title: ${link}`,
    );
  });

  it('includes attribution in the text when provided', () => {
    expect(getShareLink('Author', link, 'Title', 'envelope', thumb)).toBe(
      `mailto:?subject=Title (Author)&body=Title (Author): ${link}`,
    );
  });

  it('builds a facebook link', () => {
    expect(getShareLink(undefined, link, 'Title', 'facebook', thumb)).toContain(
      'facebook.com/sharer',
    );
  });

  it('builds a pinterest link including the media thumbnail', () => {
    expect(getShareLink(undefined, link, 'Title', 'pinterest', thumb)).toContain(
      `media=${thumb}`,
    );
  });

  it('truncates long text for twitter', () => {
    const longLabel = 'x'.repeat(100);
    const result = getShareLink(undefined, link, longLabel, 'twitter', thumb);
    expect(result).toContain('...');
    expect(result).toContain('hashtags=iiif');
  });

  it('builds a whatsapp link', () => {
    expect(getShareLink(undefined, link, 'Title', 'whatsapp', thumb)).toBe(
      `whatsapp://send?text=Title: ${link}`,
    );
  });

  it('returns null for an unknown provider', () => {
    expect(getShareLink(undefined, link, 'Title', 'myspace', thumb)).toBeNull();
  });
});
