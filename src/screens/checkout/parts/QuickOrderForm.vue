<script setup lang="ts">
// Local block: quick order form for the «Швидке» tab (no Figma layout — composed from the base, PRD F10 / F51).
// Phone and name are shared with the full form (same store fields).
import { useRouter } from 'vue-router';
import { Input, SectionTitle, ButtonFront, Icon } from '../../../main';
import { checkout, isEmpty, validateField, submitQuick } from '../../../data/checkout';

const router = useRouter();
const f = checkout.form;
const e = checkout.errors;

async function onSubmit() {
  if (await submitQuick()) router.push('/checkout-success');
}
</script>

<template>
  <form class="quick" @submit.prevent="onSubmit">
    <SectionTitle size="m" title="Одержувач замовлення" :show-action="false" />
    <p class="quick__lead ds-text-paragraph-p1">
      Залиште телефон — менеджер зателефонує, уточнить доставку й оплату та оформить замовлення за вас.
    </p>
    <Input v-model="f.phone" size="l" type="tel" label="Телефон" placeholder="+38 (0XX) XXX-XX-XX" :error="!!e.phone" :hint="e.phone" @focusout="validateField('phone')" />
    <Input v-model="f.firstName" size="l" label="Ім'я (необов'язково)" placeholder="Ім'я" />
    <div class="quick__note ds-text-special-special-13-regular">
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
</template>

<style scoped>
.quick {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding: var(--space-16);
  border: var(--stroke-thin) solid var(--border-card);
  border-radius: var(--radius-8);
  background: var(--surface-default);
}
/* Title row 40 high, as on the full form (its «Увійти» action is 40) — the title does not jump when switching tabs. */
.quick :deep(.ds-section-title) {
  box-sizing: border-box;
  min-height: var(--space-40);
}
.quick__lead {
  margin: 0;
  color: var(--text-secondary);
}
.quick__note {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--text-secondary);
}
.quick :deep(.ds-button-wrap) {
  align-self: flex-start;
}
</style>
