<script setup lang="ts">
import { ref, computed } from 'vue'
import { Star } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const hoveredValue = ref<number | null>(null)
const focusedIndex = ref(0)

/** The value to display (hover preview or actual value). */
const displayValue = computed(() => hoveredValue.value ?? props.modelValue)

/** Handles star click - toggles off if clicking the same value. */
function handleClick(value: number) {
  if (props.modelValue === value) {
    emit('update:modelValue', 0)
  } else {
    emit('update:modelValue', value)
  }
}

/** Handles keyboard navigation. */
function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      event.preventDefault()
      focusedIndex.value = Math.min(focusedIndex.value + 1, 4)
      break
    case 'ArrowLeft':
    case 'ArrowDown':
      event.preventDefault()
      focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      handleClick(focusedIndex.value + 1)
      break
  }
}
</script>

<template>
  <div
    class="flex gap-1"
    role="slider"
    :aria-valuenow="modelValue"
    :aria-valuemin="0"
    :aria-valuemax="5"
    aria-label="Rating"
    tabindex="0"
    data-testid="rating-stars"
    @keydown="handleKeydown"
  >
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      class="p-1 transition-transform hover:scale-110 focus:outline-none"
      :class="[
        star <= displayValue ? 'text-accent' : 'text-slate-500',
        focusedIndex === star - 1 ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : '',
      ]"
      :aria-label="`Rate ${star} out of 5`"
      :data-testid="`star-${star}`"
      @click="handleClick(star)"
      @mouseenter="hoveredValue = star"
      @mouseleave="hoveredValue = null"
      @focus="focusedIndex = star - 1"
    >
      <Star
        class="size-6 md:size-7"
        :class="star <= displayValue ? 'fill-current' : ''"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
