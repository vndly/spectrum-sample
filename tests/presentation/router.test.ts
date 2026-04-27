vi.mock('@/presentation/i18n', () => ({
  default: { global: { t: (key: string) => key } },
}))

vi.mock('@/presentation/views/home-screen.vue', () => ({ default: {} }))
vi.mock('@/presentation/views/calendar-screen.vue', () => ({ default: {} }))
vi.mock('@/presentation/views/library-screen.vue', () => ({ default: {} }))
vi.mock('@/presentation/views/settings-screen.vue', () => ({ default: {} }))
vi.mock('@/presentation/views/recommendations-screen.vue', () => ({ default: {} }))
vi.mock('@/presentation/views/movie-screen.vue', () => ({ default: {} }))
vi.mock('@/presentation/views/show-screen.vue', () => ({ default: {} }))

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

  // SC-01d-02-01, SC-01d-02-02, R-01b-01-01, R-01b-03-01, R-01b-04-01
  describe('route definitions', () => {
    it.each([
      { path: '/', name: 'home' },
      { path: '/recommendations', name: 'recommendations' },
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

    // R-01b-04-01 — detail routes with numeric params
    it.each([
      { path: '/movie/550', name: 'movie' },
      { path: '/show/1396', name: 'show' },
    ])('resolves $path to named route "$name"', ({ path, name }) => {
      // Arrange & Act
      const resolved = router.resolve(path)

      // Assert
      expect(resolved.name).toBe(name)
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

  // SC-01d-03-01, R-01b-01-02
  describe('lazy loading', () => {
    it('uses lazy-loaded components for all named routes', () => {
      // Arrange — use options.routes to get the original definitions (not resolved components)
      const namedRoutes = router.options.routes.filter((r) => 'name' in r && r.name)

      // Act & Assert
      expect(namedRoutes).toHaveLength(7)
      for (const route of namedRoutes) {
        const component = 'component' in route ? route.component : undefined
        expect(typeof component, `${String(route.name)} component`).toBe('function')
      }
    })

    it('triggers the calendar route lazy import on navigation', async () => {
      // Act
      await router.push('/calendar')

      // Assert
      expect(router.currentRoute.value.name).toBe('calendar')
    })
  })

  // Implementation detail — meta.titleKey per route, R-01b-03-02, R-01b-04-03
  describe('route meta', () => {
    it.each([
      { name: 'home', titleKey: 'page.home.title', params: {} },
      { name: 'recommendations', titleKey: 'page.recommendations.title', params: {} },
      { name: 'calendar', titleKey: 'page.calendar.title', params: {} },
      { name: 'library', titleKey: 'page.library.title', params: {} },
      { name: 'settings', titleKey: 'page.settings.title', params: {} },
      { name: 'movie', titleKey: 'page.movie.title', params: { id: '550' } },
      { name: 'show', titleKey: 'page.show.title', params: { id: '1396' } },
    ])('route "$name" has meta.titleKey "$titleKey"', ({ name, titleKey, params }) => {
      // Arrange & Act
      const resolved = router.resolve({ name, params })

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

  describe('document title', () => {
    beforeEach(() => {
      document.title = ''
    })

    it('sets document.title to the app title using i18n on navigation', async () => {
      // Arrange & Act
      await router.push('/library')

      // Assert — i18n mock returns the key as-is
      expect(document.title).toBe('app.title')
    })

    it('uses i18n t() function for title', async () => {
      // Arrange & Act
      await router.push('/settings')

      // Assert — mock identity function returns the key, proving i18n is used
      expect(document.title).toBe('app.title')
    })

    it('keeps the home route title fixed to the app title', async () => {
      // Arrange & Act
      await router.push('/')

      // Assert
      expect(document.title).toBe('app.title')
    })

    it('falls back to app.title when route has no titleKey', async () => {
      // Arrange — add a temporary route with no titleKey meta
      router.addRoute({
        path: '/no-title',
        name: 'no-title',
        component: { template: '<div />' },
      })

      try {
        // Act
        await router.push('/no-title')

        // Assert
        expect(document.title).toBe('app.title')
      } finally {
        router.removeRoute('no-title')
      }
    })

    // R-01b-01-01, R-01b-03-01, R-01b-04-01
    it.each(['/recommendations', '/movie/550', '/show/1396'])(
      'keeps document.title fixed for %s',
      async (path) => {
        // Arrange & Act
        await router.push(path)

        // Assert
        expect(document.title).toBe('app.title')
      },
    )
  })

  // R-01b-05-01 — non-numeric detail IDs redirect to home
  describe('detail ID guards', () => {
    it.each(['/movie/abc', '/show/abc', '/movie/', '/show/', '/movie/123ab', '/show/12.5'])(
      'redirects %s to / because ID is not numeric',
      async (path) => {
        // Arrange & Act
        await router.push(path)

        // Assert
        expect(router.currentRoute.value.name).toBe('home')
        expect(router.currentRoute.value.path).toBe('/')
      },
    )

    it('allows numeric movie ID', async () => {
      // Arrange & Act
      await router.push('/movie/550')

      // Assert
      expect(router.currentRoute.value.name).toBe('movie')
    })

    it('allows numeric show ID', async () => {
      // Arrange & Act
      await router.push('/show/1396')

      // Assert
      expect(router.currentRoute.value.name).toBe('show')
    })
  })
})
