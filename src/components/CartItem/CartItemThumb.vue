<script setup lang="ts">
/**
 * Служебная часть CartItem: фото товара (img-container) с наложениями set-counter («+5») и GiftTag на фото.
 * Без фото — нейтральная плашка surface/hover с иконкой no-photo-24.
 */
import Icon from '../Icon/Icon.vue';
import GiftTag from '../GiftTag/GiftTag.vue';

withDefaults(
  defineProps<{
    image?: string;
    alt?: string;
    /** Размер фото в px: 64 / 80. */
    size?: 64 | 80;
    showSetCounter?: boolean;
    setCounterText?: string;
    showGiftOnImg?: boolean;
    giftLabel?: string;
  }>(),
  { image: undefined, alt: '', size: 64, showSetCounter: false, setCounterText: '+5', showGiftOnImg: false, giftLabel: 'Подарунок' },
);
</script>

<template>
  <div class="ci-thumb" :class="`ci-thumb--${size}`">
    <span v-if="showSetCounter" class="ci-thumb__set">{{ setCounterText }}</span>
    <GiftTag v-if="showGiftOnImg" class="ci-thumb__gift" :label="giftLabel" />
    <div class="ci-thumb__img">
      <img v-if="image" :src="image" :alt="alt" class="ci-thumb__photo" />
      <Icon v-else name="no-photo-24" :size="24" />
    </div>
  </div>
</template>

<style scoped>
.ci-thumb {
  position: relative;
  flex: none;
  width: var(--_size);
  height: var(--_size);
}
.ci-thumb--64 { --_size: 64px; }
.ci-thumb--80 { --_size: 80px; }

.ci-thumb__img {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: clip;
  border-radius: var(--radius-8);
  background: var(--surface-hover);
  color: var(--icon-primary);
}
/* Figma (checkout-order-item): the photo fits whole, centred, aspect kept (no crop), white under it.
   The grey surface/hover plate stays only without a photo. */
.ci-thumb__img:has(.ci-thumb__photo) {
  background: var(--surface-default);
}
.ci-thumb__photo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.ci-thumb__set {
  position: absolute;
  top: calc(-1 * var(--space-8));
  right: calc(-1 * var(--space-8));
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: var(--space-24);
  height: var(--space-24);
  padding: var(--space-0) var(--space-4);
  border-radius: var(--radius-full);
  background: var(--bg-danger-primary);
  color: var(--text-primary-white);
  font: var(--font-weight-bold) var(--font-size-10) / var(--font-line-height-12) var(--font-sans);
  white-space: nowrap;
}
.ci-thumb__gift {
  position: absolute;
  top: calc(-1 * var(--space-8));
  left: 100%;
  z-index: 2;
  margin-left: calc(-1 * var(--space-4));
  background: var(--surface-default);
}
</style>
