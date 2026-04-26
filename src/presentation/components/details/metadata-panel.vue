<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Genre, CrewMember, SpokenLanguage } from '@/domain/shared.schema'

const props = defineProps<{
  releaseDate?: string
  firstAirDate?: string
  runtime?: number | null
  numberOfSeasons?: number
  numberOfEpisodes?: number
  genres: Genre[]
  crew: CrewMember[]
  spokenLanguages: SpokenLanguage[]
  originalLanguage?: string
}>()

const { t } = useI18n()

/** Extracts year from release_date or first_air_date. */
const year = computed(() => {
  const date = props.releaseDate || props.firstAirDate
  if (!date) return null
  return date.substring(0, 4)
})

/** Formats runtime as hours and minutes. */
const formattedRuntime = computed(() => {
  if (!props.runtime) return null
  const hours = Math.floor(props.runtime / 60)
  const minutes = props.runtime % 60
  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
})

/** Returns season/episode count for TV shows. */
const seasonInfo = computed(() => {
  if (props.numberOfSeasons === undefined || props.numberOfEpisodes === undefined) return null
  return `${props.numberOfSeasons} ${t('details.metadata.seasons')} · ${props.numberOfEpisodes} ${t('details.metadata.episodes')}`
})

/** Extracts directors from crew. */
const directors = computed(() => {
  return props.crew.filter((c) => c.job === 'Director')
})

/** Extracts writers from crew. */
const writers = computed(() => {
  return props.crew.filter((c) => c.department === 'Writing')
})

/** Formats spoken languages as comma-separated list. */
const languageList = computed(() => {
  if (props.spokenLanguages.length === 0) return null
  return props.spokenLanguages.map((l) => l.english_name).join(', ')
})

/** Converts ISO 639-1 language code to full language name. */
const originalLanguageName = computed(() => {
  if (!props.originalLanguage) return null
  try {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'language' })
    return displayNames.of(props.originalLanguage) ?? props.originalLanguage.toUpperCase()
  } catch {
    return props.originalLanguage.toUpperCase()
  }
})
</script>

<template>
  <div class="space-y-4" data-testid="metadata-panel">
    <!-- Primary info pills: year, runtime/seasons -->
    <div class="flex flex-wrap items-center gap-2">
      <span
        v-if="year"
        class="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium tracking-wide text-slate-600 dark:bg-surface dark:text-slate-300"
        data-testid="year"
      >
        {{ year }}
      </span>
      <span
        v-if="formattedRuntime"
        class="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium tracking-wide text-slate-600 dark:bg-surface dark:text-slate-300"
        data-testid="runtime"
      >
        {{ formattedRuntime }}
      </span>
      <span
        v-if="seasonInfo"
        class="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium tracking-wide text-slate-600 dark:bg-surface dark:text-slate-300"
        data-testid="season-info"
      >
        {{ seasonInfo }}
      </span>
      <span
        v-if="originalLanguageName"
        class="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium tracking-wide text-slate-600 dark:bg-surface dark:text-slate-300"
        data-testid="original-language"
      >
        {{ originalLanguageName }}
      </span>
    </div>

    <!-- Genre pills -->
    <div v-if="genres.length > 0" class="flex flex-wrap gap-2" data-testid="genres">
      <span
        v-for="genre in genres"
        :key="genre.id"
        class="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
      >
        {{ genre.name }}
      </span>
    </div>

    <!-- Credits grid -->
    <div v-if="directors.length > 0 || writers.length > 0" class="grid gap-3 sm:grid-cols-2">
      <!-- Directors -->
      <div v-if="directors.length > 0" data-testid="directors">
        <p
          class="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500"
        >
          {{
            directors.length === 1
              ? t('details.metadata.director')
              : t('details.metadata.directors')
          }}
        </p>
        <p class="mt-0.5 text-sm font-medium text-slate-700 dark:text-slate-200">
          {{ directors.map((d) => d.name).join(', ') }}
        </p>
      </div>

      <!-- Writers -->
      <div v-if="writers.length > 0" data-testid="writers">
        <p
          class="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500"
        >
          {{ writers.length === 1 ? t('details.metadata.writer') : t('details.metadata.writers') }}
        </p>
        <p class="mt-0.5 text-sm font-medium text-slate-700 dark:text-slate-200">
          {{ writers.map((w) => w.name).join(', ') }}
        </p>
      </div>
    </div>

    <!-- Spoken languages -->
    <div v-if="languageList" data-testid="languages">
      <p
        class="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500"
      >
        {{ t('details.metadata.language') }}
      </p>
      <p class="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
        {{ languageList }}
      </p>
    </div>
  </div>
</template>
