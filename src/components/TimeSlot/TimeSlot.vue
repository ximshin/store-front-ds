<script setup lang="ts">
/**
 * TimeSlot — интервал доставки курьером (Figma 6226:116). DS/Form/Input text, отступы space/4 × space/8, radius/4.
 * State=Active — обводка 1 px border/input-active (внутренняя: размер не меняется).
 *
 * Figma → props: Label → label, State=Active → active. Клик — событие `click`.
 */
withDefaults(defineProps<{ label?: string; active?: boolean }>(), { label: '10:00–15:00', active: false });
defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
  <button class="ds-time-slot" :class="{ 'is-active': active }" type="button" :aria-pressed="active" @click="$emit('click', $event)">
    {{ label }}
  </button>
</template>

<style scoped>
.ds-time-slot {
  display: inline-flex;
  align-items: flex-start;
  box-sizing: border-box;
  margin: 0;
  padding: var(--space-4) var(--space-8);
  border: 0;
  border-radius: var(--radius-4);
  background: transparent;
  box-shadow: inset 0 0 0 var(--stroke-thin) transparent;
  color: var(--text-primary);
  font: var(--typo-form-input-text);
  white-space: nowrap;
  cursor: pointer;
  transition: box-shadow 0.15s ease;
}
.ds-time-slot:hover {
  box-shadow: inset 0 0 0 var(--stroke-thin) var(--border-input-hover);
}
.ds-time-slot.is-active,
.ds-time-slot.is-active:hover {
  box-shadow: inset 0 0 0 var(--stroke-thin) var(--border-input-active);
}
.ds-time-slot:focus-visible {
  outline: var(--stroke-bold) solid var(--border-input-active);
  outline-offset: 0;
}
</style>
