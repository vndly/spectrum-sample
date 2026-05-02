<script setup lang="ts">
import { computed, watch } from 'vue'
import { AlertCircle } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePerson } from '@/application/use-person'
import { useToast } from '@/presentation/composables/use-toast'
import PersonHero from '@/presentation/components/details/person-hero.vue'
import PersonBio from '@/presentation/components/details/person-bio.vue'
import PersonLinks from '@/presentation/components/details/person-links.vue'
import FilmographyGrid from '@/presentation/components/details/filmography-grid.vue'
import PersonSkeleton from '@/presentation/components/details/person-skeleton.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { addToast } = useToast()

const personId = computed(() => Number(route.params.id))
const { data: person, loading, error, refresh } = usePerson(personId)

type ErrorWithStatus = Error & { status?: unknown }

function getErrorStatus(currentError: Error | null): number | null {
  const status = (currentError as ErrorWithStatus | null)?.status

  return typeof status === 'number' ? status : null
}

const errorStatus = computed(() => getErrorStatus(error.value))
const isNotFound = computed(
  () => errorStatus.value === 404 || (error.value?.message.includes('404') ?? false),
)
const isRateLimited = computed(
  () => errorStatus.value === 429 || (error.value?.message.includes('429') ?? false),
)
const isServerError = computed(() =>
  errorStatus.value
    ? errorStatus.value >= 500 && errorStatus.value < 600
    : /\b5\d{2}\b/.test(error.value?.message ?? ''),
)
const isNetworkError = computed(
  () => error.value?.message.toLowerCase().includes('network') ?? false,
)

function goHome() {
  router.push('/')
}

watch(
  error,
  (currentError) => {
    if (!currentError || isNotFound.value || isRateLimited.value) {
      return
    }

    const message = isServerError.value ? t('person.error.server') : t('person.error.network')

    if (isNetworkError.value || isServerError.value) {
      addToast({
        message,
        type: 'error',
        action: { label: t('person.retry'), handler: refresh },
      })
    }
  },
  { immediate: true },
)
</script>

<template>
  <article class="min-h-screen px-4 py-6 text-white md:px-6 md:py-8">
    <div v-if="loading" aria-live="polite" data-testid="person-loading-region">
      <PersonSkeleton />
    </div>

    <section
      v-else-if="error"
      class="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center"
      role="alert"
    >
      <AlertCircle class="size-12 text-slate-500" aria-hidden="true" />
      <h1 class="text-xl font-bold text-white">
        {{ isNotFound ? t('person.notFound') : t('person.error') }}
      </h1>
      <button
        v-if="isNotFound"
        type="button"
        class="min-h-11 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/80"
        data-testid="person-home-link"
        @click="goHome"
      >
        {{ t('person.backToHome') }}
      </button>
      <button
        v-else
        type="button"
        class="min-h-11 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/80"
        data-testid="person-retry-button"
        @click="refresh"
      >
        {{ t('person.retry') }}
      </button>
    </section>

    <template v-else-if="person">
      <div class="space-y-8">
        <PersonHero
          :name="person.name"
          :known-for-department="person.knownForDepartment"
          :profile-url="person.profileUrl"
          :birth-info="person.birthInfo"
          :death-info="person.deathInfo"
        />

        <div class="grid gap-8 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
          <PersonBio :biography="person.biography" />
          <PersonLinks :links="person.externalLinks" />
        </div>

        <FilmographyGrid :credits="person.filmography" />
      </div>
    </template>
  </article>
</template>
