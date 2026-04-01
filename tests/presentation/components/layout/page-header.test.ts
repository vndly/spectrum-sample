import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import i18n from '@/presentation/i18n'
import PageHeader from '@/presentation/components/layout/page-header.vue'

const routes = [
  {
    path: '/',
    component: { template: '<div>Home</div>' },
    meta: { titleKey: 'page.home.title' },
  },
  {
    path: '/calendar',
    component: { template: '<div>Calendar</div>' },
    meta: { titleKey: 'page.calendar.title' },
  },
  {
    path: '/library',
    component: { template: '<div>Library</div>' },
    meta: { titleKey: 'page.library.title' },
  },
  {
    path: '/settings',
    component: { template: '<div>Settings</div>' },
    meta: { titleKey: 'page.settings.title' },
  },
]

async function renderPageHeader(routePath: string, locale: 'en' | 'es' = 'en') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  i18n.global.locale.value = locale

  await router.push(routePath)
  await router.isReady()

  const wrapper = mount(PageHeader, {
    global: {
      plugins: [router, i18n],
    },
  })

  await flushPromises()

  return { wrapper, router }
}

describe('PageHeader', () => {
  // SC-08-01 — Displays the translated title from route meta.titleKey
  it('renders the translated title for the active route', async () => {
    // Arrange & Act
    const { wrapper } = await renderPageHeader('/calendar')

    // Assert
    expect(wrapper.text()).toContain('Calendar')
  })

  // SC-08-02, SC-25-05 — Updates the displayed title when the route changes
  it('updates the translated title when navigation changes the active route', async () => {
    // Arrange
    const { wrapper, router } = await renderPageHeader('/')
    expect(wrapper.text()).toContain('Home')

    // Act
    await router.push('/settings')
    await flushPromises()

    // Assert
    expect(wrapper.text()).toContain('Settings')
    expect(wrapper.text()).not.toContain('Home')
  })

  // SC-08-03 — Applies sticky positioning classes
  it('applies the documented sticky positioning classes', async () => {
    // Arrange & Act
    const { wrapper } = await renderPageHeader('/calendar')

    // Assert
    const header = wrapper.get('header')
    expect(header.classes()).toContain('sticky')
    expect(header.classes()).toContain('top-0')
    expect(header.classes()).toContain('z-10')
    expect(header.classes()).toContain('bg-bg-primary')
  })

  // SC-08-04, SC-25-06 — Renders translated output in a non-default locale
  it('renders the translated title in a non-default locale', async () => {
    // Arrange & Act
    const { wrapper } = await renderPageHeader('/library', 'es')

    // Assert
    expect(wrapper.text()).toContain('Biblioteca')
  })
})
