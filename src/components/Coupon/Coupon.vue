<script setup lang="ts">
/**
 * Coupon — блок промокода в корзине и оформлении (Figma 6219:221). Собран из Input (Label position=Left без подписи, 32),
 * ButtonFront (Primary M «Застосувати») и PromoChip. Карточка border/card, radius/12, заголовок coupon-16 + DS/Paragraph/P1.
 * State: collapsed — только заголовок с plus-16; empty — поле + кнопка; filled — в поле код и крестик очистки;
 * applied — поле пустое, ниже PromoChip применённого кода; error — поле с border/danger и текст ошибки под рядом.
 *
 * Figma → props: Title → title, Error text → errorText, State → state (collapsed | empty | filled | applied | error).
 * Значение поля — v-model (`modelValue`), код применённого промокода — `appliedCode`.
 * События: toggle (клик по заголовку в collapsed), apply, clear (крестик в поле), remove (крестик PromoChip).
 */
import { computed } from 'vue';
import Icon from '../Icon/Icon.vue';
import Input from '../Input/Input.vue';
import ButtonFront from '../ButtonFront/ButtonFront.vue';
import PromoChip from '../PromoChip/PromoChip.vue';

export type CouponState = 'collapsed' | 'empty' | 'filled' | 'applied' | 'error';

const props = withDefaults(
  defineProps<{
    state?: CouponState;
    title?: string;
    errorText?: string;
    modelValue?: string;
    placeholder?: string;
    applyLabel?: string;
    /** Код применённого промокода (состояние applied). */
    appliedCode?: string;
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma.
    state: 'collapsed',
    title: 'Додати промокод',
    errorText: 'Неправильний код',
    modelValue: '',
    placeholder: 'Промокод або подарунковий сертифікат',
    applyLabel: 'Застосувати',
    appliedCode: 'SMART10',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  toggle: [];
  apply: [];
  clear: [];
  remove: [];
}>();

const collapsed = computed(() => props.state === 'collapsed');
const showRow = computed(() => props.state !== 'collapsed');
</script>

<template>
  <div class="ds-coupon" :class="`ds-coupon--${state}`">
    <component
      :is="collapsed ? 'button' : 'div'"
      class="ds-coupon__header"
      :type="collapsed ? 'button' : undefined"
      :aria-expanded="collapsed ? false : undefined"
      @click="collapsed && emit('toggle')"
    >
      <span class="ds-coupon__icon"><Icon name="coupon-16" /></span>
      <span class="ds-coupon__title">{{ title }}</span>
      <Icon v-if="collapsed" name="plus-16" />
    </component>

    <div v-if="showRow" class="ds-coupon__group">
      <div class="ds-coupon__row">
        <div class="ds-coupon__field">
          <Input
            :model-value="modelValue"
            :placeholder="placeholder"
            :show-label="false"
            label-position="left"
            size="m"
            :error="state === 'error'"
            hint=""
            :clearable="state === 'filled' || state === 'error'"
            @update:model-value="emit('update:modelValue', $event)"
            @clear="emit('clear')"
          />
        </div>
        <ButtonFront type="primary" size="m" :label="applyLabel" @click="emit('apply')" />
      </div>
      <p v-if="state === 'error'" class="ds-coupon__error">{{ errorText }}</p>
    </div>

    <div v-if="state === 'applied'" class="ds-coupon__codes">
      <PromoChip :code="appliedCode" @remove="emit('remove')" />
    </div>
  </div>
</template>

<style scoped>
.ds-coupon {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  box-sizing: border-box;
  width: 100%;
  padding: var(--space-12) var(--space-16);
  border: var(--stroke-thin) solid var(--border-card);
  border-radius: var(--radius-12);
  background: var(--surface-default);
  color: var(--text-primary);
}

.ds-coupon__header {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  box-sizing: border-box;
  width: 100%;
  height: var(--space-24);
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: var(--typo-paragraph-p1);
  text-align: left;
}
button.ds-coupon__header {
  cursor: pointer;
}
button.ds-coupon__header:focus-visible {
  outline: var(--stroke-bold) solid var(--border-input-active);
  outline-offset: 1px;
}
.ds-coupon__icon {
  display: inline-flex;
  color: var(--icon-strong);
}
.ds-coupon__title {
  flex: 1 1 0;
  min-width: 0;
}

.ds-coupon__group {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.ds-coupon__row {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}
.ds-coupon__field {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
}
.ds-coupon__error {
  margin: 0;
  color: var(--text-danger);
  font: var(--typo-form-input-text);
}

.ds-coupon__codes {
  display: flex;
  gap: var(--space-8);
}
</style>
