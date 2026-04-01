import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import i18n from '@/presentation/i18n'

vi.mock('lucide-vue-next', () => ({
  House: { template: '<svg data-icon="house" />' },
  CalendarDays: { template: '<svg data-icon="calendar-days" />' },
  Bookmark: { template: '<svg data-icon="bookmark" />' },
  Settings: { template: '<svg data-icon="settings" />' },
}))

import SidebarNav from '@/presentation/components/layout/sidebar-nav.vue'

const routes = [
  { path: '/', component: { template: '<div>Home</div>' } },
  { path: '/calendar', component: { template: '<div>Calendar</div>' } },
  { path: '/library', component: { template: '<div>Library</div>' } },
  { path: '/settings', component: { template: '<div>Settings</div>' } },
]

async function renderSidebarNav(routePath: string, locale: 'en' | 'fr' = 'en') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  i18n.global.locale.value = locale

  await router.push(routePath)
  await router.isReady()

  const wrapper = mount(SidebarNav, {
    global: {
      plugins: [router, i18n],
    },
  })

  await flushPromises()

  return { wrapper, router }
}

describe('SidebarNav', () => {
  // SC-05-01, SC-25-01 — Renders the desktop sidebar shell with exactly four scaffolded nav links
  it('renders the desktop sidebar structure with exactly four scaffolded nav items', async () => {
    // Arrange & Act
    const { wrapper } = await renderSidebarNav('/')

    // Assert
    const sidebar = wrapper.get('aside')
    const links = wrapper.findAll('a')

    expect(sidebar.classes()).toContain('fixed')
    expect(sidebar.classes()).toContain('w-56')
    expect(sidebar.classes()).toContain('bg-bg-secondary')
    expect(wrapper.text()).toContain('Plot Twisted')
    expect(links).toHaveLength(4)
    expect(wrapper.get('a[href="/"]').text()).toContain('Home')
    expect(wrapper.get('a[href="/calendar"]').text()).toContain('Calendar')
    expect(wrapper.get('a[href="/library"]').text()).toContain('Library')
    expect(wrapper.get('a[href="/settings"]').text()).toContain('Settings')
    expect(wrapper.text()).not.toContain('Recommendations')
    expect(wrapper.text()).not.toContain('Stats')
    expect(wrapper.find('a[href^="/movie/"]').exists()).toBe(false)
    expect(wrapper.find('a[href^="/show/"]').exists()).toBe(false)
  })

  // SC-05-02 — Renders the documented French labels with the mapped icons
  it('renders the documented French labels with the mapped icons', async () => {
    // Arrange & Act
    const { wrapper } = await renderSidebarNav('/', 'fr')

    // Assert
    expect(wrapper.get('a[href="/"]').text()).toContain('Accueil')
    expect(wrapper.get('a[href="/calendar"]').text()).toContain('Calendrier')
    expect(wrapper.get('a[href="/library"]').text()).toContain('Bibliothèque')
    expect(wrapper.get('a[href="/settings"]').text()).toContain('Paramètres')
    expect(wrapper.get('a[href="/"] [data-icon="house"]').exists()).toBe(true)
    expect(wrapper.get('a[href="/calendar"] [data-icon="calendar-days"]').exists()).toBe(true)
    expect(wrapper.get('a[href="/library"] [data-icon="bookmark"]').exists()).toBe(true)
    expect(wrapper.get('a[href="/settings"] [data-icon="settings"]').exists()).toBe(true)
  })

  // SC-07-01, SC-07-02, SC-25-02 — Active route uses teal accent styling and Home is not active on child routes
  it('highlights the active route and keeps Home inactive away from root', async () => {
    // Arrange & Act
    const { wrapper } = await renderSidebarNav('/library')

    // Assert
    const activeLink = wrapper.get('a[href="/library"]')
    const homeLink = wrapper.get('a[href="/"]')
    const calendarLink = wrapper.get('a[href="/calendar"]')

    expect(activeLink.classes()).toContain('border-accent')
    expect(activeLink.classes()).toContain('bg-accent/10')
    expect(activeLink.classes()).toContain('text-white')
    expect(homeLink.classes()).toContain('text-slate-400')
    expect(homeLink.classes()).not.toContain('border-accent')
    expect(homeLink.classes()).not.toContain('bg-accent/10')
    expect(calendarLink.classes()).toContain('text-slate-400')
  })

  // SC-07-04, SC-25-07 — Home uses exact-match positive behavior on the root route
  it('highlights Home only on the root route', async () => {
    // Arrange & Act
    const { wrapper } = await renderSidebarNav('/')

    // Assert
    const homeLink = wrapper.get('a[href="/"]')
    const libraryLink = wrapper.get('a[href="/library"]')

    expect(homeLink.classes()).toContain('border-accent')
    expect(homeLink.classes()).toContain('bg-accent/10')
    expect(homeLink.classes()).toContain('text-white')
    expect(libraryLink.classes()).toContain('text-slate-400')
  })

  // Implementation detail — Inactive links use muted text styling
  it('renders inactive links with muted styling', async () => {
    // Arrange & Act
    const { wrapper } = await renderSidebarNav('/settings')

    // Assert
    expect(wrapper.get('a[href="/"]').classes()).toContain('text-slate-400')
    expect(wrapper.get('a[href="/calendar"]').classes()).toContain('text-slate-400')
    expect(wrapper.get('a[href="/library"]').classes()).toContain('text-slate-400')
  })
})
