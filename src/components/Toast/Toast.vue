<script setup lang="ts">
/**
 * Toast — всплывающее уведомление (Figma 6256:205): тёмная плашка surface/action/primary, radius/8, DS/Shadow/m,
 * иконка статуса 16, текст DS/Paragraph/P1 (text/primary-white), действие (Special 14 Medium),
 * закрытие (cross-16). Ширина 400; на мобайле — Fill.
 *
 * Figma → props: Type → type (success | error | info), Action → action, Show action? → showAction,
 * Show close? → showClose. Текст сообщения — prop message / слот по умолчанию (в Figma правится в инстансе).
 */
import { computed } from 'vue';
import Icon from '../Icon/Icon.vue';

export type ToastType = 'success' | 'error' | 'info';

const props = withDefaults(
  defineProps<{
    type?: ToastType;
    /** Текст сообщения; по умолчанию — пример по типу. */
    message?: string;
    action?: string;
    showAction?: boolean;
    showClose?: boolean;
    closeLabel?: string;
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma.
    type: 'success',
    message: undefined,
    action: 'Перейти',
    showAction: true,
    showClose: true,
    closeLabel: 'Закрити',
  },
);

defineEmits<{ action: []; close: [] }>();

const SAMPLES: Record<ToastType, string> = {
  success: 'Товар додано в кошик',
  error: 'Не вдалося додати товар. Спробуйте ще раз',
  info: 'Ціну оновлено',
};
const ICONS: Record<ToastType, string> = { success: 'tick-16', error: 'info-16', info: 'info-16' };
const text = computed(() => props.message ?? SAMPLES[props.type]);
</script>

<template>
  <div class="ds-toast" :class="`ds-toast--${type}`" :role="type === 'error' ? 'alert' : 'status'">
    <span class="ds-toast__icon"><Icon :name="ICONS[type]" :size="16" /></span>
    <span class="ds-toast__text"><slot>{{ text }}</slot></span>
    <button v-if="showAction" type="button" class="ds-toast__action" @click="$emit('action')">{{ action }}</button>
    <button v-if="showClose" type="button" class="ds-toast__close" :aria-label="closeLabel" @click="$emit('close')">
      <Icon name="cross-16" :size="16" />
    </button>
  </div>
</template>

<style scoped>
.ds-toast {
  --_icon: var(--icon-success);

  display: flex;
  align-items: center;
  gap: var(--space-12);
  box-sizing: border-box;
  width: 100%;
  max-width: 400px;
  padding: var(--space-12) var(--space-16);
  border-radius: var(--radius-8);
  background: var(--surface-action-primary);
  box-shadow: var(--shadow-m);
  color: var(--text-primary-white);
}
.ds-toast--error {
  --_icon: var(--icon-danger);
}
.ds-toast--info {
  --_icon: var(--icon-info);
}

.ds-toast__icon {
  display: inline-flex;
  flex: none;
  color: var(--_icon);
}
.ds-toast__text {
  flex: 1 1 0;
  min-width: 1px;
  font: var(--typo-paragraph-p1);
}
.ds-toast__action {
  flex: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: var(--text-primary-white);
  font: var(--typo-special-special-14-medium);
  white-space: nowrap;
  cursor: pointer;
}
.ds-toast__close {
  display: inline-flex;
  flex: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: var(--icon-primary-white);
  cursor: pointer;
}
.ds-toast__action:focus-visible,
.ds-toast__close:focus-visible {
  outline: none;
}
</style>
