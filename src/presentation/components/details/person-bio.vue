<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  biography: string | null
}>()

const { t } = useI18n()
const expanded = ref(false)

const trimmedBiography = computed(() => props.biography?.trim() || '')
const hasBiography = computed(() => trimmedBiography.value.length > 0)
const canExpand = computed(() => trimmedBiography.value.length > 280)
</script>

<template>
  <section>
    <h2 class="text-lg font-bold text-white">{{ t('person.biography') }}</h2>

    <p
      v-if="hasBiography"
      class="mt-3 max-w-prose px-0 text-sm leading-6 text-slate-300 max-md:px-4"
      :class="{ 'line-clamp-6': canExpand && !expanded }"
      data-testid="person-biography"
    >
      {{ trimmedBiography }}
    </p>
    <p v-else class="mt-3 text-sm text-slate-400">{{ t('person.biographyEmpty') }}</p>

    <button
      v-if="canExpand"
      type="button"
      class="mt-3 min-h-11 cursor-pointer rounded-md text-sm font-medium text-accent transition-colors hover:text-teal-300"
      data-testid="person-bio-toggle"
      @click="expanded = !expanded"
    >
      {{ expanded ? t('person.readLess') : t('person.readMore') }}
    </button>
  </section>
</template>
