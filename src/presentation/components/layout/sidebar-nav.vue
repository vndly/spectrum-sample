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
  <aside
    class="fixed inset-y-0 left-0 flex w-56 flex-col bg-bg-secondary max-md:hidden"
    aria-label="Desktop sidebar"
  >
    <div class="border-b border-white/10 px-6 py-6">
      <p class="text-lg font-bold text-white">{{ $t('app.title') }}</p>
    </div>

    <nav class="flex flex-1 flex-col gap-2 px-4 py-6" aria-label="Primary navigation">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-r-lg border-l-2 px-4 py-3 transition-colors"
        :class="
          isActiveRoute(item.to)
            ? 'border-accent bg-accent/10 text-white'
            : 'border-transparent text-slate-400 hover:text-white'
        "
      >
        <component :is="item.icon" class="size-5" />
        <span class="text-sm font-medium">{{ $t(item.labelKey) }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>
