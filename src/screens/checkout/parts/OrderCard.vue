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
  promoFormVisible, openPromoInput, closePromoInput, discountsBlocked, wholesaleTiers, setWholesaleQty, crossedPrice, wholesaleOldSum,
} from '../../../data/checkout';

// scrollHint (accordion variant): item count in the title + a fade at the bottom of the list while more items
// are hidden below — the cut-off list otherwise gives no sign it scrolls.
// split (/checkout-v2, Figma 1:1048 order-box): two cards — the summary (promo, warning, totals) on top, then the items
// card with its own title «Ваше замовлення · N товарів» and the list. Same DOM, arranged by CSS (order + borders).
// promoAlways (/checkout-v2-comment, with split): no chips row and no «Додати код» — the promo field is always shown;
// an applied code is seen only as its discount line in the totals (removable there, Figma 1:1172).
// summaryOnly (/checkout-mobile, with split): only the summary card (promo, warning, totals) — the screen shows the
// items itself; an empty cart renders nothing here.
// itemsOnly (/checkout-v2-paycol, /checkout-v2-three, with split): only the items card — the totals live in another column.
// hideCount (/checkout-v2-display): the title is just «Ваше замовлення», without the item count.
// promoLook 'mobile' (/checkout-mobile): the promo field and its button are the mobile controls (m-field 48 / radius 16,
// m-btn 48 «Ок» from checkout-mobile/parts/mobile.css, applied under the screen root .cm); logic unchanged.
// promoIcon (/checkout-v2-steps, /checkout-v2-steps-plain): the discount icon coupon-16 left in the promo field.
const props = withDefaults(defineProps<{ scrollHint?: boolean; split?: boolean; promoAlways?: boolean; summaryOnly?: boolean; itemsOnly?: boolean; hideCount?: boolean; promoLook?: 'ds' | 'mobile'; promoIcon?: boolean }>(), {
  scrollHint: false,
  split: false,
  promoAlways: false,
  summaryOnly: false,
  itemsOnly: false,
  hideCount: false,
  promoLook: 'ds',
  promoIcon: false,
});

const router = useRouter();
const promoForm = ref<HTMLFormElement | null>(null);

function goods(n: number): string {
  const d = n % 10, dd = n % 100;
  if (d === 1 && dd !== 11) return `${n} товар`;
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return `${n} товари`;
  return `${n} товарів`;
}
const title = computed(() =>
  (props.scrollHint || props.split) && !props.hideCount && !isEmpty.value ? `Ваше замовлення · ${goods(checkout.lines.length)}` : 'Ваше замовлення',
);

const itemsEl = ref<HTMLElement | null>(null);
const moreBelow = ref(false);
/** split: the items title gets its bottom border only while the list is scrolled (Figma 1:1164). */
const scrolled = ref(false);
function updateMore() {
  const el = itemsEl.value;
  moreBelow.value = !!el && el.scrollHeight - el.scrollTop - el.clientHeight > 1;
  scrolled.value = !!el && el.scrollTop > 0;
}
function onItemsScroll() {
  if (props.scrollHint || props.split) updateMore();
}
let ro: ResizeObserver | null = null;
onMounted(() => {
  if (!props.scrollHint && !props.split) return;
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
/**
 * split (Figma 1:1167): the same logic as the other screens — no code: the field alone; codes applied: chips +
 * «Додати код», the field opens under the row; a repeat click keeps it; a click elsewhere (while empty) or Esc hides it. No close button.
 */
// The field is open while asked for, and always while no code is applied (as on the other screens).
const formOpen = promoFormVisible;
const closeForm = closePromoInput;
/**
 * Click elsewhere closes the field only while it is empty — a typed code is not lost.
 * Focus moving to «Додати код» (split) is not «elsewhere»: the field stays, the click just focuses it — no flicker.
 */
function onFormFocusOut(e: FocusEvent) {
  const next = e.relatedTarget as HTMLElement | null;
  if (next && promoForm.value?.contains(next)) return;
  if (next?.closest?.('.order__add-code')) return;
  if (!checkout.promoInput.trim()) closeForm();
}
</script>

<template>
  <div
    v-if="!(summaryOnly && isEmpty)"
    class="order"
    :class="{ 'order--split': split, 'order--mobile': promoLook === 'mobile', 'is-empty': isEmpty }"
  >
    <div v-if="!summaryOnly" class="order__title" :class="{ 'is-scrolled': split && scrolled }">
      <SectionTitle size="m" :title="title" :show-action="false" />
    </div>

    <div v-if="!isEmpty && !itemsOnly" class="order__summary">
      <!-- split: the promo row first, the field under it (Figma 1:1167). -->
      <!-- The row exists only while codes are applied; with none the field alone is shown (as on /checkout-accordion). -->
      <div v-if="split && !promoAlways && checkout.promos.length" class="order__promo">
        <div class="order__chips">
          <PromoChip v-for="code in checkout.promos" :key="code" :code="code" @remove="removePromo(code)" />
        </div>
        <ButtonFront class="order__add-code" type="flat" size="m" label="Додати код" show-left-icon @click="onAddCode">
          <template #left><Icon name="plus-16" /></template>
        </ButtonFront>
      </div>
      <!-- Flow «додати купон» (Figma 1903:76187): the field replaces the chips row; Esc returns to the chips. -->
      <form
        v-if="formOpen || promoAlways"
        ref="promoForm"
        class="order__promo-form"
        @submit.prevent="applyPromo"
        @keydown.esc="!promoAlways && closeForm()"
        @focusout="!promoAlways && onFormFocusOut($event)"
      >
        <!-- Close (back to the chips) — only when there are applied codes to go back to; not in split. -->
        <ButtonFront
          v-if="checkout.promos.length && !split"
          type="flat"
          size="m"
          :show-label="false"
          show-left-icon
          aria-label="Закрити"
          @click="closePromoInput"
        >
          <template #left><Icon name="cross-16" /></template>
        </ButtonFront>
        <template v-if="promoLook === 'mobile'">
          <div class="order__promo-input">
            <input
              v-model="checkout.promoInput"
              class="m-field"
              :class="{ 'is-error': !!checkout.promoError }"
              type="text"
              placeholder="Промокод або сертифікат"
              aria-label="Промокод або подарунковий сертифікат"
              autocapitalize="characters"
              :aria-invalid="!!checkout.promoError || undefined"
              @input="checkout.promoError = ''"
            />
            <p v-if="checkout.promoError" class="m-error">{{ checkout.promoError }}</p>
          </div>
          <button type="submit" class="m-btn m-btn--primary order__promo-ok">Ок</button>
        </template>
        <Input
          v-else
          v-model="checkout.promoInput"
          class="order__promo-input"
          :show-label="false"
          placeholder="Промокод або подарунковий сертифікат"
          clearable
          :left-icon="promoIcon ? 'coupon-16' : undefined"
          :error="!!checkout.promoError"
          :hint="checkout.promoError"
          @update:model-value="checkout.promoError = ''"
        />
        <ButtonFront v-if="promoLook !== 'mobile'" type="primary" size="m" native-type="submit" label="Застосувати" />
      </form>
      <div v-else-if="!split" class="order__promo">
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
          <!-- split: the discount can be removed right here (Figma 1:1172, cross in DiscountLine). -->
          <DiscountLine
            v-for="d in discountLines"
            :key="d.label"
            :label="d.label"
            :amount="money(-d.amount)"
            :removable="split"
            :remove-look="promoLook === 'mobile' ? 'delete' : 'cross'"
            @remove="removePromo(d.label)"
          />
        </template>
      </OrderSummary>
    </div>

    <div v-if="!isEmpty && !summaryOnly" class="order__list" :class="{ 'has-more': scrollHint && moreBelow }">
    <div ref="itemsEl" class="order__items" @scroll.passive="onItemsScroll">
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
          :old-price="crossedPrice(l) !== undefined ? money(crossedPrice(l)!) : undefined"
          :show-old-price="crossedPrice(l) !== undefined"
          :price="money(unitPrice(l))"
          :sum="money(lineSum(l))"
          :old-sum="wholesaleOldSum(l) !== undefined ? money(wholesaleOldSum(l)!) : undefined"
          :quantity="l.qty"
          :min-quantity="l.minQty"
          :show-min-order="!!l.minOrderText"
          :min-order-text="l.minOrderText"
          :show-wholesale="!!l.wholesale?.length"
          :wholesale-tiers="wholesaleTiers(l)"
          :show-discount="showSmart(l)"
          :discount-label="l.smart ? `${l.smart.label} (−${money(l.smart.amount)})` : undefined"
          :show-electronic="!!l.electronic"
          :show-counter="!l.electronic"
          :show-gift="!!l.gift"
          :gift="l.gift ? { title: l.gift.title, oldPrice: money(l.gift.oldPrice), image: l.gift.image } : undefined"
          @update:quantity="setQty(l.id, $event)"
          @delete="removeLine(l.id)"
          @wholesale-tier="setWholesaleQty(l.id, $event)"
        />
      </template>
    </div>
    </div>

    <div v-else-if="!summaryOnly" class="order__empty">
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
  /* auto (not contain): at the end of the list the wheel goes on to scroll the page. */
  overscroll-behavior: auto;
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
.order__promo-ok {
  flex: none;
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

/* ---------- split (Figma 1:1048 order-box): summary card, gap 16, items card ---------- */
.order--split {
  gap: var(--space-16);
  /* the window minus the column padding (32 top / 16 bottom) — the items card scrolls inside */
  border: 0;
  border-radius: 0;
  background: none;
}
.order--split .order__summary {
  order: 1;
  padding: var(--space-16) 0;
  border: var(--stroke-thin) solid var(--border-card);
  border-radius: var(--radius-8);
  background: var(--surface-default);
}
/* Items card = title (order 2, top half) + list (order 3, bottom half), one frame border/card radius 8. */
.order--split .order__title {
  order: 2;
  margin-bottom: calc(-1 * var(--space-16));
  padding: var(--space-16) var(--space-16) 0;
  border: var(--stroke-thin) solid var(--border-card);
  border-bottom: 0;
  border-radius: var(--radius-8) var(--radius-8) 0 0;
  background: var(--surface-default);
}
.order--split .order__list {
  order: 3;
  border: var(--stroke-thin) solid var(--border-card);
  border-top: 0;
  border-radius: 0 0 var(--radius-8) var(--radius-8);
  background: var(--surface-default);
  overflow: hidden;
}
.order--split .order__empty {
  order: 3;
  border: var(--stroke-thin) solid var(--border-card);
  border-top: 0;
  border-radius: 0 0 var(--radius-8) var(--radius-8);
  background: var(--surface-default);
}
/* Figma 1:1164: the items title row is 32 + a 1 px bottom border (33) that shows only while the list is scrolled. */
.order--split .order__title :deep(.ds-section-title) {
  box-sizing: border-box;
  min-height: calc(var(--space-32) + var(--stroke-thin));
  align-items: flex-start;
  border-bottom: var(--stroke-thin) solid transparent;
  transition: border-color 0.15s ease;
}
.order--split .order__title.is-scrolled :deep(.ds-section-title) {
  border-bottom-color: var(--border-divider);
}
/* Figma 1:1173: items sit inside the card padding (16), so the dividers between them stop 16 short of each edge. */
.order--split .order__items > :deep(.ci) {
  box-shadow: none;
}
.order--split .order__items > :deep(.ci:not(:last-child))::after {
  content: '';
  position: absolute;
  left: var(--space-16);
  right: var(--space-16);
  bottom: 0;
  border-bottom: var(--stroke-thin) solid var(--border-card);
  pointer-events: none;
}
/*
 * promoLook 'mobile' (/checkout-mobile, Figma Checkout-v2 summary 107:6823): the card pads 16 (8 at the bottom — the
 * last 40 row already has air), blocks (promo · warning · totals) 16 apart; the totals rows are 40 high with no gap
 * between them; «Загальна сума» regular 14. The discount is removed by a 40 button with delete-24 (DiscountLine removeLook).
 */
.order--mobile .order__summary {
  padding: var(--space-16) var(--space-16) var(--space-8);
}
.order--mobile .order__promo-form,
.order--mobile .order__warning {
  padding: 0;
}
.order--mobile .order__summary :deep(.ds-order-summary) {
  gap: 0;
  padding: 0;
}
.order--mobile .order__summary :deep(.ds-order-summary__row),
.order--mobile .order__summary :deep(.ds-discount-line),
.order--mobile .order__summary :deep(.ds-order-summary__total) {
  min-height: var(--space-40);
}
.order--mobile .order__summary :deep(.ds-order-summary__total-label) {
  font: var(--typo-paragraph-p1);
}

/* Figma 1:1167: the promo field sits 8 under the promo row (the summary itself keeps 16 between blocks). */
.order--split .order__promo + .order__promo-form {
  margin-top: calc(var(--space-8) - var(--space-16));
}
</style>
