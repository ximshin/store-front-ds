<script setup lang="ts">
/**
 * CountryItem — пункт списка стран/городов (Figma 6226:139): флаг-эмодзи (DS/Display/S) + название (DS/Paragraph/P1).
 * Отступы space/8 × space/12, radius/4. State=Hover — `:hover` (фон surface/hover).
 *
 * Figma → props: Label → label, Flag → flag. Клик — событие `click`.
 */
withDefaults(defineProps<{ label?: string; flag?: string }>(), { label: 'Україна', flag: '🇺🇦' });
defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
  <button class="ds-country-item" type="button" @click="$emit('click', $event)">
    <span class="ds-country-item__flag">{{ flag }}</span>
    <span class="ds-country-item__label">{{ label }}</span>
  </button>
</template>

<style scoped>
.ds-country-item {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  box-sizing: border-box;
  margin: 0;
  padding: var(--space-8) var(--space-12);
  border: 0;
  border-radius: var(--radius-4);
  background: transparent;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.ds-country-item:hover {
  background: var(--surface-hover);
}
.ds-country-item:focus-visible {
  outline: var(--stroke-bold) solid var(--border-input-active);
  outline-offset: 0;
}
.ds-country-item__flag {
  font: var(--typo-display-s);
}
.ds-country-item__label {
  font: var(--typo-paragraph-p1);
}
</style>
