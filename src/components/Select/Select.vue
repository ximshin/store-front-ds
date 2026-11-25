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
 * searchable (Size=L/M), как в чекауте Хорошопа (briefs/checkout/reference_country_city.md): поле — ввод, значение при
 * фокусе остаётся; правка текста — поиск (v-model:query, список фильтрует родитель). В фокусе: лупа слева, пока идёт поиск
 * (поле пустое или текст отличается от значения), крестик справа, когда есть текст; пустое поле в фокусе — searchPlaceholder.
 * openOnFocus — список открывается при фокусе (иначе — только при вводе); listEmpty — список скрыт (ничего не найдено).
 * Уход из поля: allowCustom — введённый текст становится значением (свой город), иначе текст возвращается к значению.
 * Enter → событие `enter` (выбрать первый), Esc — вернуть значение и закрыть. Без фокуса — обычный Select.
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
    /** Поиск прямо в поле (не для Size=rich). */
    searchable?: boolean;
    /** Текст поиска (v-model:query): пусто, пока текст поля совпадает со значением. */
    query?: string;
    /** searchable: placeholder пустого поля в фокусе. */
    searchPlaceholder?: string;
    /** searchable: открывать список при фокусе. */
    openOnFocus?: boolean;
    /** searchable: список пуст — не показывать его. */
    listEmpty?: boolean;
    /** searchable: при уходе из поля введённый текст становится значением. */
    allowCustom?: boolean;
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
    searchable: false,
    query: '',
    searchPlaceholder: '',
    openOnFocus: true,
    listEmpty: false,
    allowCustom: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'update:showList': [value: boolean];
  'update:query': [value: string];
  enter: [];
  clear: [];
}>();

const open = ref(props.showList);
watch(() => props.showList, (v) => (open.value = v));

const isSelected = computed(() => props.selected ?? !!props.modelValue);
const rich = computed(() => props.size === 'rich');
const search = computed(() => props.searchable && !rich.value);

function openList() {
  if (props.disabled || open.value) return;
  open.value = true;
  emit('update:showList', true);
}

/* searchable: the text in the field; differs from modelValue while the buyer searches. */
const text = ref(props.modelValue);
const focused = ref(false);
const input = ref<HTMLInputElement | null>(null);
const searching = computed(() => focused.value && (!text.value || text.value !== props.modelValue));
function setText(v: string) {
  text.value = v;
  const q = v === props.modelValue ? '' : v;
  if (q !== props.query) emit('update:query', q);
}
// A picked option (or a value from outside): the field shows it; the focus is no longer in the input after a click.
watch(() => props.modelValue, (v) => {
  setText(v);
  if (document.activeElement !== input.value) focused.value = false;
});
function onFocus() {
  focused.value = true;
  if (props.openOnFocus) openList();
}
function onSearchInput(e: Event) {
  setText((e.target as HTMLInputElement).value);
  if (text.value || props.openOnFocus) openList();
  else close();
}
function clearText() {
  setText('');
  if (props.modelValue) clear();
  input.value?.focus();
  if (!props.openOnFocus) close();
}
function revert() {
  setText(props.modelValue);
  close();
}
/* Focus left the select (not into its own list): commit a custom text or go back to the value. */
function onFocusOut(e: FocusEvent) {
  if (!search.value || (root.value && root.value.contains(e.relatedTarget as Node))) return;
  focused.value = false;
  const v = text.value.trim();
  if (props.allowCustom && v && v !== props.modelValue) emit('update:modelValue', v);
  else setText(props.modelValue);
  close();
}

function toggle() {
  if (props.disabled) return;
  // searchable: the arrow puts the cursor into the field (focus opens the list).
  if (search.value) return input.value?.focus();
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
    @focusout="onFocusOut"
  >
    <span v-if="showLabel" class="ds-select__label">{{ label }}</span>
    <InputMain
      class="ds-select__main"
      :size="size"
      :disabled="disabled"
      :show-hint="false"
      :show-list="open && !disabled && !(search && listEmpty)"
      :show-left-items="!!$slots.icon || (search && searching)"
      :show-right-items="!(search && focused && !text)"
    >
      <!-- searchable: the search icon on the left while searching (search-24 scaled to 16). -->
      <template v-if="search && searching" #left-items>
        <span class="ds-select__icon ds-select__icon--search" aria-hidden="true"><Icon name="search-24" /></span>
      </template>
      <!-- Leading icon (slot icon, 24, icon/primary): payment methods — icons for every option, the trigger repeats it. -->
      <template v-else-if="$slots.icon" #left-items>
        <span class="ds-select__icon-lead" aria-hidden="true" @click="toggle"><slot name="icon" /></span>
      </template>
      <template #main-items>
        <input
          v-if="search"
          ref="input"
          class="ds-select__value ds-select__input"
          role="combobox"
          aria-haspopup="listbox"
          aria-autocomplete="list"
          autocomplete="off"
          spellcheck="false"
          :aria-expanded="open"
          :disabled="disabled"
          :value="text"
          :placeholder="focused && searchPlaceholder ? searchPlaceholder : placeholder"
          @focus="onFocus"
          @click="openOnFocus && openList()"
          @input="onSearchInput"
          @keydown.enter.prevent="emit('enter')"
          @keydown.esc="revert"
        />
        <span
          v-else
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
        <!-- searchable in focus: the cross while there is text (keeps the focus), nothing otherwise. -->
        <template v-if="search && focused">
          <button class="ds-select__icon" type="button" aria-label="Очистити" @pointerdown.prevent @click.stop="clearText">
            <Icon name="cross-16" />
          </button>
        </template>
        <button v-else-if="isSelected && !disabled && !rich" class="ds-select__icon" type="button" aria-label="Очистити" @click.stop="clear">
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
/* searchable: the value is an input with the same look; the placeholder is grey (text/disabled), as in Input. */
.ds-select__input {
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: text;
  appearance: none;
}
.ds-select__input::placeholder {
  color: var(--text-disabled);
  opacity: 1;
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
.ds-select__icon--search {
  color: var(--icon-secondary);
  cursor: text;
}
.ds-select.is-disabled .ds-select__icon--arrow {
  color: var(--text-disabled);
  cursor: default;
}
</style>
