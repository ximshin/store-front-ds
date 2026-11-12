<script setup lang="ts">
/**
 * TabItem — вкладка (Figma 6245:12657). DS/Special/Special 16 Medium.
 * Default — text/secondary, Active — text/primary + нижняя линия 2 px border/input-active.
 * Отступы: сверху 0, снизу space/12 (высота 36). Горизонтальный — CSS-переменная `--ds-tab-padding-x` (по умолчанию 0, как в Figma).
 *
 * Figma → props: Label → label (или слот), State=Active → active. Default → :hover.
 */
withDefaults(defineProps<{ label?: string; active?: boolean }>(), { label: 'Опис', active: false });
defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
  <button
    class="ds-tab-item"
    :class="{ 'is-active': active }"
    type="button"
    role="tab"
    :aria-selected="active"
    @click="$emit('click', $event)"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<style scoped>
.ds-tab-item {
  display: inline-flex;
  align-items: flex-start;
  flex: none;
  margin: 0;
  /* Figma: top 0, bottom space/12 (height 36). */
  padding: var(--space-0) var(--ds-tab-padding-x, var(--space-0)) var(--space-12);
  border: 0;
  background: none;
  font: var(--typo-special-special-16-medium);
  color: var(--text-secondary);
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.15s ease;
}
.ds-tab-item:hover {
  color: var(--text-primary);
}
.ds-tab-item.is-active {
  color: var(--text-primary);
  /* Figma: bottom stroke inside — does not add height (border would make it 38 instead of 36). */
  box-shadow: inset 0 calc(-1 * var(--stroke-bold)) 0 var(--border-input-active);
}
.ds-tab-item:focus-visible {
  outline: none;
}
</style>
