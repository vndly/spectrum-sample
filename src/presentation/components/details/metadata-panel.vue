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

/** Formats genres as comma-separated list. */
const genreList = computed(() => {
  if (props.genres.length === 0) return null
  return props.genres.map((g) => g.name).join(', ')
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
</script>

<template>
  <div class="space-y-3 text-sm" data-testid="metadata-panel">
    <!-- Primary info line: year, runtime/seasons, genres -->
    <div class="flex flex-wrap items-center gap-2 text-slate-300">
      <span v-if="year" data-testid="year">{{ year }}</span>
      <span v-if="year && (formattedRuntime || seasonInfo)">·</span>
      <span v-if="formattedRuntime" data-testid="runtime">{{ formattedRuntime }}</span>
      <span v-if="seasonInfo" data-testid="season-info">{{ seasonInfo }}</span>
      <span v-if="(formattedRuntime || seasonInfo) && genreList">·</span>
      <span v-if="genreList" data-testid="genres">{{ genreList }}</span>
    </div>

    <!-- Directors -->
    <div v-if="directors.length > 0" class="text-slate-400" data-testid="directors">
      <span class="font-medium text-slate-300">
        {{
          directors.length === 1 ? t('details.metadata.director') : t('details.metadata.directors')
        }}:
      </span>
      {{ directors.map((d) => d.name).join(', ') }}
    </div>

    <!-- Writers -->
    <div v-if="writers.length > 0" class="text-slate-400" data-testid="writers">
      <span class="font-medium text-slate-300">
        {{ writers.length === 1 ? t('details.metadata.writer') : t('details.metadata.writers') }}:
      </span>
      {{ writers.map((w) => w.name).join(', ') }}
    </div>

    <!-- Spoken languages -->
    <div v-if="languageList" class="text-slate-400" data-testid="languages">
      ({{ languageList }})
    </div>
  </div>
</template>
