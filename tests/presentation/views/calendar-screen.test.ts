import { mount } from '@vue/test-utils'
import { CalendarDays } from 'lucide-vue-next'
import { createI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
import EmptyState from '@/presentation/components/common/empty-state.vue'
import CalendarScreen from '@/presentation/views/calendar-screen.vue'

type Locale = 'en' | 'fr'

function createTestI18n(locale: Locale) {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    flatJson: true,
    messages: {
      en: {
        'common.empty.title': 'Nothing here yet',
        'common.empty.description': 'This page is under construction.',
      },
      fr: {
        'common.empty.title': 'Rien ici pour le moment',
        'common.empty.description': 'Cette page est en construction.',
      },
    },
  })
}

function renderCalendarScreen(locale: Locale) {
  return mount(CalendarScreen, {
    global: {
      plugins: [createTestI18n(locale)],
    },
  })
}

describe('CalendarScreen', () => {
  // SC-20-01, SC-26-01
  it('renders the documented placeholder content in English', () => {
    // Arrange
    const wrapper = renderCalendarScreen('en')

    // Assert
    expect(wrapper.findComponent(EmptyState).exists()).toBe(true)
    expect(wrapper.findComponent(CalendarDays).exists()).toBe(true)
    expect(wrapper.get('h2').text()).toBe('Nothing here yet')
    expect(wrapper.get('[data-testid="empty-state-description"]').text()).toBe(
      'This page is under construction.',
    )
  })

  // SC-20-01, SC-26-01
  it('renders the documented placeholder content in French', () => {
    // Arrange
    const wrapper = renderCalendarScreen('fr')

    // Assert
    expect(wrapper.findComponent(EmptyState).exists()).toBe(true)
    expect(wrapper.findComponent(CalendarDays).exists()).toBe(true)
    expect(wrapper.get('h2').text()).toBe('Rien ici pour le moment')
    expect(wrapper.get('[data-testid="empty-state-description"]').text()).toBe(
      'Cette page est en construction.',
    )
  })
})
