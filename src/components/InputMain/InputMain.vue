<script setup lang="ts">
/**
 * input-main — базовая строка поля ввода (Figma 4032:8049) со слотами left-items / main-items / right-items.
 * Используется внутри Input, Select, SearchBar.
 *
 * Figma → props: Show left-items → showLeftItems, Show right-items → showRightItems, Show hint → showHint,
 * Show list → showList; слоты left-items / main-items / right-items / list → slots одноимённые, hint → prop `hint` + слот.
 * Дополнительно (для сборки Input/Select): size (m = поле 32, l = поле 40), disabled, error.
 * Родитель может переопределить `--input-main-bg`, `--input-main-border`, `--input-main-min-height`, `--input-main-padding`.
 */
import Icon from '../Icon/Icon.vue';

export type InputMainSize = 'm' | 'l';

withDefaults(
  defineProps<{
    size?: InputMainSize;
    disabled?: boolean;
    error?: boolean;
    showLeftItems?: boolean;
    showRightItems?: boolean;
    showHint?: boolean;
    showList?: boolean;
    hint?: string;
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma.
    size: 'm',
    disabled: false,
    error: false,
    showLeftItems: false,
    showRightItems: true,
    showHint: true,
    showList: false,
    hint: 'Field hint',
  },
);
</script>

<template>
  <div
    class="ds-input-main"
    :class="[`ds-input-main--${size}`, { 'is-disabled': disabled, 'is-error': error }]"
  >
    <div class="ds-input-main__main">
      <div class="ds-input-main__field">
        <div v-if="showLeftItems" class="ds-input-main__side">
          <slot name="left-items"><Icon name="search-24" /></slot>
        </div>
        <div class="ds-input-main__items">
          <slot name="main-items"><span class="ds-input-main__text">Text</span></slot>
        </div>
        <div v-if="showRightItems" class="ds-input-main__side ds-input-main__side--right">
          <slot name="right-items"><Icon name="cross-16" /></slot>
        </div>
      </div>
    </div>
    <div v-if="showList" class="ds-input-main__list">
      <div class="ds-input-main__menu">
        <slot name="list" />
      </div>
    </div>
    <div v-if="showHint" class="ds-input-main__hint">
      <slot name="hint">{{ hint }}</slot>
    </div>
  </div>
</template>

<style scoped>
.ds-input-main {
  /* значения по размеру и состоянию — переопределяются ниже */
  --_padding: calc(var(--space-8) - var(--stroke-thin));
  --_min-height: var(--space-32);
  --_bg: var(--surface-default);
  --_border: var(--border-input);
  --_border-hover: var(--border-input-hover);
  --_hint: var(--text-secondary);

  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 0;
  color: var(--text-primary);
  font: var(--typo-form-input-text);
}

.ds-input-main--l {
  --_padding: calc(var(--space-12) - var(--stroke-thin));
  --_min-height: var(--space-40);
}
.ds-input-main.is-disabled {
  --_bg: var(--surface-subtle);
  --_border-hover: var(--_border);
}
.ds-input-main.is-error {
  --_border: var(--border-danger);
  --_border-hover: var(--border-danger);
  --_hint: var(--text-danger);
}

.ds-input-main__main {
  display: flex;
  align-items: center;
}

.ds-input-main__field {
  display: flex;
  flex: 1 1 0;
  align-items: center;
  gap: var(--space-8);
  box-sizing: border-box;
  min-width: 0;
  min-height: var(--input-main-min-height, var(--_min-height));
  padding: var(--input-main-padding, var(--_padding));
  overflow: clip;
  border: var(--stroke-thin) solid var(--input-main-border, var(--_border));
  border-radius: var(--radius-8);
  background: var(--input-main-bg, var(--_bg));
  transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.ds-input-main:not(.is-disabled):not(.is-error) .ds-input-main__field:hover {
  border-color: var(--input-main-border-hover, var(--_border-hover));
}
/* Фокус поля: обводка 2 px = 1 px рамка + inset 1 px. */
.ds-input-main:not(.is-disabled) .ds-input-main__field:focus-within {
  border-color: var(--border-input-active);
  box-shadow: inset 0 0 0 var(--stroke-thin) var(--border-input-active);
}

.ds-input-main__items {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: var(--space-2);
  align-items: stretch;
  min-width: 0;
}
.ds-input-main__text {
  white-space: nowrap;
}

.ds-input-main__side {
  display: flex;
  align-items: center;
  align-self: stretch;
  flex: none;
}
.ds-input-main__side--right {
  justify-content: flex-end;
  gap: var(--space-8);
}

/* Список: обёртка высотой 0, меню выпадает под полем. */
.ds-input-main__list {
  position: relative;
  z-index: 10;
  height: 0;
}
.ds-input-main__menu {
  position: absolute;
  top: var(--space-4);
  left: 0;
  right: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  /* Длинный список прокручивается: не выше 5 × 48. */
  max-height: calc(5 * var(--space-48));
  overflow-y: auto;
  border-radius: var(--radius-8);
  background: var(--surface-default);
  box-shadow: var(--shadow-menu);
}

.ds-input-main__hint {
  padding: var(--space-4) 0;
  color: var(--_hint);
  font: var(--typo-special-special-12-regular);
}
</style>
