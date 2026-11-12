<script setup lang="ts">
// Screen «Замовлення оформлено» — no Figma layout, composed from the base (directive_wire_vue, PRD scenario step 8).
// Reads the last order / quick request from the mock store; without one — back to checkout.
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { CheckoutHeader, ButtonFront, Icon, SectionTitle } from '../../main';
import { checkout, resetCheckout } from '../../data/checkout';

const router = useRouter();
const order = checkout.lastOrder;

onMounted(() => {
  if (!order) router.replace('/checkout');
});
function again() {
  resetCheckout();
  router.push('/checkout');
}
</script>

<template>
  <div class="screen">
    <CheckoutHeader show-callback phones="050 029-37-94, 063 500-89-85, 067 189-29-84" @back="router.push('/')" />
    <main v-if="order" class="main">
      <div class="card">
        <div class="badge"><Icon name="tick-16" :size="40" /></div>
        <h1 class="ds-text-display-s title">
          {{ order.kind === 'quick' ? `Заявку №${order.number} прийнято` : `Замовлення №${order.number} оформлено` }}
        </h1>
        <p class="ds-text-paragraph-lead lead">
          <template v-if="order.kind === 'quick'">Менеджер зателефонує на {{ order.phone }} і оформить замовлення.</template>
          <template v-else>
            Дякуємо! Ми зателефонуємо на {{ order.phone }} для підтвердження<span v-if="order.email">, деталі — на {{ order.email }}</span>.
          </template>
        </p>

        <dl v-if="order.kind === 'order'" class="facts">
          <div class="fact"><dt>Одержувач</dt><dd>{{ order.recipient }}</dd></div>
          <div class="fact"><dt>Доставка</dt><dd>{{ order.delivery }}</dd></div>
          <div class="fact"><dt>Оплата</dt><dd>{{ order.payment }}</dd></div>
        </dl>

        <section class="items">
          <SectionTitle size="s" :title="`Товари (${order.lines.length})`" :show-action="false" />
          <div v-for="(line, i) in order.lines" :key="i" class="item ds-text-paragraph-p1">
            <span class="item__title">{{ line.title }} × {{ line.qty }}</span>
            <span class="item__sum ds-text-price-s">{{ line.sum }}</span>
          </div>
          <div class="item item--total">
            <span class="ds-text-paragraph-p1">Загальна сума</span>
            <span class="ds-text-price-m">{{ order.total }}</span>
          </div>
        </section>

        <div class="actions">
          <ButtonFront type="default" size="l" label="Повернутись до покупок" @click="router.push('/')" />
          <ButtonFront type="primary" size="l" label="Оформити ще одне" @click="again" />
        </div>
      </div>
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
  justify-content: center;
  padding: var(--space-48) var(--space-16);
}
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-16);
  width: 100%;
  max-width: 600px;
  padding: var(--space-32) var(--space-24);
  border: var(--stroke-thin) solid var(--border-card);
  border-radius: var(--radius-8);
  background: var(--surface-default);
  text-align: center;
}
.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  border-radius: var(--radius-full);
  background: var(--bg-success-light);
  color: var(--icon-success);
}
.title,
.lead {
  margin: 0;
}
.lead {
  color: var(--text-secondary);
}
.facts {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  width: 100%;
  margin: var(--space-8) 0 0;
  text-align: left;
}
.fact {
  display: flex;
  gap: var(--space-16);
  font: var(--typo-paragraph-p1);
}
.fact dt {
  flex: 0 0 120px;
  color: var(--text-secondary);
}
.fact dd {
  margin: 0;
}
.items {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  width: 100%;
  padding-top: var(--space-16);
  border-top: var(--stroke-thin) solid var(--border-divider);
  text-align: left;
}
.item {
  display: flex;
  justify-content: space-between;
  gap: var(--space-16);
}
.item__title {
  min-width: 0;
}
.item__sum {
  flex: none;
}
.item--total {
  align-items: baseline;
  padding-top: var(--space-8);
  border-top: var(--stroke-thin) solid var(--border-divider);
}
/* Same narrow-width header rule as the checkout screen (CheckoutHeader is desktop-only in the DS). */
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
.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-8);
  padding-top: var(--space-8);
}
</style>
