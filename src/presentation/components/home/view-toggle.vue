<script setup lang="ts">
import { useSettings } from '@/application/use-settings'
import { LayoutGrid, List } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { layoutMode } = useSettings()
const { t } = useI18n()
</script>

<template>
  <div class="flex overflow-hidden rounded-lg bg-surface">
    <button
      type="button"
      :title="t('home.filters.grid')"
      class="flex size-10 items-center justify-center transition-colors"
      :class="[
        layoutMode === 'grid'
          ? 'bg-accent text-white'
          : 'text-slate-400 hover:text-white hover:bg-surface-hover',
      ]"
      @click="layoutMode = 'grid'"
    >
      <LayoutGrid class="size-5" />
    </button>
    <button
      type="button"
      :title="t('home.filters.list')"
      class="flex size-10 items-center justify-center transition-colors"
      :class="[
        layoutMode === 'list'
          ? 'bg-accent text-white'
          : 'text-slate-400 hover:text-white hover:bg-surface-hover',
      ]"
      @click="layoutMode = 'list'"
    >
      <List class="size-5" />
    </button>
  </div>
</template>
