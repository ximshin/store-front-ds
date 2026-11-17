<script setup lang="ts">
/**
 * DiscountLine — строка скидки в итогах корзины/заказа (Figma 6215:69): иконка 16 (icon/primary) + название
 * (DS/Paragraph/P1) + удаление (cross-16, icon/secondary) слева, сумма (DS/Paragraph/P1, text/price) справа.
 * Ширина — Fill, высота 20. Не путать с DiscountLabel (метка у товара).
 *
 * Figma → props: Label → label, Amount → amount; иконка — prop `icon` (по умолчанию coupon-16, icon/primary);
 * крестик remove (6464:4072) — prop `removable` + событие `remove` (снять промокод прямо из итогов).
 */
import Icon from '../Icon/Icon.vue';

const props = withDefaults(defineProps<{ label?: string; amount?: string; icon?: string; removable?: boolean }>(), {
  label: 'Накопичувальна знижка',
  amount: '−20 грн',
  icon: 'coupon-16',
  removable: false,
});
const emit = defineEmits<{ remove: [] }>();
</script>

<template>
  <div class="ds-discount-line">
    <span class="ds-discount-line__title">
      <span class="ds-discount-line__icon"><Icon :name="icon" /></span>
      <span class="ds-discount-line__label"><slot>{{ label }}</slot></span>
      <button
        v-if="props.removable"
        type="button"
        class="ds-discount-line__remove"
        :aria-label="`Видалити знижку ${label}`"
        @click="emit('remove')"
      >
        <Icon name="cross-16" />
      </button>
    </span>
    <span class="ds-discount-line__amount">{{ amount }}</span>
  </div>
</template>

<style scoped>
.ds-discount-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  width: 100%;
  min-height: var(--space-20);
}
.ds-discount-line__title {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}
.ds-discount-line__icon {
  display: inline-flex;
  color: var(--icon-primary);
}
.ds-discount-line__label {
  font: var(--typo-paragraph-p1);
  color: var(--text-primary);
}
.ds-discount-line__remove {
  display: inline-flex;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: var(--radius-2);
  background: none;
  color: var(--icon-secondary);
  cursor: pointer;
}
.ds-discount-line__remove:hover {
  color: var(--icon-primary);
}
.ds-discount-line__remove:focus-visible {
  outline: var(--stroke-thin) solid var(--border-input-active);
  outline-offset: var(--space-2);
}
.ds-discount-line__amount {
  font: var(--typo-paragraph-p1);
  color: var(--text-price);
  white-space: nowrap;
}
</style>
