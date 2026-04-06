import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFilters, _resetFilters } from '@/application/use-filters'
import { useRouter, useRoute } from 'vue-router'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
  useRoute: vi.fn(),
}))

// Mock provider client
vi.mock('@/infrastructure/provider.client', () => ({
  getMovieGenres: vi.fn(() => Promise.resolve({ genres: [{ id: 1, name: 'Action' }] })),
  getTvGenres: vi.fn(() => Promise.resolve({ genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'Comedy' }] })),
}))

// Mock useSettings
vi.mock('@/application/use-settings', () => ({
  useSettings: vi.fn(() => ({
    language: { value: 'en' },
  })),
}))

describe('useFilters', () => {
  let mockRouter: any
  let mockRoute: any

  beforeEach(() => {
    _resetFilters()
    mockRouter = {
      push: vi.fn(),
    }
    mockRoute = {
      query: {},
    }
    ;(useRouter as any).mockReturnValue(mockRouter)
    ;(useRoute as any).mockReturnValue(mockRoute)
  })

  it('should initialize with default filters', () => {
    const TestComponent = defineComponent({
      setup() {
        const { filters } = useFilters()
        return { filters }
      },
      template: '<div></div>',
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.vm.filters.genres).toEqual([])
    expect(wrapper.vm.filters.mediaType).toBe('all')
  })

  it('should restore filters from URL', async () => {
    mockRoute.query = {
      genres: '1,2',
      mediaType: 'movie',
      yearFrom: '2020',
      yearTo: '2022',
    }

    const TestComponent = defineComponent({
      setup() {
        const { filters } = useFilters()
        return { filters }
      },
      template: '<div></div>',
    })
    const wrapper = mount(TestComponent)
    
    // Wait for onMounted
    await nextTick()

    expect(wrapper.vm.filters.genres).toEqual([1, 2])
    expect(wrapper.vm.filters.mediaType).toBe('movie')
    expect(wrapper.vm.filters.yearFrom).toBe(2020)
    expect(wrapper.vm.filters.yearTo).toBe(2022)
  })

  it('should sync filters to URL when changed', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { filters } = useFilters()
        return { filters }
      },
      template: '<div></div>',
    })
    const wrapper = mount(TestComponent)
    await nextTick()

    wrapper.vm.filters.mediaType = 'tv'
    await nextTick()

    expect(mockRouter.push).toHaveBeenCalledWith({
      query: expect.objectContaining({ mediaType: 'tv' }),
    })
  })

  it('should clear all filters', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { filters, clearAll } = useFilters()
        return { filters, clearAll }
      },
      template: '<div></div>',
    })
    const wrapper = mount(TestComponent)
    await nextTick()

    wrapper.vm.filters.mediaType = 'movie'
    wrapper.vm.filters.genres = [1]
    
    wrapper.vm.clearAll()
    
    expect(wrapper.vm.filters.mediaType).toBe('all')
    expect(wrapper.vm.filters.genres).toEqual([])
  })
})
