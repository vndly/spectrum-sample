vi.mock('@/presentation/i18n', () => ({
  default: { global: { t: (key: string) => key } },
}))

vi.mock('@/presentation/views/home-screen.vue', () => ({ default: {} }))
vi.mock('@/presentation/views/calendar-screen.vue', () => ({ default: {} }))
vi.mock('@/presentation/views/library-screen.vue', () => ({ default: {} }))
vi.mock('@/presentation/views/settings-screen.vue', () => ({ default: {} }))

import router from '@/presentation/router'

describe('router', () => {
  // SC-01d-29-01
  describe('history mode', () => {
    it('uses HTML5 history mode without hash fragments', () => {
      // Arrange & Act
      const resolved = router.resolve('/settings')

      // Assert
      expect(resolved.href).toBe('/settings')
      expect(resolved.href).not.toContain('#')
    })
  })

  // SC-01d-02-01, SC-01d-02-02
  describe('route definitions', () => {
    it.each([
      { path: '/', name: 'home' },
      { path: '/calendar', name: 'calendar' },
      { path: '/library', name: 'library' },
      { path: '/settings', name: 'settings' },
    ])('resolves $path to named route "$name"', ({ path, name }) => {
      // Arrange & Act
      const resolved = router.resolve(path)

      // Assert
      expect(resolved.name).toBe(name)
      expect(resolved.path).toBe(path)
    })

    // SC-01d-02-03
    it('redirects unknown paths to /', async () => {
      // Arrange & Act
      await router.push('/nonexistent')

      // Assert
      expect(router.currentRoute.value.name).toBe('home')
      expect(router.currentRoute.value.path).toBe('/')
    })
  })

  // SC-01d-03-01
  describe('lazy loading', () => {
    it('uses lazy-loaded components for all named routes', () => {
      // Arrange — use options.routes to get the original definitions (not resolved components)
      const namedRoutes = router.options.routes.filter((r) => 'name' in r && r.name)

      // Act & Assert
      expect(namedRoutes).toHaveLength(4)
      for (const route of namedRoutes) {
        const component = 'component' in route ? route.component : undefined
        expect(typeof component, `${String(route.name)} component`).toBe('function')
      }
    })
  })

  // Implementation detail — meta.titleKey per route
  describe('route meta', () => {
    it.each([
      { name: 'home', titleKey: 'page.home.title' },
      { name: 'calendar', titleKey: 'page.calendar.title' },
      { name: 'library', titleKey: 'page.library.title' },
      { name: 'settings', titleKey: 'page.settings.title' },
    ])('route "$name" has meta.titleKey "$titleKey"', ({ name, titleKey }) => {
      // Arrange & Act
      const resolved = router.resolve({ name })

      // Assert
      expect(resolved.meta.titleKey).toBe(titleKey)
    })
  })

  // SC-01d-11-01, SC-01d-11-02
  describe('scroll behavior', () => {
    it('returns { top: 0 } on forward navigation', () => {
      // Arrange
      const { scrollBehavior } = router.options
      expect(scrollBehavior).toBeDefined()
      if (!scrollBehavior) return
      const route = router.currentRoute.value

      // Act
      const result = scrollBehavior(route, route, null)

      // Assert
      expect(result).toEqual({ top: 0 })
    })

    it('returns { top: 0 } regardless of savedPosition', () => {
      // Arrange
      const { scrollBehavior } = router.options
      expect(scrollBehavior).toBeDefined()
      if (!scrollBehavior) return
      const route = router.currentRoute.value

      // Act
      const result = scrollBehavior(route, route, { left: 0, top: 500 })

      // Assert
      expect(result).toEqual({ top: 0 })
    })
  })

  // SC-01d-10-01, SC-01d-10-02, SC-01d-10-03
  describe('document title', () => {
    beforeEach(() => {
      document.title = ''
    })

    it('sets document.title using i18n on navigation', async () => {
      // Arrange & Act
      await router.push('/library')

      // Assert — i18n mock returns the key as-is
      expect(document.title).toBe('page.library.title \u2014 app.title')
    })

    it('uses i18n t() function for title', async () => {
      // Arrange & Act
      await router.push('/settings')

      // Assert — mock identity function returns the key, proving i18n is used
      expect(document.title).toContain('page.settings.title')
      expect(document.title).toContain('app.title')
    })

    it('sets home route title correctly', async () => {
      // Arrange & Act
      await router.push('/')

      // Assert
      expect(document.title).toBe('page.home.title \u2014 app.title')
    })
  })
})
