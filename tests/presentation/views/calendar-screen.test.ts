/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import CalendarScreen from '@/presentation/views/calendar-screen.vue'

const year = ref(2026)
const month = ref(3)
const nextMonth = vi.fn()
const previousMonth = vi.fn()
const goToToday = vi.fn()
const movies = ref<any[]>([])
const calendarDays = ref<Date[]>([])
const moviesByDate = ref<Record<string, any[]>>({})
const loading = ref(false)
const error = ref<Error | null>(null)
const retry = vi.fn()

vi.mock('@/application/use-calendar', () => ({
  useCalendar: () => ({
    year,
    month,
    nextMonth,
    previousMonth,
    goToToday,
  }),
}))

vi.mock('@/application/use-upcoming-movies', () => ({
  useUpcomingMovies: () => ({
    movies,
    calendarDays,
    moviesByDate,
    loading,
    error,
    retry,
  }),
}))

function createTestI18n(locale: 'en' | 'fr') {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    flatJson: true,
    messages: {
      en: {
        'calendar.nav.today': 'Today',
        'calendar.nav.previous': 'Previous Month',
        'calendar.nav.next': 'Next Month',
        'common.retry': 'Retry',
      },
      fr: {
        'calendar.nav.today': "Aujourd'hui",
        'calendar.nav.previous': 'Mois précédent',
        'calendar.nav.next': 'Mois suivant',
        'common.retry': 'Réessayer',
      },
    },
  })
}

function renderCalendarScreen(locale: 'en' | 'fr' = 'en') {
  return mount(CalendarScreen, {
    global: {
      plugins: [createTestI18n(locale)],
      stubs: {
        CalendarGrid: {
          name: 'CalendarGrid',
          props: ['year', 'month', 'movies', 'calendarDays', 'moviesByDate', 'loading'],
          template:
            '<div data-testid="calendar-grid">{{ year }}-{{ month }}-{{ movies.length }}-{{ loading }}</div>',
        },
      },
    },
  })
}

describe('CalendarScreen', () => {
  beforeEach(() => {
    year.value = 2026
    month.value = 3
    movies.value = []
    calendarDays.value = [new Date(2026, 2, 31), new Date(2026, 3, 1)]
    moviesByDate.value = {}
    loading.value = false
    error.value = null
    nextMonth.mockReset()
    previousMonth.mockReset()
    goToToday.mockReset()
    retry.mockReset()
  })

  it('renders the localized month header and passes props into CalendarGrid', () => {
    const wrapper = renderCalendarScreen('en')

    expect(wrapper.get('h1').text()).toContain('April')
    expect(wrapper.get('h1').text()).toContain('2026')
    expect(wrapper.get('[data-testid="calendar-grid"]').text()).toBe('2026-3-0-false')
  })

  it('renders the header in French and triggers the navigation actions', async () => {
    const wrapper = renderCalendarScreen('fr')
    const buttons = wrapper.findAll('button')

    expect(wrapper.get('h1').text()).toContain('avril')

    await buttons[0].trigger('click')
    await buttons[1].trigger('click')
    await buttons[2].trigger('click')

    expect(previousMonth).toHaveBeenCalled()
    expect(goToToday).toHaveBeenCalled()
    expect(nextMonth).toHaveBeenCalled()
  })

  it('renders the error state and retries when requested', async () => {
    error.value = new Error('Network error')

    const wrapper = renderCalendarScreen()

    expect(wrapper.text()).toContain('Network error')
    expect(wrapper.find('[data-testid="calendar-grid"]').exists()).toBe(false)

    await wrapper
      .findAll('button')
      .find((button) => button.text() === 'Retry')
      ?.trigger('click')
    expect(retry).toHaveBeenCalled()
  })
})
