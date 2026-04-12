import { flushPromises, mount } from '@vue/test-utils'
import i18n from '@/presentation/i18n'
import router from '@/presentation/router'
import App from '@/App.vue'

vi.mock('lucide-vue-next', () => ({
  House: { template: '<svg data-icon="house" />' },
  Compass: { template: '<svg data-icon="compass" />' },
  CalendarDays: { template: '<svg data-icon="calendar-days" />' },
  Bookmark: { template: '<svg data-icon="bookmark" />' },
  Settings: { template: '<svg data-icon="settings" />' },
  X: { template: '<svg data-icon="close" />' },
  Search: { template: '<svg data-icon="search" />' },
  AlertCircle: { template: '<svg data-icon="alert-circle" />' },
  Film: { template: '<svg data-icon="film" />' },
  Star: { template: '<svg data-icon="star" />' },
  ChevronDown: { template: '<svg data-icon="chevron-down" />' },
  LayoutGrid: { template: '<svg data-icon="layout-grid" />' },
  List: { template: '<svg data-icon="list" />' },
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

    expect(shell).toBeDefined()
    expect(wrapper.get('header').text()).toContain('Home')
    // Home screen now renders SearchBar instead of EmptyState placeholder
    expect(wrapper.get('[data-testid="route-content"]').find('input[type="search"]').exists()).toBe(
      true,
    )
  })

  // SC-10-02, R-01b-02-01 — Current scaffolded nav set renders in both shell navs with Recommendations
  it('renders the current five-item scaffolded nav set in both shell navigation surfaces', async () => {
    // Arrange & Act
    const wrapper = await renderApp('/')

    // Assert
    const sidebarLinks = wrapper
      .findAll('aside[aria-label="Desktop sidebar"] a')
      .map((link) => link.text().replace(/\s+/g, ' ').trim())
    const bottomNavLinks = wrapper
      .findAll('nav[aria-label="Mobile navigation"] a')
      .map((link) => link.text().replace(/\s+/g, ' ').trim())

    expect(sidebarLinks).toEqual(['Home', 'Recommendations', 'Calendar', 'Library', 'Settings'])
    expect(bottomNavLinks).toEqual(['Home', 'Recommendations', 'Calendar', 'Library', 'Settings'])
  })
})
