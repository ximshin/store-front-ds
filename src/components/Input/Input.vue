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
    /** Многострочное поле (textarea): растёт по тексту от `rows` строк, крестик очистки — у верхнего края. */
    multiline?: boolean;
    /** Минимум строк в режиме multiline. */
    rows?: number;
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
    multiline: false,
    rows: 3,
  },
);

const emit = defineEmits<{ 'update:modelValue': [value: string]; clear: [] }>();

const canClear = computed(() => props.clearable && !props.disabled && !!props.modelValue);
// multiline: the cross slot is always there (the cross only hides when empty) — otherwise the textarea narrows
// when the first character appears and its resize handle jumps left.
const showRightItems = computed(() => canClear.value || (props.multiline && props.clearable && !props.disabled));

function onClear() {
  emit('update:modelValue', '');
  emit('clear');
}

const showHint = computed(() => props.error && !props.disabled && !!props.hint);

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement | HTMLTextAreaElement).value);
}
</script>

<template>
  <label
    class="ds-input"
    :class="[`ds-input--${labelPosition}`, `ds-input--${size}`, { 'is-disabled': disabled, 'ds-input--multiline': multiline }]"
  >
    <span v-if="showLabel" class="ds-input__label">{{ label }}</span>
    <InputMain
      class="ds-input__main"
      :size="size"
      :disabled="disabled"
      :error="error"
      :show-right-items="showRightItems"
      :show-hint="showHint"
      :hint="hint"
    >
      <template #main-items>
        <textarea
          v-if="multiline"
          class="ds-input__control ds-input__control--multiline"
          :name="name"
          :rows="rows"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :aria-invalid="error || undefined"
          :style="{ '--input-rows': rows }"
          @input="onInput"
        />
        <input
          v-else
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
        <button
          class="ds-input__clear"
          :class="{ 'is-hidden': !canClear }"
          type="button"
          :aria-label="clearLabel"
          :tabindex="canClear ? undefined : -1"
          :aria-hidden="!canClear || undefined"
          @click.prevent="onClear"
        >
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
/* multiline: textarea grows with the text from `rows` lines to 8 lines, then scrolls; manual resize — vertical only.
   The textarea fills the whole field (the field padding moves inside it), so its resize handle sits in the field's
   bottom-right corner; the clear cross lies over the top-right corner, the text keeps clear of it (padding-right). */
.ds-input--multiline {
  --_ta-pad: calc(var(--space-8) - var(--stroke-thin));
}
.ds-input--multiline.ds-input--l {
  --_ta-pad: calc(var(--space-12) - var(--stroke-thin));
}
.ds-input--multiline :deep(.ds-input-main__field) {
  position: relative;
  align-items: stretch;
  padding: 0;
}
.ds-input--multiline :deep(.ds-input-main__side--right) {
  position: absolute;
  top: var(--_ta-pad);
  right: var(--_ta-pad);
}
/* The resize handle is inset 2 px from the right and bottom border (margin); the padding is cut by the same 2 px,
   so the text and the field height stay where they were. */
.ds-input__control--multiline {
  box-sizing: border-box;
  width: calc(100% - var(--space-2));
  height: auto;
  min-height: calc(var(--input-rows, 3) * var(--font-line-height-16) + 2 * var(--_ta-pad) - var(--space-2));
  max-height: calc(8 * var(--font-line-height-16) + 2 * var(--_ta-pad) - var(--space-2));
  margin: 0 var(--space-2) var(--space-2) 0;
  padding: var(--_ta-pad);
  padding-right: calc(var(--_ta-pad) + var(--space-16) + var(--space-8) - var(--space-2));
  padding-bottom: calc(var(--_ta-pad) - var(--space-2));
  field-sizing: content;
  resize: vertical;
  line-height: var(--font-line-height-16);
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
.ds-input__clear.is-hidden {
  visibility: hidden;
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
