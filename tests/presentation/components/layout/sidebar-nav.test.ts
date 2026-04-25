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

import SidebarNav from '@/presentation/components/layout/sidebar-nav.vue'

const routes = [
  { path: '/', component: { template: '<div>Home</div>' } },
  { path: '/recommendations', component: { template: '<div>Recommendations</div>' } },
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
  // SC-05-01, SC-25-01, R-01b-02-01 — Renders the desktop sidebar shell with exactly five primary nav links
  it('renders the desktop sidebar structure with exactly five primary nav items in documented order', async () => {
    // Arrange & Act
    const { wrapper } = await renderSidebarNav('/')

    // Assert
    const sidebar = wrapper.get('aside')
    const brandHeader = wrapper.get('aside > div')
    const nav = wrapper.get('nav[aria-label="Primary navigation"]')
    const links = wrapper.findAll('a')

    expect(sidebar.classes()).toContain('fixed')
    expect(sidebar.classes()).toContain('w-56')
    expect(sidebar.classes()).toContain('bg-white')
    expect(sidebar.classes()).toContain('dark:bg-bg-secondary')
    expect(brandHeader.classes()).toContain('py-4')
    expect(brandHeader.classes()).not.toContain('py-6')
    expect(nav.classes()).toContain('pb-6')
    expect(nav.classes()).not.toContain('px-4')
    expect(nav.classes()).not.toContain('py-6')
    expect(wrapper.text()).toContain('Plot Twisted')
    expect(wrapper.text()).toContain('🎬')
    expect(links).toHaveLength(5)

    // R-01b-02-01 — documented order: Home, Recommendations, Calendar, Library, Settings
    const linkTexts = links.map((link) => link.text().replace(/\s+/g, ' ').trim())
    expect(linkTexts[0]).toContain('Home')
    expect(linkTexts[1]).toContain('Recommendations')
    expect(linkTexts[2]).toContain('Calendar')
    expect(linkTexts[3]).toContain('Library')
    expect(linkTexts[4]).toContain('Settings')

    // Stats and detail routes remain absent from primary navigation
    expect(wrapper.text()).not.toContain('Stats')
    expect(wrapper.find('a[href^="/movie/"]').exists()).toBe(false)
    expect(wrapper.find('a[href^="/show/"]').exists()).toBe(false)
  })

  // SC-05-02, R-01b-02-02 — Renders the documented French labels with the mapped icons
  it('renders the documented French labels with the mapped icons', async () => {
    // Arrange & Act
    const { wrapper } = await renderSidebarNav('/', 'fr')

    // Assert
    expect(wrapper.get('a[href="/?reset=1"]').text()).toContain('Accueil')
    expect(wrapper.get('a[href="/recommendations"]').text()).toContain('Recommandations')
    expect(wrapper.get('a[href="/calendar"]').text()).toContain('Calendrier')
    expect(wrapper.get('a[href="/library"]').text()).toContain('Bibliothèque')
    expect(wrapper.get('a[href="/settings"]').text()).toContain('Paramètres')
    expect(wrapper.find('a[href="/?reset=1"] [data-icon="house"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/recommendations"] [data-icon="compass"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/calendar"] [data-icon="calendar-days"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/library"] [data-icon="bookmark"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/settings"] [data-icon="settings"]').exists()).toBe(true)
  })

  // R-01b-02-02 — Recommendations uses translated label in English
  it('renders Recommendations with translated English label and Compass icon', async () => {
    // Arrange & Act
    const { wrapper } = await renderSidebarNav('/', 'en')

    // Assert
    expect(wrapper.get('a[href="/recommendations"]').text()).toContain('Recommendations')
    expect(wrapper.find('a[href="/recommendations"] [data-icon="compass"]').exists()).toBe(true)
  })

  // R-01b-02-03 — Recommendations uses existing active-state styling
  it('highlights Recommendations with teal accent when active', async () => {
    // Arrange & Act
    const { wrapper } = await renderSidebarNav('/recommendations')

    // Assert
    const recommendationsLink = wrapper.get('a[href="/recommendations"]')
    const homeLink = wrapper.get('a[href="/?reset=1"]')

    expect(recommendationsLink.classes()).toContain('border-accent')
    expect(recommendationsLink.classes()).toContain('bg-accent/10')
    expect(recommendationsLink.classes()).toContain('text-slate-950')
    expect(recommendationsLink.classes()).toContain('dark:text-white')
    expect(homeLink.classes()).toContain('text-slate-500')
    expect(homeLink.classes()).toContain('dark:text-slate-400')
    expect(homeLink.classes()).not.toContain('border-accent')
  })

  // SC-07-01, SC-07-02, SC-25-02 — Active route uses teal accent styling and Home is not active on child routes
  it('highlights the active route and keeps Home inactive away from root', async () => {
    // Arrange & Act
    const { wrapper } = await renderSidebarNav('/library')

    // Assert
    const activeLink = wrapper.get('a[href="/library"]')
    const homeLink = wrapper.get('a[href="/?reset=1"]')
    const calendarLink = wrapper.get('a[href="/calendar"]')

    expect(activeLink.classes()).toContain('border-accent')
    expect(activeLink.classes()).toContain('bg-accent/10')
    expect(activeLink.classes()).toContain('text-slate-950')
    expect(activeLink.classes()).toContain('dark:text-white')
    expect(homeLink.classes()).toContain('text-slate-500')
    expect(homeLink.classes()).not.toContain('border-accent')
    expect(homeLink.classes()).not.toContain('bg-accent/10')
    expect(calendarLink.classes()).toContain('text-slate-500')
  })

  // SC-07-04, SC-25-07 — Home uses exact-match positive behavior on the root route
  it('highlights Home only on the root route', async () => {
    // Arrange & Act
    const { wrapper } = await renderSidebarNav('/')

    // Assert
    const homeLink = wrapper.get('a[href="/?reset=1"]')
    const libraryLink = wrapper.get('a[href="/library"]')

    expect(homeLink.classes()).toContain('border-accent')
    expect(homeLink.classes()).toContain('bg-accent/10')
    expect(homeLink.classes()).toContain('text-slate-950')
    expect(homeLink.classes()).toContain('dark:text-white')
    expect(libraryLink.classes()).toContain('text-slate-500')
  })

  // Implementation detail — Inactive links use muted text styling
  it('renders inactive links with muted styling', async () => {
    // Arrange & Act
    const { wrapper } = await renderSidebarNav('/settings')

    // Assert
    expect(wrapper.get('a[href="/?reset=1"]').classes()).toContain('text-slate-500')
    expect(wrapper.get('a[href="/calendar"]').classes()).toContain('text-slate-500')
    expect(wrapper.get('a[href="/library"]').classes()).toContain('text-slate-500')
  })
})
