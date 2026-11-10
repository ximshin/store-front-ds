<script setup lang="ts">
/**
 * dropdown-list — список выбора (сортировка каталога) (Figma 6131:9837), без вариантов.
 * Пункты dropdown-list__item: padding space/8 · space/12, выбранный / hover — surface/hover.
 *
 * Figma: вариантов нет. Props: items (строки), modelValue (выбранная строка), слот по умолчанию — свои пункты.
 */
withDefaults(
  defineProps<{
    items?: string[];
    modelValue?: string;
  }>(),
  { items: () => [] },
);

defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <div class="ds-dropdown-list" role="listbox">
    <slot>
      <div
        v-for="item in items"
        :key="item"
        class="ds-dropdown-list__item"
        :class="{ 'is-selected': item === modelValue }"
        role="option"
        tabindex="0"
        :aria-selected="item === modelValue"
        @click="$emit('update:modelValue', item)"
        @keydown.enter.prevent="$emit('update:modelValue', item)"
      >
        {{ item }}
      </div>
    </slot>
  </div>
</template>

<style scoped>
.ds-dropdown-list {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  padding: var(--space-4) 0;
  border-radius: var(--radius-8);
  background: var(--surface-default);
  /* Figma: Effect «dropdown-menu» (0 8 18 #00000026) — в токенах ближайший --shadow-dropdown */
  box-shadow: var(--shadow-dropdown);
}
.ds-dropdown-list__item {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: var(--space-8) var(--space-12);
  color: var(--text-primary);
  font: var(--typo-form-input-text);
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.ds-dropdown-list__item:hover,
.ds-dropdown-list__item.is-selected {
  background: var(--surface-hover);
}
.ds-dropdown-list__item:focus-visible {
  outline: var(--stroke-bold) solid var(--border-input-active);
  outline-offset: calc(-1 * var(--stroke-bold));
}
</style>
