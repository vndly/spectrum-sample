<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  overview: string | null
}>()

const { t } = useI18n()

/** Whether to show the synopsis. */
const shouldShow = computed(() => props.overview && props.overview.trim().length > 0)
</script>

<template>
  <section v-if="shouldShow" data-testid="synopsis">
    <h2
      class="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500"
    >
      {{ t('details.synopsis.title') }}
    </h2>
    <p
      class="text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base md:leading-relaxed"
    >
      {{ overview }}
    </p>
  </section>
</template>
