<script setup lang="ts">
/**
 * Select — выпадающий список (Figma 6108:3333). Собран из InputMain (как инстанс в Figma).
 * Default — стрелка arrow-down-16 (icon/dropdown-arrow), Selected — выбранное значение и крестик очистки,
 * Disabled — border/disabled, текст text/disabled. Список опций — слот `list`.
 *
 * Figma → props: State=Default/Selected → определяется `modelValue` (есть значение → Selected; можно задать `selected`),
 * State=Disabled → disabled, Show list → showList, Show label → showLabel, Label → label,
 * Label position → labelPosition (top | left), Size → size (m | l), слот list → slot `list`.
 */
import { computed, ref, watch } from 'vue';
import InputMain from '../InputMain/InputMain.vue';
import Icon from '../Icon/Icon.vue';

export type SelectLabelPosition = 'top' | 'left';
export type SelectSize = 'm' | 'l';

const props = withDefaults(
  defineProps<{
    /** Подпись выбранного значения; пусто — показывается placeholder (State=Default). */
    modelValue?: string;
    placeholder?: string;
    label?: string;
    showLabel?: boolean;
    showList?: boolean;
    /** Принудительно State=Selected (иначе — по наличию modelValue). */
    selected?: boolean;
    labelPosition?: SelectLabelPosition;
    size?: SelectSize;
    disabled?: boolean;
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma.
    modelValue: '',
    placeholder: 'Select option',
    label: 'Назва поля',
    showLabel: true,
    showList: false,
    selected: undefined,
    labelPosition: 'top',
    size: 'm',
    disabled: false,
  },
);

const emit = defineEmits<{ 'update:modelValue': [value: string]; 'update:showList': [value: boolean]; clear: [] }>();

const open = ref(props.showList);
watch(() => props.showList, (v) => (open.value = v));

const isSelected = computed(() => props.selected ?? !!props.modelValue);

function toggle() {
  if (props.disabled) return;
  open.value = !open.value;
  emit('update:showList', open.value);
}
function clear() {
  if (props.disabled) return;
  emit('update:modelValue', '');
  emit('clear');
}
</script>

<template>
  <div
    class="ds-select"
    :class="[`ds-select--${labelPosition}`, `ds-select--${size}`, { 'is-disabled': disabled }]"
  >
    <span v-if="showLabel" class="ds-select__label">{{ label }}</span>
    <InputMain
      class="ds-select__main"
      :size="size"
      :disabled="disabled"
      :show-hint="false"
      :show-list="open && !disabled"
    >
      <template #main-items>
        <span
          class="ds-select__value"
          :class="{ 'is-placeholder': !isSelected }"
          role="combobox"
          aria-haspopup="listbox"
          :aria-expanded="open"
          :aria-disabled="disabled || undefined"
          :tabindex="disabled ? -1 : 0"
          @click="toggle"
          @keydown.enter.prevent="toggle"
          @keydown.space.prevent="toggle"
          @keydown.esc="open = false"
        >
          {{ isSelected ? modelValue : placeholder }}
        </span>
      </template>
      <template #right-items>
        <button v-if="isSelected && !disabled" class="ds-select__icon" type="button" aria-label="Очистити" @click.stop="clear">
          <Icon name="cross-16" />
        </button>
        <span v-else class="ds-select__icon ds-select__icon--arrow" @click="toggle">
          <Icon name="arrow-down-16" />
        </span>
      </template>
      <template #list><slot name="list" /></template>
    </InputMain>
  </div>
</template>

<style scoped>
.ds-select {
  --input-main-border: var(--border-input);
  display: flex;
  min-width: 0;
  color: var(--text-primary);
  font: var(--typo-form-input-title);
}
.ds-select--top {
  flex-direction: column;
  align-items: stretch;
}
.ds-select--left {
  flex-direction: row;
  align-items: flex-start;
}
.ds-select.is-disabled {
  /* Disabled: белое поле с обводкой border/disabled (как в Figma). */
  --input-main-bg: var(--surface-default);
  --input-main-border: var(--border-disabled);
}

.ds-select__label {
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--space-4);
  box-sizing: border-box;
  padding-right: var(--space-8);
  overflow: clip;
  font: var(--typo-form-input-title);
  white-space: nowrap;
}
.ds-select.is-disabled .ds-select__label {
  color: var(--text-disabled);
}
.ds-select--top.ds-select--m .ds-select__label {
  padding-bottom: var(--space-8);
}
.ds-select--top.ds-select--l .ds-select__label {
  padding-bottom: var(--space-4);
}
.ds-select--left .ds-select__label {
  padding-top: var(--space-8);
}
.ds-select--left .ds-select__main {
  flex: 1 1 0;
}

.ds-select__value {
  display: block;
  overflow: hidden;
  outline: none;
  cursor: pointer;
  color: var(--text-primary);
  font: var(--typo-form-input-text);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ds-select.is-disabled .ds-select__value {
  color: var(--text-disabled);
  cursor: default;
}

.ds-select__icon {
  display: inline-flex;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
}
.ds-select__icon--arrow {
  color: var(--icon-dropdown-arrow);
}
.ds-select.is-disabled .ds-select__icon--arrow {
  color: var(--text-disabled);
  cursor: default;
}
</style>
