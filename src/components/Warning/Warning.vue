<script setup lang="ts">
/**
 * warning — плашка-сообщение (Figma 6345:311): иконка статуса 16 + текст DS/Paragraph/P1 + подсказка (i).
 * Type: warning / info / danger / success — фон bg/<status>/light, иконка icon/<status>
 * (alert-16 / info-16 / alert-16 / tick-16). Ширина — Fill. Подсказка (i) показывает Tooltip по наведению/фокусу.
 *
 * Figma → props: Type → type, Text → text (или слот), Show info → showInfo; текст подсказки — prop `tooltip` / слот `tooltip`.
 */
import { ref } from 'vue';
import Icon from '../Icon/Icon.vue';
import Tooltip from '../Tooltip/Tooltip.vue';

export type WarningType = 'warning' | 'info' | 'danger' | 'success';

withDefaults(
  defineProps<{
    type?: WarningType;
    text?: string;
    showInfo?: boolean;
    tooltip?: string;
  }>(),
  {
    type: 'warning',
    text: 'Знижки не діють під час оплати цим способом',
    showInfo: true,
    tooltip: undefined,
  },
);

const ICONS: Record<WarningType, string> = {
  warning: 'alert-16',
  info: 'info-16',
  danger: 'alert-16',
  success: 'tick-16',
};
const open = ref(false);
</script>

<template>
  <div class="ds-warning" :class="`ds-warning--${type}`" role="status">
    <span class="ds-warning__icon"><Icon :name="ICONS[type]" /></span>
    <span class="ds-warning__text"><slot>{{ text }}</slot></span>
    <span
      v-if="showInfo"
      class="ds-warning__info"
      tabindex="0"
      aria-label="Докладніше"
      @mouseenter="open = true"
      @mouseleave="open = false"
      @focus="open = true"
      @blur="open = false"
    >
      <Icon name="info-16" />
      <span v-if="open" class="ds-warning__tooltip">
        <Tooltip arrow-position="bottom" arrow-align="end" :text="tooltip">
          <slot name="tooltip" />
        </Tooltip>
      </span>
    </span>
  </div>
</template>

<style scoped>
.ds-warning {
  --_bg: var(--bg-warning-light);
  --_icon: var(--icon-warning);

  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-8);
  box-sizing: border-box;
  width: 100%;
  padding: var(--space-8) var(--space-16);
  border-radius: var(--radius-6);
  background: var(--_bg);
}
.ds-warning--info { --_bg: var(--bg-info-light); --_icon: var(--icon-info); }
.ds-warning--danger { --_bg: var(--bg-danger-light); --_icon: var(--icon-danger); }
.ds-warning--success { --_bg: var(--bg-success-light); --_icon: var(--icon-success); }

.ds-warning__icon {
  display: inline-flex;
  color: var(--_icon);
}
.ds-warning__text {
  flex: 1;
  min-width: 0;
  font: var(--typo-paragraph-p1);
  color: var(--text-primary);
}
/* Figma: Show tooltip — tooltip (Bottom, End) above the plate, right edge = plate edge, arrow on (i), width 340. */
.ds-warning__info {
  display: inline-flex;
  color: var(--icon-secondary);
  cursor: help;
}
.ds-warning__info:focus-visible {
  outline: none;
}
.ds-warning__tooltip {
  position: absolute;
  right: 0;
  bottom: calc(100% + var(--space-8));
  z-index: 10;
  width: min(340px, 100%);
}
.ds-warning__tooltip :deep(.ds-tooltip) {
  width: 100%;
}
</style>
