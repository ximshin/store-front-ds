<script setup lang="ts">
/**
 * MediaIconButton — кнопка-иконка поверх фото товара, 32×32 (Figma 6211:20).
 * Rounded — избранное / сравнение (radius/8); Square — стрелки галереи (radius/4 + border/divider).
 * Фон surface/media/control, hover — surface/media/control-hover.
 *
 * Figma → props: Shape → shape, Icon (instance swap) → icon (у Square по умолчанию arrow-right-16;
 * «назад» — flip, как поворот инстанса на 180° в Figma).
 */
import { computed } from 'vue';
import Icon from '../Icon/Icon.vue';

export type MediaIconButtonShape = 'rounded' | 'square';

const props = withDefaults(
  defineProps<{
    shape?: MediaIconButtonShape;
    /** Имя иконки со страницы Icons; по умолчанию heart-24 (rounded) / arrow-right-16 (square). */
    icon?: string;
    /** Повернуть иконку на 180° (стрелка «назад» у Square). */
    flip?: boolean;
    /** Доступное имя кнопки (у кнопки нет текста). */
    label?: string;
    disabled?: boolean;
    nativeType?: 'button' | 'submit' | 'reset';
  }>(),
  {
    shape: 'rounded',
    icon: undefined,
    flip: false,
    label: undefined,
    disabled: false,
    nativeType: 'button',
  },
);

defineEmits<{ click: [event: MouseEvent] }>();

const iconName = computed(() => props.icon ?? (props.shape === 'square' ? 'arrow-right-16' : 'heart-24'));
</script>

<template>
  <button
    class="ds-media-icon-button"
    :class="`ds-media-icon-button--${shape}`"
    :type="nativeType"
    :disabled="disabled"
    :aria-label="label"
    @click="$emit('click', $event)"
  >
    <span class="ds-media-icon-button__icon" :class="{ 'is-flipped': flip }">
      <slot><Icon :name="iconName" :size="16" /></slot>
    </span>
  </button>
</template>

<style scoped>
.ds-media-icon-button {
  --_radius: var(--radius-8);
  --_border: transparent;

  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: var(--space-32);
  height: var(--space-32);
  margin: 0;
  padding: 0;
  border: var(--stroke-thin) solid var(--_border);
  border-radius: var(--_radius);
  background: var(--surface-media-control);
  color: var(--icon-strong);
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.ds-media-icon-button:hover:not(:disabled) {
  background: var(--surface-media-control-hover);
}
.ds-media-icon-button:disabled {
  cursor: default;
  opacity: 0.4;
}
.ds-media-icon-button:focus-visible {
  outline: none;
}

.ds-media-icon-button--square {
  --_radius: var(--radius-4);
  --_border: var(--border-divider);
}

.ds-media-icon-button__icon {
  display: inline-flex;
}
.ds-media-icon-button__icon.is-flipped {
  transform: rotate(180deg);
}
</style>
