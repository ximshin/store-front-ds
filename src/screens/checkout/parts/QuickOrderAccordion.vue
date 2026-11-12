<script setup lang="ts">
// Local block: quick order as a collapsible card above the full form — no tabs
// (Figma variant 1991:61158, «step-checkout»: card r8, border, padding 16, title + lead + arrow-down).
// Expanded: phone, name (optional), «Надіслати заявку». Phone and name are shared with the full form.
import { useRouter } from 'vue-router';
import { Input, ButtonFront, Icon } from '../../../main';
import { checkout, isEmpty, validateField, submitQuick } from '../../../data/checkout';

const open = defineModel<boolean>('open', { default: false });
const router = useRouter();
const f = checkout.form;
const e = checkout.errors;

async function onSubmit() {
  if (await submitQuick()) router.push('/checkout-success');
}
</script>

<template>
  <section class="qa" :class="{ 'is-open': open }">
    <button type="button" class="qa__head" :aria-expanded="open" aria-controls="quick-order-body" @click="open = !open">
      <span class="qa__titles">
        <span class="qa__title ds-text-heading-h4">Швидке замовлення</span>
        <span class="qa__lead ds-text-paragraph-p1">Залиште контакти і менеджер зателефонує й оформить замовлення</span>
      </span>
      <Icon name="arrow-down-16" class="qa__arrow" />
    </button>
    <form v-if="open" id="quick-order-body" class="qa__body" @submit.prevent="onSubmit">
      <div class="qa__row">
        <Input v-model="f.phone" size="l" type="tel" label="Телефон" placeholder="+38 (0XX) XXX-XX-XX" :error="!!e.phone" :hint="e.phone" @focusout="validateField('phone')" />
        <Input v-model="f.firstName" size="l" label="Ім'я (необов'язково)" placeholder="Ім'я" />
      </div>
      <div class="qa__note ds-text-special-special-13-regular">
        <Icon name="clock-24" :size="16" />
        Менеджер зателефонує в робочий час магазину: Пн–Сб 9:00–20:00
      </div>
      <ButtonFront
        type="primary"
        size="l"
        native-type="submit"
        :label="checkout.submitting ? 'Надсилаємо…' : 'Надіслати заявку'"
        :disabled="checkout.submitting || isEmpty"
      />
    </form>
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
.qa__lead {
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-16);
  padding: 0 var(--space-16) var(--space-16);
}
.qa__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
  width: 100%;
}
.qa__note {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--text-secondary);
}
@media (max-width: 600px) {
  .qa__row {
    grid-template-columns: 1fr;
  }
}
</style>
