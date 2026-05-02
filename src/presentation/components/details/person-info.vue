<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  birthInfo: string | null
  deathInfo: string | null
}>()

const { t } = useI18n()
const hasInfo = computed(() => Boolean(props.birthInfo || props.deathInfo))
</script>

<template>
  <section v-if="hasInfo" data-testid="person-info-section">
    <h2 class="sr-only">{{ t('person.info') }}</h2>
    <dl class="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
      <div v-if="birthInfo">
        <dt class="text-xs text-slate-500">{{ t('person.born') }}</dt>
        <dd class="mt-1">{{ birthInfo }}</dd>
      </div>
      <div v-if="deathInfo">
        <dt class="text-xs text-slate-500">{{ t('person.died') }}</dt>
        <dd class="mt-1">{{ deathInfo }}</dd>
      </div>
    </dl>
  </section>
</template>
