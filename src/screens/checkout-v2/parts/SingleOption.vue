<script setup lang="ts">
import Icon from '../../../components/Icon/Icon.vue';
// Local block of /checkout-v2-single: the only delivery / payment option shown as static text instead of a select
// (briefs/checkout/research_single_option.md): same height as Select size=rich (64) so the form does not jump
// when the number of options changes; no arrow, no hover. Default — a lighter frame (border/divider); filled — a tint.
// Name (+ logo 16) and a second line (price / terms). A visible label when the section has other fields.
// note: why the choice is not there — the other options are unavailable for this combination (research: say so only
// when the restriction really happens).
// labelPosition left (/checkout-v2-labels-left): the label in the label column, the box and the note to its right.
withDefaults(
  defineProps<{ title: string; sub?: string; logo?: string; label?: string; note?: string; labelPosition?: 'top' | 'left'; filled?: boolean; icon?: string }>(),
  { sub: '', logo: undefined, label: undefined, note: '', labelPosition: 'top', filled: false, icon: undefined },
);
</script>

<template>
  <div class="so" :class="'so--' + labelPosition">
    <span v-if="label" class="so__label">{{ label }}</span>
    <div class="so__body">
      <div class="so__box" :class="{ 'so__box--filled': filled, 'so__box--icon': icon }" role="group" :aria-label="label">
        <span v-if="icon" class="so__icon" aria-hidden="true"><Icon :name="icon" :size="16" /></span>
        <span class="so__title">
          {{ title }}
          <img v-if="logo" class="so__logo" :src="logo" alt="" width="16" height="16" />
        </span>
        <span v-if="sub" class="so__sub">{{ sub }}</span>
      </div>
      <p v-if="note" class="so__note ds-text-special-special-12-regular">{{ note }}</p>
    </div>
  </div>
</template>

<style scoped>
.so {
  display: flex;
  flex-direction: column;
}
.so__body {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-width: 0;
}
/* Label left: the label column (--form-label-w, set by the screen), label on the level of the first text line. */
.so--left {
  flex-direction: row;
  align-items: flex-start;
}
.so--left .so__label {
  flex: none;
  box-sizing: border-box;
  width: var(--form-label-w, auto);
  padding: calc(var(--space-12) + var(--space-2)) var(--space-8) 0 0;
}
/* As the Select label (DS/Form/Input title, 4 under it). */
.so__label {
  padding-bottom: var(--space-4);
  color: var(--text-primary);
  font: var(--typo-form-input-title);
}
/* Select size=rich geometry: 64 high, padding 14 / 12, two lines of 16 with 4 between. */
.so__box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-4);
  box-sizing: border-box;
  min-height: calc(2 * var(--space-32));
  /* Default (/checkout-v2): a lighter frame than a field (border/divider instead of border/input), no fill — reads as
     fixed text, not an input. The height stays 64 (same as Select size=rich) so the form does not jump. */
  padding: calc(var(--space-12) + var(--space-2) - var(--stroke-thin)) calc(var(--space-12) - var(--stroke-thin));
  border: var(--stroke-thin) solid var(--border-divider);
  border-radius: var(--radius-8);
  background: none;
  color: var(--text-primary);
  font: var(--typo-form-input-text);
}
/* filled (/checkout-v2-single): a tint under the text, radius 8 — keeps the value apart from its label.
   The theme editor has no setting for it, so the tint is derived from the text colour (text/primary at 4 %) and follows
   any theme; older browsers without color-mix keep surface/subtle. */
.so__box--filled {
  padding: calc(var(--space-12) + var(--space-2)) var(--space-12);
  border: 0;
  border-radius: var(--radius-8);
  background: var(--surface-subtle);
  background: color-mix(in srgb, var(--text-primary) 4%, transparent);
}
/* icon (payment): the leading icon 16 on the level of the option name; the second line under the name. */
.so__box--icon {
  display: grid;
  grid-template-columns: auto 1fr;
  align-content: center;
  column-gap: var(--space-8);
}
/* Text always in the second column — otherwise the second line auto-places under the icon and pushes the name right. */
.so__box--icon > .so__title,
.so__box--icon > .so__sub {
  grid-column: 2;
}
.so__icon {
  grid-row: 1;
  align-self: center;
  display: inline-flex;
  color: var(--icon-primary);
}
.so__title {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}
.so__logo {
  flex: none;
}
.so__sub {
  color: var(--text-secondary);
}
/* As the field hint (input-main hint: Special 12 Regular, text/secondary, 4 above). */
.so__note {
  margin: var(--space-4) 0 0;
  color: var(--text-secondary);
}
</style>
