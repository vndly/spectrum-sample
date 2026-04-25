<script setup lang="ts">
import { computed, onActivated, onMounted, useTemplateRef } from 'vue'
import { Search, X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    modelValue: string
    autofocus?: boolean
  }>(),
  {
    autofocus: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()
const searchInput = useTemplateRef<HTMLInputElement>('searchInput')

/** Whether the clear button should be visible. */
const showClear = computed(() => props.modelValue.length > 0)

onMounted(() => {
  if (props.autofocus) {
    searchInput.value?.focus()
  }
})

onActivated(() => {
  if (props.autofocus) {
    searchInput.value?.focus()
  }
})

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
      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 dark:text-slate-400"
      data-testid="search-icon"
    >
      <Search class="size-5" aria-hidden="true" />
    </div>

    <!-- Search input -->
    <input
      ref="searchInput"
      type="search"
      :value="modelValue"
      :placeholder="t('home.search.placeholder')"
      class="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-10 text-slate-950 shadow-sm placeholder-slate-500 outline-none ring-accent focus:ring-2 dark:border-transparent dark:bg-surface dark:text-white dark:shadow-none dark:placeholder-slate-400 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
      @input="handleInput"
    />

    <!-- Clear button -->
    <button
      v-if="showClear"
      type="button"
      :aria-label="t('home.search.clear')"
      class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-slate-500 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
      @click="handleClear"
    >
      <X class="size-5" aria-hidden="true" />
    </button>
  </div>
</template>
