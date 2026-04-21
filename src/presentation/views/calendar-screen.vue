<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useCalendar } from '@/application/use-calendar'
import { useUpcomingMovies } from '@/application/use-upcoming-movies'
import CalendarGrid from '@/presentation/components/calendar/calendar-grid.vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const { year, month, nextMonth, previousMonth, goToToday } = useCalendar()
const { movies, calendarDays, moviesByDate, loading, error, retry } = useUpcomingMovies(
  year.value,
  month.value,
)

/**
 * Returns the localized month name for the current view.
 */
function getMonthName(year: number, month: number) {
  const date = new Date(year, month, 1)
  return new Intl.DateTimeFormat(locale.value, { month: 'long' }).format(date)
}
</script>

<template>
  <div class="flex flex-col gap-6 px-2 pb-8 pt-2 md:px-3 md:pb-10">
    <!-- Header with Month/Year and Navigation -->
    <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-white">
          {{ getMonthName(year, month) }}
          <span class="text-slate-500 font-medium">{{ year }}</span>
        </h1>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="flex size-10 items-center justify-center rounded-lg bg-slate-800 text-white transition-colors hover:bg-slate-700"
          :title="t('calendar.nav.previous')"
          @click="previousMonth"
        >
          <ChevronLeft class="size-6" />
        </button>
        <button
          class="flex h-10 px-4 items-center justify-center rounded-lg bg-slate-800 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          @click="goToToday"
        >
          {{ t('calendar.nav.today') }}
        </button>
        <button
          class="flex size-10 items-center justify-center rounded-lg bg-slate-800 text-white transition-colors hover:bg-slate-700"
          :title="t('calendar.nav.next')"
          @click="nextMonth"
        >
          <ChevronRight class="size-6" />
        </button>
      </div>
    </header>

    <!-- Calendar Grid -->
    <main>
      <div v-if="error" class="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
        <p class="text-red-400 mb-4">{{ error.message }}</p>
        <button
          class="rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
          @click="retry"
        >
          {{ t('common.retry') }}
        </button>
      </div>

      <CalendarGrid
        v-else
        :year="year"
        :month="month"
        :movies="movies"
        :calendar-days="calendarDays"
        :movies-by-date="moviesByDate"
        :loading="loading"
      />
    </main>
  </div>
</template>
