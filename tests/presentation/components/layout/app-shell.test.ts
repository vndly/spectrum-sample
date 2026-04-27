import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import i18n from '@/presentation/i18n'
import {
  _resetForTesting as resetModalForTesting,
  useModal,
} from '@/presentation/composables/use-modal'
import {
  _resetForTesting as resetToastForTesting,
  useToast,
} from '@/presentation/composables/use-toast'
import AppShell from '@/presentation/components/layout/app-shell.vue'

vi.mock('lucide-vue-next', () => ({
  House: { template: '<svg data-icon="house" />' },
  Compass: { template: '<svg data-icon="compass" />' },
  CalendarDays: { template: '<svg data-icon="calendar-days" />' },
  Bookmark: { template: '<svg data-icon="bookmark" />' },
  Settings: { template: '<svg data-icon="settings" />' },
  X: { template: '<svg data-icon="close" />' },
}))

const appStyles = readFileSync(resolve(process.cwd(), 'src/assets/main.css'), 'utf8')

const routes = [
  {
    path: '/',
    component: {
      name: 'HomeScreen',
      data: () => ({ persistedValue: '' }),
      template:
        '<div><input data-testid="home-state-input" v-model="persistedValue" /><div data-testid="view-home">Home view {{ persistedValue }}</div></div>',
    },
    meta: { titleKey: 'page.home.title' },
  },
  {
    path: '/recommendations',
    component: { template: '<div data-testid="view-recommendations">Recommendations view</div>' },
    meta: { titleKey: 'page.recommendations.title' },
  },
  {
    path: '/calendar',
    component: { template: '<div data-testid="view-calendar">Calendar view</div>' },
    meta: { titleKey: 'page.calendar.title' },
  },
  {
    path: '/library',
    component: { template: '<div data-testid="view-library">Library view</div>' },
    meta: { titleKey: 'page.library.title' },
  },
  {
    path: '/settings',
    component: { template: '<div data-testid="view-settings">Settings view</div>' },
    meta: { titleKey: 'page.settings.title' },
  },
  {
    path: '/movie/:id',
    component: { template: '<div data-testid="view-movie">Movie view</div>' },
    meta: { titleKey: 'page.movie.title' },
  },
  {
    path: '/show/:id',
    component: { template: '<div data-testid="view-show">Show view</div>' },
    meta: { titleKey: 'page.show.title' },
  },
]

async function renderAppShell(routePath = '/') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  i18n.global.locale.value = 'en'

  await router.push(routePath)
  await router.isReady()

  const wrapper = mount(AppShell, {
    attachTo: document.body,
    global: {
      plugins: [router, i18n],
    },
  })

  await flushPromises()

  return { wrapper, router }
}

describe('AppShell', () => {
  beforeEach(() => {
    resetModalForTesting()
    resetToastForTesting()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  // SC-04-01 — Desktop shell offsets routed content from the fixed sidebar
  it('renders a fixed desktop sidebar and offsets the content column', async () => {
    // Arrange & Act
    const { wrapper } = await renderAppShell('/')

    // Assert
    const shell = wrapper.get('[data-testid="app-shell"]')
    const sidebar = wrapper.get('aside[aria-label="Desktop sidebar"]')
    const contentColumn = wrapper.get('[data-testid="app-shell-content-column"]')
    const routeContent = wrapper.get('[data-testid="route-content"]')

    expect(shell.classes()).toContain('min-h-screen')
    expect(sidebar.classes()).toContain('fixed')
    expect(sidebar.classes()).toContain('w-56')
    expect(contentColumn.classes()).toContain('md:pl-56')
    expect(routeContent.classes()).toContain('flex-1')
    expect(routeContent.classes()).toContain('overflow-y-auto')
    expect(routeContent.text()).toContain('Home view')
  })

  // SC-04-02, SC-04-03 — Mobile and desktop shell chrome switch at the documented breakpoint
  it('encodes sidebar and bottom-nav switching with breakpoint classes', async () => {
    // Arrange & Act
    const { wrapper } = await renderAppShell('/')

    // Assert
    const sidebar = wrapper.get('aside[aria-label="Desktop sidebar"]')
    const bottomNav = wrapper.get('nav[aria-label="Mobile navigation"]')

    expect(sidebar.classes()).toContain('max-md:hidden')
    expect(bottomNav.classes()).toContain('hidden')
    expect(bottomNav.classes()).toContain('max-md:fixed')
    expect(bottomNav.classes()).toContain('max-md:flex')
  })

  // SC-04-04 — Content clears the mobile bottom nav
  it('applies bottom-nav clearance to the routed content region', async () => {
    // Arrange & Act
    const { wrapper } = await renderAppShell('/library')

    // Assert
    const routeContent = wrapper.get('[data-testid="route-content"]')

    expect(routeContent.classes()).toContain('pb-16')
    expect(routeContent.classes()).toContain('md:pb-0')
    expect(routeContent.text()).toContain('Library view')
  })

  // SC-09-01 — Route changes use the shared fade contract
  it('uses the shared fade transition contract for routed views', async () => {
    // Arrange
    const { wrapper, router } = await renderAppShell('/')

    // Act
    await router.push('/library')
    await flushPromises()

    // Assert
    const transition = wrapper.findComponent({ name: 'Transition' })

    expect(transition.exists()).toBe(true)
    expect(transition.attributes('name')).toBe('fade')
    expect(transition.attributes('mode')).toBe('out-in')
    expect(appStyles).toMatch(
      /\.fade-enter-active,\s*\.fade-leave-active\s*\{\s*transition:\s*opacity 0\.2s ease-in-out;/,
    )
    expect(appStyles).toMatch(/\.fade-enter-from,\s*\.fade-leave-to\s*\{\s*opacity:\s*0;/)
    expect(wrapper.get('[data-testid="route-content"]').text()).toContain('Library view')
  })

  // SC-09-02 — Reduced motion removes the animated fade
  it('disables the fade animation under prefers-reduced-motion', async () => {
    // Arrange & Act
    const { wrapper } = await renderAppShell('/')

    // Assert
    expect(wrapper.findComponent({ name: 'Transition' }).attributes('name')).toBe('fade')
    expect(appStyles).toMatch(
      /@media\s*\(prefers-reduced-motion: reduce\)\s*\{[\s\S]*\.fade-enter-active,\s*\.fade-leave-active,[\s\S]*transition:\s*none;/,
    )
  })

  it('does not remount the active route when only query params change', async () => {
    // Arrange
    const { wrapper, router } = await renderAppShell('/')
    const initialView = wrapper.get('[data-testid="view-home"]').element

    // Act
    await router.push({ path: '/', query: { yearFrom: '2020' } })
    await flushPromises()

    // Assert
    expect(wrapper.get('[data-testid="view-home"]').element).toBe(initialView)
  })

  it('preserves home state after opening a detail route and going back', async () => {
    // Arrange
    const { wrapper, router } = await renderAppShell('/')
    await wrapper.get('[data-testid="home-state-input"]').setValue('fight')

    // Act
    await router.push('/movie/550')
    await flushPromises()
    router.back()
    await flushPromises()

    // Assert
    expect(wrapper.get<HTMLInputElement>('[data-testid="home-state-input"]').element.value).toBe(
      'fight',
    )
    expect(wrapper.get('[data-testid="view-home"]').text()).toContain('fight')
  })

  // SC-10-03 — Global overlays stack above shell chrome
  it('mounts bottom-nav, modal, and toast layers in the documented stacking order', async () => {
    // Arrange
    useModal().open({ title: 'Confirm action', content: 'Modal body' })
    useToast().addToast({ message: 'Toast message', type: 'success' })

    // Act
    const { wrapper } = await renderAppShell('/')

    // Assert
    const bottomNav = wrapper.get('nav[aria-label="Mobile navigation"]')
    const modalBackdrop = wrapper.get('[data-testid="modal-backdrop"]')
    const toastContainer = wrapper.get('[data-testid="toast-container"]')

    expect(bottomNav.classes()).toContain('z-10')
    expect(modalBackdrop.classes()).toContain('z-40')
    expect(toastContainer.classes()).toContain('z-50')
    expect(wrapper.text()).toContain('Confirm action')
    expect(wrapper.text()).toContain('Toast message')
  })

  // R-01b-07-01 — New placeholder routes render inside the shared shell
  describe('new placeholder routes in shell', () => {
    it.each([
      { path: '/recommendations', testId: 'view-recommendations' },
      { path: '/movie/550', testId: 'view-movie' },
      { path: '/show/1396', testId: 'view-show' },
    ])('renders $path inside the shared AppShell content column', async ({ path, testId }) => {
      // Arrange & Act
      const { wrapper } = await renderAppShell(path)

      // Assert
      const contentColumn = wrapper.get('[data-testid="app-shell-content-column"]')
      const routeContent = wrapper.get('[data-testid="route-content"]')

      expect(contentColumn.classes()).toContain('md:pl-56')
      expect(routeContent.find(`[data-testid="${testId}"]`).exists()).toBe(true)
    })
  })

  // R-01b-07-02 — New placeholder routes reuse shared fade and reduced-motion contract
  it('uses the shared fade transition when navigating to new placeholder routes', async () => {
    // Arrange
    const { wrapper, router } = await renderAppShell('/')

    // Act
    await router.push('/recommendations')
    await flushPromises()

    // Assert
    const transition = wrapper.findComponent({ name: 'Transition' })

    expect(transition.exists()).toBe(true)
    expect(transition.attributes('name')).toBe('fade')
    expect(transition.attributes('mode')).toBe('out-in')
    expect(wrapper.get('[data-testid="route-content"]').text()).toContain('Recommendations view')
  })

  // R-01b-07-03 — New placeholder routes avoid provider and storage side effects
  describe('no side effects on placeholder routes', () => {
    let fetchSpy: ReturnType<typeof vi.spyOn>
    let setItemSpy: ReturnType<typeof vi.spyOn>
    let removeItemSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      fetchSpy = vi.spyOn(global, 'fetch')
      setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
      removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem')
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it.each([
      { path: '/recommendations', testId: 'view-recommendations' },
      { path: '/movie/550', testId: 'view-movie' },
      { path: '/show/1396', testId: 'view-show' },
    ])(
      'navigating to $path triggers zero fetch and zero localStorage writes',
      async ({ path, testId }) => {
        // Arrange
        useModal().open({ title: 'Test modal', content: 'Modal body' })
        useToast().addToast({ message: 'Test toast', type: 'info' })

        // Act
        const { wrapper } = await renderAppShell(path)

        // Assert
        expect(fetchSpy).not.toHaveBeenCalled()
        expect(setItemSpy).not.toHaveBeenCalled()
        expect(removeItemSpy).not.toHaveBeenCalled()
        expect(wrapper.find(`[data-testid="${testId}"]`).exists()).toBe(true)
        expect(wrapper.find('[data-testid="modal-backdrop"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="toast-container"]').exists()).toBe(true)
      },
    )
  })
})
