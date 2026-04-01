<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()
const { t } = useI18n()

const titleKey = computed(() =>
  typeof route.meta.titleKey === 'string' ? route.meta.titleKey : 'app.title',
)
</script>

<template>
  <header class="sticky top-0 z-10 bg-bg-primary px-4 py-4">
    <h1 class="text-xl font-bold text-white">{{ t(titleKey) }}</h1>
  </header>
</template>
