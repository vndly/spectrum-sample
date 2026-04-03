import { flushPromises, mount } from '@vue/test-utils'
import i18n from '@/presentation/i18n'
import router from '@/presentation/router'
import App from '@/App.vue'

vi.mock('lucide-vue-next', () => ({
  House: { template: '<svg data-icon="house" />' },
  CalendarDays: { template: '<svg data-icon="calendar-days" />' },
  Bookmark: { template: '<svg data-icon="bookmark" />' },
  Settings: { template: '<svg data-icon="settings" />' },
  X: { template: '<svg data-icon="close" />' },
}))

vi.mock('@/presentation/components/error/error-boundary.vue', () => ({
  default: {
    name: 'ErrorBoundary',
    template: '<div data-testid="error-boundary"><slot /></div>',
  },
}))

async function renderApp(routePath = '/') {
  i18n.global.locale.value = 'en'

  await router.push(routePath)
  await router.isReady()

  const wrapper = mount(App, {
    attachTo: document.body,
    global: {
      plugins: [router, i18n],
    },
  })

  await flushPromises()

  return wrapper
}

describe('App', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  // SC-10-01 — Routed view renders inside the shared shell
  it('renders AppShell inside ErrorBoundary and keeps routed content inside the shell', async () => {
    // Arrange & Act
    const wrapper = await renderApp('/')

    // Assert
    const boundary = wrapper.get('[data-testid="error-boundary"]')
    const shell = boundary.get('[data-testid="app-shell"]')

    expect(shell.exists()).toBe(true)
    expect(wrapper.get('header').text()).toContain('Home')
    expect(wrapper.get('[data-testid="route-content"]').text()).toContain('Nothing here yet')
    expect(wrapper.get('[data-testid="route-content"]').text()).toContain(
      'This page is under construction.',
    )
  })

  // SC-10-02 — Current scaffolded nav set renders in both shell navs
  it('renders the current four-item scaffolded nav set in both shell navigation surfaces', async () => {
    // Arrange & Act
    const wrapper = await renderApp('/')

    // Assert
    const sidebarLinks = wrapper
      .findAll('aside[aria-label="Desktop sidebar"] a')
      .map((link) => link.text().replace(/\s+/g, ' ').trim())
    const bottomNavLinks = wrapper
      .findAll('nav[aria-label="Mobile navigation"] a')
      .map((link) => link.text().replace(/\s+/g, ' ').trim())

    expect(sidebarLinks).toEqual(['Home', 'Calendar', 'Library', 'Settings'])
    expect(bottomNavLinks).toEqual(['Home', 'Calendar', 'Library', 'Settings'])
    expect(wrapper.text()).not.toContain('Recommendations')
  })
})
