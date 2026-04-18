import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useStats } from '@/application/use-stats'
import { useLibraryEntries } from '@/application/use-library-entries'
import { useGenres } from '@/application/use-genres'
import { useSettings } from '@/application/use-settings'
import { ref, type Ref } from 'vue'
import type { LibraryEntry } from '@/domain/library.schema'
import type { Genre } from '@/domain/shared.schema'
import type { LibraryViewItem } from '@/domain/filter.logic'

// Mock dependencies
vi.mock('@/application/use-library-entries', () => ({
  useLibraryEntries: vi.fn(),
}))

vi.mock('@/application/use-genres', () => ({
  useGenres: vi.fn(),
}))

vi.mock('@/application/use-settings', () => ({
  useSettings: vi.fn(),
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: { value: 'en' },
  }),
}))

describe('useStats', () => {
  const mockEntries: LibraryEntry[] = [
    {
      id: 1,
      mediaType: 'movie',
      status: 'watched',
      rating: 5,
      runtime: 120,
      genreIds: [28],
      watchDates: ['2026-01-01'],
      title: 'A',
      addedAt: '2026-01-01',
      posterPath: null,
      lists: [],
      favorite: false,
      tags: [],
      notes: '',
    },
  ]

  const mockGenres: Genre[] = [{ id: 28, name: 'Action' }]

  beforeEach(() => {
    vi.mocked(useLibraryEntries).mockReturnValue({
      allEntries: ref(mockEntries),
      entries: ref([]) as Ref<LibraryViewItem[]>,
      refresh: vi.fn(),
      getEntriesByStatus: vi.fn(),
      getEntriesByList: vi.fn(),
    } as unknown as ReturnType<typeof useLibraryEntries>)

    vi.mocked(useGenres).mockReturnValue({
      genres: ref(mockGenres),
      loading: ref(false),
      error: ref(null),
      fetchGenres: vi.fn(),
    } as unknown as ReturnType<typeof useGenres>)

    vi.mocked(useSettings).mockReturnValue({
      language: ref('en'),
      preferredRegion: ref('US'),
      layoutMode: ref('grid'),
      theme: ref('dark'),
      defaultHomeSection: ref('trending'),
    } as unknown as ReturnType<typeof useSettings>)
  })

  it('computes metrics correctly', () => {
    const { metrics } = useStats()
    expect(metrics.value.totalWatched).toBe(1)
    expect(metrics.value.averageRating).toBe(5)
    expect(metrics.value.totalWatchTimeMinutes).toBe(120)
  })

  it('resolves genre names for distribution', () => {
    const { genreDistribution } = useStats()
    expect(genreDistribution.value[0].name).toBe('Action')
    expect(genreDistribution.value[0].count).toBe(1)
  })

  it('falls back to a generated genre label and exposes top rated items', () => {
    vi.mocked(useGenres).mockReturnValue({
      genres: ref([]),
      loading: ref(false),
      error: ref(null),
      fetchGenres: vi.fn(),
    } as unknown as ReturnType<typeof useGenres>)

    const { genreDistribution, topRatedItems } = useStats()

    expect(genreDistribution.value[0].name).toBe('Genre 28')
    expect(topRatedItems.value[0].title).toBe('A')
  })

  it('sorts genre distribution entries by descending count', () => {
    vi.mocked(useLibraryEntries).mockReturnValue({
      allEntries: ref([
        ...mockEntries,
        {
          id: 2,
          mediaType: 'movie',
          status: 'watched',
          rating: 4,
          runtime: 90,
          genreIds: [35, 35],
          watchDates: ['2026-02-01'],
          title: 'B',
          addedAt: '2026-02-01',
          posterPath: null,
          lists: [],
          favorite: false,
          tags: [],
          notes: '',
        },
      ]),
      entries: ref([]) as Ref<LibraryViewItem[]>,
      refresh: vi.fn(),
      getEntriesByStatus: vi.fn(),
      getEntriesByList: vi.fn(),
    } as unknown as ReturnType<typeof useLibraryEntries>)
    vi.mocked(useGenres).mockReturnValue({
      genres: ref([
        { id: 28, name: 'Action' },
        { id: 35, name: 'Comedy' },
      ]),
      loading: ref(false),
      error: ref(null),
      fetchGenres: vi.fn(),
    } as unknown as ReturnType<typeof useGenres>)

    const { genreDistribution } = useStats()

    expect(genreDistribution.value[0].name).toBe('Comedy')
    expect(genreDistribution.value[1].name).toBe('Action')
  })

  it('formats chart data', () => {
    const { genreChartData, monthlyChartData } = useStats()

    expect(genreChartData.value.labels).toContain('Action')
    expect(genreChartData.value.datasets[0].data).toContain(1)

    expect(monthlyChartData.value.labels.length).toBe(12)
    expect(monthlyChartData.value.datasets[0].data[0]).toBe(1) // Jan 2026
  })

  it('triggers genre fetch when language changes', async () => {
    const fetchGenres = vi.fn()
    const language = ref('en')
    vi.mocked(useGenres).mockReturnValue({
      genres: ref(mockGenres),
      loading: ref(false),
      error: ref(null),
      fetchGenres,
    } as unknown as ReturnType<typeof useGenres>)
    vi.mocked(useSettings).mockReturnValue({
      language,
      preferredRegion: ref('US'),
      layoutMode: ref('grid'),
      theme: ref('dark'),
      defaultHomeSection: ref('trending'),
    } as unknown as ReturnType<typeof useSettings>)

    useStats()

    expect(fetchGenres).toHaveBeenCalledWith('en')

    language.value = 'fr'
    // watchEffect should trigger
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(fetchGenres).toHaveBeenCalledWith('fr')
  })
})
