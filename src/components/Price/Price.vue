<script setup lang="ts">
/**
 * Price — цена товара (Figma 6211:41).
 * Size: S 14 (строка корзины) / M 16 (карточка) / L 18 (итог). State: default (text/price) / sale (text/sale).
 * Старая цена — DS/Price/Old, зачёркнута, text/price-old.
 *
 * Figma → props: Price → price, Old price → oldPrice, Show old price → showOldPrice, Size → size, State → state.
 */
export type PriceSize = 's' | 'm' | 'l';
export type PriceState = 'default' | 'sale';

withDefaults(
  defineProps<{
    price?: string;
    oldPrice?: string;
    showOldPrice?: boolean;
    size?: PriceSize;
    state?: PriceState;
  }>(),
  { price: '1 599 грн', oldPrice: '1 999 грн', showOldPrice: true, size: 'm', state: 'default' },
);
</script>

<template>
  <div class="ds-price" :class="[`ds-price--${size}`, `ds-price--${state}`]">
    <span class="ds-price__value">{{ price }}</span>
    <span v-if="showOldPrice" class="ds-price__old">{{ oldPrice }}</span>
  </div>
</template>

<style scoped>
.ds-price {
  --_font: var(--typo-price-m);
  --_fg: var(--text-price);

  display: inline-flex;
  align-items: baseline;
  gap: var(--space-8);
}
.ds-price--s { --_font: var(--typo-price-s); }
.ds-price--m { --_font: var(--typo-price-m); }
.ds-price--l { --_font: var(--typo-price-l); }
.ds-price--sale { --_fg: var(--text-sale); }

.ds-price__value {
  font: var(--_font);
  color: var(--_fg);
  white-space: nowrap;
}
.ds-price__old {
  font: var(--typo-price-old);
  color: var(--text-price-old);
  text-decoration: line-through;
  white-space: nowrap;
}
</style>
