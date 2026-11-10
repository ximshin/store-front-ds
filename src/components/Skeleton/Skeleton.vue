<script setup lang="ts">
/**
 * Skeleton — заглушка загрузки (Figma 6275:15436). Заливка surface/hover, пульсация opacity.
 * Text — строка 16 (radius/4), Rect — блок (radius/8), Circle — круг (radius/full).
 * Размер по умолчанию как в Figma (Text 200×16, Rect 120×120, Circle 40×40); задаётся props width / height
 * (число — px, строка — любое CSS-значение, например '100%').
 *
 * Figma → props: Shape → shape (text | rect | circle).
 */
import { computed } from 'vue';

export type SkeletonShape = 'text' | 'rect' | 'circle';

const props = withDefaults(
  defineProps<{
    shape?: SkeletonShape;
    width?: number | string;
    height?: number | string;
    /** Отключает пульсацию. */
    static?: boolean;
  }>(),
  { shape: 'text', width: undefined, height: undefined, static: false },
);

const DEFAULTS: Record<SkeletonShape, [number, number]> = { text: [200, 16], rect: [120, 120], circle: [40, 40] };
const css = (v: number | string) => (typeof v === 'number' ? `${v}px` : v);
const style = computed(() => ({
  width: css(props.width ?? DEFAULTS[props.shape][0]),
  height: css(props.height ?? DEFAULTS[props.shape][1]),
}));
</script>

<template>
  <span class="ds-skeleton" :class="[`ds-skeleton--${shape}`, { 'is-static': static }]" :style="style" aria-hidden="true" />
</template>

<style scoped>
.ds-skeleton {
  display: block;
  flex: none;
  max-width: 100%;
  background: var(--surface-hover);
  animation: ds-skeleton-pulse 1.4s ease-in-out infinite;
}
.ds-skeleton.is-static {
  animation: none;
}
.ds-skeleton--text {
  border-radius: var(--radius-4);
}
.ds-skeleton--rect {
  border-radius: var(--radius-8);
}
.ds-skeleton--circle {
  border-radius: var(--radius-full);
}
@keyframes ds-skeleton-pulse {
  50% {
    opacity: 0.5;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ds-skeleton {
    animation: none;
  }
}
</style>
