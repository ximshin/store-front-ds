<script setup lang="ts">
/**
 * Select — выпадающий список (Figma 6108:3333). Собран из InputMain (как инстанс в Figma).
 * Default — стрелка arrow-down-16 (icon/dropdown-arrow), Selected — выбранное значение и крестик очистки,
 * Disabled — border/disabled, текст text/disabled. Список опций — слот `list`.
 *
 * Figma → props: State=Default/Selected → определяется `modelValue` (есть значение → Selected; можно задать `selected`),
 * State=Disabled → disabled, Show list → showList, Show label → showLabel, Label → label,
 * Label position → labelPosition (top | left), Size → size (m | l | rich), слот list → slot `list`.
 * Size=rich (Figma 6471:4687, input-main Rich): поле 64 в две строки — значение + логотип службы (слот `logo`, 16)
 * и вторичная строка `sub` (цена / срок, text/secondary); справа всегда стрелка. Пункты списка — SelectRichOption.
 * Слот `icon` — иконка слева от текста (16, на уровне первой строки): у всех пунктов списка или ни у одного (research_select_icons_labels.md).
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import InputMain from '../InputMain/InputMain.vue';
import Icon from '../Icon/Icon.vue';

export type SelectLabelPosition = 'top' | 'left';
export type SelectSize = 'm' | 'l' | 'rich';

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
    /** Size=rich: вторичная строка (цена, срок доставки). */
    sub?: string;
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
    sub: '',
  },
);

const emit = defineEmits<{ 'update:modelValue': [value: string]; 'update:showList': [value: boolean]; clear: [] }>();

const open = ref(props.showList);
watch(() => props.showList, (v) => (open.value = v));

const isSelected = computed(() => props.selected ?? !!props.modelValue);
const rich = computed(() => props.size === 'rich');

function toggle() {
  if (props.disabled) return;
  open.value = !open.value;
  emit('update:showList', open.value);
}
function close() {
  if (!open.value) return;
  open.value = false;
  emit('update:showList', false);
}

/*
 * One open list at a time: a press anywhere outside this select (including another select's field) closes it.
 * The listener lives only while the list is open.
 */
const root = ref<HTMLElement | null>(null);
function onOutside(e: PointerEvent) {
  if (root.value && !root.value.contains(e.target as Node)) close();
}
watch(
  open,
  (v) => {
    if (v) document.addEventListener('pointerdown', onOutside, true);
    else document.removeEventListener('pointerdown', onOutside, true);
  },
  { immediate: true },
);
onBeforeUnmount(() => document.removeEventListener('pointerdown', onOutside, true));
function clear() {
  if (props.disabled) return;
  emit('update:modelValue', '');
  emit('clear');
}
</script>

<template>
  <div
    ref="root"
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
      :show-left-items="!!$slots.icon"
    >
      <!-- Leading icon (slot icon, 24, icon/primary): payment methods — icons for every option, the trigger repeats it. -->
      <template v-if="$slots.icon" #left-items>
        <span class="ds-select__icon-lead" aria-hidden="true" @click="toggle"><slot name="icon" /></span>
      </template>
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
          @keydown.esc="close"
        >
          <template v-if="rich">
            <span class="ds-select__title">
              <span class="ds-select__title-text">{{ isSelected ? modelValue : placeholder }}</span>
              <span v-if="$slots.logo" class="ds-select__logo" aria-hidden="true"><slot name="logo" /></span>
            </span>
            <span v-if="sub" class="ds-select__sub">{{ sub }}</span>
          </template>
          <template v-else>{{ isSelected ? modelValue : placeholder }}</template>
        </span>
      </template>
      <template #right-items>
        <button v-if="isSelected && !disabled && !rich" class="ds-select__icon" type="button" aria-label="Очистити" @click.stop="clear">
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
.ds-select--top.ds-select--l .ds-select__label,
.ds-select--top.ds-select--rich .ds-select__label {
  padding-bottom: var(--space-4);
}
/* Size=rich: две строки (значение + логотип / вторичная строка), список без внутренних отступов — строки 64 встык. */
.ds-select--rich .ds-select__value {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  white-space: normal;
}
.ds-select__title {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  min-width: 0;
}
.ds-select__title-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* On the level of the value (first line), not centred on both lines. */
.ds-select__icon-lead {
  display: inline-flex;
  align-self: flex-start;
  color: var(--icon-primary);
  cursor: pointer;
}
.ds-select__logo {
  display: inline-flex;
  flex: none;
}
.ds-select__sub {
  overflow: hidden;
  color: var(--text-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ds-select--rich :deep(.ds-input-main__menu) {
  padding: 0;
  overflow-x: hidden;
  max-height: calc(5 * 2 * var(--space-32));
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
