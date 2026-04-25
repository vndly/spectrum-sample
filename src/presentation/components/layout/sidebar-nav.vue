<script setup lang="ts">
import type { Component } from 'vue'
import { Bookmark, CalendarDays, Compass, House, Settings } from 'lucide-vue-next'
import { useRoute } from 'vue-router'

interface NavItem {
  to: string
  labelKey: string
  icon: Component
}

const route = useRoute()

const navItems: ReadonlyArray<NavItem> = [
  { to: '/?reset=1', labelKey: 'nav.home', icon: House },
  { to: '/recommendations', labelKey: 'nav.recommendations', icon: Compass },
  { to: '/calendar', labelKey: 'nav.calendar', icon: CalendarDays },
  { to: '/library', labelKey: 'nav.library', icon: Bookmark },
  { to: '/settings', labelKey: 'nav.settings', icon: Settings },
]

function isActiveRoute(path: string) {
  const basePath = path.split('?')[0]
  return basePath === '/' ? route.path === '/' : route.path === basePath
}
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 flex w-56 flex-col bg-white shadow-sm max-md:hidden dark:bg-bg-secondary dark:shadow-none"
    aria-label="Desktop sidebar"
  >
    <div class="border-b border-slate-200 px-6 py-4 dark:border-white/10">
      <p
        class="flex items-center gap-3 text-lg font-bold tracking-tight text-slate-950 dark:text-white"
      >
        <span aria-hidden="true" class="text-base leading-none">🎬</span>
        <span>{{ $t('app.title') }}</span>
      </p>
    </div>

    <nav class="flex flex-1 flex-col gap-2 pb-6" aria-label="Primary navigation">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-r-lg border-l-2 px-4 py-3 transition-colors"
        :class="
          isActiveRoute(item.to)
            ? 'border-accent bg-accent/10 text-slate-950 dark:text-white'
            : 'border-transparent text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
        "
      >
        <component :is="item.icon" class="size-5" />
        <span class="text-sm font-medium">{{ $t(item.labelKey) }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>
