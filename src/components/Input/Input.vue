<script setup lang="ts">
/**
 * Input — поле ввода (Figma 6108:2853). Собран из InputMain (как инстанс в Figma).
 * Обводка border/input, фокус — 2 px border/input-active, ошибка — border/danger + подсказка text/danger.
 * Size: m — поле 32 (по умолчанию), l — поле 40 (оформление заказа).
 *
 * Figma → props: Show label → showLabel, Label → label, Type=Default → type (html-тип input, по умолчанию 'text'),
 * Filled → определяется значением `modelValue` (пусто → placeholder), State=Disabled → disabled, State=Error → error,
 * Label position → labelPosition (top | left), Size → size (m | l). Подсказка ошибки — prop `hint`.
 * `clearable` — крестик очистки справа (right-items InputMain, cross-16 icon/strong), когда есть значение; событие `clear`.
 */
import { computed } from 'vue';
import InputMain from '../InputMain/InputMain.vue';
import Icon from '../Icon/Icon.vue';

export type InputLabelPosition = 'top' | 'left';
export type InputSize = 'm' | 'l';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    label?: string;
    showLabel?: boolean;
    placeholder?: string;
    /** html-тип нативного input (Figma Type=Default → 'text'). */
    type?: string;
    labelPosition?: InputLabelPosition;
    size?: InputSize;
    disabled?: boolean;
    error?: boolean;
    /** Текст подсказки; показывается в состоянии error. */
    hint?: string;
    name?: string;
    /** Крестик очистки справа, когда поле заполнено. */
    clearable?: boolean;
    clearLabel?: string;
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma.
    modelValue: '',
    label: 'Назва поля',
    showLabel: true,
    placeholder: 'Placeholder',
    type: 'text',
    labelPosition: 'top',
    size: 'm',
    disabled: false,
    error: false,
    hint: 'Field hint',
    name: undefined,
    clearable: false,
    clearLabel: 'Очистити',
  },
);

const emit = defineEmits<{ 'update:modelValue': [value: string]; clear: [] }>();

const canClear = computed(() => props.clearable && !props.disabled && !!props.modelValue);

function onClear() {
  emit('update:modelValue', '');
  emit('clear');
}

const showHint = computed(() => props.error && !props.disabled && !!props.hint);

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
  <label
    class="ds-input"
    :class="[`ds-input--${labelPosition}`, `ds-input--${size}`, { 'is-disabled': disabled }]"
  >
    <span v-if="showLabel" class="ds-input__label">{{ label }}</span>
    <InputMain
      class="ds-input__main"
      :size="size"
      :disabled="disabled"
      :error="error"
      :show-right-items="canClear"
      :show-hint="showHint"
      :hint="hint"
    >
      <template #main-items>
        <input
          class="ds-input__control"
          :type="type"
          :name="name"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :aria-invalid="error || undefined"
          @input="onInput"
        />
      </template>
      <template #right-items>
        <button class="ds-input__clear" type="button" :aria-label="clearLabel" @click.prevent="onClear">
          <Icon name="cross-16" />
        </button>
      </template>
    </InputMain>
  </label>
</template>

<style scoped>
.ds-input {
  display: flex;
  min-width: 0;
  color: var(--text-primary);
  font: var(--typo-form-input-title);
}
.ds-input--top {
  flex-direction: column;
  align-items: stretch;
}
.ds-input--left {
  flex-direction: row;
  align-items: flex-start;
}

.ds-input__label {
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--space-4);
  box-sizing: border-box;
  padding-right: var(--space-8);
  overflow: clip;
  color: var(--text-primary);
  font: var(--typo-form-input-title);
  white-space: nowrap;
}
/* Label position=Top: отступ до поля — 8 (M) / 4 (L). Left: отступ сверху 8, чтобы строка была на уровне текста. */
.ds-input--top.ds-input--m .ds-input__label {
  padding-bottom: var(--space-8);
}
.ds-input--top.ds-input--l .ds-input__label {
  padding-bottom: var(--space-4);
}
.ds-input--left .ds-input__label {
  padding-top: var(--space-8);
}
.ds-input--left .ds-input__main {
  flex: 1 1 0;
}

.ds-input__control {
  display: block;
  width: 100%;
  height: var(--font-line-height-16);
  margin: 0;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--text-primary);
  font: var(--typo-form-input-text);
}
.ds-input__control::placeholder {
  color: var(--text-disabled);
  opacity: 1;
}
.ds-input__clear {
  display: inline-flex;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: var(--icon-strong);
  cursor: pointer;
  transition: color 0.15s ease;
}
.ds-input__clear:hover {
  color: var(--icon-action-primary);
}
.ds-input__clear:focus-visible {
  outline: none;
}
.ds-input__control:disabled {
  cursor: default;
}
</style>
