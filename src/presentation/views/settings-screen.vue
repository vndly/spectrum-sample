<script setup lang="ts">
import { Settings } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import EmptyState from '@/presentation/components/common/empty-state.vue'

const { t } = useI18n()
</script>

<template>
  <EmptyState
    :icon="Settings"
    :title="t('common.empty.title')"
    :description="t('common.empty.description')"
  />
</template>
