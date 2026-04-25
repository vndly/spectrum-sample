import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import i18n from '@/presentation/i18n'

vi.mock('lucide-vue-next', () => ({
  House: { template: '<svg data-icon="house" />' },
  Compass: { template: '<svg data-icon="compass" />' },
  CalendarDays: { template: '<svg data-icon="calendar-days" />' },
  Bookmark: { template: '<svg data-icon="bookmark" />' },
  Settings: { template: '<svg data-icon="settings" />' },
}))

import BottomNav from '@/presentation/components/layout/bottom-nav.vue'

const routes = [
  { path: '/', component: { template: '<div>Home</div>' } },
  { path: '/recommendations', component: { template: '<div>Recommendations</div>' } },
  { path: '/calendar', component: { template: '<div>Calendar</div>' } },
  { path: '/library', component: { template: '<div>Library</div>' } },
  { path: '/settings', component: { template: '<div>Settings</div>' } },
]

async function renderBottomNav(routePath: string, locale: 'en' | 'fr' = 'en') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  i18n.global.locale.value = locale

  await router.push(routePath)
  await router.isReady()

  const wrapper = mount(BottomNav, {
    global: {
      plugins: [router, i18n],
    },
  })

  await flushPromises()

  return { wrapper, router }
}

describe('BottomNav', () => {
  // SC-06-01, SC-25-03, R-01b-02-01 — Renders the mobile bottom nav with exactly five primary nav links
  it('renders the mobile bottom nav with five primary nav items in documented order', async () => {
    // Arrange & Act
    const { wrapper } = await renderBottomNav('/')

    // Assert
    const nav = wrapper.get('nav')
    const links = wrapper.findAll('a')

    expect(nav.classes()).toContain('hidden')
    expect(nav.classes()).toContain('max-md:fixed')
    expect(nav.classes()).toContain('max-md:flex')
    expect(nav.classes()).toContain('bottom-0')
    expect(nav.classes()).toContain('inset-x-0')
    expect(nav.classes()).toContain('z-10')
    expect(links).toHaveLength(5)

    // R-01b-02-01 — documented order: Home, Recommendations, Calendar, Library, Settings
    expect(links.map((link) => link.text().replace(/\s+/g, ' ').trim())).toEqual([
      'Home',
      'Recommendations',
      'Calendar',
      'Library',
      'Settings',
    ])

    // Stats and detail routes remain absent from primary navigation
    expect(wrapper.text()).not.toContain('Stats')
    expect(wrapper.find('a[href^="/movie/"]').exists()).toBe(false)
    expect(wrapper.find('a[href^="/show/"]').exists()).toBe(false)

    // Icons present
    expect(wrapper.find('a[href="/?reset=1"] [data-icon="house"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/recommendations"] [data-icon="compass"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/calendar"] [data-icon="calendar-days"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/library"] [data-icon="bookmark"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/settings"] [data-icon="settings"]').exists()).toBe(true)
  })

  // SC-06-03, SC-25-04 — Each item meets the mobile minimum touch target through explicit sizing classes
  it('applies 44x44 minimum touch target classes to each nav item', async () => {
    // Arrange & Act
    const { wrapper } = await renderBottomNav('/')

    // Assert
    for (const link of wrapper.findAll('a')) {
      expect(link.classes()).toContain('min-h-11')
      expect(link.classes()).toContain('min-w-11')
    }
  })

  // SC-07-03 — Active route item uses the teal accent styling
  it('highlights the active route in the bottom nav', async () => {
    // Arrange & Act
    const { wrapper } = await renderBottomNav('/library')

    // Assert
    const activeLink = wrapper.get('a[href="/library"]')
    const homeLink = wrapper.get('a[href="/?reset=1"]')

    expect(activeLink.classes()).toContain('text-accent')
    expect(homeLink.classes()).toContain('text-slate-500')
    expect(homeLink.classes()).toContain('dark:text-slate-400')
    expect(homeLink.classes()).not.toContain('text-accent')
  })

  // R-01b-02-03 — Recommendations uses existing active-state treatment
  it('highlights Recommendations with teal accent when active', async () => {
    // Arrange & Act
    const { wrapper } = await renderBottomNav('/recommendations')

    // Assert
    const recommendationsLink = wrapper.get('a[href="/recommendations"]')
    const homeLink = wrapper.get('a[href="/?reset=1"]')

    expect(recommendationsLink.classes()).toContain('text-accent')
    expect(homeLink.classes()).toContain('text-slate-500')
    expect(homeLink.classes()).not.toContain('text-accent')
  })

  // SC-07-05, SC-25-08 — Home uses exact-match positive behavior on the root route
  it('highlights Home only on the root route', async () => {
    // Arrange & Act
    const { wrapper } = await renderBottomNav('/')

    // Assert
    const homeLink = wrapper.get('a[href="/?reset=1"]')
    const libraryLink = wrapper.get('a[href="/library"]')

    expect(homeLink.classes()).toContain('text-accent')
    expect(libraryLink.classes()).toContain('text-slate-500')
  })

  // Implementation detail — Inactive items use muted styling
  it('renders inactive items with muted styling', async () => {
    // Arrange & Act
    const { wrapper } = await renderBottomNav('/settings')

    // Assert
    expect(wrapper.get('a[href="/?reset=1"]').classes()).toContain('text-slate-500')
    expect(wrapper.get('a[href="/calendar"]').classes()).toContain('text-slate-500')
    expect(wrapper.get('a[href="/library"]').classes()).toContain('text-slate-500')
  })
})
