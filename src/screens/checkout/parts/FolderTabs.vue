<script setup lang="ts">
// Local block: folder tabs above the form card (Figma 1986:29749, variant «Новий покупець / Увійти / Швидке
// замовлення»). Built from the ButtonFront L look: padding 12/16, gap 8, icon 16, Heading/Small Card Title.
// Active tab: surface/default, border/card on top / left / right, radius 8 8 0 0, overlaps the card's top border
// (the card below has top-left radius 0 when the first tab is active). Inactive: flat, no frame.
// Not in the DS yet — local to the checkout screen.
import { Icon } from '../../../main';

export interface FolderTab {
  value: string;
  label: string;
  icon: string;
}
defineProps<{ items: FolderTab[] }>();
const model = defineModel<string>({ required: true });
</script>

<template>
  <div class="ft" role="tablist">
    <button
      v-for="t in items"
      :key="t.value"
      type="button"
      role="tab"
      class="ft__tab ds-text-heading-small-card-title"
      :class="{ 'is-active': t.value === model }"
      :aria-selected="t.value === model"
      @click="model = t.value"
    >
      <Icon :name="t.icon" :size="16" class="ft__icon" />
      {{ t.label }}
    </button>
  </div>
</template>

<style scoped>
.ft {
  position: relative;
  z-index: 1; /* the active tab covers the card's top border */
  display: flex;
  gap: var(--space-8);
  margin-bottom: calc(-1 * var(--stroke-thin));
  overflow-x: auto;
  scrollbar-width: none;
}
.ft__tab {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: var(--space-8);
  height: 40px;
  margin: 0;
  box-sizing: border-box;
  /* a real 1 px border (transparent when inactive) — snaps to pixels like the card border; padding minus 1 keeps 12 / 16 */
  padding: calc(var(--space-12) - var(--stroke-thin)) calc(var(--space-16) - var(--stroke-thin)) var(--space-12);
  border: var(--stroke-thin) solid transparent;
  border-bottom: 0;
  border-radius: var(--radius-8) var(--radius-8) 0 0;
  background: none;
  color: var(--text-primary);
  white-space: nowrap;
  cursor: pointer;
}
.ft__tab:hover:not(.is-active) {
  background: var(--surface-hover);
}
.ft__tab:focus-visible {
  outline: var(--stroke-thin) solid var(--border-input-active);
  outline-offset: calc(-1 * var(--space-4));
}
.ft__tab.is-active {
  /* frame on three sides, the bottom stays open onto the card */
  border-color: var(--border-card);
  background: var(--surface-default);
  cursor: default;
}
.ft__icon {
  flex: none;
  color: var(--icon-strong);
}
</style>
