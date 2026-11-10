<script setup lang="ts">
/**
 * RecommendedItem — мини-карточка рекомендованного / похожего товара (Figma 6215:134, recommended-item и similar-item —
 * один компонент). 140 px: фото 140×140, название DS/Special/Special 13 Regular, Price S, button-front Primary M «До кошика».
 * Обводка border/card, радиус radius/8.
 *
 * Figma → props: Title → title. Фото — данные товара: `image` (url); без фото — no-photo-24.
 * Цена — `price` / `oldPrice`, подпись кнопки — `buttonLabel`; клик — событие `add`.
 */
import ButtonFront from '../ButtonFront/ButtonFront.vue';
import Price from '../Price/Price.vue';
import Icon from '../Icon/Icon.vue';

withDefaults(
  defineProps<{
    title?: string;
    image?: string;
    price?: string;
    oldPrice?: string;
    buttonLabel?: string;
  }>(),
  { title: 'Women ZigZag Sweatshirt', image: undefined, price: '1 599 грн', oldPrice: '1 999 грн', buttonLabel: 'До кошика' },
);
defineEmits<{ add: [] }>();
</script>

<template>
  <div class="ds-recommended-item">
    <div class="ds-recommended-item__image">
      <img v-if="image" :src="image" :alt="title" class="ds-recommended-item__photo" />
      <Icon v-else name="no-photo-24" :size="24" />
    </div>
    <div class="ds-recommended-item__main">
      <p class="ds-recommended-item__title">{{ title }}</p>
      <Price size="s" :price="price" :old-price="oldPrice" />
      <ButtonFront type="primary" size="m" :label="buttonLabel" @click="$emit('add')" />
    </div>
  </div>
</template>

<style scoped>
.ds-recommended-item {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 140px;
  overflow: clip;
  border: var(--stroke-thin) solid var(--border-card);
  border-radius: var(--radius-8);
  background: var(--surface-default);
}
.ds-recommended-item__image {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 140px;
  overflow: clip;
  background: var(--surface-hover);
  color: var(--icon-primary);
}
.ds-recommended-item__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ds-recommended-item__main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-8);
  padding: var(--space-8);
  overflow: clip;
}
.ds-recommended-item__title {
  align-self: stretch;
  margin: 0;
  color: var(--text-primary);
  font: var(--typo-special-special-13-regular);
  overflow-wrap: anywhere;
}
</style>
