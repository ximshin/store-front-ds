<script setup lang="ts">
/**
 * search-bar — поиск в шапке и каталоге (Figma 6127:2471). Собран из InputMain; иконки — search-icon-size / cross-icon-size.
 * Рамка border/divider, радиус 8, отступ по бокам space/8, текст DS/Paragraph/P1.
 *
 * Figma → props: Height=S/M/L (32 / 40 / 48) → height ('s' | 'm' | 'l'), Icon size=S/M/L (20 / 24 / 32) → iconSize,
 * Show left icon → showLeftIcon, Show right icon → showRightIcon. Текст запроса — v-model (`modelValue`) + `placeholder`.
 */
import InputMain from '../InputMain/InputMain.vue';
import SearchIconSize from './SearchIconSize.vue';
import CrossIconSize from './CrossIconSize.vue';

export type SearchBarHeight = 's' | 'm' | 'l';
export type SearchBarIconSize = 's' | 'm' | 'l';

const ICON_PX = { s: '20', m: '24', l: '32' } as const;

withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    height?: SearchBarHeight;
    iconSize?: SearchBarIconSize;
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma.
    modelValue: '',
    placeholder: 'пошук товарів',
    height: 's',
    iconSize: 's',
    showLeftIcon: true,
    showRightIcon: true,
  },
);

const emit = defineEmits<{ 'update:modelValue': [value: string]; clear: [] }>();

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}
function clear() {
  emit('update:modelValue', '');
  emit('clear');
}
</script>

<template>
  <InputMain
    class="ds-search-bar"
    :class="`ds-search-bar--${height}`"
    :show-left-items="showLeftIcon"
    :show-right-items="showRightIcon"
    :show-hint="false"
  >
    <template #left-items>
      <SearchIconSize :icon-size="ICON_PX[iconSize]" />
    </template>
    <template #main-items>
      <input
        class="ds-search-bar__control"
        type="search"
        role="searchbox"
        :value="modelValue"
        :placeholder="placeholder"
        @input="onInput"
      />
    </template>
    <template #right-items>
      <button class="ds-search-bar__clear" type="button" aria-label="Очистити" @click="clear">
        <CrossIconSize :icon-size="ICON_PX[iconSize]" />
      </button>
    </template>
  </InputMain>
</template>

<style scoped>
.ds-search-bar {
  --input-main-border: var(--border-divider);
  --input-main-border-hover: var(--border-input-hover);
  --input-main-padding: 0 calc(var(--space-8) - var(--stroke-thin));
  --input-main-min-height: var(--space-32);
}
.ds-search-bar--m {
  --input-main-min-height: var(--space-40);
}
.ds-search-bar--l {
  --input-main-min-height: var(--space-48);
}

.ds-search-bar__control {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--text-primary);
  font: var(--typo-paragraph-p1);
  appearance: none;
}
.ds-search-bar__control::placeholder {
  color: var(--text-disabled);
  opacity: 1;
}
.ds-search-bar__control::-webkit-search-cancel-button {
  display: none;
}

.ds-search-bar__clear {
  display: inline-flex;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
}
</style>
