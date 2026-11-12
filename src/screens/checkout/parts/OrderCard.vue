<script setup lang="ts">
// Local block of the checkout screen: «Ваше замовлення» card. Wired to the mock store:
// quantities, deletion, promo codes, totals, empty cart.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { SectionTitle, PromoChip, ButtonFront, OrderSummary, DiscountLine, CartItem, Input, EmptyState, Icon, Warning } from '../../../main';
import { money } from '../../../data/format';
import {
  checkout, isEmpty, grossSubtotal, discountLines, deliveryText, total,
  unitPrice, showSmart, lineSum, bundleOldSum, setQty, removeLine, applyPromo, removePromo,
  promoFormVisible, openPromoInput, closePromoInput, discountsBlocked, wholesaleHint, addToWholesale,
} from '../../../data/checkout';

// scrollHint (accordion variant): item count in the title + a fade at the bottom of the list while more items
// are hidden below — the cut-off list otherwise gives no sign it scrolls.
const props = withDefaults(defineProps<{ scrollHint?: boolean }>(), { scrollHint: false });

const router = useRouter();
const promoForm = ref<HTMLFormElement | null>(null);

function goods(n: number): string {
  const d = n % 10, dd = n % 100;
  if (d === 1 && dd !== 11) return `${n} товар`;
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return `${n} товари`;
  return `${n} товарів`;
}
const title = computed(() =>
  props.scrollHint && !isEmpty.value ? `Ваше замовлення · ${goods(checkout.lines.length)}` : 'Ваше замовлення',
);

const itemsEl = ref<HTMLElement | null>(null);
const moreBelow = ref(false);
function updateMore() {
  const el = itemsEl.value;
  moreBelow.value = !!el && el.scrollHeight - el.scrollTop - el.clientHeight > 1;
}
let ro: ResizeObserver | null = null;
onMounted(() => {
  if (!props.scrollHint) return;
  ro = new ResizeObserver(updateMore);
  if (itemsEl.value) ro.observe(itemsEl.value);
  updateMore();
});
onBeforeUnmount(() => ro?.disconnect());
watch(() => checkout.lines.length, () => nextTick(updateMore));

async function onAddCode() {
  openPromoInput();
  await nextTick();
  promoForm.value?.querySelector('input')?.focus();
}
/** Click elsewhere closes the field only while it is empty — a typed code is not lost. */
function onFormFocusOut(e: FocusEvent) {
  const next = e.relatedTarget as Node | null;
  if (next && promoForm.value?.contains(next)) return;
  if (!checkout.promoInput.trim()) closePromoInput();
}
</script>

<template>
  <div class="order">
    <div class="order__title">
      <SectionTitle size="m" :title="title" :show-action="false" />
    </div>

    <div v-if="!isEmpty" class="order__summary">
      <!-- Flow «додати купон» (Figma 1903:76187): the field replaces the chips row; Esc returns to the chips. -->
      <form
        v-if="promoFormVisible"
        ref="promoForm"
        class="order__promo-form"
        @submit.prevent="applyPromo"
        @keydown.esc="closePromoInput"
        @focusout="onFormFocusOut"
      >
        <!-- Close (back to the chips) — only when there are applied codes to go back to. -->
        <ButtonFront
          v-if="checkout.promos.length"
          type="flat"
          size="m"
          :show-label="false"
          show-left-icon
          aria-label="Закрити"
          @click="closePromoInput"
        >
          <template #left><Icon name="cross-16" /></template>
        </ButtonFront>
        <Input
          v-model="checkout.promoInput"
          class="order__promo-input"
          :show-label="false"
          placeholder="Промокод або подарунковий сертифікат"
          clearable
          :error="!!checkout.promoError"
          :hint="checkout.promoError"
          @update:model-value="checkout.promoError = ''"
        />
        <ButtonFront type="primary" size="m" native-type="submit" label="Застосувати" />
      </form>
      <div v-else class="order__promo">
        <div class="order__chips">
          <PromoChip v-for="code in checkout.promos" :key="code" :code="code" @remove="removePromo(code)" />
        </div>
        <ButtonFront type="flat" size="m" label="Додати код" show-left-icon @click="onAddCode">
          <template #left><Icon name="plus-16" /></template>
        </ButtonFront>
      </div>
      <!-- Figma (copy «Checkout — DS», summary 1950:21022): the warning sits between the promo row and the totals. -->
      <div v-if="discountsBlocked" class="order__warning">
        <Warning
          type="warning"
          text="Знижки не діють під час оплати цим способом"
          tooltip="«Покупка частинами» має власні умови банку, тому промокоди й знижки до неї не застосовуються."
        />
      </div>
      <OrderSummary
        :show-title="false"
        :show-divider="false"
        :show-button="false"
        :show-discount="false"
        items-label="Проміжна сума"
        :items-total="money(grossSubtotal)"
        delivery-label="Доставка"
        :delivery-value="deliveryText"
        total-label="Загальна сума"
        :total="money(total)"
      >
        <!-- One line per code, as in the mockup: «SMART10  −… грн». -->
        <template #discounts>
          <DiscountLine v-for="d in discountLines" :key="d.label" :label="d.label" :amount="money(-d.amount)" />
        </template>
      </OrderSummary>
    </div>

    <div v-if="!isEmpty" class="order__list" :class="{ 'has-more': scrollHint && moreBelow }">
    <div ref="itemsEl" class="order__items" @scroll.passive="scrollHint && updateMore()">
      <template v-for="l in checkout.lines" :key="l.id">
        <CartItem
          v-if="l.type === 'bundle'"
          type="bundle"
          size="compact"
          :items="(l.parts ?? []).map((p) => ({ title: p.title, oldPrice: money(p.oldPrice), price: money(p.price), image: p.image }))"
          :old-sum="money(bundleOldSum(l))"
          :sum="money(lineSum(l))"
          :quantity="l.qty"
          @update:quantity="setQty(l.id, $event)"
          @delete="removeLine(l.id)"
        />
        <CartItem
          v-else
          size="compact"
          :title="l.title"
          :image="l.image"
          :old-price="l.oldPrice ? money(l.oldPrice) : undefined"
          :show-old-price="!!l.oldPrice && unitPrice(l) !== l.oldPrice"
          :price="money(unitPrice(l))"
          :sum="money(lineSum(l))"
          :quantity="l.qty"
          :min-quantity="l.minQty"
          :show-min-order="!!l.minOrderText"
          :min-order-text="l.minOrderText"
          :show-wholesale="!!wholesaleHint(l)"
          :wholesale-text="wholesaleHint(l)"
          :show-discount="showSmart(l)"
          :discount-label="l.smart ? `${l.smart.label} (−${money(l.smart.amount)})` : undefined"
          :show-electronic="!!l.electronic"
          :show-counter="!l.electronic"
          :show-gift="!!l.gift"
          :gift="l.gift ? { title: l.gift.title, oldPrice: money(l.gift.oldPrice), image: l.gift.image } : undefined"
          @update:quantity="setQty(l.id, $event)"
          @delete="removeLine(l.id)"
          @wholesale="addToWholesale(l.id)"
        />
      </template>
    </div>
    </div>

    <div v-else class="order__empty">
      <EmptyState type="cart" action="Повернутись до покупок" @action="router.push('/')" />
    </div>
  </div>
</template>

<style scoped>
.order {
  display: flex;
  flex-direction: column;
  /* Desktop: not taller than the window (column padding 32 top / 16 bottom) — the item list scrolls inside. */
  max-height: calc(100vh - var(--space-32) - var(--space-16));
  overflow: hidden;
  border: var(--stroke-thin) solid var(--border-card);
  border-radius: var(--radius-8);
  background: var(--surface-default);
}
.order__title,
.order__summary {
  flex: none;
}
.order__list {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}
/* Fade at the bottom while items are hidden below (scrollHint); gone at the end of the list. */
.order__list::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--space-48);
  background: linear-gradient(to bottom, transparent, var(--surface-default));
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.order__list.has-more::after {
  opacity: 1;
}
/* Scrollbar in DS colours (component scrollbar: track surface/hover, thumb icon/secondary, 4 px). */
.order__items {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--icon-secondary) var(--surface-hover);
}
.order__items::-webkit-scrollbar {
  width: var(--space-4);
}
.order__items::-webkit-scrollbar-track {
  border-radius: var(--radius-full);
  background: var(--surface-hover);
}
.order__items::-webkit-scrollbar-thumb {
  border-radius: var(--radius-full);
  background: var(--icon-secondary);
}
/* Stacked columns (≤ 1100): the page scrolls, no inner scroll. */
@media (max-width: 1100px) {
  .order {
    max-height: none;
  }
  .order__items {
    overflow: visible;
  }
}
/* Figma copy: title without bottom padding, summary without top border. */
.order__title {
  padding: var(--space-16) var(--space-16) 0;
}
.order__title :deep(.ds-section-title) {
  padding-bottom: 0;
}
.order__summary {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding: var(--space-16) 0;
  border-bottom: var(--stroke-thin) solid var(--border-card);
}
.order__promo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  padding: 0 var(--space-16);
}
.order__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
}
.order__promo-form {
  display: flex;
  align-items: flex-start;
  gap: var(--space-8);
  padding: 0 var(--space-16);
}
.order__warning {
  padding: 0 var(--space-16);
}
.order__promo-input {
  flex: 1 1 0;
  min-width: 0;
}
/* OrderSummary inside the card: no own frame (as in the mockup). */
.order__summary :deep(.ds-order-summary) {
  border: 0;
  border-radius: 0;
  background: none;
  padding-top: 0;
  padding-bottom: 0;
  /* Figma: instance override itemSpacing 16. */
  gap: var(--space-16);
}
/* Mockup: summary keys are text/primary (instance override in Figma). */
.order__summary :deep(.ds-order-summary__key) {
  color: var(--text-primary);
}
.order__items > :last-child {
  box-shadow: none;
}
.order__empty {
  display: flex;
  justify-content: center;
  padding: var(--space-32) var(--space-16);
  border-top: var(--stroke-thin) solid var(--border-card);
}
</style>
