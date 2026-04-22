<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import ModalDialog from '@/presentation/components/common/modal-dialog.vue'
import ToastContainer from '@/presentation/components/common/toast-container.vue'
import BottomNav from '@/presentation/components/layout/bottom-nav.vue'
import SidebarNav from '@/presentation/components/layout/sidebar-nav.vue'

const route = useRoute()
</script>

<template>
  <div
    data-testid="app-shell"
    class="min-h-screen bg-slate-50 text-slate-950 dark:bg-bg-primary dark:text-white"
  >
    <SidebarNav />

    <div data-testid="app-shell-content-column" class="flex min-h-screen flex-col md:pl-56">
      <main
        data-testid="route-content"
        class="z-0 min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-16 md:pb-0"
      >
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <KeepAlive include="HomeScreen">
              <component :is="Component" :key="route.path" />
            </KeepAlive>
          </Transition>
        </RouterView>
      </main>
    </div>

    <BottomNav />
    <ModalDialog />
    <ToastContainer />
  </div>
</template>
