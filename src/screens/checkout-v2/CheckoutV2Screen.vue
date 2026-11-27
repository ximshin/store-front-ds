<script setup lang="ts">
// Screen /checkout-v2 — Figma Checkout-v2 «Checkout — DS» (fCa1yysqLNrhQCioRjN8CF, 1:1048).
// Switch «Звичайне оформлення | Швидке замовлення» (Figma 10:1880) under the title: the full form or the quick order —
// a shortened full form in the same style. The form lies on the page background without a frame; the order column —
// two cards: summary and items. Wired to the same mock store as /checkout. /checkout-accordion stays as it was.
import { computed, nextTick, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { CheckoutHeader, ButtonFront } from '../../main';
import OrderCard from '../checkout/parts/OrderCard.vue';
import CheckoutFormV2 from './parts/CheckoutFormV2.vue';
import QuickOrderFormV2 from './parts/QuickOrderFormV2.vue';
import ModeSwitch from './parts/ModeSwitch.vue';
import { checkout, clearFormFields, setDelivery, setPayment, type Mode } from '../../data/checkout';

// single (/checkout-v2-single): the shop has one delivery method (Нова Пошта) and one payment method (cash on delivery).
// labels (/checkout-v2-labels-left): field labels in a column left of the fields (as on the shop's current checkout).
// narrow (/checkout-v2-labels-left-400, with labels left): every field 400 wide, the form column = labels 160 + 400,
// the form and the order column centred together — no gap between them, spare width goes to the page margins.
// commentBottom (/checkout-v2-comment): the comment is its own section after «Оплата», the field is a textarea.
// contactsFirst (/checkout-v2-comment): Телефон · Е-пошта before the name.
// patronymicBelow (/checkout-v2-comment): «По батькові» on its own row under the name, as wide as «Прізвище».
// switchLook: a compact switch that hugs its labels (Figma toggle-box 89:1229) — /checkout-v2 compact-dark, /checkout-v2-comment compact (light).
// promoAlways (/checkout-v2-comment): the promo field is always shown, no chips — the code is seen as its discount line.
// layout: rhythm variants (display … split) change only CSS; structural ones (paycol, accordion, three) rearrange blocks.
export type DesktopLayout = 'base' | 'display' | 'framed' | 'cards' | 'steps' | 'split' | 'paycol' | 'accordion' | 'three';
// noSteps (/checkout-v2-steps-plain, with layout steps): no numbered circles and no step line — sections start at the left edge.
// modeToggle (/checkout-v2-toggle, Figma Checkout-v2 title 90:2483): no switch — one button M (default) right of the title
// that leads to the other mode; its label names that mode («Швидке замовлення» ↔ «Звичайне оформлення»).
const props = withDefaults(defineProps<{ layout?: DesktopLayout; modeToggle?: boolean; emptyForm?: boolean; paymentLogo?: boolean; single?: boolean; labels?: 'top' | 'left'; narrow?: boolean; commentBottom?: boolean; promoAlways?: boolean; switchLook?: 'compact' | 'compact-dark' | 'line'; patronymicBelow?: boolean; contactsFirst?: boolean; noSteps?: boolean }>(), {
  layout: 'base',
  modeToggle: false,
  emptyForm: false,
  paymentLogo: false,
  single: false,
  labels: 'top',
  narrow: false,
  commentBottom: false,
  promoAlways: false,
  switchLook: undefined,
  patronymicBelow: false,
  contactsFirst: false,
  noSteps: false,
});
// emptyForm (/checkout-v2-steps): the recipient and address fields start empty — the buyer fills them in;
// the mock values come back when the screen is left, so the other screens stay pre-filled.
if (props.emptyForm) {
  const prev = clearFormFields();
  onBeforeUnmount(() => Object.assign(checkout.form, prev));
}
if (props.single) {
  if (checkout.form.delivery !== 'np') setDelivery('np');
  setPayment('cod');
}

const router = useRouter();
// Props shared by every CheckoutFormV2 instance (structural layouts render the form in parts, in several columns).
const formProps = computed(() => ({
  gated: props.emptyForm,
  paymentLogo: props.paymentLogo,
  single: props.single,
  labels: props.labels,
  commentBottom: props.commentBottom,
  patronymicBelow: props.patronymicBelow,
  contactsFirst: props.contactsFirst,
}));
// paycol / three (full mode only): payment, totals and the confirm button move to the order column.
const payColumn = computed(() => checkout.mode === 'full' && (props.layout === 'paycol' || props.layout === 'three'));
const switchEl = ref<HTMLElement | null>(null);
// split: short labels «Детальне | Швидке» (the switch sits in the title row there).
const modes = computed(() => props.layout === 'split'
  ? [{ value: 'full', label: 'Детальне' }, { value: 'quick', label: 'Швидке' }]
  : [{ value: 'full', label: 'Звичайне оформлення' }, { value: 'quick', label: 'Швидке замовлення' }]);
function setMode(value: string) {
  checkout.mode = value as Mode;
}
// «Передзвонити вам?» in the header — the quick order.
async function onCallback() {
  setMode('quick');
  await nextTick();
  switchEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
</script>

<template>
  <div class="screen" :class="[`screen--${layout}`, { 'screen--labels-left': labels === 'left', 'screen--narrow': narrow, 'screen--no-steps': noSteps }]">
    <CheckoutHeader
      show-callback
      phones="050 029-37-94, 063 500-89-85, 067 189-29-84"
      @back="router.push('/')"
      @callback="onCallback"
    />
    <main class="main">
      <div class="left">
        <div class="head">
          <!-- modeToggle: Figma 90:2483 — title and the mode button in one row (centred, 24 below). -->
          <div v-if="modeToggle" ref="switchEl" class="head__row">
            <h1 class="ds-text-display-m head__title">Оформлення замовлення</h1>
            <ButtonFront
              type="default"
              size="m"
              :label="checkout.mode === 'full' ? 'Швидке замовлення' : 'Звичайне оформлення'"
              @click="setMode(checkout.mode === 'full' ? 'quick' : 'full')"
            />
          </div>
          <h1 v-if="!modeToggle" class="ds-text-display-m head__title">Оформлення замовлення</h1>
          <!-- Figma switch-box 10:1880: padding-bottom 8. -->
          <div v-if="!modeToggle" ref="switchEl" class="head__switch" :class="{ 'head__switch--compact': !!switchLook }">
            <ModeSwitch :model-value="checkout.mode" :items="modes" label="Спосіб оформлення" :look="switchLook ?? (narrow ? 'filled' : 'soft')" @update:model-value="setMode" />
          </div>
        </div>
        <!-- paycol (ref. ui-pay-column-86): «what and where» on the left — the items, recipient, delivery, comment. -->
        <template v-if="payColumn && layout === 'paycol'">
          <OrderCard class="left__items" split items-only scroll-hint />
          <CheckoutFormV2 v-bind="formProps" :parts="['recipient', 'delivery', 'comment']" />
        </template>
        <!-- three (ref. ui-three-columns-62): the items and the recipient + delivery side by side under the title. -->
        <div v-else-if="payColumn && layout === 'three'" class="cols">
          <div class="cols__items"><OrderCard split items-only scroll-hint /></div>
          <CheckoutFormV2 v-bind="formProps" narrow :parts="['recipient', 'delivery']" />
        </div>
        <CheckoutFormV2 v-else-if="checkout.mode === 'full'" v-bind="formProps" :narrow="narrow" :accordion="layout === 'accordion'" />
        <QuickOrderFormV2 v-else :labels="labels" :comment-bottom="commentBottom" :patronymic-below="patronymicBelow" :contacts-first="contactsFirst" />
      </div>
      <aside class="right">
        <!-- paycol / three: «how to pay» — payment, the totals with the promo field, (comment,) consents and the button. -->
        <div v-if="payColumn" class="pay">
          <CheckoutFormV2 v-bind="formProps" :parts="['payment']" />
          <OrderCard split summary-only promo-always />
          <CheckoutFormV2 v-bind="formProps" :parts="layout === 'three' ? ['comment', 'confirm'] : ['confirm']" />
        </div>
        <OrderCard v-else split scroll-hint :promo-always="promoAlways" :hide-count="layout === 'display'" :promo-icon="layout === 'steps'" />
      </aside>
    </main>
  </div>
</template>

<style scoped>
/* ---------- labels left (/checkout-v2-labels-left) ----------
   DS Label position=Left with a fixed label column (160) so the fields start on one line; the label sits on the
   level of the field text (L 40: 12 from the top; rich 64: first line at 14). Fields one per line; elements without
   a label (.form__indent: payment, links, notes, errors, confirm) start at the field column. */
.screen--labels-left {
  --form-label-w: 160px;
}
.screen--labels-left :deep(.ds-input--left .ds-input__label),
.screen--labels-left :deep(.ds-select--left .ds-select__label) {
  box-sizing: border-box;
  width: var(--form-label-w);
  padding-top: var(--space-12);
  white-space: normal;
}
.screen--labels-left :deep(.ds-select--rich.ds-select--left .ds-select__label) {
  padding-top: calc(var(--space-12) + var(--space-2));
}
.screen--labels-left :deep(.form__indent) {
  box-sizing: border-box;
  max-width: calc(100% - var(--form-label-w));
  margin-left: var(--form-label-w);
}
.screen--labels-left :deep(.rf__row) {
  flex-direction: column;
  gap: var(--space-16);
}
.screen--labels-left :deep(.rf__spacer) {
  display: none;
}
/* The map button: on the field line (the label is beside the field, not above it). */
.screen--labels-left :deep(.form__address > .ds-button-wrap) {
  margin-top: 0;
}
/* ---------- narrow (/checkout-v2-labels-left-400): fields 400, form + order centred ---------- */
.screen--narrow {
  --form-field-w: 400px;
}
@media (min-width: 1101px) {
  .screen--narrow .main {
    justify-content: center;
  }
  .screen--narrow .left {
    flex: 0 1 calc(var(--form-label-w) + var(--form-field-w));
  }
}
/* The map button is icon-only here (CheckoutFormV2 narrow): a square 40 beside the branch field, which is shorter by
   40 + gap 8 — the row ends on the common right edge. */
/* Phones: no room for a label column — labels go back above the fields. */
@media (max-width: 600px) {
  .screen--labels-left :deep(.ds-input--left),
  .screen--labels-left :deep(.ds-select--left),
  .screen--labels-left :deep(.so--left) {
    flex-direction: column;
    align-items: stretch;
  }
  .screen--labels-left :deep(.ds-input--left .ds-input__label),
  .screen--labels-left :deep(.ds-select--left .ds-select__label),
  .screen--labels-left :deep(.so--left .so__label) {
    width: auto;
    padding: 0 0 var(--space-4);
  }
  .screen--labels-left :deep(.form__indent) {
    max-width: none;
    margin-left: 0;
  }
  /* Narrow: the square map button stays beside the field (label above it — the button lines up with the field). */
  .screen--narrow :deep(.form__address) {
    flex-direction: row;
    align-items: flex-start;
  }
  .screen--narrow :deep(.form__address > .ds-button-wrap) {
    margin-top: calc(var(--font-line-height-16) + var(--space-4));
  }
}

/* Figma 1:1048: fill surface/default + surface/subtle at 3 % (itself translucent) — visually white; cards stand out by border/card. */
.screen {
  min-height: 100vh;
  background: var(--surface-default);
  color: var(--text-primary);
}
/* Figma main 1:1050: padding 0 32, gap 40; left Fill, order column 480 (padding 32 top / 16 bottom). Band max 1440. */
.main {
  display: flex;
  align-items: flex-start;
  gap: var(--space-40);
  box-sizing: border-box;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--space-32);
}
.left {
  flex: 1 1 0;
  min-width: 0;
  padding: var(--space-16) 0 var(--space-40);
}
.head {
  padding-top: var(--space-8);
}
.head__title {
  margin: 0;
  padding-bottom: var(--space-24);
}
.head__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-16);
  padding-bottom: var(--space-24);
}
.head__row .head__title {
  padding-bottom: 0;
}
.head__switch {
  padding-bottom: var(--space-8);
}
/* Figma toggle-box 89:1229: no bottom padding under the compact switch. */
.head__switch--compact {
  padding-bottom: 0;
}
/* Desktop: the order column sticks to the top; the items card scrolls inside (OrderCard). */
.right {
  position: sticky;
  top: 0;
  flex: 0 0 480px;
  box-sizing: border-box;
  padding: var(--space-32) 0 var(--space-16);
}
@media (max-width: 900px) {
  .screen :deep(.ds-checkout-header__contacts) {
    display: none;
  }
}
@media (max-width: 600px) {
  .screen :deep(.ds-checkout-header) {
    padding: 0 var(--space-16);
  }
  .screen :deep(.ds-checkout-header__back .ds-button__label) {
    display: none;
  }
}
/* Narrow widths: columns stack, the order cards go under the form (max 600, centred). */
@media (max-width: 1100px) {
  .main {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 0 var(--space-16);
  }
  .left,
  .right {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }
  .right {
    position: static;
    flex: none;
    padding: 0 0 var(--space-40);
  }
}
</style>

<!--
  Rhythm variants (layout): the same screen, only proportions change — heading sizes, spacing between sections and
  titles, dividers, neutral surfaces. Inputs, selects, their labels and all colours stay as they are (colours are set per
  shop). References — briefs/checkout/refs_desktop_rhythm.md; mobile pairs — /checkout-mobile-airy|dense|cards|steps.
-->
<style scoped>
.screen {
  --step-gutter: calc(var(--space-48) + var(--space-8));
}
/* Numbered section titles (framed, steps): «1. Одержувач замовлення». */
.screen--framed :deep(.form),
.screen--steps :deep(.form) {
  counter-reset: sec;
}
.screen--framed :deep(.form__section),
.screen--steps :deep(.form__section) {
  counter-increment: sec;
}

/* ---------- 1. display — the usual page title; light section titles, air between sections, light totals ---------- */
.screen--display :deep(.form__section) {
  padding: var(--space-48) 0 0;
  border-bottom: 0;
}
.screen--display :deep(.form__head .ds-section-title__text) {
  font: var(--font-weight-regular) var(--font-size-20) / var(--font-line-height-28) var(--font-sans), system-ui, sans-serif;
}
.screen--display :deep(.form__head.ds-section-title) {
  margin-bottom: var(--space-8);
}
/* Fields 20 apart (rows of the recipient, delivery fields). */
.screen--display :deep(.form__items),
.screen--display :deep(.rf__items) {
  gap: var(--space-20);
}
/* Payment → comment 20, comment → consents 40. */
.screen--display :deep(.cs) {
  margin-top: var(--space-20);
  padding: 0;
  border-bottom: 0;
}
.screen--display :deep(.form__confirm) {
  margin-top: 0;
  padding-top: var(--space-40);
}
/* Both order cards: 20 on every side. Summary — the card pads 20, its blocks have no own side padding. */
.screen--display :deep(.order--split .order__summary) {
  gap: var(--space-20);
  padding: var(--space-20);
}
.screen--display :deep(.order--split .order__summary .order__promo-form),
.screen--display :deep(.order--split .order__summary .order__promo),
.screen--display :deep(.order--split .order__summary .order__warning),
.screen--display :deep(.order--split .order__summary .ds-order-summary) {
  padding-inline: 0;
}
/* Items card: title 16 from the top, 20 from the sides; rows 20 from the sides, the last one 20 from the bottom. */
.screen--display :deep(.order--split .order__title) {
  padding: var(--space-16) var(--space-20) 0;
}
.screen--display :deep(.order--split .order__items > .ci) {
  padding-inline: var(--space-20);
}
.screen--display :deep(.order--split .order__items > .ci:last-child) {
  padding-bottom: var(--space-20);
}
.screen--display :deep(.order--split .order__items > .ci--bundle .ci__bundle-title),
.screen--display :deep(.order--split .order__items > .ci--bundle .ci__bundle-item),
.screen--display :deep(.order--split .order__items > .ci--bundle .ci__bundle-total) {
  padding-inline: 0;
}
.screen--display :deep(.order--split .order__items > .ci:not(:last-child)::after) {
  left: var(--space-20);
  right: var(--space-20);
}
/* «Загальна сума» and the sum — regular 16; «Ваше замовлення» — regular. */
.screen--display :deep(.order__summary .ds-order-summary__total-label) {
  font-weight: var(--font-weight-regular);
}
/* The sum — 14 bold, as the item sums. */
.screen--display :deep(.order__summary .ds-order-summary__total .ds-price__value) {
  font: var(--font-weight-bold) var(--font-size-14) / var(--font-line-height-20) var(--font-sans), system-ui, sans-serif;
}
/* Title row: 8 below the text, so the divider shown while the list scrolls does not stick to the title. */
.screen--display :deep(.order--split .order__title .ds-section-title) {
  padding-bottom: var(--space-8);
}
.screen--display :deep(.order__title .ds-section-title__text) {
  font: var(--font-weight-regular) var(--font-size-20) / var(--font-line-height-28) var(--font-sans), system-ui, sans-serif;
}

/* ---------- 2. framed — every section in a frame, caps titles with tracking, tight steps between frames ---------- */
.screen--framed .head__title {
  font: var(--font-weight-semibold) var(--font-size-20) / var(--font-line-height-28) var(--font-sans), system-ui, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  padding: var(--space-16) 0 var(--space-24);
}
.screen--framed :deep(.form) {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding-top: var(--space-16);
}
.screen--framed :deep(.form__section),
.screen--framed :deep(.cs) {
  padding: var(--space-24);
  border: var(--stroke-thin) solid var(--border-card);
  border-radius: var(--radius-8);
}
.screen--framed :deep(.form__head .ds-section-title__text),
.screen--framed :deep(.order__title .ds-section-title__text) {
  font: var(--font-weight-semibold) var(--font-size-14) / var(--font-line-height-20) var(--font-sans), system-ui, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.screen--framed :deep(.cs) {
  padding: var(--space-12) var(--space-16);
}
.screen--framed :deep(.form__head .ds-section-title__text::before) {
  content: counter(sec) '. ';
}
.screen--framed :deep(.form__head.ds-section-title) {
  margin-bottom: var(--space-8);
}
.screen--framed :deep(.form__confirm) {
  padding-top: var(--space-8);
}
.screen--framed :deep(.order--split .order__summary) {
  padding: var(--space-24) var(--space-8);
}

/* ---------- 3. cards — the page on a neutral tint, every block a white card without a frame ---------- */
.screen--cards {
  background: linear-gradient(var(--surface-subtle), var(--surface-subtle)), var(--surface-default);
}
.screen--cards :deep(.form) {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}
.screen--cards :deep(.form__section),
.screen--cards :deep(.cs),
.screen--cards :deep(.form__confirm) {
  padding: var(--space-24);
  border: 0;
  border-radius: var(--radius-16);
  background: var(--surface-default);
}
.screen--cards :deep(.cs) {
  padding: var(--space-12) var(--space-16);
}
.screen--cards :deep(.form__head .ds-section-title__text),
.screen--cards :deep(.order__title .ds-section-title__text) {
  font: var(--font-weight-semibold) var(--font-size-20) / var(--font-line-height-28) var(--font-sans), system-ui, sans-serif;
}
.screen--cards :deep(.form__head.ds-section-title) {
  margin-bottom: var(--space-8);
}
.screen--cards .head__switch {
  padding-bottom: var(--space-16);
}
.screen--cards :deep(.order--split .order__summary),
.screen--cards :deep(.order--split .order__title),
.screen--cards :deep(.order--split .order__list),
.screen--cards :deep(.order--split .order__empty) {
  border: 0;
}
.screen--cards :deep(.order--split .order__summary) {
  padding: var(--space-24) var(--space-8);
  border-radius: var(--radius-16);
}
.screen--cards :deep(.order--split .order__title) {
  padding: var(--space-24) var(--space-16) 0;
  border-radius: var(--radius-16) var(--radius-16) 0 0;
}
.screen--cards :deep(.order--split .order__list) {
  border-radius: 0 0 var(--radius-16) var(--radius-16);
}

/* ---------- 4. steps — numbered circles, section titles 24 without an underline, a step line on the left ---------- */
.screen--steps .head__switch {
  padding-bottom: var(--space-16);
}
.screen--steps :deep(.form__section) {
  position: relative;
  padding: var(--space-24) 0 var(--space-24) var(--step-gutter);
  border-bottom: 0;
}
.screen--steps :deep(.form__head.ds-section-title) {
  position: relative;
  margin-bottom: var(--space-16);
}
/* The single remaining method (SingleOption: instalments → only Nova Poshta; pickup → only cash) as a line field
   too: label 13 inside, value 16/24, sub 13/16, the bottom line; no box. */
.screen--steps :deep(.form .so--top) {
  position: relative;
}
.screen--steps :deep(.form .so--top > .so__label) {
  position: absolute;
  top: var(--space-8);
  left: 0;
  z-index: 1;
  padding: 0;
  color: var(--text-secondary);
  font: var(--font-weight-regular) var(--font-size-13) / var(--font-line-height-16) var(--font-sans), system-ui, sans-serif;
}
.screen--steps :deep(.form .so__box) {
  min-height: 56px;
  padding: var(--space-24) 0 var(--space-8);
  border: 0;
  border-bottom: var(--stroke-thin) solid var(--border-input);
  border-radius: 0;
  background: none;
}
.screen--steps :deep(.form .so:not(:has(> .so__label)) .so__box) {
  padding-block: var(--space-16);
}
.screen--steps :deep(.form .so__title) {
  font-size: var(--font-size-16);
  line-height: var(--font-line-height-24);
}
.screen--steps :deep(.form .so__sub) {
  font-size: var(--font-size-13);
  line-height: var(--font-line-height-16);
}
/* «Увійти» centred on the 32 title line. */
.screen--steps :deep(.form__head.ds-section-title) {
  align-items: center;
}
/* Fields 24 apart — in a row (Телефон · Е-пошта, Прізвище · Ім'я) and between rows / fields of a section. */
.screen--steps :deep(.rf__row),
.screen--steps :deep(.rf__items),
.screen--steps :deep(.form__items) {
  gap: var(--space-24);
}
/* «Наприклад, Україна» stays 4 under the country line (as with the 16 gap). */
.screen--steps :deep(.form__example) {
  margin-top: calc(var(--space-4) - var(--space-24));
}
.screen--steps :deep(.form__head .ds-section-title__text) {
  font: var(--font-weight-regular) var(--font-size-24) / var(--font-line-height-32) var(--font-sans), system-ui, sans-serif;
}
/* The number: a 36 circle in the left gutter, centred on the 32 title line. */
.screen--steps :deep(.form__head .ds-section-title__text::before) {
  content: counter(sec);
  position: absolute;
  left: calc(-1 * var(--step-gutter));
  top: -2px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 36px;
  height: 36px;
  border: 1.5px solid currentColor;
  border-radius: var(--radius-full);
  font: var(--font-weight-semibold) var(--font-size-16) / 1 var(--font-sans), system-ui, sans-serif;
}
/* The step line: from under the circle to the next section's circle; none after the last step. */
.screen--steps :deep(.form__section::before) {
  content: '';
  position: absolute;
  left: 17px;
  top: calc(var(--space-24) + 40px);
  bottom: calc(4px - var(--space-24));
  border-left: var(--stroke-thin) solid var(--border-divider);
}
.screen--steps :deep(.form__section:not(:has(~ .form__section))::before) {
  display: none;
}
.screen--steps :deep(.cs),
.screen--steps :deep(.form__confirm) {
  box-sizing: border-box;
  max-width: calc(100% - var(--step-gutter));
  margin-left: var(--step-gutter);
}
.screen--steps :deep(.cs) {
  padding-top: 0;
  border-bottom: 0;
}
.screen--steps :deep(.form__confirm) {
  padding-top: var(--space-24);
}
/* noSteps (/checkout-v2-steps-plain): the same steps rhythm without the numbers — no circles, no step line, no gutter. */
.screen--no-steps {
  --step-gutter: 0px;
}
.screen--no-steps :deep(.form__head .ds-section-title__text::before),
.screen--no-steps :deep(.form__section::before) {
  display: none;
}
.screen--steps :deep(.order__title .ds-section-title__text) {
  font: var(--font-weight-regular) var(--font-size-24) / var(--font-line-height-32) var(--font-sans), system-ui, sans-serif;
}

/* Line fields (Figma HOROSHOP-8318 Checkout 2066:4016): no box — only the bottom line; the label 13/16 secondary
   sits inside the field above the value 16/24. Fields 56 tall; the comment textarea grows from 3 lines.
   Inputs and labelled selects: an empty unfocused field shows only the label, in the value row (floating label); on
   focus / with a value it moves up. The promo field in the summary is a line too (no label — placeholder). */
.screen--steps :deep(:is(.form .ds-input--top, .form .ds-select--top)) {
  position: relative;
}
.screen--steps :deep(:is(.form .ds-input--top > .ds-input__label, .form .ds-select--top > .ds-select__label)) {
  position: absolute;
  top: var(--space-8);
  left: 0;
  z-index: 1;
  padding: 0;
  color: var(--text-secondary);
  font: var(--font-weight-regular) var(--font-size-13) / var(--font-line-height-16) var(--font-sans), system-ui, sans-serif;
  pointer-events: none;
  transition: top 0.15s ease, font-size 0.15s ease, line-height 0.15s ease;
}
.screen--steps :deep(.form .ds-input--top:not(:focus-within):has(.ds-input__control:placeholder-shown) > .ds-input__label),
.screen--steps :deep(.form .ds-select--top:not(:focus-within):has(.ds-select__input:placeholder-shown) > .ds-select__label),
.screen--steps :deep(.form .ds-select--top.is-empty:not(:focus-within) > .ds-select__label) {
  top: var(--space-16);
  font-size: var(--font-size-16);
  line-height: var(--font-line-height-24);
}
/* The placeholder repeats the label — hidden; phone / e-mail format and the comment example show on focus. */
.screen--steps :deep(.form .ds-input--top:not(.ds-input--multiline) .ds-input__control:not([type='tel'], [type='email'])::placeholder),
.screen--steps :deep(.form .ds-input--top:not(:focus-within) .ds-input__control::placeholder) {
  color: transparent;
}
/* Labelled selects: the placeholder («Введіть назву своєї країни», «Оберіть спосіб доставки») hides under the label;
   the search select shows it again on focus. Rich / list selects: the form marks an empty one with .is-empty (it
   passes the chosen value as the placeholder, so the Select's own is-placeholder can't tell empty from chosen). */
.screen--steps :deep(.form .ds-select--top:has(> .ds-select__label):not(:focus-within) .ds-select__input::placeholder),
.screen--steps :deep(.form .ds-select--top.is-empty:has(> .ds-select__label):not(:focus-within) :is(.ds-select__value, .ds-select__value *)) {
  color: transparent;
}
.screen--steps :deep(:is(.form .ds-input--top, .form .ds-select--top, .order__promo-input) .ds-input-main__field) {
  min-height: 56px;
  padding: var(--space-24) 0 var(--space-8);
  border-width: 0 0 var(--stroke-thin);
  border-radius: 0;
  background: transparent;
}
/* Disabled until the city is chosen (gated): the label and the value muted, the line border/disabled; the payment
   section title and its number muted too (as /checkout-mobile). */
.screen--steps :deep(.form :is(.ds-select.is-disabled > .ds-select__label, .ds-input.is-disabled > .ds-input__label)) {
  color: var(--text-disabled);
}
.screen--steps :deep(.form .ds-select.is-disabled :is(.ds-select__sub, .ds-select__icon-lead, .ds-select__logo)) {
  color: var(--text-disabled);
  opacity: 0.5;
}
.screen--steps :deep(.form__section--locked .form__head),
.screen--steps :deep(.form__section--locked .form__head .ds-section-title__text) {
  color: var(--text-disabled);
}
.screen--steps :deep(.form__address .ds-button:disabled) {
  background: transparent;
}
/* No label (payment select, promo): the value is centred in the 56 line. An empty labelled select too — the arrow
   lines up with the label shown in the value row. */
.screen--steps :deep(:is(.form .ds-select--top:not(:has(> .ds-select__label)), .order__promo-input) .ds-input-main__field),
.screen--steps :deep(.form .ds-select--top:has(> .ds-select__label):not(:focus-within):has(.ds-select__input:placeholder-shown) .ds-input-main__field),
.screen--steps :deep(.form .ds-select--top.is-empty:has(> .ds-select__label):not(:focus-within) .ds-input-main__field) {
  padding-block: var(--space-16);
}
.screen--steps :deep(:is(.form .ds-input--top, .form .ds-select--top, .order__promo-input) .ds-input-main:not(.is-disabled) .ds-input-main__field:focus-within) {
  box-shadow: inset 0 calc(-1 * var(--stroke-thin)) 0 var(--border-input-active);
}
.screen--steps :deep(:is(.form, .order__promo-input) :is(.ds-input__control, .ds-select__value, .ds-select__title-text)) {
  height: auto;
  font-size: var(--font-size-16);
  line-height: var(--font-line-height-24);
}
.screen--steps :deep(.form .ds-select__sub) {
  font-size: var(--font-size-13);
  line-height: var(--font-line-height-16);
}

/* Comment textarea: the textarea fills the field, so the line paddings move inside it; 3 lines of 24 + 24 / 8,
   grows to 8 lines; no resize handle (it grows by itself); the clear cross sits on the value row. */
.screen--steps :deep(.form .ds-input--multiline .ds-input-main__field) {
  padding: 0;
}
.screen--steps :deep(.form .ds-input--multiline .ds-input__control--multiline) {
  width: 100%;
  min-height: calc(var(--input-rows, 3) * var(--font-line-height-24) + var(--space-24) + var(--space-8));
  max-height: calc(8 * var(--font-line-height-24) + var(--space-24) + var(--space-8));
  margin: 0;
  padding: var(--space-24) var(--space-32) var(--space-8) 0;
  resize: none;
}
.screen--steps :deep(.form .ds-input--multiline .ds-input-main__side--right) {
  top: var(--space-24);
  right: 0;
  height: var(--font-line-height-24);
}

/* Promo row: the field and «Застосувати» on one line, the button centred on the 56 line. */
.screen--steps :deep(.order__promo-form) {
  align-items: center;
}

/* «Обрати на мапі» — a text link with the icon instead of a framed button (it does not compete with the fields). */
.screen--steps :deep(.form__address) {
  align-items: center;
}
.screen--steps :deep(.form__address > .ds-button-wrap .ds-button),
.screen--steps :deep(.form__address > .ds-button) {
  padding-inline: var(--space-8);
  border-color: transparent;
  background: transparent;
  font: var(--typo-special-special-14-medium);
}
.screen--steps :deep(.form__address > .ds-button-wrap .ds-button:hover),
.screen--steps :deep(.form__address > .ds-button:hover) {
  background: var(--surface-hover);
}
/* The promo line runs under the field and the button: the line moves from the field to the form row. */
.screen--steps :deep(.order__promo-form) {
  border-bottom: var(--stroke-thin) solid var(--border-input);
  transition: box-shadow 0.15s ease;
}
.screen--steps :deep(.order__promo-form:has(.is-error)) {
  border-bottom-color: var(--border-danger);
}
.screen--steps :deep(.order__promo-form:focus-within) {
  border-bottom-color: var(--border-input-active);
  box-shadow: inset 0 calc(-1 * var(--stroke-thin)) 0 var(--border-input-active);
}
.screen--steps :deep(.order .order__promo-form .order__promo-input .ds-input-main__field),
.screen--steps :deep(.order .order__promo-form .order__promo-input .ds-input-main:not(.is-disabled) .ds-input-main__field:focus-within) {
  border-bottom-width: 0;
  box-shadow: none;
}
/* The error text goes under the common line. */
.screen--steps :deep(.order .order__promo-form .order__promo-input .ds-input-main__hint) {
  position: absolute;
  top: calc(100% + var(--space-4));
  left: 0;
}
.screen--steps :deep(.order__promo-form:has(.is-error)) {
  margin-bottom: var(--space-20);
}
/* «Застосувати» — a text button like «Обрати на мапі», without the black fill. */
.screen--steps :deep(.order__promo-form > .ds-button-wrap .ds-button),
.screen--steps :deep(.order__promo-form > .ds-button) {
  padding-inline: var(--space-8);
  border-color: transparent;
  background: transparent;
  color: var(--text-primary);
  font: var(--typo-special-special-14-medium);
}
.screen--steps :deep(.order__promo-form > .ds-button-wrap .ds-button:hover),
.screen--steps :deep(.order__promo-form > .ds-button:hover) {
  background: var(--surface-hover);
}

/* Order column without card frames: the summary, a divider, the items title and list lie on the page. */
.screen--steps :deep(.order--split) {
  gap: 0;
}
.screen--steps :deep(.order--split .order__summary),
.screen--steps :deep(.order--split .order__title),
.screen--steps :deep(.order--split .order__list),
.screen--steps :deep(.order--split .order__empty) {
  border: 0;
  border-radius: 0;
  background: none;
}
.screen--steps :deep(.order--split .order__summary) {
  padding: 0 0 var(--space-20);
  border-bottom: var(--stroke-thin) solid var(--border-divider);
}
.screen--steps :deep(.order--split .order__title) {
  margin-bottom: 0;
  padding: var(--space-20) 0 0;
}
.screen--steps :deep(.order--split .order__title .ds-section-title) {
  padding-bottom: var(--space-20);
}
.screen--steps :deep(.order--split .order__summary .ds-order-summary),
.screen--steps :deep(.order--split .order__promo-form),
.screen--steps :deep(.order--split .order__promo),
.screen--steps :deep(.order--split .order__warning) {
  padding-inline: 0;
}
.screen--steps :deep(.order__list::after) {
  display: none;
}
.screen--steps :deep(.order--split .order__items > .ci) {
  padding-inline: 0;
}
.screen--steps :deep(.order--split .ci--bundle .ci__bundle-title),
.screen--steps :deep(.order--split .ci--bundle .ci__bundle-item),
.screen--steps :deep(.order--split .ci--bundle .ci__bundle-total) {
  padding-inline: 0;
}
.screen--steps :deep(.order--split .order__items > .ci:not(:last-child)::after) {
  left: 0;
  right: 0;
}
/* A vertical line between the form and the order column (two-column layout only): 40 on each side.
   The column content starts at the page title: the promo row's text sits on the title line (centres at 124). */
@media (min-width: 1101px) {
  .screen--steps .right {
    padding-top: var(--space-16);
  }
  .screen--steps .left {
    padding-right: var(--space-40);
    border-right: var(--stroke-thin) solid var(--border-divider);
  }
}

/* ---------- 5. split — the order column is a tinted panel to the right window edge, no cards ---------- */
/*
 * Demo of a shop accent: --shop-accent stands for the colour a merchant sets (here a blue). It drives the primary
 * action colour (buttons, the active switch item, checked checkboxes) and tints the order panel at 3 %.
 */
.screen--split {
  --shop-accent: var(--azure-45);
  --surface-action-primary: var(--shop-accent);
  --surface-action-primary-hover: color-mix(in srgb, var(--shop-accent) 85%, black);
}
@media (min-width: 1101px) {
  /* Panel start = the band's right edge − page padding 32 − column 480 − panel padding 40. */
  .screen--split {
    background:
      linear-gradient(to right, var(--surface-default) calc(50% + min(50%, 720px) - 552px), transparent 0),
      color-mix(in srgb, var(--shop-accent) 3%, var(--surface-default));
  }
  .screen--split .right {
    padding-top: var(--space-40);
  }
}
/* Title and the mode switch in one row: the switch flush right, both on top (wraps under the title when narrow). */
.screen--split .head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  column-gap: var(--space-16);
  padding-top: var(--space-24);
}
.screen--split .head__title {
  font: var(--font-weight-semibold) var(--font-size-24) / var(--font-line-height-32) var(--font-sans), system-ui, sans-serif;
}
.screen--split :deep(.form__section) {
  padding: var(--space-40) 0 0;
  border-bottom: 0;
}
.screen--split :deep(.form__head .ds-section-title__text),
.screen--split :deep(.order__title .ds-section-title__text) {
  font: var(--font-weight-semibold) var(--font-size-20) / var(--font-line-height-28) var(--font-sans), system-ui, sans-serif;
}
.screen--split :deep(.form__head.ds-section-title) {
  margin-bottom: var(--space-8);
}
.screen--split :deep(.cs) {
  margin-top: var(--space-24);
  border-bottom: 0;
}
/* Consents: no divider above, 40 from the comment (its own 16 at the bottom + 24). */
.screen--split :deep(.form__confirm) {
  margin-top: 0;
  padding-top: var(--space-24);
}
/* The order on the panel: no frames. Same order and scroll as /checkout-v2 — the summary on top, then the title and the
   item list that scrolls inside (the column is not taller than the window); a divider between them. */
.screen--split :deep(.order--split) {
  gap: 0;
}
.screen--split :deep(.order--split .order__summary),
.screen--split :deep(.order--split .order__title),
.screen--split :deep(.order--split .order__list),
.screen--split :deep(.order--split .order__empty) {
  border: 0;
  border-radius: 0;
  background: none;
}
/* 20 on both sides of each divider: summary → its line → 20 → title → 20 → the line shown while the list scrolls. */
.screen--split :deep(.order--split .order__summary) {
  padding: 0 0 var(--space-20);
  border-bottom: var(--stroke-thin) solid var(--border-divider);
}
.screen--split :deep(.order--split .order__title) {
  margin-bottom: 0;
  padding: var(--space-20) 0 0;
}
.screen--split :deep(.order--split .order__title .ds-section-title) {
  padding-bottom: var(--space-20);
}
/* Fields 20 apart (rows of the recipient, delivery fields). */
.screen--split :deep(.form__items),
.screen--split :deep(.rf__items) {
  gap: var(--space-20);
}
.screen--split :deep(.order--split .order__summary .ds-order-summary),
.screen--split :deep(.order--split .order__promo-form),
.screen--split :deep(.order--split .order__promo),
.screen--split :deep(.order--split .order__warning) {
  padding-inline: 0;
}
.screen--split :deep(.order__list::after) {
  display: none;
}
/* Item rows lie on the panel: no white fill, flush with the title; dividers across the column. */
.screen--split :deep(.order--split .order__items > .ci) {
  padding-inline: 0;
  background: none;
}
.screen--split :deep(.order--split .ci--bundle .ci__bundle-title),
.screen--split :deep(.order--split .ci--bundle .ci__bundle-item),
.screen--split :deep(.order--split .ci--bundle .ci__bundle-total) {
  padding-inline: 0;
}
.screen--split :deep(.order--split .order__items > .ci:not(:last-child)::after) {
  left: 0;
  right: 0;
}
/* The form keeps 40 of white before the panel (the panel's own padding is 40). */
@media (min-width: 1101px) {
  .screen--split .main {
    gap: calc(var(--space-40) * 2);
  }
}

/* ========== Structural variants (paycol, accordion, three) — refs_desktop_rhythm.md №7, №9, №10 ========== */

/* Pay column (paycol, three): payment card → totals card → consents and the button, the column sticks to the top. */
.pay {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}
.pay :deep(.form__section) {
  padding: var(--space-16);
  border: var(--stroke-thin) solid var(--border-card);
  border-radius: var(--radius-8);
}
.pay :deep(.cs) {
  padding: var(--space-8) 0 0;
  border-bottom: 0;
}
.pay :deep(.form__confirm) {
  padding: 0;
}
/* The button spans the column — it is the end of the column, as «Pay» on the reference. */
.pay :deep(.ds-checkout-confirm .ds-button-wrap),
.pay :deep(.ds-checkout-confirm .ds-button) {
  width: 100%;
}
.pay :deep(.order) {
  max-height: none;
}

/* ---------- 7. paycol — items + recipient + delivery on the left; payment, totals and the button on the right ---------- */
/* The items card: up to ~3 rows, then the list scrolls inside (fade + count in the title) — the form stays near the top. */
.screen--paycol .left__items {
  max-height: 480px;
  margin: var(--space-16) 0 var(--space-8);
}

/* ---------- 10. three — items | recipient + delivery | payment + totals + button ---------- */
.screen--three .right {
  flex-basis: 400px;
}
.cols {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: var(--space-32);
  align-items: start;
}
.cols__items {
  position: sticky;
  top: 0;
  padding-top: var(--space-16);
}
.screen--three :deep(.rf__row) {
  flex-direction: column;
  gap: var(--space-16);
}
.screen--three :deep(.rf__spacer) {
  display: none;
}
@media (max-width: 1100px) {
  .cols {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
  .cols__items {
    position: static;
  }
}

/* ---------- 9. accordion — one section open; passed ones collapse to a summary with «Змінити» ---------- */
.screen--accordion :deep(.form--accordion) {
  padding-top: var(--space-16);
}
.screen--accordion :deep(.form--accordion > .form__section) {
  padding: var(--space-20) var(--space-24);
  border: var(--stroke-thin) solid var(--border-card);
  border-bottom: 0;
}
.screen--accordion :deep(.form--accordion > .form__section:first-child) {
  border-radius: var(--radius-8) var(--radius-8) 0 0;
}
.screen--accordion :deep(.form--accordion > .form__section:nth-of-type(3)) {
  border-bottom: var(--stroke-thin) solid var(--border-card);
  border-radius: 0 0 var(--radius-8) var(--radius-8);
}
/* Steps ahead: a muted row on the neutral tint. */
.screen--accordion :deep(.form__section--todo) {
  background: var(--surface-subtle);
}
.screen--accordion :deep(.form--accordion .form__head.ds-section-title) {
  min-height: var(--space-32);
  align-items: center;
}
.screen--accordion :deep(.form--accordion .form__section--open > .form__head.ds-section-title) {
  margin-bottom: var(--space-16);
}
/* No step numbers (2026-11-27): titles start at the frame padding; a passed step is told by its summary + «Змінити». */
.screen--accordion :deep(.form--accordion .form__summary) {
  padding-left: 0;
}
/* Quick order: its recipient section in the same frame as the accordion sections. */
.screen--accordion :deep(.form:not(.form--accordion)) {
  padding-top: var(--space-16);
}
.screen--accordion :deep(.form:not(.form--accordion) > .form__section:first-child) {
  padding: var(--space-20) var(--space-24);
  border: var(--stroke-thin) solid var(--border-card);
  border-radius: var(--radius-8);
}
.screen--accordion :deep(.form:not(.form--accordion) > .form__section:first-child > .form__head.ds-section-title) {
  min-height: var(--space-32);
  align-items: center;
  margin-bottom: var(--space-16);
}
.screen--accordion :deep(.form--accordion > .cs) {
  margin-top: var(--space-16);
  border-bottom: 0;
}
.screen--accordion :deep(.form--accordion > .form__confirm) {
  padding-top: var(--space-8);
}
</style>
