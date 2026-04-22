import { describe, expect, it } from 'vitest'
import { buildImageSrcSet, buildImageUrl } from '@/infrastructure/image.helper'

describe('image helper', () => {
  it('builds a TMDB image URL for a relative path and size', () => {
    expect(buildImageUrl('/poster.jpg', 'w342')).toBe('https://image.tmdb.org/t/p/w342/poster.jpg')
  })

  it('returns null when building an image URL without a path', () => {
    expect(buildImageUrl(null, 'w342')).toBeNull()
  })

  it('builds a responsive srcset from width-based TMDB sizes', () => {
    expect(buildImageSrcSet('/poster.jpg', ['w185', 'w342', 'w500'])).toBe(
      [
        'https://image.tmdb.org/t/p/w185/poster.jpg 185w',
        'https://image.tmdb.org/t/p/w342/poster.jpg 342w',
        'https://image.tmdb.org/t/p/w500/poster.jpg 500w',
      ].join(', '),
    )
  })

  it('omits non-width TMDB sizes from srcset descriptors', () => {
    expect(buildImageSrcSet('/profile.jpg', ['h632', 'original'])).toBeNull()
  })

  it('returns null when building a srcset without a path', () => {
    expect(buildImageSrcSet(null, ['w185', 'w342'])).toBeNull()
  })
})
