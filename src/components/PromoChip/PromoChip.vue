<script setup lang="ts">
/**
 * PromoChip — применённый промокод (Figma 6215:61): код (DS/Special/Special 13 Regular, text/primary) +
 * кнопка удаления (cross-16, icon/secondary, зона 24). Высота 24, обводка 1 px border/input, radius/8.
 *
 * Figma → props: Code → code (или слот). Клик по крестику — событие `remove`.
 */
import Icon from '../Icon/Icon.vue';

withDefaults(defineProps<{ code?: string }>(), { code: 'SMART10' });
defineEmits<{ remove: [event: MouseEvent] }>();
</script>

<template>
  <span class="ds-promo-chip">
    <span class="ds-promo-chip__code"><slot>{{ code }}</slot></span>
    <button class="ds-promo-chip__remove" type="button" aria-label="Видалити промокод" @click="$emit('remove', $event)">
      <Icon name="cross-16" />
    </button>
  </span>
</template>

<style scoped>
.ds-promo-chip {
  display: inline-flex;
  align-items: center;
  height: var(--space-24);
  box-sizing: border-box;
  padding-left: var(--space-8);
  border: var(--stroke-thin) solid var(--border-input);
  border-radius: var(--radius-8);
}
.ds-promo-chip__code {
  font: var(--typo-special-special-13-regular);
  color: var(--text-primary);
  white-space: nowrap;
}
.ds-promo-chip__remove {
  display: inline-flex;
  align-items: center;
  margin: 0;
  padding: var(--space-4);
  border: 0;
  background: none;
  color: var(--icon-secondary);
  cursor: pointer;
  transition: color 0.15s ease;
}
.ds-promo-chip__remove:hover {
  color: var(--icon-strong);
}
.ds-promo-chip__remove:focus-visible {
  outline: none;
}
</style>
