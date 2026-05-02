<script setup lang="ts"></script>

<template>
  <div class="space-y-8 motion-reduce:[&_*]:animate-none" data-testid="person-skeleton">
    <div class="flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
      <div class="size-40 rounded-full bg-slate-800 animate-pulse md:size-[200px]" />
      <div class="w-full max-w-prose space-y-3 pt-2">
        <div class="h-8 w-64 max-w-full rounded bg-slate-800 animate-pulse" />
        <div class="h-4 w-32 rounded bg-slate-800 animate-pulse" />
        <div class="mt-6 space-y-2">
          <div class="h-4 w-full rounded bg-slate-800 animate-pulse" />
          <div class="h-4 w-5/6 rounded bg-slate-800 animate-pulse" />
          <div class="h-4 w-3/4 rounded bg-slate-800 animate-pulse" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      <div v-for="index in 12" :key="index" class="space-y-2">
        <div class="aspect-[2/3] rounded-lg bg-slate-800 animate-pulse" />
        <div class="h-4 rounded bg-slate-800 animate-pulse" />
        <div class="h-3 w-1/2 rounded bg-slate-800 animate-pulse" />
      </div>
    </div>
  </div>
</template>
