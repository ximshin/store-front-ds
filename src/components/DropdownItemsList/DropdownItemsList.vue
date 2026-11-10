<script setup lang="ts">
/**
 * dropdown-items-list — выпадающий список фильтра каталога (Figma 6131:9523): строки (слот items) + Scrollbar.
 * Каждая строка — прямой потомок слота: высота 32, padding 0 / space/12 (Checkbox без образца и т.п.).
 *
 * Figma → props: Show scroll-bar? → showScrollBar, items → слот по умолчанию, Property 1=Default — единственное значение (не prop).
 * Дополнительно: scrollProgress — положение бегунка Scrollbar.
 */
import Scrollbar from '../Scrollbar/Scrollbar.vue';

withDefaults(
  defineProps<{
    showScrollBar?: boolean;
    scrollProgress?: number;
  }>(),
  { showScrollBar: true, scrollProgress: 0 },
);
</script>

<template>
  <div class="ds-dropdown-items-list">
    <div class="ds-dropdown-items-list__items"><slot /></div>
    <Scrollbar v-if="showScrollBar" :progress="scrollProgress" />
  </div>
</template>

<style scoped>
.ds-dropdown-items-list {
  display: flex;
  align-items: flex-start;
  gap: var(--space-8);
  box-sizing: border-box;
  width: 100%;
  padding: var(--space-8) var(--space-0);
  border: var(--stroke-thin) solid var(--border-input);
  border-radius: var(--radius-8);
  background: var(--surface-default);
}
.ds-dropdown-items-list__items {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-width: 0;
}
.ds-dropdown-items-list__items > :slotted(*) {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: var(--space-32);
  padding: 0 var(--space-12);
}
</style>
