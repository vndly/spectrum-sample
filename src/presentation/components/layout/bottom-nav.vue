<script setup lang="ts">
import type { Component } from 'vue'
import { Bookmark, CalendarDays, House, Settings } from 'lucide-vue-next'
import { useRoute } from 'vue-router'

interface NavItem {
  to: string
  labelKey: string
  icon: Component
}

const route = useRoute()

const navItems: ReadonlyArray<NavItem> = [
  { to: '/', labelKey: 'nav.home', icon: House },
  { to: '/calendar', labelKey: 'nav.calendar', icon: CalendarDays },
  { to: '/library', labelKey: 'nav.library', icon: Bookmark },
  { to: '/settings', labelKey: 'nav.settings', icon: Settings },
]

function isActiveRoute(path: string) {
  return path === '/' ? route.path === '/' : route.path === path
}
</script>

<template>
  <nav
    class="hidden inset-x-0 bottom-0 z-10 border-t border-white/10 bg-bg-secondary max-md:fixed max-md:flex"
    aria-label="Mobile navigation"
  >
    <RouterLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-medium transition-colors"
      :class="isActiveRoute(item.to) ? 'text-accent' : 'text-slate-400 hover:text-white'"
    >
      <component :is="item.icon" class="size-5" />
      <span>{{ $t(item.labelKey) }}</span>
    </RouterLink>
  </nav>
</template>
