<script setup lang="ts">
/**
 * tooltip — подсказка (Figma 6149:8176). Фон surface/default, тень DS/Shadow/tooltip, текст DS/Paragraph/Tooltip,
 * radius/4, отступы 8 × 12, ширина до 480. Стрелка 12 × 6 по центру.
 *
 * Figma → props: Arrow position → arrowPosition (bottom — стрелка снизу, подсказка над элементом; top — стрелка сверху),
 * Arrow align → arrowAlign (center — по центру; end — у правого края, центр стрелки в space/24 от края: для иконки (i)
 * у правого края, как в warning). Текст — слот или prop `text` (переносы строк сохраняются).
 */
export type TooltipArrowPosition = 'bottom' | 'top';
export type TooltipArrowAlign = 'center' | 'end';

withDefaults(defineProps<{ arrowPosition?: TooltipArrowPosition; arrowAlign?: TooltipArrowAlign; text?: string }>(), {
  arrowPosition: 'bottom',
  arrowAlign: 'center',
  text: '«Оплата частинами» ПриватБанку\nПід час оплати цим способом на замовлення не діють знижки:\nАкційні ціни • Купони на знижку • Подарунки • Знижки на комплект\nНакопичувальні знижки • Карта клієнта • Оптові ціни за кількість',
});
</script>

<template>
  <div class="ds-tooltip" :class="[`ds-tooltip--${arrowPosition}`, `ds-tooltip--align-${arrowAlign}`]" role="tooltip">
    <span class="ds-tooltip__arrow" aria-hidden="true" />
    <div class="ds-tooltip__text"><slot>{{ text }}</slot></div>
  </div>
</template>

<style scoped>
.ds-tooltip {
  position: relative;
  box-sizing: border-box;
  width: max-content;
  max-width: 480px;
  padding: var(--space-8) var(--space-12);
  border-radius: var(--radius-4);
  background: var(--surface-default);
  box-shadow: var(--shadow-tooltip);
}
.ds-tooltip__text {
  font: var(--typo-paragraph-tooltip);
  color: var(--text-primary);
  white-space: pre-line;
  overflow-wrap: anywhere;
}
.ds-tooltip__arrow {
  position: absolute;
  left: 50%;
  width: 12px;
  height: 6px;
  margin-left: -6px;
  background: var(--surface-default);
}
.ds-tooltip--align-end .ds-tooltip__arrow {
  left: auto;
  right: calc(var(--space-24) - 6px);
  margin-left: 0;
}
.ds-tooltip--bottom .ds-tooltip__arrow {
  bottom: -6px;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}
.ds-tooltip--top .ds-tooltip__arrow {
  top: -6px;
  clip-path: polygon(50% 0, 0 100%, 100% 100%);
}
</style>
