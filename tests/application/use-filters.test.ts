/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFilters, _resetFilters } from '@/application/use-filters'
import { useRouter, useRoute, type Router, type RouteLocationNormalizedLoaded } from 'vue-router'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { createI18n } from 'vue-i18n'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
  useRoute: vi.fn(),
}))

// Mock provider client
vi.mock('@/infrastructure/provider.client', () => ({
  getMovieGenres: vi.fn(() => Promise.resolve({ genres: [{ id: 1, name: 'Action' }] })),
  getTvGenres: vi.fn(() =>
    Promise.resolve({
      genres: [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Comedy' },
      ],
    }),
  ),
}))

// Mock useSettings
vi.mock('@/application/use-settings', () => ({
  useSettings: vi.fn(() => ({
    language: { value: 'en' },
  })),
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: {} },
})

/** Helper component to test the composable. */
const TestComponent = defineComponent({
  setup() {
    return { ...useFilters() }
  },
  template: '<div></div>',
})

describe('useFilters', () => {
  let mockRouter: Partial<Router>
  let mockRoute: Partial<RouteLocationNormalizedLoaded>

  beforeEach(() => {
    _resetFilters()
    mockRouter = {
      push: vi.fn(),
    }
    mockRoute = {
      query: {},
    }
    vi.mocked(useRouter).mockReturnValue(mockRouter as Router)
    vi.mocked(useRoute).mockReturnValue(mockRoute as RouteLocationNormalizedLoaded)
  })

  it('should initialize with default filters', () => {
    const wrapper = mount(TestComponent, {
      global: { plugins: [i18n] },
    })
    const vm = wrapper.vm as any
    expect(vm.filters.genres).toEqual([])
    expect(vm.filters.mediaType).toBe('all')
  })

  it('should restore filters from URL', async () => {
    mockRoute.query = {
      genres: '1,2',
      mediaType: 'movie',
      yearFrom: '2020',
      yearTo: '2022',
    }

    const wrapper = mount(TestComponent, {
      global: { plugins: [i18n] },
    })
    const vm = wrapper.vm as any

    // Wait for onMounted
    await nextTick()

    expect(vm.filters.genres).toEqual([1, 2])
    expect(vm.filters.mediaType).toBe('movie')
    expect(vm.filters.yearFrom).toBe(2020)
    expect(vm.filters.yearTo).toBe(2022)
  })

  it('should sync filters to URL when changed', async () => {
    const wrapper = mount(TestComponent, {
      global: { plugins: [i18n] },
    })
    const vm = wrapper.vm as any
    await nextTick()

    vm.filters.mediaType = 'tv'
    await nextTick()

    expect(mockRouter.push).toHaveBeenCalledWith({
      query: expect.objectContaining({ mediaType: 'tv' }),
    })
  })

  it('should clear all filters', async () => {
    const wrapper = mount(TestComponent, {
      global: { plugins: [i18n] },
    })
    const vm = wrapper.vm as any
    await nextTick()

    vm.filters.mediaType = 'movie'
    vm.filters.genres = [1]

    vm.clearAll()

    expect(vm.filters.mediaType).toBe('all')
    expect(vm.filters.genres).toEqual([])
  })

  it('counts all active filter categories', async () => {
    mockRoute.query = {
      genres: '1',
      mediaType: 'tv',
      yearFrom: '2020',
      yearTo: '2026',
    }

    const wrapper = mount(TestComponent, {
      global: { plugins: [i18n] },
    })
    const vm = wrapper.vm as any

    await nextTick()

    expect(vm.activeFilterCount).toBe(4)
  })

  it('gracefully skips URL syncing when router and route are unavailable', async () => {
    vi.mocked(useRouter).mockReturnValue(undefined as unknown as Router)
    vi.mocked(useRoute).mockReturnValue(undefined as unknown as RouteLocationNormalizedLoaded)

    const wrapper = mount(TestComponent, {
      global: { plugins: [i18n] },
    })
    const vm = wrapper.vm as any

    await nextTick()

    vm.clearAll()
    expect(vm.filters.mediaType).toBe('all')
  })
})
