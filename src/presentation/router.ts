import { createRouter, createWebHistory } from 'vue-router'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import i18n from '@/presentation/i18n'

declare module 'vue-router' {
  interface RouteMeta {
    titleKey?: string
  }
}

/**
 * Navigation guard that validates the :id param is numeric.
 * Redirects to home if the ID is not a valid integer string.
 */
function numericIdGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const id = to.params.id
  if (typeof id === 'string' && /^\d+$/.test(id)) {
    next()
  } else {
    next('/')
  }
}

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/home-screen.vue'),
      meta: { titleKey: 'page.home.title' },
    },
    {
      path: '/recommendations',
      name: 'recommendations',
      component: () => import('./views/recommendations-screen.vue'),
      meta: { titleKey: 'page.recommendations.title' },
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('./views/calendar-screen.vue'),
      meta: { titleKey: 'page.calendar.title' },
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('./views/library-screen.vue'),
      meta: { titleKey: 'page.library.title' },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./views/settings-screen.vue'),
      meta: { titleKey: 'page.settings.title' },
    },
    {
      path: '/movie/:id',
      name: 'movie',
      component: () => import('./views/movie-screen.vue'),
      meta: { titleKey: 'page.movie.title' },
      beforeEnter: numericIdGuard,
    },
    {
      path: '/show/:id',
      name: 'show',
      component: () => import('./views/show-screen.vue'),
      meta: { titleKey: 'page.show.title' },
      beforeEnter: numericIdGuard,
    },
    {
      path: '/person/:id',
      name: 'person',
      component: () => import('./views/person-screen.vue'),
      meta: { titleKey: 'page.person.title' },
      beforeEnter: numericIdGuard,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.afterEach(() => {
  const t = i18n.global.t
  document.title = t('app.title')
})

export default router
