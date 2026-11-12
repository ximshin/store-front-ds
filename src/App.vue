<script setup lang="ts">
// App shell: every page (screens index, screens, DS showcase) is a route — see src/router.ts.
// Toasts from the mock layer (src/data/toast.ts) are shown above any screen.
import { RouterView } from 'vue-router';
import Toast from './components/Toast/Toast.vue';
import { toasts, closeToast } from './data/toast';
</script>

<template>
  <!-- key: several routes share one screen component with different props (checkout variants) —
       a fresh instance per route, otherwise Vue reuses it and keeps the previous variant's setup. -->
  <RouterView :key="$route.name" />
  <div class="toasts" aria-live="polite">
    <TransitionGroup name="toast">
      <Toast
        v-for="t in toasts"
        :key="t.id"
        :type="t.type"
        :message="t.message"
        :show-action="false"
        @close="closeToast(t.id)"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toasts {
  position: fixed;
  left: 50%;
  bottom: var(--space-24);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-8);
  width: min(400px, calc(100% - 2 * var(--space-16)));
  transform: translateX(-50%);
  pointer-events: none;
}
.toasts > * {
  pointer-events: auto;
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(var(--space-16));
}
@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active {
    transition: none;
  }
}
</style>
