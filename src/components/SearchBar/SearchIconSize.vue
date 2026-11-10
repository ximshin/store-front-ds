<script setup lang="ts">
/**
 * search-icon-size — иконка поиска в поле search-bar (Figma 6127:2496), Icon size 20 / 24 / 32.
 * Figma → props: Icon size → iconSize ('20' | '24' | '32'), icon (swap) → prop `icon` (имя иконки) или слот `icon`,
 * Show count → showCount + count (необязательный счётчик рядом с иконкой).
 */
import Icon from '../Icon/Icon.vue';

export type SearchIconPx = '20' | '24' | '32';

withDefaults(
  defineProps<{
    iconSize?: SearchIconPx;
    icon?: string;
    showCount?: boolean;
    count?: number | string;
  }>(),
  { iconSize: '20', icon: 'search-24', showCount: false, count: 0 },
);
</script>

<template>
  <span class="ds-icon-size" :style="{ '--_size': `${iconSize}px` }">
    <span class="ds-icon-size__glyph">
      <slot name="icon"><Icon :name="icon" :size="24" /></slot>
    </span>
    <span v-if="showCount" class="ds-icon-size__count">{{ count }}</span>
  </span>
</template>

<style scoped>
.ds-icon-size {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
}
.ds-icon-size__glyph {
  display: inline-flex;
  width: var(--_size);
  height: var(--_size);
}
/* Icon принимает 16/24/48/64 — масштабируем глиф 24 до нужного размера. */
.ds-icon-size__glyph :deep(.ds-icon) {
  width: 100% !important;
  height: 100% !important;
}
.ds-icon-size__count {
  color: var(--text-secondary);
  font: var(--typo-special-special-12-regular);
}
</style>
