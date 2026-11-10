<script setup lang="ts">
/**
 * Modal — попап витрины (Figma 6220:278): корзина, промокод, быстрый заказ, вход.
 * Size S 480 / M 560 / L 960; отступы 16 / 20 / 20, промежуток space/16, radius/16, тень DS/Shadow/l,
 * заголовок DS/Heading/H2 + IconButton закрытия. Содержимое — слот по умолчанию (плейсхолдер ModalContent),
 * подвал — слот `footer` (по умолчанию «Скасувати» + «Зберегти»).
 *
 * Teleport не используется: компонент рисуется на месте. `open` (v-model:open) скрывает/показывает попап;
 * `overlay` добавляет затемнение surface/overlay (position: fixed на весь ближайший containing block).
 *
 * Figma → props: Size → size, Title → title, Show footer? → showFooter, Content (swap) → слот по умолчанию.
 */
import IconButton from '../IconButton/IconButton.vue';
import ButtonFront from '../ButtonFront/ButtonFront.vue';
import ModalContent from './ModalContent.vue';

export type ModalSize = 's' | 'm' | 'l';

withDefaults(
  defineProps<{
    size?: ModalSize;
    title?: string;
    showFooter?: boolean;
    /** Показан ли попап (v-model:open). */
    open?: boolean;
    /** Затемнение surface/overlay под попапом (центрирует попап). */
    overlay?: boolean;
    cancelLabel?: string;
    confirmLabel?: string;
    closeLabel?: string;
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma.
    size: 's',
    title: 'Кошик',
    showFooter: true,
    open: true,
    overlay: false,
    cancelLabel: 'Скасувати',
    confirmLabel: 'Зберегти',
    closeLabel: 'Закрити',
  },
);

const emit = defineEmits<{ 'update:open': [value: boolean]; close: []; cancel: []; confirm: [] }>();

function close() {
  emit('update:open', false);
  emit('close');
}
function cancel() {
  emit('cancel');
  emit('update:open', false);
}
</script>

<template>
  <Transition name="ds-modal">
  <div v-if="open" class="ds-modal-layer" :class="{ 'has-overlay': overlay }">
    <div class="ds-modal" :class="`ds-modal--${size}`" role="dialog" aria-modal="true" :aria-label="title">
      <div class="ds-modal__header">
        <span class="ds-modal__title">{{ title }}</span>
        <IconButton icon="cross-16" :label="closeLabel" @click="close" />
      </div>
      <div class="ds-modal__body"><slot><ModalContent /></slot></div>
      <div v-if="showFooter" class="ds-modal__footer">
        <slot name="footer">
          <ButtonFront type="default" size="l" :label="cancelLabel" @click="cancel" />
          <ButtonFront type="primary" size="l" :label="confirmLabel" @click="$emit('confirm')" />
        </slot>
      </div>
    </div>
  </div>
  </Transition>
</template>

<style scoped>
.ds-modal-layer {
  display: inline-flex;
  max-width: 100%;
}
.ds-modal-layer.has-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-overlay);
}

.ds-modal {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-16);
  box-sizing: border-box;
  max-width: 100%;
  /* Окно не выше экрана: тело прокручивается, шапка и подвал на месте. */
  max-height: calc(100vh - 2 * var(--space-40));
  padding: var(--space-16) var(--space-20) var(--space-20);
  border-radius: var(--radius-16);
  background: var(--surface-default);
  box-shadow: var(--shadow-l);
  color: var(--text-primary);
}
.ds-modal__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
.ds-modal--s {
  width: 480px;
}
.ds-modal--m {
  width: 560px;
}
.ds-modal--l {
  width: 960px;
}

.ds-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  overflow: clip;
}
.ds-modal__title {
  font: var(--typo-heading-h2);
  white-space: nowrap;
}
.ds-modal__footer {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: var(--space-8);
  overflow: clip;
}

/* Появление / скрытие: fade слоя + лёгкий scale окна. */
.ds-modal-enter-active,
.ds-modal-leave-active {
  transition: opacity 0.2s ease;
}
.ds-modal-enter-active .ds-modal,
.ds-modal-leave-active .ds-modal {
  transition: transform 0.2s ease;
}
.ds-modal-enter-from,
.ds-modal-leave-to {
  opacity: 0;
}
.ds-modal-enter-from .ds-modal,
.ds-modal-leave-to .ds-modal {
  transform: scale(0.96);
}
@media (prefers-reduced-motion: reduce) {
  .ds-modal-enter-active,
  .ds-modal-leave-active,
  .ds-modal-enter-active .ds-modal,
  .ds-modal-leave-active .ds-modal {
    transition: none;
  }
}
</style>
