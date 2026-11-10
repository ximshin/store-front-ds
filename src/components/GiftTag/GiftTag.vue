<script setup lang="ts">
/**
 * GiftTag — метка «Подарунок» у товара в корзине (Figma 6215:85). DS/Special/Special 12 Regular, text/sale, radius/4.
 * Type: outline (обводка border/danger) / filled (фон bg/danger/light).
 *
 * Figma → props: Label → label (или слот), Type → type.
 */
export type GiftTagType = 'outline' | 'filled';
withDefaults(defineProps<{ label?: string; type?: GiftTagType }>(), { label: 'Подарунок', type: 'outline' });
</script>

<template>
  <span class="ds-gift-tag" :class="`ds-gift-tag--${type}`"><slot>{{ label }}</slot></span>
</template>

<style scoped>
.ds-gift-tag {
  display: inline-flex;
  align-items: center;
  padding: var(--space-0) var(--space-4);
  border-radius: var(--radius-4);
  font: var(--typo-special-special-12-regular);
  color: var(--text-sale);
  white-space: nowrap;
}
.ds-gift-tag--outline {
  border: var(--stroke-thin) solid var(--border-danger);
}
.ds-gift-tag--filled {
  background: var(--bg-danger-light);
}
</style>
