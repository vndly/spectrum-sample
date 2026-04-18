/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { useBrowse } from '@/application/use-browse'
import * as providerClient from '@/infrastructure/provider.client'
import type { SearchResponse, SearchResultItem } from '@/domain/search.schema'

// Mock the provider client
vi.mock('@/infrastructure/provider.client', () => ({
  getTrending: vi.fn(),
  getPopularMovies: vi.fn(),
  getPopularShows: vi.fn(),
}))

// Mock useSettings
vi.mock('@/application/use-settings', () => ({
  useSettings: () => ({
    language: { value: 'en' },
  }),
}))

/** Helper component to test the composable. */
const TestComponent = defineComponent({
  setup() {
    return { ...useBrowse() }
  },
  template: '<div></div>',
})

describe('useBrowse', () => {
  const mockTrending: SearchResponse = {
    page: 1,
    results: [
      {
        id: 1,
        title: 'Trending Movie',
        media_type: 'movie',
        backdrop_path: '/backdrop1.jpg',
        poster_path: '/poster1.jpg',
        vote_average: 8.5,
        release_date: '2024-01-01',
        original_title: 'Trending Movie',
        overview: 'Overview',
        genre_ids: [1],
        adult: false,
        original_language: 'en',
        video: false,
        popularity: 100,
        vote_count: 100,
      },
      {
        id: 2,
        name: 'Trending Show',
        media_type: 'tv',
        backdrop_path: '/backdrop2.jpg',
        poster_path: '/poster2.jpg',
        vote_average: 7.5,
        first_air_date: '2024-01-01',
        original_name: 'Trending Show',
        overview: 'Overview',
        genre_ids: [2],
        adult: false,
        original_language: 'en',
        origin_country: ['US'],
        popularity: 100,
        vote_count: 100,
      },
      { id: 3, name: 'Person', media_type: 'person' } as SearchResultItem, // Should be filtered out
    ],
    total_pages: 1,
    total_results: 3,
  }

  const mockMovies: SearchResponse = {
    page: 1,
    results: Array.from({ length: 25 }, (_, i) => ({
      id: i + 10,
      title: `Movie ${i}`,
      media_type: 'movie',
      backdrop_path: '/backdrop.jpg',
      poster_path: '/poster.jpg',
      vote_average: 8.0,
      release_date: '2024-01-01',
      original_title: `Movie ${i}`,
      overview: 'Overview',
      genre_ids: [1],
      adult: false,
      original_language: 'en',
      video: false,
      popularity: 100,
      vote_count: 100,
    })),
    total_pages: 1,
    total_results: 25,
  }

  const mockShows: SearchResponse = {
    page: 1,
    results: Array.from({ length: 25 }, (_, i) => ({
      id: i + 100,
      name: `Show ${i}`,
      media_type: 'tv',
      backdrop_path: '/backdrop.jpg',
      poster_path: '/poster.jpg',
      vote_average: 7.0,
      first_air_date: '2024-01-01',
      original_name: `Show ${i}`,
      overview: 'Overview',
      genre_ids: [2],
      adult: false,
      original_language: 'en',
      origin_country: ['US'],
      popularity: 100,
      vote_count: 100,
    })),
    total_pages: 1,
    total_results: 25,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(providerClient.getTrending).mockResolvedValue(mockTrending)
    vi.mocked(providerClient.getPopularMovies).mockResolvedValue(mockMovies)
    vi.mocked(providerClient.getPopularShows).mockResolvedValue(mockShows)
  })

  it('fetches and filters browse data on mount', async () => {
    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    expect(vm.loading).toBe(true)

    // Wait for all promises to resolve
    await nextTick()
    await nextTick() // Multiple ticks for nested promises/parallel fetch

    expect(vm.loading).toBe(false)
    expect(vm.error).toBeNull()

    // Trending: person should be filtered out
    expect(vm.trending).toHaveLength(2)
    expect(vm.trending[0].title).toBe('Trending Movie')
    expect(vm.trending[1].name).toBe('Trending Show')

    // Popular: should be limited to 20
    expect(vm.popularMovies).toHaveLength(20)
    expect(vm.popularShows).toHaveLength(20)
  })

  it('handles errors during fetching', async () => {
    vi.mocked(providerClient.getTrending).mockRejectedValue(new Error('Network Error'))

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    await nextTick()
    await nextTick()

    expect(vm.loading).toBe(false)
    expect(vm.error).toBeDefined()
    expect(vm.error?.message).toBe('Network Error')
    expect(vm.trending).toHaveLength(0)
  })

  it('normalizes non-Error failures into a default browse error', async () => {
    vi.mocked(providerClient.getTrending).mockRejectedValue('boom')

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    await nextTick()
    await nextTick()

    expect(vm.error?.message).toBe('Failed to load browse data')
  })

  it('retries fetching data', async () => {
    vi.mocked(providerClient.getTrending)
      .mockRejectedValueOnce(new Error('Fail'))
      .mockResolvedValueOnce(mockTrending)

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    await nextTick()
    await nextTick()
    expect(vm.error).toBeDefined()

    // Retry
    vm.retry()
    expect(vm.loading).toBe(true)
    expect(vm.error).toBeNull()

    await nextTick()
    await nextTick()
    expect(vm.loading).toBe(false)
    expect(vm.trending).toHaveLength(2)
  })
})
