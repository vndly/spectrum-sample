import { createRouter, createWebHistory } from 'vue-router'
import i18n from '@/presentation/i18n'

declare module 'vue-router' {
  interface RouteMeta {
    titleKey?: string
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
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.afterEach((to) => {
  const t = i18n.global.t
  const titleKey = to.meta.titleKey
  document.title = titleKey ? `${t(titleKey)} \u2014 ${t('app.title')}` : t('app.title')
})

export default router
