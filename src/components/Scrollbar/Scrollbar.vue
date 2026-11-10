<script setup lang="ts">
/**
 * scrollbar — полоса прокрутки списка 4×24 (Figma 6131:9077), служебная часть dropdown-items-list и Filter-item.
 * Дорожка surface/hover (radius/full), бегунок icon/secondary. Занимает высоту родителя (stretch).
 *
 * Figma: вариантов нет. Дополнительно: thumbHeight (px, в Figma 24) и progress (0..1 — положение бегунка).
 */
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    /** Высота бегунка, px. */
    thumbHeight?: number;
    /** Положение бегунка: 0 — сверху, 1 — снизу. */
    progress?: number;
  }>(),
  { thumbHeight: 24, progress: 0 },
);

const thumbStyle = computed(() => ({
  height: `${props.thumbHeight}px`,
  top: `calc((100% - ${props.thumbHeight}px) * ${Math.min(1, Math.max(0, props.progress))})`,
}));
</script>

<template>
  <div class="ds-scrollbar" :style="{ minHeight: `${thumbHeight}px` }" aria-hidden="true">
    <span class="ds-scrollbar__bar" :style="thumbStyle" />
  </div>
</template>

<style scoped>
.ds-scrollbar {
  position: relative;
  flex: none;
  align-self: stretch;
  box-sizing: border-box;
  width: var(--space-4);
  border-radius: var(--radius-full);
  background: var(--surface-hover);
}
.ds-scrollbar__bar {
  position: absolute;
  left: 0;
  width: 100%;
  border-radius: var(--radius-full);
  background: var(--icon-secondary);
}
</style>
