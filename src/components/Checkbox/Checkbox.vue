<script setup lang="ts">
/**
 * Checkbox — чекбокс с подписью и счётчиком, фильтры каталога (Figma 6124:2238).
 * Size: s=16 / m=20 / l=24. Состояния: normal, hover (:hover), checked, indeterminate, disabled, disabled-checked.
 *
 * Figma → props: Size → size, State=checked → checked, State=indeterminate → indeterminate,
 * State=disabled / disabled-checked → disabled (+ checked), State=hover → :hover, Show icon? → showIcon
 * (цветной квадрат 24 перед подписью, только M / L), подпись → label (или слот), счётчик → counter.
 * Пустой label скрывает подпись (чекбокс в DropdownListItem — только квадрат).
 */
import { computed } from 'vue';

export type CheckboxSize = 's' | 'm' | 'l';

const props = withDefaults(
  defineProps<{
    size?: CheckboxSize;
    checked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    showIcon?: boolean;
    /** Цвет квадрата-образца при showIcon (данные товара, не токен). */
    color?: string;
    label?: string;
    counter?: string | number;
    showCounter?: boolean;
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma.
    size: 's',
    checked: false,
    indeterminate: false,
    disabled: false,
    showIcon: true,
    color: '#ff94b2',
    label: 'Filter item',
    counter: 99,
    showCounter: true,
  },
);

const emit = defineEmits<{ 'update:checked': [value: boolean] }>();

const on = computed(() => props.checked || props.indeterminate);
const swatch = computed(() => props.showIcon && props.size !== 's');

function onChange(e: Event) {
  emit('update:checked', (e.target as HTMLInputElement).checked);
}
</script>

<template>
  <label
    class="ds-checkbox"
    :class="[`ds-checkbox--${size}`, { 'is-on': on, 'is-disabled': disabled }]"
  >
    <span class="ds-checkbox__main">
      <input
        class="ds-checkbox__input"
        type="checkbox"
        :checked="checked"
        :indeterminate.prop="indeterminate"
        :disabled="disabled"
        @change="onChange"
      />
      <span v-if="swatch" class="ds-checkbox__swatch" :class="{ 'is-active': on }">
        <span class="ds-checkbox__color" :style="{ background: color }" />
      </span>
      <span class="ds-checkbox__box" aria-hidden="true">
        <svg v-if="on && !indeterminate && size === 's'" viewBox="0 0 16 16" fill="none">
          <path d="M11.4345 5.43453C11.7469 5.12213 12.253 5.12215 12.5654 5.43453C12.8778 5.74695 12.8778 6.25297 12.5654 6.56539L7.56539 11.5654C7.25297 11.8778 6.74695 11.8778 6.43453 11.5654L3.93453 9.06539C3.62215 8.75297 3.62213 8.24694 3.93453 7.93453C4.24694 7.62213 4.75297 7.62215 5.06539 7.93453L6.99996 9.8691L11.4345 5.43453Z" fill="currentColor" />
        </svg>
        <svg v-else-if="on && !indeterminate && size === 'm'" viewBox="0 0 20 20" fill="none">
          <path d="M14.293 6.293C14.6835 5.90247 15.3165 5.90247 15.7071 6.293C16.0975 6.68353 16.0976 7.31657 15.7071 7.70706L9.70706 13.7071C9.31657 14.0976 8.68353 14.0975 8.293 13.7071L5.293 10.7071C4.9026 10.3165 4.90252 9.68348 5.293 9.293C5.68348 8.90252 6.31653 8.9026 6.70706 9.293L9.00003 11.586L14.293 6.293Z" fill="currentColor" />
        </svg>
        <svg v-else-if="on && !indeterminate" viewBox="0 0 24 24" fill="none">
          <path d="M17.1518 7.15185C17.6205 6.68322 18.3805 6.68322 18.8491 7.15185C19.3173 7.62052 19.3176 8.38065 18.8491 8.84911L10.8491 16.8491C10.3806 17.3176 9.62052 17.3173 9.15185 16.8491L5.15185 12.8491C4.68322 12.3805 4.68322 11.6205 5.15185 11.1518C5.62048 10.6832 6.38048 10.6832 6.84911 11.1518L10.0005 14.3032L17.1518 7.15185Z" fill="currentColor" />
        </svg>
        <span v-else-if="indeterminate" class="ds-checkbox__dash" />
      </span>
      <span v-if="label || $slots.default" class="ds-checkbox__label">
        <slot>{{ label }}</slot>
      </span>
    </span>
    <span v-if="showCounter" class="ds-checkbox__counter">{{ counter }}</span>
  </label>
</template>

<style scoped>
.ds-checkbox {
  /* приватные переменные состояния */
  --_bg: var(--surface-default);
  --_border: var(--border-input);
  --_fg: var(--icon-on-color);
  --_text: var(--text-primary);

  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  position: relative;
  border-radius: var(--radius-4);
  cursor: pointer;
}
.ds-checkbox:hover:not(.is-disabled) {
  --_border: var(--border-input-hover);
}
.ds-checkbox.is-on {
  --_bg: var(--surface-action-primary);
  --_border: var(--surface-action-primary);
}
.ds-checkbox.is-disabled {
  --_bg: var(--surface-input-disabled);
  --_border: var(--border-disabled);
  --_text: var(--text-disabled);
  cursor: default;
}
.ds-checkbox.is-disabled.is-on {
  --_bg: var(--surface-disabled);
  --_border: transparent;
}

.ds-checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
}

.ds-checkbox__main {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  min-width: 0;
}

.ds-checkbox__box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  box-sizing: border-box;
  border: var(--stroke-thin) solid var(--_border);
  border-radius: var(--radius-4);
  background: var(--_bg);
  color: var(--_fg);
  transition: background-color 0.15s ease, border-color 0.15s ease;
}
.ds-checkbox__box svg {
  width: calc(100% + 2 * var(--stroke-thin));
  height: calc(100% + 2 * var(--stroke-thin));
  margin: calc(-1 * var(--stroke-thin));
  flex: none;
}
.ds-checkbox__dash {
  width: var(--_dash, var(--space-8));
  height: var(--space-2);
  border-radius: var(--radius-full);
  background: currentColor;
}
.ds-checkbox__input:focus-visible ~ .ds-checkbox__box {
  outline: var(--stroke-bold) solid var(--border-input-active);
  outline-offset: 1px;
}

.ds-checkbox__label {
  color: var(--_text);
  white-space: nowrap;
}
.ds-checkbox__counter {
  flex: none;
  padding-left: var(--space-4);
  color: var(--text-secondary);
  font: var(--typo-special-special-13-regular);
}

/* ---- Size: квадрат 16 / 20 / 24, подпись 13 / 14 / 16 ---- */
.ds-checkbox--s .ds-checkbox__box { width: var(--space-16); height: var(--space-16); }
.ds-checkbox--s .ds-checkbox__label { font: var(--typo-special-special-13-regular); }
.ds-checkbox--m { --_dash: calc(var(--space-8) + var(--space-2)); }
.ds-checkbox--l { --_dash: var(--space-12); }
.ds-checkbox--m .ds-checkbox__box { width: var(--space-20); height: var(--space-20); }
.ds-checkbox--m .ds-checkbox__label { font: var(--typo-form-input-text); }
.ds-checkbox--l .ds-checkbox__box { width: var(--space-24); height: var(--space-24); }
.ds-checkbox--l .ds-checkbox__label { font: var(--typo-form-mob-input-text); }
.ds-checkbox--l .ds-checkbox__counter { font: var(--typo-form-input-text); }

/* ---- Show icon: цветной образец 24 ---- */
.ds-checkbox__swatch {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  box-sizing: border-box;
  width: var(--space-24);
  height: var(--space-24);
  border: var(--stroke-thin) solid transparent;
  border-radius: var(--radius-4);
}
.ds-checkbox__swatch.is-active {
  border-color: var(--border-input-active);
  border-radius: var(--radius-6);
}
.ds-checkbox__color {
  box-sizing: border-box;
  width: var(--space-20);
  height: var(--space-20);
  border: var(--stroke-thin) solid var(--border-divider);
  border-radius: var(--radius-4);
}
/* Figma: у M / L образец стоит ПЕРЕД квадратом (swatch, затем box) — порядок как в DOM. */
</style>
