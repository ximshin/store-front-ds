<script setup lang="ts">
/**
 * Radio — радио-кнопка 20 (Figma 6254:424): выбор одного из нескольких (способ доставки, оплаты).
 * Состояния: normal, hover (:hover), checked, disabled, disabled-checked. Подпись — DS/Form/Input text.
 *
 * Figma → props: State=checked → checked, State=disabled / disabled-checked → disabled (+ checked),
 * State=hover → :hover, Label → label (или слот), Show label? → showLabel.
 */
const props = withDefaults(
  defineProps<{
    checked?: boolean;
    disabled?: boolean;
    label?: string;
    showLabel?: boolean;
    name?: string;
    value?: string;
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma.
    checked: false,
    disabled: false,
    label: 'Варіант',
    showLabel: true,
  },
);

const emit = defineEmits<{ 'update:checked': [value: boolean] }>();

function onChange(e: Event) {
  emit('update:checked', (e.target as HTMLInputElement).checked);
}
</script>

<template>
  <label class="ds-radio" :class="{ 'is-checked': checked, 'is-disabled': disabled }">
    <input
      class="ds-radio__input"
      type="radio"
      :name="name"
      :value="value"
      :checked="checked"
      :disabled="disabled"
      @change="onChange"
    />
    <span class="ds-radio__circle" aria-hidden="true" />
    <span v-if="showLabel" class="ds-radio__label">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>

<style scoped>
.ds-radio {
  --_bg: var(--surface-default);
  --_border: var(--border-input);
  --_text: var(--text-primary);

  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  position: relative;
  cursor: pointer;
}
.ds-radio:hover:not(.is-disabled) {
  --_border: var(--border-input-hover);
}
.ds-radio.is-checked {
  --_bg: var(--surface-action-primary);
  --_border: var(--surface-action-primary);
}
.ds-radio.is-disabled {
  --_bg: var(--surface-input-disabled);
  --_border: var(--border-disabled);
  --_text: var(--text-disabled);
  cursor: default;
}
.ds-radio.is-disabled.is-checked {
  --_bg: var(--surface-disabled);
  --_border: transparent;
}

.ds-radio__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
}

.ds-radio__circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  box-sizing: border-box;
  width: var(--space-20);
  height: var(--space-20);
  border: var(--stroke-thin) solid var(--_border);
  border-radius: var(--radius-full);
  background: var(--_bg);
  transition: background-color 0.15s ease, border-color 0.15s ease;
}
/* checked: точка 8 (icon/on-color) */
.ds-radio.is-checked .ds-radio__circle::after {
  content: '';
  width: var(--space-8);
  height: var(--space-8);
  border-radius: var(--radius-full);
  background: var(--icon-on-color);
}
.ds-radio__input:focus-visible ~ .ds-radio__circle {
  outline: var(--stroke-bold) solid var(--border-input-active);
  outline-offset: 1px;
}

.ds-radio__label {
  color: var(--_text);
  font: var(--typo-form-input-text);
  white-space: nowrap;
}
</style>
