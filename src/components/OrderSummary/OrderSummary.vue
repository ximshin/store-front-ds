<script setup lang="ts">
/**
 * OrderSummary — итог корзины/заказа (Figma 6220:152). Карточка border/card, radius/12, отступы space/16, gap space/12.
 * Заголовок (DS/Heading/H4), строки «ключ — значение» (DS/Paragraph/P1, text/secondary / text/primary), DiscountLine,
 * разделитель border/divider, «Всього» + Price L, ButtonFront Primary L на всю ширину.
 * На экране оформления заголовок, строка скидки, разделитель и кнопка скрыты — флаги show*.
 *
 * Figma → props: Title → title, Items label → itemsLabel, Items total → itemsTotal, Delivery label → deliveryLabel,
 * Delivery value → deliveryValue, Total label → totalLabel. Дополнительно: total (сумма), showTitle, showDiscount
 * (+ discountLabel / discountAmount), showDivider, showButton (+ buttonLabel). Клик по кнопке — событие `submit`.
 */
import DiscountLine from '../DiscountLine/DiscountLine.vue';
import Price from '../Price/Price.vue';
import ButtonFront from '../ButtonFront/ButtonFront.vue';

withDefaults(
  defineProps<{
    title?: string;
    itemsLabel?: string;
    itemsTotal?: string;
    deliveryLabel?: string;
    deliveryValue?: string;
    totalLabel?: string;
    total?: string;
    discountLabel?: string;
    discountAmount?: string;
    buttonLabel?: string;
    showTitle?: boolean;
    showDiscount?: boolean;
    showDivider?: boolean;
    showButton?: boolean;
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma.
    title: 'Разом',
    itemsLabel: '3 товари на суму',
    itemsTotal: '80 159 грн',
    deliveryLabel: 'Доставка',
    deliveryValue: 'За тарифами перевізника',
    totalLabel: 'Всього',
    total: '77 159 грн',
    discountLabel: 'Знижка за промокодом',
    discountAmount: '−3 000 грн',
    buttonLabel: 'Оформити замовлення',
    showTitle: true,
    showDiscount: true,
    showDivider: true,
    showButton: true,
  },
);

defineEmits<{ submit: [event: MouseEvent] }>();
</script>

<template>
  <div class="ds-order-summary">
    <p v-if="showTitle" class="ds-order-summary__title">{{ title }}</p>
    <div class="ds-order-summary__row">
      <span class="ds-order-summary__key">{{ itemsLabel }}</span>
      <span class="ds-order-summary__value">{{ itemsTotal }}</span>
    </div>
    <!-- Слот `discounts` — несколько строк скидок (по одной на код); без слота — одна DiscountLine из props.
         Пустой слот Vue считает отсутствующим и рисует запасную строку — со слотом передавайте :show-discount="false". -->
    <slot name="discounts">
      <DiscountLine v-if="showDiscount" :label="discountLabel" :amount="discountAmount" />
    </slot>
    <div class="ds-order-summary__row">
      <span class="ds-order-summary__key">{{ deliveryLabel }}</span>
      <span class="ds-order-summary__value">{{ deliveryValue }}</span>
    </div>
    <div v-if="showDivider" class="ds-order-summary__divider" />
    <div class="ds-order-summary__total">
      <span class="ds-order-summary__total-label">{{ totalLabel }}</span>
      <Price :price="total" :show-old-price="false" size="l" />
    </div>
    <ButtonFront
          block
      v-if="showButton"
      class="ds-order-summary__button"
      type="primary"
      size="l"
      :label="buttonLabel"
      @click="$emit('submit', $event)"
    />
  </div>
</template>

<style scoped>
.ds-order-summary {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-12);
  box-sizing: border-box;
  width: 100%;
  padding: var(--space-16);
  border: var(--stroke-thin) solid var(--border-card);
  border-radius: var(--radius-12);
  background: var(--surface-default);
  color: var(--text-primary);
}

.ds-order-summary__title {
  margin: 0;
  font: var(--typo-heading-h4);
  color: var(--text-primary);
}
.ds-order-summary__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  font: var(--typo-paragraph-p1);
}
.ds-order-summary__key {
  color: var(--text-secondary);
}
.ds-order-summary__value {
  color: var(--text-primary);
  text-align: right;
}
.ds-order-summary__divider {
  height: var(--stroke-thin);
  background: var(--border-divider);
}
.ds-order-summary__total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
}
.ds-order-summary__total-label {
  font: var(--typo-special-special-14-bold);
  color: var(--text-primary);
}
.ds-order-summary__button {
  display: flex;
}
</style>
