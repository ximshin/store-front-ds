<script setup lang="ts">
/**
 * IconButton — кнопка-иконка 32×32 без фона (Figma 6208:19).
 * Мобильная шапка, удаление в корзине. Зона нажатия расширена до size/touch-min (44).
 *
 * Figma → props: Icon (instance swap) → icon (имя иконки) или слот по умолчанию.
 */
import Icon from '../Icon/Icon.vue';

withDefaults(
  defineProps<{
    /** Имя иконки со страницы Icons (рисуется размером 16). */
    icon?: string;
    /** Доступное имя кнопки (у кнопки нет текста). */
    label?: string;
    disabled?: boolean;
    nativeType?: 'button' | 'submit' | 'reset';
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma (бургер).
    icon: 'menu-24',
    label: undefined,
    disabled: false,
    nativeType: 'button',
  },
);

defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
  <button
    class="ds-icon-button"
    :type="nativeType"
    :disabled="disabled"
    :aria-label="label"
    @click="$emit('click', $event)"
  >
    <slot><Icon :name="icon" :size="16" /></slot>
  </button>
</template>

<style scoped>
.ds-icon-button {
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: var(--space-32);
  height: var(--space-32);
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: var(--radius-8);
  background: transparent;
  color: var(--icon-strong);
  cursor: pointer;
}
/* Зона нажатия ≥ size/touch-min (44), визуально кнопка остаётся 32×32. */
.ds-icon-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--size-touch-min);
  height: var(--size-touch-min);
  transform: translate(-50%, -50%);
}
.ds-icon-button:disabled {
  cursor: default;
  opacity: 0.4;
}
/* У кнопок фокус не показывается. */
.ds-icon-button:focus-visible {
  outline: none;
}
</style>
