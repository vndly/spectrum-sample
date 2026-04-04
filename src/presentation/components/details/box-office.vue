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
    <h2 class="mb-3 text-lg font-semibold text-white">{{ t('details.boxOffice.title') }}</h2>
    <div class="flex gap-6 text-sm">
      <div v-if="budget > 0" data-testid="budget">
        <span class="text-slate-400">{{ t('details.boxOffice.budget') }}</span>
        <p class="font-medium text-white">{{ formatCurrency(budget) }}</p>
      </div>
      <div v-if="revenue > 0" data-testid="revenue">
        <span class="text-slate-400">{{ t('details.boxOffice.revenue') }}</span>
        <p class="font-medium text-white">{{ formatCurrency(revenue) }}</p>
      </div>
    </div>
  </section>
</template>
