<script setup lang="ts">
/**
 * CartItem — строка товара в корзине (Figma набор 6303:12634).
 * Type: product / bundle (набор). Size: default (1091, адаптив — Fill) / compact (480, правая колонка оформления, попапы).
 * Собирается из Counter, Price, DiscountLabel, GiftTag, InfoTag, ButtonFront (удаление — Flat L без подписи, как в Figma), Icon.
 *
 * Figma → props: Type → type, Size → size; Show min-order / old price / electronic / wholesale / counter / gift-tag /
 * discount / gift-on-img / set-counter / delete / delete-cost / delete-count / mods / gift → show*; слот mods → слот `mods`.
 * Фото — данные товара: `image`, `items[].image`, `gift.image` (url). Без фото — плашка surface/hover.
 */
import { ref, watch } from 'vue';
import Counter from '../Counter/Counter.vue';
import Price from '../Price/Price.vue';
import DiscountLabel from '../DiscountLabel/DiscountLabel.vue';
import GiftTag from '../GiftTag/GiftTag.vue';
import InfoTag from '../InfoTag/InfoTag.vue';
import CartItemInfo from './CartItemInfo.vue';
import ButtonFront from '../ButtonFront/ButtonFront.vue';
import Icon from '../Icon/Icon.vue';
import CartItemThumb from './CartItemThumb.vue';

export type CartItemType = 'product' | 'bundle';
export type CartItemSize = 'default' | 'compact';
export interface CartItemBundleItem {
  title: string;
  image?: string;
  oldPrice?: string;
  price: string;
}
export interface CartItemGift {
  title: string;
  image?: string;
  oldPrice?: string;
}
export interface CartItemMod {
  label: string;
  value: string;
}

const props = withDefaults(
  defineProps<{
    type?: CartItemType;
    size?: CartItemSize;
    /** Название товара (у набора в Default — название набора). */
    title?: string;
    /** URL фото товара. */
    image?: string;
    price?: string;
    oldPrice?: string;
    /** Сумма по строке (цена × количество). */
    sum?: string;
    /** Старая сумма (только набор Compact). */
    oldSum?: string;
    quantity?: number;
    /** Максимум для счётчика (по умолчанию — как у Counter). */
    maxQuantity?: number;
    /** Минимум для счётчика (минимальный заказ товара; по умолчанию — как у Counter). */
    minQuantity?: number;
    minOrderText?: string;
    wholesaleText?: string;
    discountLabel?: string;
    giftTagLabel?: string;
    /** Подсказка (i) у метки «Подарунок»: что подарок — покупка за 1 грн. */
    giftHint?: string;
    electronicLabel?: string;
    setCounterText?: string;
    mods?: CartItemMod[];
    /** Набор: товары в составе (Compact — все, Default — миниатюры). */
    items?: CartItemBundleItem[];
    /** Набор Compact: заголовок над составом. */
    bundleTitle?: string;
    /** Набор Default: «+N» в миниатюрах. */
    moreCount?: string;
    /** Подарок под товаром (Compact, Show gift). */
    gift?: CartItemGift;
    showMinOrder?: boolean;
    showOldPrice?: boolean;
    showElectronic?: boolean;
    showWholesale?: boolean;
    showCounter?: boolean;
    showGiftTag?: boolean;
    showDiscount?: boolean;
    showGiftOnImg?: boolean;
    showSetCounter?: boolean;
    showDelete?: boolean;
    showDeleteCost?: boolean;
    showMods?: boolean;
    showGift?: boolean;
  }>(),
  {
    type: 'product',
    size: 'default',
    title: 'Навушники Apple AirPods Max, срібний',
    image: undefined,
    price: '20 899 грн',
    oldPrice: '30 299 грн',
    sum: '2 899 грн',
    oldSum: undefined,
    quantity: 1,
    minOrderText: 'Замовлення від 2 одиниць',
    wholesaleText: 'додайте ще 5 одиниць та заощадьте 240 гривень',
    discountLabel: 'smart-10 (−649 грн)',
    giftTagLabel: 'Подарунок',
    giftHint: 'Подарунок додається до замовлення як покупка за 1 грн',
    electronicLabel: 'Електронний товар',
    setCounterText: '+5',
    mods: () => [
      { label: 'Розмір:', value: 'XS' },
      { label: 'колір:', value: 'чорний' },
    ],
    items: () => [],
    bundleTitle: 'Разом дешевше',
    moreCount: '+99',
    gift: () => ({ title: 'Apple iPhone 15 Pro Max 256GB Blue', oldPrice: '30 299 грн' }),
    showMinOrder: true,
    showOldPrice: true,
    showElectronic: false,
    showWholesale: false,
    showCounter: true,
    showGiftTag: false,
    showDiscount: false,
    showGiftOnImg: false,
    showSetCounter: false,
    showDelete: true,
    showDeleteCost: true,
    showMods: false,
    showGift: true,
  },
);

/** `wholesale` — клик по подсказке опта «додайте ще N одиниць…»: экран добавляет недостающие единицы. */
const emit = defineEmits<{ 'update:quantity': [value: number]; delete: []; wholesale: [] }>();

const qty = ref(props.quantity);
watch(() => props.quantity, (v) => (qty.value = v));
watch(qty, (v) => emit('update:quantity', v));
</script>

<template>
  <!-- Compact · Product -->
  <div v-if="size === 'compact' && type === 'product'" class="ci ci--compact ci--product">
    <div class="ci__row">
      <CartItemThumb
        :image="image"
        :alt="title"
        :size="64"
        :show-set-counter="showSetCounter"
        :set-counter-text="setCounterText"
        :show-gift-on-img="showGiftOnImg"
        :gift-label="giftTagLabel"
      />
      <div class="ci__main">
        <div class="ci__main-info">
          <p class="ci__title ci__title--compact">{{ title }}</p>
          <div v-if="showMods" class="ci__mods">
            <slot name="mods">
              <span v-for="m in mods" :key="m.label" class="ci__mod">
                <span class="ci__mod-label">{{ m.label }}</span><span>{{ m.value }}</span>
              </span>
            </slot>
          </div>
          <div class="ci__price-box">
            <DiscountLabel v-if="showDiscount" :label="discountLabel" class="ci__discount" />
            <div class="ci__price">
              <GiftTag v-if="showGiftTag" :label="giftTagLabel" />
              <span v-if="showOldPrice" class="ci__old">{{ oldPrice }}</span>
              <CartItemInfo v-if="showGiftTag" :text="giftHint" />
              <span class="ci__now">{{ price }}</span>
            </div>
          </div>
          <p v-if="showMinOrder" class="ci__min-order">{{ minOrderText }}</p>
        </div>
        <div class="ci__bottom">
          <div v-if="showCounter" class="ci__counter-box">
            <Counter v-model="qty" show-units :max="maxQuantity" :min="minQuantity" />
          </div>
          <InfoTag v-if="showElectronic" :label="electronicLabel" />
          <Price class="ci__sum" :price="sum" :show-old-price="false" size="s" />
        </div>
        <button v-if="showWholesale" type="button" class="ci__wholesale ci__wholesale--compact" @click="emit('wholesale')">
          <Icon name="plus-16" /><span>{{ wholesaleText }}</span>
        </button>
      </div>
    </div>
    <div v-if="showGift" class="ci__gift">
      <div class="ci__gift-img">
        <img v-if="gift.image" :src="gift.image" :alt="gift.title" class="ci-thumb__photo" />
        <Icon v-else name="no-photo-24" :size="24" />
      </div>
      <div class="ci__gift-content">
        <p class="ci__title">{{ gift.title }}</p>
        <div class="ci__gift-price">
          <GiftTag :label="giftTagLabel" />
          <span v-if="gift.oldPrice" class="ci__old">{{ gift.oldPrice }}</span>
          <CartItemInfo :text="giftHint" />
        </div>
      </div>
    </div>
    <div v-if="showDelete" class="ci__delete ci__delete--product">
      <ButtonFront type="flat" size="l" :show-label="false" show-left-icon aria-label="Видалити" @click="emit('delete')"><template #left><Icon name="delete-16" /></template></ButtonFront>
    </div>
  </div>

  <!-- Compact · Bundle -->
  <div v-else-if="size === 'compact'" class="ci ci--compact ci--bundle">
    <div class="ci__bundle-title"><p>{{ bundleTitle }}</p></div>
    <div v-for="(it, i) in items" :key="i" class="ci__bundle-item">
      <CartItemThumb
        :image="it.image"
        :alt="it.title"
        :size="64"
        :show-set-counter="showSetCounter && i === 0"
        :set-counter-text="setCounterText"
        :show-gift-on-img="showGiftOnImg && i === 0"
        :gift-label="giftTagLabel"
      />
      <div class="ci__gift-content">
        <p class="ci__title">{{ it.title }}</p>
        <div class="ci__gift-price">
          <span v-if="showOldPrice && it.oldPrice" class="ci__old">{{ it.oldPrice }}</span>
          <span class="ci__now">{{ it.price }}</span>
        </div>
      </div>
    </div>
    <div class="ci__bundle-total">
      <div class="ci__spacer" />
      <div class="ci__bundle-group">
        <div v-if="showCounter" class="ci__counter-box">
          <Counter v-model="qty" show-units :max="maxQuantity" :min="minQuantity" />
        </div>
        <div class="ci__bundle-sum">
          <span v-if="showOldPrice && oldSum" class="ci__old">{{ oldSum }}</span>
          <Price :price="sum" :show-old-price="false" size="s" />
        </div>
      </div>
    </div>
    <div v-if="showDelete" class="ci__delete ci__delete--bundle">
      <ButtonFront type="flat" size="l" :show-label="false" show-left-icon aria-label="Видалити" @click="emit('delete')"><template #left><Icon name="delete-16" /></template></ButtonFront>
    </div>
  </div>

  <!-- Default · Product / Bundle -->
  <div v-else class="ci ci--default" :class="`ci--${type}`">
    <CartItemThumb
      v-if="type === 'product'"
      :image="image"
      :alt="title"
      :size="80"
      :show-set-counter="showSetCounter"
      :set-counter-text="setCounterText"
      :show-gift-on-img="showGiftOnImg"
      :gift-label="giftTagLabel"
    />
    <div v-else class="ci__stack">
      <div class="ci__stack-grid">
        <span v-for="i in 3" :key="i" class="ci__stack-cell">
          <img v-if="items[i - 1]?.image" :src="items[i - 1].image" :alt="items[i - 1].title" class="ci-thumb__photo" />
        </span>
        <span class="ci__stack-cell ci__stack-more">{{ moreCount }}</span>
      </div>
      <GiftTag v-if="showGiftOnImg" :label="giftTagLabel" />
    </div>

    <div class="ci__main ci__main--default">
      <div class="ci__left">
        <div class="ci__title-row">
          <p class="ci__title">{{ title }}</p>
          <Icon v-if="type === 'bundle'" name="arrow-down-16" />
        </div>
        <div v-if="showMods" class="ci__mods">
          <slot name="mods">
            <span v-for="m in mods" :key="m.label" class="ci__mod">
              <span class="ci__mod-label">{{ m.label }}</span><span>{{ m.value }}</span>
            </span>
          </slot>
        </div>
        <div class="ci__price-box">
          <span v-if="showDiscount" class="ci__discount-box"><DiscountLabel :label="discountLabel" /></span>
          <div class="ci__price">
            <GiftTag v-if="showGiftTag" :label="giftTagLabel" />
            <span v-if="showOldPrice" class="ci__old">{{ oldPrice }}</span>
            <CartItemInfo v-if="showGiftTag" :text="giftHint" />
            <span class="ci__now">{{ price }}</span>
          </div>
          <span v-if="showMinOrder" class="ci__min-order">{{ minOrderText }}</span>
        </div>
        <div v-if="showElectronic" class="ci__electronic"><InfoTag :label="electronicLabel" /></div>
        <button v-if="showWholesale" type="button" class="ci__wholesale" @click="emit('wholesale')">
          <Icon name="plus-16" /><span>{{ wholesaleText }}</span>
        </button>
      </div>
      <div v-if="showCounter" class="ci__counter-box ci__counter-box--default">
        <Counter v-model="qty" show-units :max="maxQuantity" :min="minQuantity" />
      </div>
      <div class="ci__cost">
        <Price :price="sum" :show-old-price="false" size="s" />
        <ButtonFront v-if="showDelete && showDeleteCost" type="flat" size="l" :show-label="false" show-left-icon aria-label="Видалити" @click="emit('delete')"><template #left><Icon name="delete-16" /></template></ButtonFront>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ci {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  background: var(--surface-default);
  /* Нижняя линия внутри (Figma stroke inside) — не добавляет высоту. */
  box-shadow: inset 0 calc(-1 * var(--stroke-thin)) 0 var(--border-card);
  color: var(--text-primary);
  font: var(--typo-paragraph-p1);
}
.ci p {
  margin: 0;
}

/* ---------- общие части ---------- */
.ci__title {
  min-width: 0;
  color: var(--text-primary);
  font: var(--typo-paragraph-p1);
  overflow-wrap: anywhere;
}
.ci__price-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
}
.ci__price {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  padding-right: var(--space-4);
}
.ci__old {
  color: var(--text-price-old);
  font: var(--typo-price-old);
  text-decoration: line-through;
  white-space: nowrap;
}
.ci__now {
  color: var(--text-primary);
  font: var(--typo-paragraph-p1);
  white-space: nowrap;
}
.ci__info {
  display: inline-flex;
  color: var(--icon-primary);
}
.ci__min-order {
  color: var(--text-secondary);
  font: var(--typo-paragraph-p1);
  white-space: nowrap;
}
.ci__mods {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
}
.ci__mod {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  white-space: nowrap;
}
.ci__mod-label {
  color: var(--text-secondary);
}
/* Подсказка опта — кнопка: клик добавляет недостающие единицы (событие wholesale). */
.ci__wholesale {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  margin: 0;
  padding: var(--space-12) 0 0;
  border: 0;
  background: none;
  font: inherit;
  text-align: left;
  color: var(--text-primary);
  cursor: pointer;
}
.ci__wholesale:hover > span {
  text-decoration: underline;
}
.ci__wholesale:focus-visible {
  outline: var(--stroke-thin) solid var(--border-input-active);
  outline-offset: var(--space-2);
}
.ci__wholesale > span:first-child,
.ci__wholesale > :deep(.ds-icon) {
  margin-top: var(--space-2);
}
.ci__wholesale--compact {
  padding-top: var(--space-8);
}
.ci__counter-box {
  display: flex;
  flex: none;
  align-items: center;
}
.ci__delete {
  position: absolute;
  right: var(--space-16);
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-40);
  height: var(--space-40);
}
.ci__delete--product { top: var(--space-4); }
.ci__delete--bundle { top: var(--space-16); }

/* ---------- Default ---------- */
.ci--default {
  display: flex;
  align-items: flex-start;
  gap: var(--space-16);
  padding: var(--space-12);
}
.ci--default.ci--bundle {
  padding: var(--space-16);
}
.ci--default .ci__main--default {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  min-width: 0;
  gap: var(--space-16);
}
.ci__left {
  display: flex;
  flex: 0 1 calc(380px + var(--space-16));
  flex-direction: column;
  min-width: 0;
  padding-right: var(--space-16);
}
.ci__title-row {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  padding-bottom: var(--space-8);
}
.ci__electronic {
  display: flex;
  padding-top: var(--space-12);
}
.ci--bundle .ci__electronic {
  padding-top: var(--space-8);
}
.ci__discount-box {
  display: inline-flex;
  padding-right: var(--space-4);
}
.ci__discount-box > :deep(.ds-discount-label) {
  background: var(--bg-success-pale);
  border: var(--stroke-thin) solid var(--border-success-pale);
}
.ci__counter-box--default {
  margin-left: auto;
}
.ci__cost {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: flex-end;
  min-width: 96px;
  gap: var(--space-8);
}

/* Миниатюры набора (Default) */
.ci__stack {
  display: flex;
  flex: none;
  flex-direction: column;
  gap: var(--space-2);
  align-items: flex-start;
  width: 64px;
}
.ci__stack-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
  width: 64px;
  height: 64px;
}
.ci__stack-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  overflow: clip;
  border: var(--stroke-thin) solid var(--border-card);
  border-radius: var(--radius-4);
  background: var(--surface-hover);
}
.ci__stack-more {
  background: var(--surface-default);
  font: var(--typo-special-special-12-regular);
  color: var(--text-primary);
}

/* ---------- Compact ---------- */
.ci--compact.ci--product {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding: var(--space-16);
}
.ci__row {
  display: flex;
  align-items: flex-start;
  gap: var(--space-16);
}
.ci__main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}
.ci__main-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-right: var(--space-16);
  padding-bottom: var(--space-12);
}
.ci__title--compact {
  padding-right: var(--space-32);
}
.ci__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
}
.ci__bottom > :last-child {
  min-width: 96px;
  justify-content: flex-end;
  margin-left: auto;
}

/* Подарок под товаром */
.ci__gift {
  display: flex;
  align-items: flex-start;
  gap: var(--space-16);
  /* Рамка внутри (Figma stroke inside): отступ 8 включает 1 px обводки. */
  padding: calc(var(--space-8) - var(--stroke-thin));
  border: var(--stroke-thin) solid var(--border-gift);
  border-radius: var(--radius-8);
  background: var(--surface-default);
}
.ci__gift-img {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  overflow: clip;
  border-radius: var(--radius-8);
  background: var(--surface-hover);
  color: var(--icon-primary);
}
/* Photos in the gift block and the bundle stack: fit whole, centred, white under the photo (as CartItemThumb). */
.ci__gift-img:has(img),
.ci__stack-cell:has(img) {
  background: var(--surface-default);
}
.ci__gift-img > img,
.ci__stack-cell > img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.ci__gift-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}
.ci__gift-price {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

/* Набор Compact */
.ci--compact.ci--bundle {
  display: flex;
  flex-direction: column;
  padding: var(--space-8) var(--space-0);
}
.ci__bundle-title {
  padding: var(--space-8) var(--space-16);
  color: var(--text-sale);
}
.ci__bundle-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-16);
  padding: var(--space-8) var(--space-16);
}
.ci__bundle-total {
  display: flex;
  align-items: center;
  gap: var(--space-16);
  padding: var(--space-8) var(--space-16);
}
.ci__spacer {
  flex: none;
  width: 64px;
  height: var(--space-40);
}
.ci__bundle-group {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  gap: var(--space-8);
}
.ci__bundle-sum {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: auto;
}
</style>
