<script setup lang="ts">
/**
 * CartButton — корзина в шапке (Figma 6209:57): иконка cart-24 (icon/strong) + счётчик (surface/action/primary,
 * DS/Special/Counter, text/primary-white, обводка border/on-color) + сумма (DS/Form/Button M label).
 *
 * Figma → props: Count → count, Price → price, Show count? → showCount, Show price? → showPrice.
 */
import Icon from '../Icon/Icon.vue';

withDefaults(
  defineProps<{
    count?: string;
    price?: string;
    showCount?: boolean;
    showPrice?: boolean;
    nativeType?: 'button' | 'submit' | 'reset';
  }>(),
  { count: '1', price: '1 299 грн', showCount: true, showPrice: true, nativeType: 'button' },
);

defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
  <button class="ds-cart-button" :type="nativeType" aria-label="Кошик" @click="$emit('click', $event)">
    <span class="ds-cart-button__icon">
      <Icon name="cart-24" :size="24" />
      <span v-if="showCount" class="ds-cart-button__badge">{{ count }}</span>
    </span>
    <span v-if="showPrice" class="ds-cart-button__price">{{ price }}</span>
  </button>
</template>

<style scoped>
.ds-cart-button {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: var(--space-8);
  margin: 0;
  padding: var(--space-8) var(--space-12);
  border: 0;
  border-radius: var(--radius-8);
  background: transparent;
  color: var(--text-primary);
  font: var(--typo-form-button-m-label);
  white-space: nowrap;
  cursor: pointer;
}
.ds-cart-button:focus-visible {
  outline: none;
}
.ds-cart-button__icon {
  position: relative;
  display: inline-flex;
  width: var(--space-24);
  height: var(--space-24);
  color: var(--icon-strong);
}
/* Счётчик поверх иконки (абсолютное позиционирование — наложение, как в Figma): left 12, top -6. */
.ds-cart-button__badge {
  position: absolute;
  top: calc(var(--space-neg-4) + var(--space-neg-2));
  left: var(--space-12);
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--space-16);
  padding: 0 var(--space-4);
  border: var(--stroke-thin) solid var(--border-on-color);
  border-radius: var(--radius-full);
  background: var(--surface-action-primary);
  color: var(--text-primary-white);
  font: var(--typo-special-counter);
}
</style>
