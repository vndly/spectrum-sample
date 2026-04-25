<script setup lang="ts">
defineProps<{
  tabs: Array<{ id: string; label: string }>
  activeTab: string
}>()

defineEmits<{
  'update:activeTab': [id: string]
}>()
</script>

<template>
  <div
    class="flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-transparent dark:bg-surface dark:shadow-none"
  >
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200"
      :class="
        activeTab === tab.id
          ? 'bg-accent text-white shadow-sm'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white'
      "
      @click="$emit('update:activeTab', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
