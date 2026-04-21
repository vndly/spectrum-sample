<script setup lang="ts">
import { computed } from 'vue'
import { formatDateISO } from '@/domain/calendar.logic'
import type { MovieListItem } from '@/domain/movie.schema'
import ReleaseCard from './release-card.vue'
import SkeletonLoader from '@/presentation/components/common/skeleton-loader.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  year: number
  month: number
  movies: MovieListItem[]
  calendarDays: Date[]
  moviesByDate: Record<string, MovieListItem[]>
  loading: boolean
}>()

const { locale } = useI18n()

/**
 * Localized weekday names (short format) based on the current locale.
 */
const weekdayNames = computed(() => {
  const formatter = new Intl.DateTimeFormat(locale.value, { weekday: 'short' })
  // Use a fixed week (Jan 4-10, 2026 starts on Sunday) to get weekday names
  return [0, 1, 2, 3, 4, 5, 6].map((day) => {
    return formatter.format(new Date(2026, 0, 4 + day))
  })
})

/** Returns true if the date is in the current month being viewed. */
function isCurrentMonth(date: Date) {
  return date.getMonth() === props.month
}

/** Returns true if the date is today. */
function isToday(date: Date) {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Desktop/Tablet Grid (7 columns) -->
    <div class="hidden sm:block">
      <!-- Weekday headers -->
      <div class="grid grid-cols-7 border-b border-slate-700/50 pb-2">
        <div
          v-for="name in weekdayNames"
          :key="name"
          class="text-center text-xs font-bold uppercase tracking-wider text-slate-500"
        >
          {{ name }}
        </div>
      </div>

      <!-- Calendar cells -->
      <div
        class="grid grid-cols-7 gap-px bg-slate-700/50 border border-slate-700/50 rounded-lg overflow-hidden mt-2"
      >
        <template v-if="loading">
          <div v-for="i in 35" :key="i" class="min-h-[120px] bg-slate-900/50 p-2">
            <div class="flex items-center justify-between mb-2">
              <SkeletonLoader width="20px" height="12px" />
            </div>
            <div class="flex flex-col gap-1">
              <SkeletonLoader height="32px" rounded="rounded" />
              <SkeletonLoader height="32px" rounded="rounded" />
            </div>
          </div>
        </template>
        <template v-else>
          <div
            v-for="date in calendarDays"
            :key="date.toISOString()"
            class="min-h-[120px] bg-slate-900/50 p-2 transition-colors"
            :class="[
              !isCurrentMonth(date) ? 'opacity-30' : '',
              isToday(date) ? 'bg-teal-900/10 ring-1 ring-inset ring-teal-500/30' : '',
            ]"
          >
            <div class="flex items-center justify-between mb-2">
              <span
                class="text-xs font-medium"
                :class="isToday(date) ? 'text-teal-400 font-bold' : 'text-slate-400'"
              >
                {{ date.getDate() }}
              </span>
            </div>

            <div class="flex flex-col gap-1">
              <template v-if="moviesByDate[formatDateISO(date)]">
                <ReleaseCard
                  v-for="movie in moviesByDate[formatDateISO(date)]"
                  :key="movie.id"
                  :movie="movie"
                />
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Mobile List Fallback (< 640px) -->
    <div class="flex flex-col gap-8 sm:hidden">
      <template v-if="loading">
        <div v-for="i in 5" :key="i" class="flex flex-col gap-3">
          <div class="flex items-center gap-3 border-b border-slate-700/50 pb-2">
            <SkeletonLoader width="30px" height="30px" />
            <SkeletonLoader width="60px" height="20px" />
          </div>
          <div class="flex flex-col gap-2">
            <SkeletonLoader height="40px" rounded="rounded" />
            <SkeletonLoader height="40px" rounded="rounded" />
          </div>
        </div>
      </template>
      <template v-else-if="movies.length > 0">
        <div
          v-for="date in calendarDays.filter(
            (d) => isCurrentMonth(d) && moviesByDate[formatDateISO(d)],
          )"
          :key="date.toISOString()"
          class="flex flex-col gap-3"
        >
          <div class="flex items-center gap-3 border-b border-slate-700/50 pb-2">
            <span class="text-xl font-bold text-teal-400">{{ date.getDate() }}</span>
            <span class="text-sm font-medium text-slate-400 uppercase tracking-widest">
              {{ weekdayNames[date.getDay()] }}
            </span>
          </div>
          <div class="flex flex-col gap-2">
            <ReleaseCard
              v-for="movie in moviesByDate[formatDateISO(date)]"
              :key="movie.id"
              :movie="movie"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
