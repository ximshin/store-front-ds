<script setup lang="ts">
/**
 * cross-icon-size — иконка очистки в поле search-bar (Figma 6127:2510), Icon size 20 / 24 / 32.
 * Figma → props: Icon size → iconSize ('20' | '24' | '32'), icon (swap) → prop `icon` (имя иконки) или слот `icon`.
 */
import Icon from '../Icon/Icon.vue';

export type CrossIconPx = '20' | '24' | '32';

withDefaults(defineProps<{ iconSize?: CrossIconPx; icon?: string }>(), { iconSize: '20', icon: 'cross-24' });
</script>

<template>
  <span class="ds-icon-size" :style="{ '--_size': `${iconSize}px` }">
    <span class="ds-icon-size__glyph">
      <slot name="icon"><Icon :name="icon" :size="24" /></slot>
    </span>
  </span>
</template>

<style scoped>
.ds-icon-size {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
</style>
