<script setup lang="ts">
// Screen /checkout-v2 — Figma Checkout-v2 «Checkout — DS» (fCa1yysqLNrhQCioRjN8CF, 1:1048).
// Switch «Звичайне оформлення | Швидке замовлення» (Figma 10:1880) under the title: the full form or the quick order —
// a shortened full form in the same style. The form lies on the page background without a frame; the order column —
// two cards: summary and items. Wired to the same mock store as /checkout. /checkout-accordion stays as it was.
import { nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import { CheckoutHeader } from '../../main';
import OrderCard from '../checkout/parts/OrderCard.vue';
import CheckoutFormV2 from './parts/CheckoutFormV2.vue';
import QuickOrderFormV2 from './parts/QuickOrderFormV2.vue';
import ModeSwitch from './parts/ModeSwitch.vue';
import { checkout, setDelivery, setPayment, type Mode } from '../../data/checkout';

// single (/checkout-v2-single): the shop has one delivery method (Нова Пошта) and one payment method (cash on delivery).
// labels (/checkout-v2-labels-left): field labels in a column left of the fields (as on the shop's current checkout).
// narrow (/checkout-v2-labels-left-400, with labels left): every field 400 wide, the form column = labels 160 + 400,
// the form and the order column centred together — no gap between them, spare width goes to the page margins.
const props = withDefaults(defineProps<{ single?: boolean; labels?: 'top' | 'left'; narrow?: boolean }>(), {
  single: false,
  labels: 'top',
  narrow: false,
});
if (props.single) {
  if (checkout.form.delivery !== 'np') setDelivery('np');
  setPayment('cod');
}

const router = useRouter();
const switchEl = ref<HTMLElement | null>(null);
const modes = [
  { value: 'full', label: 'Звичайне оформлення' },
  { value: 'quick', label: 'Швидке замовлення' },
];
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
  <div class="screen" :class="{ 'screen--labels-left': labels === 'left', 'screen--narrow': narrow }">
    <CheckoutHeader
      show-callback
      phones="050 029-37-94, 063 500-89-85, 067 189-29-84"
      @back="router.push('/')"
      @callback="onCallback"
    />
    <main class="main">
      <div class="left">
        <div class="head">
          <h1 class="ds-text-display-m head__title">Оформлення замовлення</h1>
          <!-- Figma switch-box 10:1880: padding-bottom 8. -->
          <div ref="switchEl" class="head__switch">
            <ModeSwitch :model-value="checkout.mode" :items="modes" label="Спосіб оформлення" :look="narrow ? 'filled' : 'soft'" @update:model-value="setMode" />
          </div>
        </div>
        <CheckoutFormV2 v-if="checkout.mode === 'full'" :single="single" :labels="labels" :narrow="narrow" />
        <QuickOrderFormV2 v-else :labels="labels" />
      </div>
      <aside class="right">
        <OrderCard split scroll-hint />
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
.head__switch {
  padding-bottom: var(--space-8);
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
