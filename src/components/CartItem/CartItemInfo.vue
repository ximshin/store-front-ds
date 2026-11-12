<script setup lang="ts">
/**
 * Внутренний блок CartItem: иконка (i) info-16 у метки «Подарунок» с подсказкой Tooltip (Bottom, Center)
 * по наведению / фокусу. Текст — prop `text` (в CartItem — `giftHint`).
 */
import { ref } from 'vue';
import Icon from '../Icon/Icon.vue';
import Tooltip from '../Tooltip/Tooltip.vue';

defineProps<{ text?: string }>();
const open = ref(false);
</script>

<template>
  <span
    class="ci__info"
    tabindex="0"
    aria-label="Докладніше"
    @mouseenter="open = true"
    @mouseleave="open = false"
    @focus="open = true"
    @blur="open = false"
  >
    <Icon name="info-16" />
    <span v-if="open && text" class="ci-info__tooltip">
      <Tooltip arrow-position="bottom" :text="text" />
    </span>
  </span>
</template>

<style scoped>
.ci__info {
  position: relative;
  display: inline-flex;
  color: var(--icon-primary);
  cursor: help;
}
.ci__info:focus-visible {
  outline: none;
}
.ci-info__tooltip {
  position: absolute;
  bottom: calc(100% + var(--space-8));
  left: 50%;
  z-index: 10;
  transform: translateX(-50%);
}
.ci-info__tooltip :deep(.ds-tooltip) {
  width: max-content;
  max-width: 280px;
}
</style>
