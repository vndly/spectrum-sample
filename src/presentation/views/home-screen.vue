<script setup lang="ts">
import { House } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import EmptyState from '@/presentation/components/common/empty-state.vue'

const { t } = useI18n()
</script>

<template>
  <EmptyState
    :icon="House"
    :title="t('common.empty.title')"
    :description="t('common.empty.description')"
  />
</template>
