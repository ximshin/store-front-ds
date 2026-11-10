<script setup lang="ts">
/**
 * SkeletonProductCard — заглушка карточки товара (Figma 6275:15451): фото (Rect) + 4 строки Skeleton.
 * Default — 300 (отступы 16, gap 16, строки по центру, фото 268), Compact — 183 (мобайл, gap 12, фото 183, строки слева).
 *
 * Figma → props: State → state (default | compact).
 */
import Skeleton from '../Skeleton/Skeleton.vue';

export type SkeletonProductCardState = 'default' | 'compact';

withDefaults(defineProps<{ state?: SkeletonProductCardState; static?: boolean }>(), { state: 'default', static: false });
</script>

<template>
  <div class="ds-skeleton-card" :class="`ds-skeleton-card--${state}`">
    <Skeleton shape="rect" width="100%" :height="state === 'compact' ? 183 : 268" :static="static" />
    <div class="ds-skeleton-card__info">
      <Skeleton :width="state === 'compact' ? 73 : 107" :height="12" :static="static" />
      <Skeleton :width="state === 'compact' ? 165 : 241" :height="16" :static="static" />
      <Skeleton :width="state === 'compact' ? 128 : 188" :height="16" :static="static" />
      <Skeleton :width="state === 'compact' ? 82 : 121" :height="20" :static="static" />
    </div>
  </div>
</template>

<style scoped>
.ds-skeleton-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;
  width: 100%;
}
.ds-skeleton-card--default {
  max-width: 300px;
  gap: var(--space-16);
  padding: var(--space-16);
}
.ds-skeleton-card--compact {
  max-width: 183px;
  gap: var(--space-12);
}
.ds-skeleton-card__info {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  overflow: clip;
}
.ds-skeleton-card--default .ds-skeleton-card__info {
  align-items: center;
}
.ds-skeleton-card--compact .ds-skeleton-card__info {
  align-items: flex-start;
}
</style>
