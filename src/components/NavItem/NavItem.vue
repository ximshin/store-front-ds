<script setup lang="ts">
/**
 * NavItem — пункт меню шапки (Figma 6208:17). Паддинг space/8, высота 32.
 * Light — верхний ряд (DS/Form/Button M label, text/primary); Dark — тёмная плашка и подвал
 * (DS/Special/Special 12 Regular, text/primary-white). Show arrow — выпадающий пункт («Ще»).
 *
 * Figma → props: Label → label (или слот), Show arrow? → showArrow, Theme=Light/Dark → theme ('light' | 'dark').
 */
import Icon from '../Icon/Icon.vue';

withDefaults(
  defineProps<{
    label?: string;
    showArrow?: boolean;
    theme?: 'light' | 'dark';
    href?: string;
  }>(),
  { label: 'Жінкам', showArrow: false, theme: 'light', href: '#' },
);
</script>

<template>
  <a class="ds-nav-item" :class="`ds-nav-item--${theme}`" :href="href">
    <span class="ds-nav-item__label"><slot>{{ label }}</slot></span>
    <Icon v-if="showArrow" name="arrow-down-16" />
  </a>
</template>

<style scoped>
.ds-nav-item {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-8);
  border-radius: var(--radius-8);
  color: var(--_fg);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
}
.ds-nav-item--light {
  --_fg: var(--text-primary);
  font: var(--typo-form-button-m-label);
}
.ds-nav-item--dark {
  --_fg: var(--text-primary-white);
  font: var(--typo-special-special-12-regular);
}
</style>
