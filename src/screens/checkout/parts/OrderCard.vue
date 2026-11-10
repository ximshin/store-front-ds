<script setup lang="ts">
// Local block of the checkout screen: «Ваше замовлення» card (Figma «order» in Checkout Tabs — Desktop).
// Built only from base components + tokens. Static content as in the mockup — no handlers, no data layer.
import { SectionTitle, PromoChip, ButtonFront, OrderSummary, CartItem } from '../../../main';

const bundleClothes = [
  { title: 'Футболка чоловіча Basic, темно-синя', oldPrice: '899 грн', price: '749 грн' },
  { title: 'Комбінезон джинсовий жіночий Relaxed Fit, світло-блакитний', oldPrice: '2 499 грн', price: '2 199 грн' },
];
const bundleAutumn = [
  { title: 'Футболка жіноча Slim, бордова', oldPrice: '799 грн', price: '649 грн' },
  { title: 'Світшот «Хвилі», сірий меланж', oldPrice: '1 899 грн', price: '1 599 грн' },
];
</script>

<template>
  <div class="order">
    <div class="order__title">
      <SectionTitle size="m" title="Ваше замовлення" :show-action="false" />
    </div>

    <div class="order__summary">
      <div class="order__promo">
        <PromoChip code="SMART10" />
        <ButtonFront type="flat" size="m" label="Додати код" show-left-icon />
      </div>
      <OrderSummary
        :show-title="false"
        :show-discount="false"
        :show-divider="false"
        :show-button="false"
        items-label="Проміжна сума"
        items-total="215 280 грн"
        delivery-label="Доставка"
        delivery-value="за тарифами перевізника"
        total-label="Загальна сума"
        total="215 280 грн"
      />
    </div>

    <div class="order__items">
      <CartItem
        size="compact"
        title="Навушники Apple AirPods Max, Space Gray"
        old-price="25 999 грн"
        price="21 999 грн"
        sum="43 998 грн"
        :quantity="2"
        :show-min-order="false"
        show-wholesale
        wholesale-text="додайте ще 3 одиниці та заощадьте 1 200 грн"
        :show-gift="false"
      />
      <CartItem type="bundle" size="compact" :items="bundleClothes" old-sum="3 398 грн" sum="2 948 грн" :quantity="1" />
      <CartItem
        size="compact"
        title="Apple iPhone 15 Pro 128GB Natural Titanium"
        old-price="49 999 грн"
        price="47 499 грн"
        sum="94 998 грн"
        :quantity="2"
        show-discount
        discount-label="smart-5 (−2 500 грн)"
        min-order-text="Замовлення від 2 шт."
        :show-gift="false"
      />
      <CartItem
        size="compact"
        title="Сукня-футболка оверсайз, сіра"
        old-price="1 290 грн"
        price="990 грн"
        sum="990 грн"
        :quantity="1"
        :show-min-order="false"
        show-gift
        :gift="{ title: 'Свічка ароматична «№7» — подарунок', oldPrice: '450 грн' }"
      />
      <CartItem type="bundle" size="compact" :items="bundleAutumn" old-sum="2 698 грн" sum="2 248 грн" :quantity="1" />
      <CartItem
        size="compact"
        title="Apple MacBook Air 13 M3, 16/512GB, Midnight"
        old-price="64 999 грн"
        price="61 999 грн"
        sum="61 999 грн"
        :quantity="1"
        show-discount
        discount-label="smart-10 (−3 000 грн)"
        min-order-text="Замовлення від 1 шт."
        :show-gift="false"
      />
      <CartItem
        size="compact"
        title="AppleCare+ для iPhone 15 Pro, 2 роки (електронний ключ)"
        old-price="8 999 грн"
        price="8 099 грн"
        sum="8 099 грн"
        :show-min-order="false"
        show-discount
        discount-label="smart-10 (−900 грн)"
        show-electronic
        :show-counter="false"
        :show-gift="false"
      />
    </div>
  </div>
</template>

<style scoped>
.order {
  overflow: hidden;
  border: var(--stroke-thin) solid var(--border-card);
  border-radius: var(--radius-8);
  background: var(--surface-default);
}
.order__title {
  padding: var(--space-16);
}
.order__title :deep(.ds-section-title) {
  padding-bottom: 0;
}
.order__summary {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding: var(--space-16) 0;
  border-top: var(--stroke-thin) solid var(--border-card);
  border-bottom: var(--stroke-thin) solid var(--border-card);
}
.order__promo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-16);
}
/* OrderSummary inside the card: no own frame (as in the mockup). */
.order__summary :deep(.ds-order-summary) {
  border: 0;
  border-radius: 0;
  background: none;
  padding-top: 0;
  padding-bottom: 0;
}
/* Mockup: summary keys are text/primary (instance override in Figma). */
.order__summary :deep(.ds-order-summary__key) {
  color: var(--text-primary);
}
.order__items > :last-child {
  border-bottom: 0;
}
</style>
