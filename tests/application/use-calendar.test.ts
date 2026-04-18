/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useCalendar } from '@/application/use-calendar'

const mockRoute = {
  query: {
    year: '2026',
    month: '3', // April
  },
}

const mockPush = vi.fn()

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => ({
    push: mockPush,
  }),
}))

/** Helper component to test the composable. */
const TestComponent = defineComponent({
  setup() {
    return { ...useCalendar() }
  },
  template: '<div></div>',
})

describe('useCalendar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute.query = { year: '2026', month: '3' }
  })

  it('initializes from route query (FR-06-03)', () => {
    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    expect(vm.year).toBe(2026)
    expect(vm.month).toBe(3)
  })

  it('defaults to current month if no query provided (FR-06-03)', () => {
    mockRoute.query = {} as any
    const now = new Date()
    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    expect(vm.year).toBe(now.getFullYear())
    expect(vm.month).toBe(now.getMonth())
  })

  it('reads year and month from array query values', () => {
    mockRoute.query = { year: ['2024'], month: ['5'] } as any

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    expect(vm.year).toBe(2024)
    expect(vm.month).toBe(5)
  })

  it('navigates to next month (FR-06-03)', () => {
    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    vm.nextMonth()

    expect(mockPush).toHaveBeenCalledWith({
      query: { year: '2026', month: '4' },
    })
  })

  it('navigates to previous month (FR-06-03)', () => {
    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    vm.previousMonth()

    expect(mockPush).toHaveBeenCalledWith({
      query: { year: '2026', month: '2' },
    })
  })

  it('handles year rollover on next month', () => {
    mockRoute.query = { year: '2026', month: '11' } // December
    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    vm.nextMonth()

    expect(mockPush).toHaveBeenCalledWith({
      query: { year: '2027', month: '0' },
    })
  })

  it('handles year rollover on previous month', () => {
    mockRoute.query = { year: '2026', month: '0' } // January
    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    vm.previousMonth()

    expect(mockPush).toHaveBeenCalledWith({
      query: { year: '2025', month: '11' },
    })
  })

  it('navigates to the current month and year', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-18T12:00:00.000Z'))

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    vm.goToToday()

    expect(mockPush).toHaveBeenCalledWith({
      query: { year: '2026', month: '3' },
    })

    vi.useRealTimers()
  })
})
