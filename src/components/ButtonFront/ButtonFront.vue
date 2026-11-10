<script setup lang="ts">
/**
 * button-front — кнопка витрины (Figma 2520:562).
 * Type: primary — основное действие на экране (одно); default — второстепенное (обводка); destructive — опасное
 * действие, не удаление; delete — всегда и только удаление; flat — без фона; dropdown — со стрелкой и списком.
 *
 * Figma → props: Type → type, Size → size (s=24, m=32, l=40), State=Hover → :hover, State=Disabled → disabled,
 * Show left icon / Show right icon / Show label / Show list → booleans, слоты left / right / list → slots.
 */
import { computed } from 'vue';
import Icon from '../Icon/Icon.vue';

export type ButtonFrontType = 'primary' | 'default' | 'destructive' | 'delete' | 'flat' | 'dropdown';
export type ButtonFrontSize = 's' | 'm' | 'l';

const props = withDefaults(
  defineProps<{
    type?: ButtonFrontType;
    size?: ButtonFrontSize;
    disabled?: boolean;
    label?: string;
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
    showLabel?: boolean;
    /** Только для type="dropdown": показывает слот `list` под кнопкой. */
    showList?: boolean;
    nativeType?: 'button' | 'submit' | 'reset';
    /** Кнопка на всю ширину контейнера (итоги заказа, карточка пункта выдачи). */
    block?: boolean;
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma.
    type: 'primary',
    size: 'l',
    disabled: false,
    label: 'Button',
    showLeftIcon: false,
    showRightIcon: false,
    showLabel: true,
    showList: false,
    nativeType: 'button',
    block: false,
  },
);

defineEmits<{ click: [event: MouseEvent] }>();

const isDropdown = computed(() => props.type === 'dropdown');
</script>

<template>
  <div class="ds-button-wrap" :class="{ 'is-dropdown': isDropdown, 'is-block': block }">
    <button
      class="ds-button"
      :class="[`ds-button--${type}`, `ds-button--${size}`]"
      :type="nativeType"
      :disabled="disabled"
      :aria-haspopup="isDropdown ? 'menu' : undefined"
      :aria-expanded="isDropdown ? showList : undefined"
      @click="$emit('click', $event)"
    >
      <span v-if="showLeftIcon" class="ds-button__left">
        <slot name="left"><Icon name="plus-16" /></slot>
      </span>
      <span v-if="showLabel" class="ds-button__label">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="showRightIcon || isDropdown" class="ds-button__right">
        <slot name="right">
          <Icon :name="isDropdown ? 'arrow-down-16' : 'plus-16'" />
        </slot>
      </span>
    </button>
    <div v-if="isDropdown && showList" class="ds-button__list">
      <slot name="list" />
    </div>
  </div>
</template>

<style scoped>
.ds-button-wrap {
  display: inline-flex;
  position: relative;
}
.ds-button-wrap.is-block {
  display: flex;
  width: 100%;
}
.ds-button-wrap.is-block .ds-button {
  width: 100%;
}

.ds-button {
  /* цвета по типу — переопределяются ниже */
  --_bg: transparent;
  --_bg-hover: var(--_bg);
  --_bg-disabled: var(--_bg);
  --_border: transparent;
  --_border-hover: var(--_border);
  --_border-disabled: var(--_border);
  --_fg: var(--text-primary);
  --_fg-disabled: var(--_fg);
  --_icon-right: currentColor;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  margin: 0;
  border: var(--stroke-thin) solid var(--_border);
  background: var(--_bg);
  color: var(--_fg);
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.ds-button:hover:not(:disabled) {
  background: var(--_bg-hover);
  border-color: var(--_border-hover);
}
.ds-button:disabled {
  cursor: default;
  background: var(--_bg-disabled);
  border-color: var(--_border-disabled);
  color: var(--_fg-disabled);
}
/* У кнопок фокус не показывается (решение по ДС); стандартное кольцо браузера тоже убрано. */
.ds-button:focus-visible {
  outline: none;
}

/* ---- Size: высота как в Figma (24 / 32 / 40), отступы по бокам — space/* ---- */
.ds-button--l {
  height: var(--space-40);
  padding: 0 calc(var(--space-16) - var(--stroke-thin));
  border-radius: var(--radius-4);
  font: var(--typo-form-button-l-label);
}
.ds-button--m {
  height: var(--space-32);
  padding: 0 calc(var(--space-12) - var(--stroke-thin));
  border-radius: var(--radius-8);
  font: var(--typo-form-button-m-label);
}
.ds-button--s {
  height: var(--space-24);
  padding: 0 calc(var(--space-8) - var(--stroke-thin));
  border-radius: var(--radius-6);
  font: var(--typo-form-button-s-label);
}

/* ---- Type ---- */
.ds-button--primary {
  --_bg: var(--surface-action-primary);
  --_bg-hover: var(--surface-action-primary-hover);
  --_bg-disabled: var(--surface-secondary);
  --_fg: var(--text-primary-white);
}
.ds-button--delete {
  --_bg: var(--bg-danger-primary);
  --_bg-hover: var(--bg-danger-primary);
  --_bg-disabled: color-mix(in srgb, var(--bg-danger-primary) 40%, transparent);
  --_fg: var(--text-primary-white);
}
.ds-button--default {
  --_border: var(--border-input);
  --_border-hover: var(--border-hover-card);
  --_border-disabled: var(--border-disabled);
  --_fg: var(--text-primary);
  --_fg-disabled: var(--text-disabled);
}
.ds-button--flat {
  --_bg-hover: var(--surface-hover);
  --_fg: var(--text-primary);
  --_fg-disabled: var(--text-disabled);
}
.ds-button--destructive {
  --_border: var(--border-input);
  --_border-hover: var(--border-hover-card);
  --_border-disabled: var(--border-disabled);
  --_fg: var(--text-danger);
  --_fg-disabled: color-mix(in srgb, var(--text-danger) 40%, transparent);
}
.ds-button--dropdown {
  --_border: var(--border-input);
  --_border-hover: var(--border-input-hover);
  --_border-disabled: var(--border-disabled);
  --_fg: var(--text-primary);
  --_fg-disabled: var(--text-disabled);
  --_icon-right: var(--icon-dropdown-arrow);
}

.ds-button__left,
.ds-button__right {
  display: inline-flex;
}
.ds-button__right {
  color: var(--_icon-right);
}

.ds-button__list {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  padding-top: var(--space-4);
}
</style>
