<script setup lang="ts">
import { CalendarDays } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import EmptyState from '@/presentation/components/common/empty-state.vue'

const { t } = useI18n()
</script>

<template>
  <EmptyState
    :icon="CalendarDays"
    :title="t('common.empty.title')"
    :description="t('common.empty.description')"
  />
</template>
