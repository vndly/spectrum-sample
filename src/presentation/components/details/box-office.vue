<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  budget: number
  revenue: number
}>()

const { t } = useI18n()

/** Whether to show the component. */
const shouldShow = computed(() => props.budget > 0 || props.revenue > 0)

/** Formats a number as currency. */
function formatCurrency(value: number): string {
  return `$${value.toLocaleString()}`
}
</script>

<template>
  <section v-if="shouldShow" data-testid="box-office">
    <h2
      class="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500"
    >
      {{ t('details.boxOffice.title') }}
    </h2>
    <div class="flex gap-6">
      <div v-if="budget > 0" data-testid="budget">
        <p class="text-xs text-slate-500 dark:text-slate-400">
          {{ t('details.boxOffice.budget') }}
        </p>
        <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {{ formatCurrency(budget) }}
        </p>
      </div>
      <div v-if="revenue > 0" data-testid="revenue">
        <p class="text-xs text-slate-500 dark:text-slate-400">
          {{ t('details.boxOffice.revenue') }}
        </p>
        <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {{ formatCurrency(revenue) }}
        </p>
      </div>
    </div>
  </section>
</template>
