<script setup lang="ts">
import ErrorBoundary from '@/presentation/components/error/error-boundary.vue'
import AppShell from '@/presentation/components/layout/app-shell.vue'
</script>

<template>
  <ErrorBoundary>
    <AppShell />
  </ErrorBoundary>
</template>
