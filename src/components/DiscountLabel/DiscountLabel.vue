<script setup lang="ts">
/**
 * DiscountLabel — метка скидки у товара (Figma 6348:657): coupon-16 (icon/success) + DS/Paragraph/P1 text/success,
 * промежуток space/4. Не путать с DiscountLine (строка итогов).
 *
 * Figma → props: Label → label (или слот), Show icon → showIcon.
 */
import Icon from '../Icon/Icon.vue';

withDefaults(defineProps<{ label?: string; showIcon?: boolean }>(), { label: 'smart-10 (−649 грн)', showIcon: true });
</script>

<template>
  <span class="ds-discount-label">
    <span v-if="showIcon" class="ds-discount-label__icon"><Icon name="coupon-16" /></span>
    <span class="ds-discount-label__text"><slot>{{ label }}</slot></span>
  </span>
</template>

<style scoped>
.ds-discount-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
}
.ds-discount-label__icon {
  display: inline-flex;
  color: var(--icon-success);
}
.ds-discount-label__text {
  font: var(--typo-paragraph-p1);
  color: var(--text-success);
  white-space: nowrap;
}
</style>
