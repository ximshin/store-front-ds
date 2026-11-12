<script setup lang="ts">
/**
 * DiscountLine — строка скидки в итогах корзины/заказа (Figma 6215:69): иконка 16 (icon/primary) + название
 * (DS/Paragraph/P1) слева, сумма (DS/Paragraph/P1, text/price) справа. Ширина — Fill, высота 20.
 * Не путать с DiscountLabel (метка у товара).
 *
 * Figma → props: Label → label, Amount → amount; иконка — prop `icon` (по умолчанию coupon-16, icon/primary).
 */
import Icon from '../Icon/Icon.vue';

withDefaults(defineProps<{ label?: string; amount?: string; icon?: string }>(), {
  label: 'Накопичувальна знижка',
  amount: '−20 грн',
  icon: 'coupon-16',
});
</script>

<template>
  <div class="ds-discount-line">
    <span class="ds-discount-line__title">
      <span class="ds-discount-line__icon"><Icon :name="icon" /></span>
      <span class="ds-discount-line__label"><slot>{{ label }}</slot></span>
    </span>
    <span class="ds-discount-line__amount">{{ amount }}</span>
  </div>
</template>

<style scoped>
.ds-discount-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  width: 100%;
  min-height: var(--space-20);
}
.ds-discount-line__title {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}
.ds-discount-line__icon {
  display: inline-flex;
  color: var(--icon-primary);
}
.ds-discount-line__label {
  font: var(--typo-paragraph-p1);
  color: var(--text-primary);
}
.ds-discount-line__amount {
  font: var(--typo-paragraph-p1);
  color: var(--text-price);
  white-space: nowrap;
}
</style>
