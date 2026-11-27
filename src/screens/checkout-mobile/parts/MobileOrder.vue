<script setup lang="ts">
// Local block of /checkout-mobile: the items card «Ваше замовлення · N товарів», above the form (under the summary).
// Card look — as the desktop items card (border/card, radius 8, title row); rows — as the shop's mobile checkout
// (photo 64, name, unit price, line sum, counter, delete). Many items would push the form far down, so the list
// folds: collapsed it shows a strip of photos (up to 4 + «+N»); open by default only for 1–2 items.
// Promo, discounts and totals — in the summary card above (OrderCard summaryOnly, as on desktop).
// Row content — as the desktop CartItem Compact (2026-11-24): crossed «was» price, smart label, min order, electronic
// tag (no counter), wholesale tiers (tap sets the qty; a reached tier — the line sum crossed above), the gift under the
// item, a bundle «Разом дешевше» with its parts and old prices. The (i) hint of the gift is a hover tooltip on desktop —
// here the text «за 1 грн» is shown instead.
import { computed, ref } from 'vue';
import { Counter, Icon, DiscountLabel, GiftTag, InfoTag } from '../../../main';
import {
  checkout, setQty, removeLine, unitPrice, lineSum, isEmpty, crossedPrice, wholesaleOldSum, wholesaleTiers,
  setWholesaleQty, showSmart, bundleOldSum, subtotal, type CartLine,
} from '../../../data/checkout';
import { money } from '../../../data/format';

/**
 * look 'ref' (/checkout-mobile — main since 2026-11-25; look 'desktop' — /checkout-mobile-desktop-items): rows laid out as the shop's new mobile cart
 * (new-cart.lb.stage.horoshop.ua/checkout/?v=mobile — .cart-item / .cart-set):
 * - product: photo 64 + content column; name 13 (text/primary, as desktop); price row — «price  ~~old~~» on the left
 *   (old wraps under when there is no room, 8 apart), the line sum bold on the right; under it counter ↔ delete (16 above);
 * - set: «Разом дешевше» (bold 14, text/sale) over the first part's name; first part photo 64, the others 44
 *   indented 20; each part with its regular price; footer under the content column: «set price  ~~old~~», the sum bold
 *   (wraps under), then counter ↔ delete.
 * Not in the reference (desktop features, placed in the content column): smart label under the name, min order,
 * electronic tag, wholesale tiers and the gift under the buttons.
 */
const props = withDefaults(defineProps<{ look?: 'desktop' | 'ref' }>(), { look: 'desktop' });

const MAX_THUMBS = 4;
const open = ref(checkout.lines.length <= 2);

function goods(n: number): string {
  const d = n % 10, dd = n % 100;
  if (d === 1 && dd !== 11) return `${n} товар`;
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return `${n} товари`;
  return `${n} товарів`;
}
function title(l: CartLine): string {
  return l.type === 'bundle' ? `${l.title}: ${(l.parts ?? []).map((p) => p.title).join(' + ')}` : l.title;
}
function image(l: CartLine): string | undefined {
  return l.image ?? l.parts?.[0]?.image;
}
const thumbs = computed(() => checkout.lines.slice(0, MAX_THUMBS));
const extra = computed(() => Math.max(0, checkout.lines.length - MAX_THUMBS));

/**
 * look 'ref', folded — mini-cart (Figma Checkout-v2 107:6143): the whole card is one button, padding 8:
 * instead of the mockup's photo stack — the bag icon with a count badge (Figma -HOROSHOP-8318- Checkout 653:11122,
 * 2026-11-25: bag-24 in icon/strong (main black) centred in a 40-wide box; the button is 48 high (12 + 24 + 12); badge — top −6 / right −8, min 16, px 4, pill,
 * surface/action-primary, text 10 regular white, line 16; the count = item rows, as «N товарів»),
 * 16 → «N товарів на X грн» (16, count and sum bold), then the chevron in a 40 box (instead of the mockup's pencil —
 * user's decision). Tap opens the list with the usual title row.
 */
const mini = computed(() => props.look === 'ref' && !isEmpty.value && !open.value);
</script>

<template>
  <section class="mo" :class="{ 'mo--mini': mini }" aria-labelledby="mo-title">
    <h2 v-if="mini" class="mo__heading">
      <button
        id="mo-title"
        type="button"
        class="mm"
        aria-expanded="false"
        aria-controls="mo-list"
        :aria-label="`Ваше замовлення: ${goods(checkout.lines.length)} на ${money(subtotal)}. Показати товари`"
        @click="open = true"
      >
        <span class="mm__bag" aria-hidden="true">
          <span class="mm__bag-icon">
            <Icon name="bag-24" :size="24" />
            <span class="mm__count">{{ checkout.lines.length }}</span>
          </span>
        </span>
        <span class="mm__text">
          <b>{{ checkout.lines.length }}</b> {{ goods(checkout.lines.length).replace(/^\d+ /, '') }} на
          <b>{{ money(subtotal) }}</b>
        </span>
        <span class="mm__toggle">
          <Icon class="mo__chevron" name="arrow-down-16" :size="16" />
        </span>
      </button>
    </h2>
    <h2 v-else-if="isEmpty" id="mo-title" class="mo__head mo__head--static">Ваше замовлення</h2>
    <h2 v-else class="mo__heading">
      <button
        id="mo-title"
        type="button"
        class="mo__head"
        :aria-expanded="open"
        aria-controls="mo-list"
        @click="open = !open"
      >
        <span class="mo__head-text">Ваше замовлення · {{ goods(checkout.lines.length) }}</span>
        <span class="mo__toggle" :aria-label="open ? 'Згорнути' : 'Показати'">
          <Icon class="mo__chevron" :class="{ 'is-open': open }" name="arrow-down-16" :size="16" />
        </span>
      </button>
    </h2>

    <p v-if="isEmpty" class="mo__empty">Кошик порожній — додайте товари, щоб оформити замовлення.</p>

    <!-- mini-cart is the whole card while folded (look 'ref') — no strip, no list. -->
    <template v-else-if="mini" />

    <!-- Collapsed: photo strip; a tap anywhere on it opens the list. -->
    <button v-else-if="!open" type="button" class="mo__thumbs" aria-label="Показати товари" @click="open = true">
      <span v-for="l in thumbs" :key="l.id" class="mo__thumb">
        <img v-if="image(l)" :src="image(l)" alt="" width="48" height="48" />
        <Icon v-else name="no-photo-24" :size="24" />
        <span v-if="l.qty > 1" class="mo__qty">×{{ l.qty }}</span>
      </span>
      <span v-if="extra" class="mo__thumb mo__thumb--more">+{{ extra }}</span>
    </button>

    <!-- look 'ref': rows as the shop's new mobile cart (see the note in the script). -->
    <ul v-else-if="props.look === 'ref'" id="mo-list" class="mo__list">
      <template v-for="l in checkout.lines" :key="l.id">
        <li v-if="l.type === 'bundle'" class="mo__item mr mr--set">
          <div v-for="(p, i) in l.parts ?? []" :key="i" class="mr__set-item">
            <div class="mr__set-photo" :class="{ 'mr__set-photo--small': i > 0 }">
              <img v-if="p.image" :src="p.image" alt="" />
              <Icon v-else name="no-photo-24" :size="24" />
            </div>
            <div class="mr__content">
              <p v-if="i === 0" class="mr__set-header">{{ l.title }}</p>
              <p class="mr__name">{{ p.title }}</p>
              <p class="mr__part-price">{{ money(p.oldPrice) }}</p>
            </div>
          </div>
          <div class="mr__set-footer">
            <div class="mr__price-block">
              <p class="mr__prices">
                <span>{{ money(unitPrice(l)) }}</span>
                <s class="mr__old">{{ money(bundleOldSum(l) / l.qty) }}</s>
              </p>
              <strong class="mr__cost">{{ money(lineSum(l)) }}</strong>
            </div>
            <div class="mr__buttons">
              <Counter :model-value="l.qty" :min="l.minQty ?? 1" @update:model-value="setQty(l.id, $event)" />
              <button type="button" class="m-btn m-btn--small mo__delete" :aria-label="`Видалити «${title(l)}»`" @click="removeLine(l.id)">
                <Icon name="delete-16" :size="16" />
              </button>
            </div>
          </div>
        </li>

        <!-- Product with a gift — as the reference (new-cart …/checkout/?v=mobile, .cart-set with a gift item):
             laid out as a set — the product (photo 64, name, price bold, old price crossed), under it the gift (photo 44
             indented 20, name, «Подарунок» tag + its old price crossed 16 after), then the shared footer under the
             content column: unit price ↔ line sum bold, counter ↔ delete. -->
        <li v-else-if="l.gift" class="mo__item mr mr--set">
          <div class="mr__set-item">
            <div class="mr__set-photo">
              <img v-if="l.image" :src="l.image" alt="" />
              <Icon v-else name="no-photo-24" :size="24" />
            </div>
            <div class="mr__content">
              <p class="mr__name">{{ l.title }}</p>
              <DiscountLabel v-if="showSmart(l) && l.smart" class="mr__smart" :label="`${l.smart.label} (−${money(l.smart.amount)})`" />
              <p class="mr__prices">
                <strong class="mr__cost">{{ money(unitPrice(l)) }}</strong>
                <s v-if="crossedPrice(l) !== undefined" class="mr__old">{{ money(crossedPrice(l)!) }}</s>
              </p>
              <p v-if="l.minOrderText" class="mr__note">{{ l.minOrderText }}</p>
            </div>
          </div>
          <div class="mr__set-item">
            <div class="mr__set-photo mr__set-photo--small">
              <img v-if="l.gift.image" :src="l.gift.image" alt="" />
              <Icon v-else name="no-photo-24" :size="24" />
            </div>
            <div class="mr__content">
              <p class="mr__name">{{ l.gift.title }}</p>
              <p class="mr__gift-price">
                <GiftTag />
                <s class="mr__old">{{ money(l.gift.oldPrice) }}</s>
              </p>
            </div>
          </div>
          <div class="mr__set-footer">
            <div class="mr__price-block">
              <p class="mr__prices">
                <span>{{ money(unitPrice(l)) }}</span>
              </p>
              <p class="mr__cost-box">
                <s v-if="wholesaleOldSum(l) !== undefined" class="mr__old">{{ money(wholesaleOldSum(l)!) }}</s>
                <strong class="mr__cost">{{ money(lineSum(l)) }}</strong>
              </p>
            </div>
            <div class="mr__buttons">
              <Counter :model-value="l.qty" :min="l.minQty ?? 1" @update:model-value="setQty(l.id, $event)" />
              <button type="button" class="m-btn m-btn--small mo__delete" :aria-label="`Видалити «${title(l)}»`" @click="removeLine(l.id)">
                <Icon name="delete-16" :size="16" />
              </button>
            </div>
            <div v-if="l.wholesale?.length" class="mo__tiers mr__extra" role="group" aria-label="Оптові ціни">
              <button
                v-for="t in wholesaleTiers(l)"
                :key="t.quantity"
                type="button"
                class="m-btn mo__tier"
                :class="{ 'm-btn--primary': t.active }"
                :aria-pressed="t.active"
                @click="setWholesaleQty(l.id, t.quantity)"
              >
                {{ t.label }}
              </button>
            </div>
          </div>
        </li>

        <li v-else class="mo__item mr">
          <div class="mr__photo">
            <img v-if="l.image" :src="l.image" alt="" />
            <Icon v-else name="no-photo-24" :size="24" />
          </div>
          <div class="mr__content mr__content--item">
            <p class="mr__name mr__name--item">{{ l.title }}</p>
            <DiscountLabel v-if="showSmart(l) && l.smart" class="mr__smart" :label="`${l.smart.label} (−${money(l.smart.amount)})`" />
            <div class="mr__price-block">
              <p class="mr__prices">
                <span>{{ money(unitPrice(l)) }}</span>
                <s v-if="crossedPrice(l) !== undefined" class="mr__old">{{ money(crossedPrice(l)!) }}</s>
              </p>
              <p class="mr__cost-box">
                <s v-if="wholesaleOldSum(l) !== undefined" class="mr__old">{{ money(wholesaleOldSum(l)!) }}</s>
                <strong class="mr__cost">{{ money(lineSum(l)) }}</strong>
              </p>
            </div>
            <p v-if="l.minOrderText" class="mr__note">{{ l.minOrderText }}</p>
            <InfoTag v-if="l.electronic" class="mr__tag" label="Електронний товар" />
            <div class="mr__buttons">
              <Counter v-if="!l.electronic" :model-value="l.qty" :min="l.minQty ?? 1" @update:model-value="setQty(l.id, $event)" />
              <button type="button" class="m-btn m-btn--small mo__delete" :aria-label="`Видалити «${title(l)}»`" @click="removeLine(l.id)">
                <Icon name="delete-16" :size="16" />
              </button>
            </div>
            <div v-if="l.wholesale?.length" class="mo__tiers mr__extra" role="group" aria-label="Оптові ціни">
              <button
                v-for="t in wholesaleTiers(l)"
                :key="t.quantity"
                type="button"
                class="m-btn mo__tier"
                :class="{ 'm-btn--primary': t.active }"
                :aria-pressed="t.active"
                @click="setWholesaleQty(l.id, t.quantity)"
              >
                {{ t.label }}
              </button>
            </div>
          </div>
        </li>
      </template>
    </ul>

    <ul v-else id="mo-list" class="mo__list">
      <!-- Bundle «Разом дешевше»: title in the sale colour, the parts with old prices, then qty and the line sum. -->
      <template v-for="l in checkout.lines" :key="l.id">
        <li v-if="l.type === 'bundle'" class="mo__item mo__item--bundle">
          <p class="mo__bundle-title">{{ l.title }}</p>
          <div v-for="(p, i) in l.parts ?? []" :key="i" class="mo__part">
            <div class="mo__photo mo__photo--part">
              <img v-if="p.image" :src="p.image" alt="" width="48" height="48" />
              <Icon v-else name="no-photo-24" :size="24" />
            </div>
            <div class="mo__body">
              <p class="mo__name">{{ p.title }}</p>
              <p class="mo__price">
                <s class="mo__old">{{ money(p.oldPrice) }}</s>
                <span>{{ money(p.price) }}</span>
              </p>
            </div>
          </div>
          <div class="mo__actions">
            <Counter class="mo__counter" :model-value="l.qty" :min="l.minQty ?? 1" @update:model-value="setQty(l.id, $event)" />
            <div class="mo__sum">
              <s class="mo__old">{{ money(bundleOldSum(l)) }}</s>
              <strong>{{ money(lineSum(l)) }}</strong>
            </div>
            <button type="button" class="m-btn m-btn--small mo__delete" :aria-label="`Видалити «${title(l)}»`" @click="removeLine(l.id)">
              <Icon name="delete-16" :size="16" />
            </button>
          </div>
        </li>

        <li v-else class="mo__item">
          <div class="mo__row">
            <div class="mo__photo">
              <img v-if="image(l)" :src="image(l)" alt="" width="64" height="64" />
              <Icon v-else name="no-photo-24" :size="24" />
            </div>
            <div class="mo__body">
              <p class="mo__name">{{ l.title }}</p>
              <DiscountLabel
                v-if="showSmart(l) && l.smart"
                class="mo__smart"
                :label="`${l.smart.label} (−${money(l.smart.amount)})`"
              />
              <p class="mo__price">
                <s v-if="crossedPrice(l) !== undefined" class="mo__old">{{ money(crossedPrice(l)!) }}</s>
                <span>{{ money(unitPrice(l)) }}</span>
              </p>
              <p v-if="l.minOrderText" class="mo__note">{{ l.minOrderText }}</p>
              <InfoTag v-if="l.electronic" class="mo__tag" label="Електронний товар" />
            </div>
          </div>
          <div class="mo__actions">
            <Counter
              v-if="!l.electronic"
              class="mo__counter"
              :model-value="l.qty"
              :min="l.minQty ?? 1"
              @update:model-value="setQty(l.id, $event)"
            />
            <div class="mo__sum">
              <s v-if="wholesaleOldSum(l) !== undefined" class="mo__old">{{ money(wholesaleOldSum(l)!) }}</s>
              <strong>{{ money(lineSum(l)) }}</strong>
            </div>
            <button type="button" class="m-btn m-btn--small mo__delete" :aria-label="`Видалити «${title(l)}»`" @click="removeLine(l.id)">
              <Icon name="delete-16" :size="16" />
            </button>
          </div>
          <!-- Wholesale tiers: tap sets the qty to the tier; the reached one is filled (as CartItem Compact). -->
          <div v-if="l.wholesale?.length" class="mo__tiers" role="group" aria-label="Оптові ціни">
            <button
              v-for="t in wholesaleTiers(l)"
              :key="t.quantity"
              type="button"
              class="m-btn mo__tier"
              :class="{ 'm-btn--primary': t.active }"
              :aria-pressed="t.active"
              @click="setWholesaleQty(l.id, t.quantity)"
            >
              {{ t.label }}
            </button>
          </div>
          <div v-if="l.gift" class="mo__gift">
            <div class="mo__photo mo__photo--part">
              <img v-if="l.gift.image" :src="l.gift.image" alt="" width="48" height="48" />
              <Icon v-else name="no-photo-24" :size="24" />
            </div>
            <div class="mo__body">
              <p class="mo__name">{{ l.gift.title }}</p>
              <p class="mo__price">
                <GiftTag />
                <s class="mo__old">{{ money(l.gift.oldPrice) }}</s>
                <span class="mo__note">за 1 грн</span>
              </p>
            </div>
          </div>
        </li>
      </template>
    </ul>
  </section>
</template>

<style scoped>
/* Card as the desktop items card (OrderCard split): border/card, radius 8. */
.mo {
  overflow: hidden;
  border: var(--stroke-thin) solid var(--border-card);
  border-radius: var(--radius-8);
  background: var(--surface-default);
}
/* ---------- mini-cart (look 'ref', folded; Figma 107:6143) ---------- */
.mo--mini {
  border-color: var(--border-divider);
}
.mm {
  display: flex;
  align-items: center;
  gap: var(--space-16);
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding: var(--space-12) var(--space-8); /* height 48: 12 + 24 + 12 */
  border: 0;
  background: none;
  color: var(--text-primary);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.mm:focus-visible {
  outline: none;
}
/* Bag + count (Figma 653:11122): the icon centred in a 40 box (as the chevron box on the right). */
.mm__bag {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: var(--space-40);
  height: var(--space-24);
}
.mm__bag-icon {
  position: relative;
  display: flex;
  color: var(--icon-strong); /* main black (icon/primary is black 50 %) */
}
.mm__count {
  position: absolute;
  top: -6px;
  right: calc(-1 * var(--space-8));
  box-sizing: border-box;
  min-width: var(--space-16);
  padding: 0 var(--space-4);
  border-radius: var(--radius-full);
  background: var(--surface-action-primary);
  color: var(--text-primary-white);
  font-size: 10px;
  font-weight: var(--font-weight-regular);
  line-height: var(--font-line-height-16);
  text-align: center;
}
.mm__text {
  flex: 1 1 0;
  min-width: 0;
  font-size: var(--font-size-16);
  line-height: 1.25;
}
/* The count and the sum never break inside («215 280 грн» stays whole; a long sum moves to the second line). */
.mm__text b {
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}
/* Chevron (instead of the mockup's pencil) in the mockup's 40 button box, px 8. */
.mm__toggle {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  height: var(--space-24);
  padding: 0 var(--space-8);
  color: var(--icon-secondary);
}

.mo__heading {
  margin: 0;
  font: inherit;
}
.mo__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  box-sizing: border-box;
  width: 100%;
  min-height: var(--space-48);
  margin: 0;
  padding: var(--space-12) var(--space-16);
  border: 0;
  background: none;
  color: var(--text-primary);
  font: inherit;
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-bold);
  line-height: var(--font-line-height-24);
  text-align: left;
  cursor: pointer;
}
.mo__head--static {
  cursor: default;
}
.mo__head-text {
  min-width: 0;
}
.mo__toggle {
  display: inline-flex;
  flex: none;
  align-items: center;
  color: var(--icon-secondary);
}
.mo__chevron {
  transition: transform 0.2s ease;
}
.mo__chevron.is-open {
  transform: rotate(180deg);
}
.mo__empty {
  margin: 0;
  padding: 0 var(--space-16) var(--space-16);
  color: var(--text-secondary);
  font-size: var(--font-size-14);
  line-height: var(--font-line-height-20);
}
/* Collapsed strip: photos 48, 8 apart, the qty badge in the corner. */
.mo__thumbs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  width: 100%;
  padding: 0 var(--space-16) var(--space-16);
  border: 0;
  background: none;
  cursor: pointer;
}
.mo__thumb {
  position: relative;
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: var(--space-48);
  height: var(--space-48);
  border: var(--stroke-thin) solid var(--border-card);
  border-radius: var(--radius-8);
  background: var(--surface-default);
  color: var(--icon-secondary);
}
.mo__thumb img {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-8);
  object-fit: contain;
}
.mo__thumb--more {
  background: var(--surface-subtle);
  color: var(--text-secondary);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-bold);
}
.mo__qty {
  position: absolute;
  top: calc(-1 * var(--space-4));
  right: calc(-1 * var(--space-4));
  min-width: var(--space-16);
  padding: 0 var(--space-4);
  border-radius: var(--radius-full);
  background: var(--surface-action-primary);
  color: var(--text-primary-white);
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-regular);
  line-height: var(--font-line-height-16);
  text-align: center;
}
/* As desktop (OrderCard split): the line under the title and between items stops 16 short of each edge, border/card. */
.mo__list {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
}
.mo__list::before {
  content: '';
  position: absolute;
  top: 0;
  left: var(--space-16);
  right: var(--space-16);
  border-top: var(--stroke-thin) solid var(--border-card);
}
.mo__item {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  padding: var(--space-16);
}
.mo__row,
.mo__part,
.mo__gift {
  display: flex;
  gap: var(--space-16);
}
/* Bundle: title in the sale colour (as CartItem bundle), parts 48 aligned under the 64 photo column. */
.mo__bundle-title {
  margin: 0;
  color: var(--text-sale);
  font-size: var(--font-size-13);
  line-height: var(--font-line-height-20);
}
.mo__photo.mo__photo--part {
  width: var(--space-48);
  height: var(--space-48);
}
/* Gift under the item (as CartItem Compact): frame border/gift, radius 8. */
.mo__gift {
  padding: calc(var(--space-8) - var(--stroke-thin));
  border: var(--stroke-thin) solid var(--border-gift);
  border-radius: var(--radius-8);
}
.mo__smart {
  align-self: flex-start;
  margin-top: var(--space-4);
}
.mo__price {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4) var(--space-8);
  margin: var(--space-4) 0 0;
  color: var(--text-primary);
  font-size: var(--font-size-13);
  line-height: var(--font-line-height-20);
  white-space: nowrap;
}
.mo__old {
  color: var(--text-price-old);
  font-size: var(--font-size-12);
  line-height: var(--font-line-height-16);
  white-space: nowrap;
}
.mo__note {
  margin: var(--space-4) 0 0;
  color: var(--text-secondary);
  font-size: var(--font-size-13);
  line-height: var(--font-line-height-20);
}
.mo__price .mo__note {
  margin: 0;
}
.mo__tag {
  margin-top: var(--space-8);
}
/* Line sum: the crossed sum before wholesale / the bundle's old sum stands above it. */
.mo__sum {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: auto;
  color: var(--text-primary);
  font-size: var(--font-size-16);
  line-height: var(--font-line-height-24);
  white-space: nowrap;
}
.mo__sum strong {
  font-weight: var(--font-weight-bold);
}
/* Wholesale tiers: mobile buttons 40, text 14; wrap on a narrow screen. */
.mo__tiers {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
}
.mo__tier {
  min-height: var(--space-40);
  font-size: var(--font-size-14);
  line-height: var(--font-line-height-20);
}
/* Dividers between rows stop 16 short of each edge (as the desktop items card). */
.mo__item {
  position: relative;
}
.mo__item + .mo__item::before {
  content: '';
  position: absolute;
  top: 0;
  left: var(--space-16);
  right: var(--space-16);
  border-top: var(--stroke-thin) solid var(--border-card);
}
.mo__photo {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  color: var(--icon-secondary);
}
.mo__photo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.mo__body {
  flex: 1 1 0;
  min-width: 0;
}
.mo__name {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-13);
  line-height: var(--font-line-height-20);
  overflow-wrap: anywhere;
}
/* ---------- look 'ref' (measured on the reference .cart-item / .cart-set at 390) ---------- */
.mr {
  flex-direction: row;
  gap: 0;
}
.mr--set {
  flex-direction: column;
}
.mr__photo,
.mr__set-photo {
  display: flex;
  flex: none;
  align-items: flex-start;
  justify-content: center;
  box-sizing: content-box;
  width: 64px;
  padding-right: var(--space-16);
  color: var(--icon-secondary);
}
.mr__photo img,
.mr__set-photo img {
  width: 64px;
  height: 64px;
  object-fit: contain;
}
/* Second and next parts of a set: photo 44, indented 20 inside the same 80 column. */
.mr__set-photo--small {
  width: 44px;
  padding-left: var(--space-20);
}
.mr__set-photo--small img {
  width: 44px;
  height: 44px;
}
.mr__content {
  flex: 1 1 0;
  min-width: 0;
}
.mr__content--item {
  margin-top: calc(-1 * var(--space-4));
}
.mr p {
  margin: 0;
}
.mr__set-item {
  display: flex;
}
.mr__set-item + .mr__set-item {
  margin-top: var(--space-16);
}
.mr__set-header {
  margin-bottom: 6px !important;
  color: var(--text-sale);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-bold);
  line-height: var(--font-line-height-20);
}
/* Name — text/primary as on desktop (the reference uses its light theme text). */
.mr__name {
  margin-bottom: var(--space-4) !important;
  color: var(--text-primary);
  font-size: var(--font-size-13);
  line-height: var(--font-line-height-20);
  overflow-wrap: anywhere;
}
.mr__name--item {
  margin-bottom: 5px !important;
}
.mr__part-price {
  color: var(--text-primary);
  font-size: var(--font-size-14);
  line-height: var(--font-line-height-20);
  white-space: nowrap;
}
/* Gift line (reference .cart-sticker + old price): the tag, the crossed price 16 after it (tag mr 8 + price ml 8). */
.mr__gift-price {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: var(--space-8);
  font-size: var(--font-size-13);
  line-height: var(--font-line-height-20);
}
.mr__smart {
  margin-bottom: var(--space-4);
}
/* Price row: «price ~~old~~» left (the old one wraps under, keeping its 8 indent), the sum bold right, centred. */
.mr__price-block {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}
.mr__prices {
  display: flex;
  flex-wrap: wrap;
  margin-right: var(--space-8) !important;
  color: var(--text-primary);
  font-size: var(--font-size-13);
  line-height: var(--font-line-height-20);
  white-space: nowrap;
}
.mr__old {
  margin-left: var(--space-8);
  color: var(--text-price-old);
  font-size: var(--font-size-13);
  line-height: var(--font-line-height-20);
  white-space: nowrap;
}
.mr__cost-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.mr__cost {
  color: var(--text-primary);
  font-size: var(--font-size-13);
  font-weight: var(--font-weight-bold);
  line-height: var(--font-line-height-20);
  white-space: nowrap;
}
.mr__note {
  margin-top: var(--space-4) !important;
  color: var(--text-secondary);
  font-size: var(--font-size-13);
  line-height: var(--font-line-height-20);
}
.mr__tag {
  margin-top: var(--space-8);
}
.mr__buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-16);
}
/* Electronic item: no counter — delete stays on the right. */
.mr__buttons > .mo__delete:only-child {
  margin-left: auto;
}
.mr__extra {
  margin-top: var(--space-12);
}
/* Set footer under the content column (80 = photo 64 + 16). */
.mr__set-footer {
  margin-top: var(--space-16);
  margin-left: 80px;
}

/* Counter · line sum · delete — under the photo row, full width. */
.mo__actions {
  display: flex;
  align-items: center;
  gap: var(--space-12);
}
.mo__counter {
  flex: none;
}
.mo__delete {
  width: var(--space-40);
  padding: 0;
}
</style>
