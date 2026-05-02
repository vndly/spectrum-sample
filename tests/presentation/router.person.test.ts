import { describe, expect, it, vi } from 'vitest'

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
vi.mock('@/presentation/views/person-screen.vue', () => ({ default: {} }))

import router from '@/presentation/router'

describe('person route', () => {
  it('resolves /person/500 to the person route', () => {
    // Arrange & Act
    const resolved = router.resolve('/person/500')

    // Assert
    expect(resolved.name).toBe('person')
    expect(resolved.params.id).toBe('500')
  })

  it.each(['/person/abc', '/person/123abc'])('redirects %s to /', async (path) => {
    // Arrange & Act
    await router.push(path)

    // Assert
    expect(router.currentRoute.value.name).toBe('home')
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('has the person route name and title metadata', () => {
    // Arrange & Act
    const resolved = router.resolve({ name: 'person', params: { id: '500' } })

    // Assert
    expect(resolved.name).toBe('person')
    expect(resolved.meta.titleKey).toBe('page.person.title')
  })

  it('uses a lazy-loaded component for the person route', () => {
    // Arrange
    const route = router.options.routes.find((candidate) => candidate.name === 'person')

    // Act & Assert
    expect(route).toBeDefined()
    expect(typeof route?.component).toBe('function')
  })
})
