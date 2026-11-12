<script setup lang="ts">
// Local block: quick order as a collapsible card above the full form — no tabs
// (Figma variant 1991:61158, «step-checkout»: card r8, border, padding 16, title + lead + arrow-down).
// Expanded — the quick-order form (QuickOrderFields, Figma 58:8107).
import { Icon } from '../../../main';
import QuickOrderFields from './QuickOrderFields.vue';

const open = defineModel<boolean>('open', { default: false });
</script>

<template>
  <section class="qa" :class="{ 'is-open': open }">
    <button type="button" class="qa__head" :aria-expanded="open" aria-controls="quick-order-body" @click="open = !open">
      <span class="qa__titles">
        <!-- Figma 2001:63805: icon 24 (fast-24) in the title row, gap 8; the lead is indented to the title text (32). -->
        <span class="qa__title-row">
          <Icon name="fast-24" :size="24" class="qa__icon" />
          <span class="qa__title ds-text-heading-h4">Швидке замовлення</span>
        </span>
        <span class="qa__lead ds-text-paragraph-p1">Залиште контакти і менеджер зателефонує й оформить замовлення</span>
      </span>
      <Icon name="arrow-down-16" class="qa__arrow" />
    </button>
    <QuickOrderFields v-if="open" id="quick-order-body" class="qa__body" />
  </section>
</template>

<style scoped>
.qa {
  /* Figma: stroke inside — does not add height (76, as in the mockup). */
  box-shadow: inset 0 0 0 var(--stroke-thin) var(--border-card);
  border-radius: var(--radius-8);
  background: var(--surface-default);
}
.qa__head {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  width: 100%;
  margin: 0;
  padding: var(--space-16);
  border: 0;
  background: none;
  text-align: left;
  color: var(--text-primary);
  cursor: pointer;
}
.qa__head:focus-visible {
  outline: var(--stroke-thin) solid var(--border-input-active);
  outline-offset: calc(-1 * var(--space-4));
  border-radius: var(--radius-8);
}
.qa__titles {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}
.qa__title-row {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}
.qa__icon {
  flex: none;
  color: var(--icon-strong);
}
.qa__lead {
  padding-left: calc(24px + var(--space-8)); /* icon 24 + gap 8 — under the title text */
  color: var(--text-primary);
}
.qa__arrow {
  flex: none;
  color: var(--icon-primary);
  transition: transform 0.2s ease;
}
.is-open .qa__arrow {
  transform: rotate(180deg);
}
.qa__body {
  padding: 0 var(--space-16) var(--space-16);
}
</style>
