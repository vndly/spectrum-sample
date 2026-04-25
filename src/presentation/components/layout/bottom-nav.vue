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
  <nav
    class="hidden inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white shadow-sm max-md:fixed max-md:flex dark:border-white/10 dark:bg-bg-secondary dark:shadow-none"
    aria-label="Mobile navigation"
  >
    <RouterLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-medium transition-colors"
      :class="
        isActiveRoute(item.to)
          ? 'text-accent'
          : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
      "
    >
      <component :is="item.icon" class="size-5" />
      <span>{{ $t(item.labelKey) }}</span>
    </RouterLink>
  </nav>
</template>
