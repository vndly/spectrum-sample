/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PersonScreen from '@/presentation/views/person-screen.vue'
import { usePerson } from '@/application/use-person'
import { useToast } from '@/presentation/composables/use-toast'
import { useRoute, useRouter } from 'vue-router'

const personData = ref<any>(null)
const loading = ref(false)
const error = ref<Error | null>(null)
const refresh = vi.fn()
const addToast = vi.fn()
const push = vi.fn()
const back = vi.fn()
const routeId = ref('287')

vi.mock('@/application/use-person', () => ({
  usePerson: vi.fn(),
}))

vi.mock('@/presentation/composables/use-toast', () => ({
  useToast: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(),
  RouterLink: {
    props: ['to'],
    template: '<a :href="to"><slot /></a>',
  },
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  flatJson: true,
  messages: {
    en: {
      'person.back': 'Back',
      'person.backToHome': 'Back to Home',
      'person.error': 'Unable to load person details',
      'person.error.network': 'Network error while loading person details.',
      'person.error.server': 'Server error while loading person details.',
      'person.notFound': 'Person not found',
      'person.retry': 'Retry',
    },
  },
})

function renderPersonScreen() {
  return mount(PersonScreen, {
    global: {
      plugins: [i18n],
      stubs: {
        PersonHero: {
          props: ['name', 'knownForDepartment', 'profileUrl'],
          template: '<div data-testid="person-hero">{{ name }}|{{ knownForDepartment }}</div>',
        },
        PersonBio: {
          props: ['biography'],
          template: '<section data-testid="person-bio">{{ biography }}</section>',
        },
        PersonInfo: {
          props: ['birthInfo', 'deathInfo'],
          template: '<section data-testid="person-info">{{ birthInfo }}|{{ deathInfo }}</section>',
        },
        PersonLinks: {
          props: ['links'],
          template: '<section data-testid="person-links">{{ links.length }}</section>',
        },
        FilmographyGrid: {
          props: ['credits'],
          template: '<section data-testid="filmography-grid">{{ credits.length }}</section>',
        },
        PersonSkeleton: {
          template: '<div data-testid="person-skeleton"></div>',
        },
      },
    },
  })
}

describe('PersonScreen', () => {
  beforeEach(() => {
    personData.value = null
    loading.value = false
    error.value = null
    routeId.value = '287'
    refresh.mockReset()
    addToast.mockReset()
    push.mockReset()
    back.mockReset()
    vi.mocked(usePerson).mockReturnValue({ data: personData, loading, error, refresh } as any)
    vi.mocked(useToast).mockReturnValue({ addToast } as any)
    vi.mocked(useRoute).mockReturnValue({ params: { id: routeId.value } } as any)
    vi.mocked(useRouter).mockReturnValue({ push, back } as any)
    Object.defineProperty(window, 'history', {
      configurable: true,
      value: { length: 2 },
    })
  })

  it('renders skeleton with live region while loading', () => {
    // Arrange
    loading.value = true

    // Act
    const wrapper = renderPersonScreen()

    // Assert
    const region = wrapper.get('[data-testid="person-loading-region"]')
    expect(region.attributes('aria-live')).toBe('polite')
    expect(wrapper.find('[data-testid="person-skeleton"]').exists()).toBe(true)
  })

  it('renders person data in semantic article and sections', () => {
    // Arrange
    personData.value = {
      id: 287,
      name: 'Brad Pitt',
      knownForDepartment: 'Acting',
      biography: 'An actor and producer.',
      profileUrl: '/profile.jpg',
      birthInfo: 'December 18, 1963 - Shawnee, Oklahoma, USA',
      deathInfo: null,
      externalLinks: [{ type: 'imdb', url: 'https://www.imdb.com/name/nm0000093' }],
      filmography: [{ id: 550 }],
    }

    // Act
    const wrapper = renderPersonScreen()

    // Assert
    expect(wrapper.find('article').exists()).toBe(true)
    expect(wrapper.text()).toContain('Brad Pitt')
    expect(wrapper.find('[data-testid="person-bio"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="person-info"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="filmography-grid"]').text()).toBe('1')
  })

  it('renders large filmographies without dropping items', () => {
    // Arrange
    personData.value = {
      id: 287,
      name: 'Brad Pitt',
      knownForDepartment: 'Acting',
      biography: null,
      profileUrl: null,
      birthInfo: null,
      deathInfo: null,
      externalLinks: [],
      filmography: Array.from({ length: 120 }, (_, id) => ({ id })),
    }

    // Act
    const wrapper = renderPersonScreen()

    // Assert
    expect(wrapper.find('[data-testid="filmography-grid"]').text()).toBe('120')
  })

  it('shows localized 404 state with Home link and alert semantics', async () => {
    // Arrange
    error.value = new Error('API request failed: 404 Not Found')

    // Act
    const wrapper = renderPersonScreen()

    // Assert
    const alert = wrapper.get('[role="alert"]')
    expect(alert.text()).toContain('Person not found')
    await wrapper.get('[data-testid="person-home-link"]').trigger('click')
    expect(push).toHaveBeenCalledWith('/')
  })

  it('dispatches network error toast with retry action', () => {
    // Arrange
    error.value = new Error('Network error')

    // Act
    renderPersonScreen()

    // Assert
    expect(addToast).toHaveBeenCalledWith({
      message: 'Network error while loading person details.',
      type: 'error',
      action: { label: 'Retry', handler: refresh },
    })
  })

  it('dispatches server error toast with retry action', () => {
    // Arrange
    error.value = new Error('API request failed: 500 Internal Server Error')

    // Act
    renderPersonScreen()

    // Assert
    expect(addToast).toHaveBeenCalledWith({
      message: 'Server error while loading person details.',
      type: 'error',
      action: { label: 'Retry', handler: refresh },
    })
  })

  it('uses route ID and back navigation with direct-entry fallback', async () => {
    // Arrange
    vi.mocked(useRoute).mockReturnValue({
      params: computed(() => ({ id: routeId.value })).value,
    } as any)
    personData.value = {
      id: 287,
      name: 'Brad Pitt',
      knownForDepartment: 'Acting',
      biography: null,
      profileUrl: null,
      birthInfo: null,
      deathInfo: null,
      externalLinks: [],
      filmography: [],
    }

    // Act
    const wrapper = renderPersonScreen()
    await wrapper.get('[data-testid="person-back-button"]').trigger('click')

    // Assert
    const personIdArg = vi.mocked(usePerson).mock.calls.at(-1)?.[0] as { value: number }
    expect(personIdArg.value).toBe(287)
    expect(back).toHaveBeenCalled()

    // Act
    Object.defineProperty(window, 'history', {
      configurable: true,
      value: { length: 1 },
    })
    await wrapper.get('[data-testid="person-back-button"]').trigger('click')

    // Assert
    expect(push).toHaveBeenCalledWith('/')
  })
})
