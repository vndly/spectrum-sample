<script setup lang="ts">
import { computed } from 'vue'
import { Search, X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()

/** Whether the clear button should be visible. */
const showClear = computed(() => props.modelValue.length > 0)

/**
 * Handles input changes and emits the new value.
 */
function handleInput(event: Event) {
  const input = event.target as HTMLInputElement
  emit('update:modelValue', input.value)
}

/**
 * Clears the search input.
 */
function handleClear() {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="relative">
    <!-- Search icon -->
    <div
      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
      data-testid="search-icon"
    >
      <Search class="size-5" aria-hidden="true" />
    </div>

    <!-- Search input -->
    <input
      type="search"
      :value="modelValue"
      :placeholder="t('home.search.placeholder')"
      class="w-full rounded-lg bg-surface py-3 pl-10 pr-10 text-white placeholder-slate-400 outline-none ring-accent focus:ring-2"
      @input="handleInput"
    />

    <!-- Clear button -->
    <button
      v-if="showClear"
      type="button"
      :aria-label="t('home.search.clear')"
      class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-slate-400 transition-colors hover:text-white"
      @click="handleClear"
    >
      <X class="size-5" aria-hidden="true" />
    </button>
  </div>
</template>
