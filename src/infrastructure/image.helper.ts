import { IMAGE_BASE_URL } from '@/domain/constants'

/**
 * Builds a full image URL from a TMDB relative path.
 * @param path - Relative image path from TMDB (e.g., '/kqjL17y...jpg')
 * @param size - Image size (e.g., 'w342', 'w500')
 * @returns Full image URL or null if path is null
 */
export function buildImageUrl(path: string | null, size: string): string | null {
  if (!path) {
    return null
  }
  return `${IMAGE_BASE_URL}/${size}${path}`
}

/**
 * Builds a responsive srcset from a TMDB relative path and image sizes.
 * Width descriptors are generated for TMDB sizes in the "w###" format.
 * @param path - Relative image path from TMDB (e.g., '/kqjL17y...jpg')
 * @param sizes - Image sizes (e.g., ['w185', 'w342', 'w500'])
 * @returns Srcset string or null if path is null or no width sizes are provided
 */
export function buildImageSrcSet(path: string | null, sizes: readonly string[]): string | null {
  if (!path) {
    return null
  }

  const entries = sizes.flatMap((size) => {
    const width = size.match(/^w(\d+)$/)?.[1]
    return width ? [`${buildImageUrl(path, size)} ${width}w`] : []
  })

  return entries.length > 0 ? entries.join(', ') : null
}
