import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import CalendarGrid from '@/presentation/components/calendar/calendar-grid.vue'

const MESSAGES = {
  en: {
    'calendar.empty.title': 'No releases this month',
    'calendar.empty.description': 'Try another month.',
  },
  fr: {
    'calendar.empty.title': 'Aucune sortie ce mois-ci',
    'calendar.empty.description': 'Essayez un autre mois.',
  },
}

describe('CalendarGrid', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 3, 1, 12))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const movieA = {
    id: 1,
    title: 'Arrival',
    release_date: '2026-04-01',
    poster_path: '/arrival.jpg',
    backdrop_path: '/arrival-backdrop.jpg',
    vote_average: 8,
    vote_count: 100,
    popularity: 10,
    genre_ids: [18],
    adult: false,
    original_language: 'en',
    video: false,
    original_title: 'Arrival',
    overview: 'Overview',
  }

  const movieB = {
    ...movieA,
    id: 2,
    title: 'Civil War',
    release_date: '2026-04-02',
  }

  function renderCalendarGrid(overrides: Partial<Record<string, unknown>> = {}, locale = 'en') {
    return mount(CalendarGrid, {
      props: {
        year: 2026,
        month: 3,
        movies: [movieA, movieB],
        calendarDays: [new Date(2026, 2, 31), new Date(2026, 3, 1), new Date(2026, 3, 2)],
        moviesByDate: {
          '2026-04-01': [movieA],
          '2026-04-02': [movieB],
        },
        loading: false,
        ...overrides,
      },
      global: {
        plugins: [
          createI18n({
            legacy: false,
            locale,
            fallbackLocale: 'en',
            flatJson: true,
            messages: MESSAGES,
          }),
        ],
        stubs: {
          ReleaseCard: {
            props: ['movie'],
            template: '<div data-testid="release-card">{{ movie.title }}</div>',
          },
          SkeletonLoader: {
            template: '<div data-testid="skeleton-loader"></div>',
          },
          EmptyState: {
            props: ['title', 'description'],
            template: '<div data-testid="empty-state">{{ title }}|{{ description }}<slot /></div>',
          },
        },
      },
    })
  }

  it('renders localized weekday headers', () => {
    const wrapper = renderCalendarGrid({}, 'fr')
    const expectedWeekdays = [0, 1, 2, 3, 4, 5, 6].map((day) =>
      new Intl.DateTimeFormat('fr', { weekday: 'short' }).format(new Date(2026, 0, 4 + day)),
    )

    expectedWeekdays.forEach((weekday) => {
      expect(wrapper.text()).toContain(weekday)
    })
  })

  it('renders loading skeletons for both desktop and mobile fallbacks', () => {
    const wrapper = renderCalendarGrid({
      loading: true,
      movies: [],
      moviesByDate: {},
    })

    expect(wrapper.findAll('[data-testid="skeleton-loader"]')).toHaveLength(125)
  })

  it('renders release cards and applies outside-month and today styling', () => {
    const wrapper = renderCalendarGrid()

    expect(wrapper.findAll('[data-testid="release-card"]')).toHaveLength(4)

    const dayCells = wrapper
      .findAll('div')
      .filter((node) => node.classes().includes('min-h-[120px]'))
    expect(dayCells.some((cell) => cell.classes().includes('opacity-30'))).toBe(true)
    expect(dayCells.some((cell) => cell.classes().includes('ring-teal-500/30'))).toBe(true)
  })

  it('does not render an empty state when no movies are available', () => {
    const wrapper = renderCalendarGrid({
      movies: [],
      moviesByDate: {},
    })

    expect(wrapper.findAll('[data-testid="empty-state"]')).toHaveLength(0)
    expect(wrapper.text()).not.toContain('No releases this month')
  })
})
