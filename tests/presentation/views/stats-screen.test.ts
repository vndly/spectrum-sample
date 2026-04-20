import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import StatsScreen from '@/presentation/views/stats-screen.vue'
import { useStats } from '@/application/use-stats'
import { ref } from 'vue'
import type { LibraryEntry } from '@/domain/library.schema'

// Mock useStats composable
vi.mock('@/application/use-stats', () => ({
  useStats: vi.fn(),
}))

// Mock charting components to avoid canvas issues in jsdom
vi.mock('@/presentation/components/stats/genre-chart.vue', () => ({
  default: { template: '<div data-testid="genre-chart"></div>' },
}))
vi.mock('@/presentation/components/stats/monthly-chart.vue', () => ({
  default: { template: '<div data-testid="monthly-chart"></div>' },
}))

function createTestI18n() {
  return createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    flatJson: true,
    messages: {
      en: {
        'stats.title': 'Your Library Insights',
        'stats.empty.title': 'No watched items yet',
        'stats.empty.description': 'Start marking titles as watched.',
        'stats.metrics.watched': 'Watched',
        'stats.metrics.watchlist': 'Watchlist',
        'stats.metrics.avgRating': 'Avg Rating',
        'stats.metrics.totalTime': 'Total Time',
        'stats.topRated.title': 'Top Rated Titles',
      },
    },
  })
}

describe('StatsScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useStats).mockReturnValue({
      metrics: ref({
        totalWatched: 0,
        totalWatchlist: 0,
        averageRating: 0,
        totalWatchTimeMinutes: 0,
      }),
      genreChartData: ref({ labels: [], datasets: [] }),
      monthlyChartData: ref({ labels: [], datasets: [] }),
      topRatedItems: ref([]),
      genresLoading: ref(false),
      genreDistribution: ref([]),
      monthlyActivity: ref({}),
    } as unknown as ReturnType<typeof useStats>)
  })

  // SU-05
  it('renders empty state when no items are watched', () => {
    const wrapper = mount(StatsScreen, {
      global: {
        plugins: [createTestI18n()],
        stubs: {
          EmptyState: true,
        },
      },
    })

    expect(wrapper.find('[data-testid="stats-screen"]').exists()).toBe(false)
    // The stub for EmptyState should be rendered
    expect(wrapper.html()).toContain('No watched items yet')
  })

  // SU-01, SU-02, SU-03, SU-04
  it('renders all stat components when items exist', () => {
    vi.mocked(useStats).mockReturnValue({
      metrics: ref({
        totalWatched: 5,
        totalWatchlist: 2,
        averageRating: 4.5,
        totalWatchTimeMinutes: 600,
      }),
      genreChartData: ref({
        labels: ['Action'],
        datasets: [{ label: 'Genres', data: [5], backgroundColor: '#14b8a6', borderRadius: 4 }],
      }),
      monthlyChartData: ref({
        labels: ['Jan'],
        datasets: [{ label: 'Monthly', data: [2], backgroundColor: '#14b8a6', borderRadius: 4 }],
      }),
      topRatedItems: ref([
        {
          id: 1,
          title: 'Movie A',
          rating: 5,
          mediaType: 'movie',
          status: 'watched',
          posterPath: null,
          runtime: 120,
          genreIds: [28],
          watchDates: ['2026-01-01'],
          addedAt: '2026-01-01',
          favorite: false,
          tags: [],
          notes: '',
        },
      ] as LibraryEntry[]),
      genresLoading: ref(false),
      genreDistribution: ref([]),
      monthlyActivity: ref({}),
    } as unknown as ReturnType<typeof useStats>)

    const wrapper = mount(StatsScreen, {
      global: {
        plugins: [createTestI18n()],
        stubs: {
          RouterLink: true,
        },
      },
    })

    expect(wrapper.find('[data-testid="stats-screen"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="stat-cards"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="genre-chart"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="monthly-chart"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="top-rated-list"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Your Library Insights')
  })
})
