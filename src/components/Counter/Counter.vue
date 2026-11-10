<script setup lang="ts">
/**
 * counter — счётчик количества товара «− число +» (Figma 6129:500). Кнопки — иконки minus-16 / plus-16.
 * Ширина 120, высота 40, обводка border/input, радиус 4; hover кнопки — фон surface/hover (State=Hover → :hover).
 *
 * Figma → props: Show units → showUnits (+ `units`, по умолчанию «шт.»), State=Normal/Hover → :hover.
 * Значение — v-model (`modelValue`), границы `min` / `max`.
 */
import Icon from '../Icon/Icon.vue';

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    min?: number;
    max?: number;
    showUnits?: boolean;
    units?: string;
    disabled?: boolean;
  }>(),
  { modelValue: 1, min: 1, max: 999, showUnits: false, units: 'шт.', disabled: false },
);

const emit = defineEmits<{ 'update:modelValue': [value: number] }>();

function step(delta: number) {
  const next = Math.min(props.max, Math.max(props.min, props.modelValue + delta));
  if (next !== props.modelValue) emit('update:modelValue', next);
}
</script>

<template>
  <div class="ds-counter">
    <div class="ds-counter__main">
      <button
        class="ds-counter__btn ds-counter__btn--minus"
        type="button"
        aria-label="Зменшити"
        :disabled="disabled || modelValue <= min"
        @click="step(-1)"
      >
        <Icon name="minus-16" />
      </button>
      <span class="ds-counter__value" aria-live="polite">{{ modelValue }}</span>
      <button
        class="ds-counter__btn ds-counter__btn--plus"
        type="button"
        aria-label="Збільшити"
        :disabled="disabled || modelValue >= max"
        @click="step(1)"
      >
        <Icon name="plus-16" />
      </button>
    </div>
    <span v-if="showUnits" class="ds-counter__units">{{ units }}</span>
  </div>
</template>

<style scoped>
.ds-counter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  background: var(--surface-default);
}

.ds-counter__main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  box-sizing: border-box;
  width: 120px;
  height: var(--space-40);
  padding: var(--space-0);
  overflow: clip;
  border: var(--stroke-thin) solid var(--border-input);
  border-radius: var(--radius-4);
  color: var(--text-primary);
}

.ds-counter__btn {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 100%;
  aspect-ratio: 1;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.ds-counter__btn--minus {
  border-radius: 0 var(--radius-8) var(--radius-8) 0;
}
.ds-counter__btn--plus {
  border-radius: var(--radius-8) 0 0 var(--radius-8);
}
.ds-counter__btn:hover:not(:disabled) {
  background: var(--surface-hover);
  border-radius: var(--radius-4);
}
.ds-counter__btn:disabled {
  cursor: default;
  color: var(--text-disabled);
}
/* У кнопок фокус не показывается (решение по ДС). */
.ds-counter__btn:focus-visible {
  outline: none;
}

.ds-counter__value {
  min-width: 0;
  color: var(--text-primary);
  font: var(--typo-paragraph-p1);
  text-align: center;
  white-space: nowrap;
}

.ds-counter__units {
  color: var(--text-secondary);
  font: var(--typo-form-input-text);
  white-space: nowrap;
}
</style>
