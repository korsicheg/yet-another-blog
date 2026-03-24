import { describe, it, expect } from 'vitest'
import { getYouTubeId, getThumbnailUrl, getEmbedUrl } from './video'

describe('getYouTubeId', () => {
  it('extracts ID from standard watch URL', () => {
    expect(getYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts ID from short URL', () => {
    expect(getYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extracts ID with extra query params', () => {
    expect(getYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120')).toBe('dQw4w9WgXcQ')
  })

  it('extracts ID with hyphens and underscores', () => {
    expect(getYouTubeId('https://youtube.com/watch?v=a-B_c1D2e3f')).toBe('a-B_c1D2e3f')
  })

  it('returns null for invalid URL', () => {
    expect(getYouTubeId('https://example.com')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(getYouTubeId('')).toBeNull()
  })

  it('returns null for Vimeo URL', () => {
    expect(getYouTubeId('https://vimeo.com/123456789')).toBeNull()
  })
})

describe('getThumbnailUrl', () => {
  it('returns YouTube thumbnail for youtube platform', () => {
    expect(getThumbnailUrl('https://youtube.com/watch?v=dQw4w9WgXcQ', 'youtube')).toBe(
      'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    )
  })

  it('returns null for vimeo platform', () => {
    expect(getThumbnailUrl('https://vimeo.com/123456', 'vimeo')).toBeNull()
  })

  it('returns null for null platform', () => {
    expect(getThumbnailUrl('https://youtube.com/watch?v=abc', null)).toBeNull()
  })

  it('returns null for undefined platform', () => {
    expect(getThumbnailUrl('https://youtube.com/watch?v=abc', undefined)).toBeNull()
  })

  it('returns null when YouTube ID cannot be extracted', () => {
    expect(getThumbnailUrl('https://example.com', 'youtube')).toBeNull()
  })
})

describe('getEmbedUrl', () => {
  it('converts YouTube watch URL to embed URL', () => {
    expect(getEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube')).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
    )
  })

  it('converts YouTube short URL to embed URL', () => {
    expect(getEmbedUrl('https://youtu.be/dQw4w9WgXcQ', 'youtube')).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
    )
  })

  it('converts Vimeo URL to embed URL', () => {
    expect(getEmbedUrl('https://vimeo.com/123456789', 'vimeo')).toBe(
      'https://player.vimeo.com/video/123456789',
    )
  })

  it('returns original URL for unrecognized YouTube URL', () => {
    const url = 'https://youtube.com/channel/UCtest'
    expect(getEmbedUrl(url, 'youtube')).toBe(url)
  })

  it('returns original URL for unrecognized Vimeo URL', () => {
    const url = 'https://vimeo.com/channels/test'
    expect(getEmbedUrl(url, 'vimeo')).toBe(url)
  })

  it('returns original URL for null platform', () => {
    const url = 'https://example.com/video'
    expect(getEmbedUrl(url, null)).toBe(url)
  })

  it('returns original URL for undefined platform', () => {
    const url = 'https://example.com/video'
    expect(getEmbedUrl(url, undefined)).toBe(url)
  })
})
