<script setup lang="ts">
/**
 * SelectRichOption — пункт списка Select Size=rich (Figma: dd-list 28:20522 в Checkout-v2 — строки input-main Rich).
 * Две строки: название (+ логотип службы 16, слот `logo`) и вторичная строка (цена / срок, text/secondary; без неё — строка 40);
 * справа tick-stroke у выбранного (тонкая галочка, DS Icons 6496:868). Строка 64, отступы как у поля Rich, между строками — разделитель border/input.
 *
 * Props: title, sub, checked, disabled. Слоты: icon — слева (16, на уровне названия), logo — справа от названия (16); оба декоративные.
 */
import Icon from '../Icon/Icon.vue';

withDefaults(
  defineProps<{
    title?: string;
    sub?: string;
    checked?: boolean;
    disabled?: boolean;
  }>(),
  {
    title: 'Нова Пошта',
    sub: '60 грн',
    checked: false,
    disabled: false,
  },
);

const emit = defineEmits<{ click: [event: MouseEvent] }>();

function onClick(e: MouseEvent) {
  emit('click', e);
}
</script>

<template>
  <button
    type="button"
    class="ds-rich-option"
    :class="{ 'is-checked': checked, 'is-single': !sub }"
    role="option"
    :aria-selected="checked"
    :disabled="disabled"
    @click="onClick"
  >
    <span v-if="$slots.icon" class="ds-rich-option__icon" aria-hidden="true"><slot name="icon" /></span>
    <span class="ds-rich-option__text">
      <span class="ds-rich-option__title">
        {{ title }}
        <span v-if="$slots.logo" class="ds-rich-option__logo" aria-hidden="true"><slot name="logo" /></span>
      </span>
      <span v-if="sub" class="ds-rich-option__sub">{{ sub }}</span>
    </span>
    <span class="ds-rich-option__tick" aria-hidden="true"><Icon v-if="checked" name="tick-stroke" /></span>
  </button>
</template>

<style scoped>
.ds-rich-option {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  box-sizing: border-box;
  width: 100%;
  min-height: calc(2 * var(--space-32));
  margin: 0;
  padding: calc(var(--space-12) + var(--space-2)) var(--space-12);
  border: 0;
  border-bottom: var(--stroke-thin) solid var(--border-input);
  background: var(--surface-default);
  color: var(--text-primary);
  font: var(--typo-form-input-text);
  text-align: left;
  cursor: pointer;
}
/* Без второй строки — строка 40, как поле L (список городов в том же стиле, что доставка и оплата). */
.ds-rich-option.is-single {
  min-height: var(--space-40);
  padding-top: var(--space-12);
  padding-bottom: var(--space-12);
}
.ds-rich-option:last-child {
  border-bottom: 0;
}
.ds-rich-option:hover:not(:disabled) {
  background: var(--surface-hover);
}
.ds-rich-option:focus-visible {
  outline: var(--stroke-thin) solid var(--border-input-active);
  outline-offset: calc(-1 * var(--stroke-thin));
}
.ds-rich-option:disabled {
  color: var(--text-disabled);
  cursor: default;
}
.ds-rich-option__text {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}
.ds-rich-option__title {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}
.ds-rich-option__icon {
  display: inline-flex;
  align-self: flex-start;
  flex: none;
  color: var(--icon-primary);
}
.ds-rich-option:disabled .ds-rich-option__icon {
  color: var(--text-disabled);
}
.ds-rich-option__logo {
  display: inline-flex;
  flex: none;
}
.ds-rich-option__sub {
  color: var(--text-secondary);
}
.ds-rich-option:disabled .ds-rich-option__sub {
  color: var(--text-disabled);
}
.ds-rich-option__tick {
  display: inline-flex;
  flex: none;
  width: var(--space-16);
  color: var(--icon-strong);
}
</style>
