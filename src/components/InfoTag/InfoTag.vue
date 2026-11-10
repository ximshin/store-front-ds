<script setup lang="ts">
/**
 * InfoTag — информационный тег товара (Figma 6213:10): иконка 16 (icon/strong) + DS/Special/Special 12 Regular,
 * фон surface/hover, radius/4.
 *
 * Figma → props: Label → label (или слот), Icon (swap) → icon (имя иконки) или слот `icon`.
 */
import Icon from '../Icon/Icon.vue';

withDefaults(defineProps<{ label?: string; icon?: string }>(), { label: 'Електронний товар', icon: 'file-16' });
</script>

<template>
  <span class="ds-info-tag">
    <span class="ds-info-tag__icon"><slot name="icon"><Icon :name="icon" /></slot></span>
    <span class="ds-info-tag__label"><slot>{{ label }}</slot></span>
  </span>
</template>

<style scoped>
.ds-info-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-8) var(--space-4) var(--space-4);
  border-radius: var(--radius-4);
  background: var(--surface-hover);
}
.ds-info-tag__icon {
  display: inline-flex;
  color: var(--icon-strong);
}
.ds-info-tag__label {
  font: var(--typo-special-special-12-regular);
  color: var(--text-primary);
  white-space: nowrap;
}
</style>
