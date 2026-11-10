<script setup lang="ts">
/**
 * HeaderAction — действие в шапке: иконка + подпись (+ стрелка) (Figma 6209:55). Паддинг space/8 × space/12, radius/8.
 * M — верхний ряд (иконка 24, DS/Form/Button M label, высота 40); S — тёмная плашка (иконка 16,
 * DS/Special/Special 12 Regular, высота 32). Dark — text/primary-white + icon/primary-white (фон рисует контейнер).
 *
 * Figma → props: Label → label, Show label? → showLabel, Show arrow? → showArrow, Icon (swap) → icon / слот `icon`,
 * Size=M/S → size ('m' | 's'), Theme=Light/Dark → theme ('light' | 'dark').
 */
import Icon from '../Icon/Icon.vue';

withDefaults(
  defineProps<{
    label?: string;
    showLabel?: boolean;
    showArrow?: boolean;
    /** Имя иконки со страницы Icons. */
    icon?: string;
    size?: 'm' | 's';
    theme?: 'light' | 'dark';
    nativeType?: 'button' | 'submit' | 'reset';
  }>(),
  { label: 'Вхід', showLabel: true, showArrow: false, icon: 'user-24', size: 'm', theme: 'light', nativeType: 'button' },
);

defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
  <button
    class="ds-header-action"
    :class="[`ds-header-action--${size}`, `ds-header-action--${theme}`]"
    :type="nativeType"
    @click="$emit('click', $event)"
  >
    <span class="ds-header-action__icon">
      <slot name="icon"><Icon :name="icon" :size="size === 'm' ? 24 : 16" /></slot>
    </span>
    <span v-if="showLabel" class="ds-header-action__label"><slot>{{ label }}</slot></span>
    <Icon v-if="showArrow" name="arrow-down-16" />
  </button>
</template>

<style scoped>
.ds-header-action {
  --_fg: var(--text-primary);
  --_icon: var(--icon-strong);

  display: inline-flex;
  flex: none;
  align-items: center;
  gap: var(--space-8);
  margin: 0;
  padding: var(--space-8) var(--space-12);
  border: 0;
  border-radius: var(--radius-8);
  background: transparent;
  color: var(--_fg);
  white-space: nowrap;
  cursor: pointer;
}
.ds-header-action:focus-visible {
  outline: none;
}
.ds-header-action--dark {
  --_fg: var(--text-primary-white);
  --_icon: var(--icon-primary-white);
}
.ds-header-action--m {
  font: var(--typo-form-button-m-label);
}
.ds-header-action--s {
  font: var(--typo-special-special-12-regular);
}
.ds-header-action__icon {
  display: inline-flex;
  color: var(--_icon);
}
</style>
