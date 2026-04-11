<script setup lang="ts">
import { Eye, Bookmark, Star, Clock } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import type { KeyMetrics } from '@/domain/stats.logic'
import { formatWatchTime } from '@/domain/stats.logic'

defineProps<{
  /** Key metrics to display */
  metrics: KeyMetrics
}>()

const { t } = useI18n()
</script>

<template>
  <div class="grid grid-cols-2 gap-4 md:grid-cols-4" data-testid="stat-cards">
    <!-- Total Watched -->
    <div
      class="flex flex-col gap-2 rounded-xl bg-surface p-4 transition-colors hover:bg-bg-secondary"
    >
      <div class="flex items-center gap-2 text-slate-400">
        <Eye class="size-4" />
        <span class="text-xs font-medium tracking-wider">{{ t('stats.metrics.watched') }}</span>
      </div>
      <div class="text-2xl font-bold text-white">{{ metrics.totalWatched }}</div>
    </div>

    <!-- Total Watchlist -->
    <div
      class="flex flex-col gap-2 rounded-xl bg-surface p-4 transition-colors hover:bg-bg-secondary"
    >
      <div class="flex items-center gap-2 text-slate-400">
        <Bookmark class="size-4" />
        <span class="text-xs font-medium tracking-wider">{{ t('stats.metrics.watchlist') }}</span>
      </div>
      <div class="text-2xl font-bold text-white">{{ metrics.totalWatchlist }}</div>
    </div>

    <!-- Average Rating -->
    <div
      class="flex flex-col gap-2 rounded-xl bg-surface p-4 transition-colors hover:bg-bg-secondary"
    >
      <div class="flex items-center gap-2 text-slate-400">
        <Star class="size-4" />
        <span class="text-xs font-medium tracking-wider">{{ t('stats.metrics.avgRating') }}</span>
      </div>
      <div class="text-2xl font-bold text-white">{{ metrics.averageRating.toFixed(1) }}</div>
    </div>

    <!-- Total Watch Time -->
    <div
      class="flex flex-col gap-2 rounded-xl bg-surface p-4 transition-colors hover:bg-bg-secondary"
    >
      <div class="flex items-center gap-2 text-slate-400">
        <Clock class="size-4" />
        <span class="text-xs font-medium tracking-wider">{{ t('stats.metrics.totalTime') }}</span>
      </div>
      <div class="text-2xl font-bold text-white">
        {{ formatWatchTime(metrics.totalWatchTimeMinutes) }}
      </div>
    </div>
  </div>
</template>
