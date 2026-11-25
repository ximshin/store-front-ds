<script setup lang="ts">
/**
 * DiscountLine — строка скидки в итогах корзины/заказа (Figma 6215:69): иконка 16 (icon/primary) + название
 * (DS/Paragraph/P1) + удаление (cross-16, icon/secondary) слева, сумма (DS/Paragraph/P1, text/price) справа.
 * Ширина — Fill, высота 20. Не путать с DiscountLabel (метка у товара).
 *
 * Figma → props: Label → label, Amount → amount; иконка — prop `icon` (по умолчанию coupon-16, icon/primary);
 * крестик remove (6464:4072) — prop `removable` + событие `remove` (снять промокод прямо из итогов).
 * `removeLook` 'delete' (мобильный чекаут, Figma Checkout-v2 summary 107:6823): вместо крестика — кнопка 40 (px 8)
 * с корзиной delete-24 (icon/primary).
 */
import Icon from '../Icon/Icon.vue';

const props = withDefaults(
  defineProps<{ label?: string; amount?: string; icon?: string; removable?: boolean; removeLook?: 'cross' | 'delete' }>(),
  {
    label: 'Накопичувальна знижка',
    amount: '−20 грн',
    icon: 'coupon-16',
    removable: false,
    removeLook: 'cross',
  },
);
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
        :class="{ 'ds-discount-line__remove--delete': removeLook === 'delete' }"
        :aria-label="`Видалити знижку ${label}`"
        @click="emit('remove')"
      >
        <Icon v-if="removeLook === 'delete'" name="delete-24" :size="24" />
        <Icon v-else name="cross-16" />
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
/* Figma 107:6823: button 40 high, px 8, radius 8, delete 24 in icon/primary. */
.ds-discount-line__remove--delete {
  align-items: center;
  justify-content: center;
  height: var(--space-40);
  padding: 0 var(--space-8);
  border-radius: var(--radius-8);
  color: var(--icon-primary);
}
.ds-discount-line__remove--delete:hover {
  background: var(--surface-hover);
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
