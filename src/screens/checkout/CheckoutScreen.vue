<script setup lang="ts">
// Screen «Оформлення замовлення» — Figma «Checkout Tabs — Desktop» (6355:10633), mockup HOROSHOP-8318.
// Static composition from the base (directive_screens_vue): no handlers, no data layer — see directive_wire.
import { CheckoutHeader, Tabs } from '../../main';
import CheckoutForm from './parts/CheckoutForm.vue';
import OrderCard from './parts/OrderCard.vue';

const tabs = [
  { label: 'Звичайне', value: 'full' },
  { label: 'Швидке', value: 'quick' },
];
</script>

<template>
  <div class="screen">
    <CheckoutHeader show-callback phones="050 029-37-94, 063 500-89-85, 067 189-29-84" />
    <main class="main">
      <div class="left">
        <div class="left__inner">
          <div class="head">
            <h1 class="ds-text-display-m head__title">Оформлення замовлення</h1>
            <Tabs :items="tabs" model-value="full" :divider="false" gap="var(--space-24)" padding-x="var(--space-16)" />
          </div>
          <CheckoutForm />
        </div>
      </div>
      <aside class="right">
        <OrderCard />
      </aside>
    </main>
  </div>
</template>

<style scoped>
.screen {
  min-height: 100vh;
  background: var(--surface-subtle);
  color: var(--text-primary);
}
.main {
  display: flex;
  align-items: flex-start;
  gap: var(--space-16);
  max-width: 1280px;
  margin: 0 auto;
}
/* Figma: left column Fill, its 600-wide content centred; right column 500 (padding 32 / 16 / 16 / 0). */
.left {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  justify-content: center;
  padding: var(--space-16) var(--space-16) var(--space-40);
}
.left__inner {
  width: 100%;
  max-width: 600px;
}
.head {
  padding-top: var(--space-8);
}
.head__title {
  margin: 0;
  padding-bottom: var(--space-16);
}
.right {
  flex: 0 0 500px;
  box-sizing: border-box;
  padding: var(--space-32) var(--space-16) var(--space-16) 0;
}
/* CheckoutHeader exists in the DS only for desktop (1280): on narrow screens the screen hides
   the phones (< 900) and the back label (< 600, the arrow stays). No base change. */
@media (max-width: 900px) {
  .screen :deep(.ds-checkout-header__contacts) {
    display: none;
  }
}
@media (max-width: 600px) {
  .screen :deep(.ds-checkout-header) {
    padding: 0 var(--space-16);
  }
  .screen :deep(.ds-checkout-header__back span) {
    display: none;
  }
}
/* Narrow widths: columns stack, the order card goes under the form. */
@media (max-width: 1100px) {
  .main {
    flex-direction: column;
    align-items: stretch;
  }
  .right {
    flex: none;
    width: 100%;
    max-width: calc(600px + 2 * var(--space-16));
    margin: 0 auto;
    padding: 0 var(--space-16) var(--space-40);
  }
}
</style>
