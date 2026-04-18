/* eslint-disable vue/one-component-per-file */
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useIntersectionObserver } from '@/presentation/composables/use-intersection-observer'

describe('useIntersectionObserver', () => {
  const observe = vi.fn()
  const unobserve = vi.fn()
  const disconnect = vi.fn()
  let callback: IntersectionObserverCallback

  beforeEach(() => {
    observe.mockReset()
    unobserve.mockReset()
    disconnect.mockReset()

    const IntersectionObserverMock = vi.fn(
      class {
        constructor(cb: IntersectionObserverCallback) {
          callback = cb
        }

        observe = observe
        unobserve = unobserve
        disconnect = disconnect
      },
    )

    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
  })

  it('does not create an observer when no target element exists', () => {
    const TestComponent = defineComponent({
      setup() {
        const target = ref<HTMLElement | null>(null)
        return useIntersectionObserver(target)
      },
      render() {
        return h('div')
      },
    })

    const wrapper = mount(TestComponent)

    wrapper.vm.observe()

    expect(global.IntersectionObserver).not.toHaveBeenCalled()
  })

  it('observes the target and marks it as intersecting once visible', async () => {
    const TestComponent = defineComponent({
      setup() {
        const target = ref<HTMLElement | null>(null)
        return { target, ...useIntersectionObserver(target) }
      },
      render() {
        return h('div', { ref: 'target' })
      },
    })

    const wrapper = mount(TestComponent)

    wrapper.vm.observe()
    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ threshold: 0.1, rootMargin: '200px' }),
    )
    expect(observe).toHaveBeenCalledWith(wrapper.vm.target)

    callback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)

    expect(wrapper.vm.isIntersecting).toBe(true)
    expect(unobserve).toHaveBeenCalledWith(wrapper.vm.target)
    expect(disconnect).toHaveBeenCalled()
  })

  it('updates the state without disconnecting when the target is not intersecting', async () => {
    const TestComponent = defineComponent({
      setup() {
        const target = ref<HTMLElement | null>(null)
        return { target, ...useIntersectionObserver(target) }
      },
      render() {
        return h('div', { ref: 'target' })
      },
    })

    const wrapper = mount(TestComponent)

    wrapper.vm.observe()
    callback([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver)

    expect(wrapper.vm.isIntersecting).toBe(false)
    expect(unobserve).not.toHaveBeenCalled()
  })

  it('disconnects an active observer when unobserve is called', () => {
    const TestComponent = defineComponent({
      setup() {
        const target = ref<HTMLElement | null>(null)
        return { target, ...useIntersectionObserver(target, { threshold: 0.5 }) }
      },
      render() {
        return h('div', { ref: 'target' })
      },
    })

    const wrapper = mount(TestComponent)

    wrapper.vm.observe()
    wrapper.vm.unobserve()

    expect(disconnect).toHaveBeenCalledTimes(1)
  })

  it('safely no-ops when unobserve is called before observe', () => {
    const TestComponent = defineComponent({
      setup() {
        const target = ref<HTMLElement | null>(null)
        return { target, ...useIntersectionObserver(target) }
      },
      render() {
        return h('div', { ref: 'target' })
      },
    })

    const wrapper = mount(TestComponent)
    wrapper.vm.unobserve()

    expect(disconnect).not.toHaveBeenCalled()
  })

  it('disconnects the observer on component unmount', () => {
    const TestComponent = defineComponent({
      setup() {
        const target = ref<HTMLElement | null>(null)
        return { target, ...useIntersectionObserver(target) }
      },
      render() {
        return h('div', { ref: 'target' })
      },
    })

    const wrapper = mount(TestComponent)

    wrapper.vm.observe()
    wrapper.unmount()

    expect(disconnect).toHaveBeenCalled()
  })
})
