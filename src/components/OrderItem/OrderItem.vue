<script setup lang="ts">
/**
 * OrderItem — товар в составе заказа (Figma 6215:150): фото 80 (surface/hover, radius/8), название DS/Paragraph/P1,
 * Price S, counter и сумма DS/Price/S. Ширина 440 (колонка заказа).
 *
 * Figma → props: Title → title, Sum → sum. Фото — данные товара: `image` (url); без фото — no-photo-24.
 * Цена и количество — `price` / `oldPrice` / `quantity` (v-model).
 */
import { ref, watch } from 'vue';
import Counter from '../Counter/Counter.vue';
import Price from '../Price/Price.vue';
import Icon from '../Icon/Icon.vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    sum?: string;
    image?: string;
    price?: string;
    oldPrice?: string;
    quantity?: number;
  }>(),
  {
    title: 'Apple iPhone 15 Pro 256GB Natural Titanium',
    sum: '55 999 грн',
    image: undefined,
    price: '1 599 грн',
    oldPrice: '1 999 грн',
    quantity: 1,
  },
);
const emit = defineEmits<{ 'update:quantity': [value: number] }>();

const qty = ref(props.quantity);
watch(() => props.quantity, (v) => (qty.value = v));
watch(qty, (v) => emit('update:quantity', v));
</script>

<template>
  <div class="ds-order-item">
    <div class="ds-order-item__image">
      <img v-if="image" :src="image" :alt="title" class="ds-order-item__photo" />
      <Icon v-else name="no-photo-24" :size="24" />
    </div>
    <div class="ds-order-item__content">
      <p class="ds-order-item__title">{{ title }}</p>
      <Price size="s" :price="price" :old-price="oldPrice" />
      <div class="ds-order-item__total">
        <Counter v-model="qty" />
        <Price size="s" :price="sum" :show-old-price="false" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ds-order-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-16);
  box-sizing: border-box;
  width: 100%;
  padding: var(--space-16);
  background: var(--surface-default);
}
.ds-order-item__image {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  overflow: clip;
  border-radius: var(--radius-8);
  background: var(--surface-hover);
  color: var(--icon-primary);
}
.ds-order-item__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ds-order-item__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-8);
  min-width: 0;
}
.ds-order-item__title {
  align-self: stretch;
  margin: 0;
  color: var(--text-primary);
  font: var(--typo-paragraph-p1);
  overflow-wrap: anywhere;
}
.ds-order-item__total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
}
</style>
