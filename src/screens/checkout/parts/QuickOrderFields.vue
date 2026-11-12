<script setup lang="ts">
// Local block: the quick-order form (Figma 58:8107) — «Ім'я та прізвище», «Телефон», «Е-пошта», the two
// checkboxes and «Оформити замовлення» (CheckoutConfirm). Used by the accordion card and the «Швидке замовлення»
// folder tab. Name, phone, e-mail and checkboxes are shared with the full form.
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Input, CheckoutConfirm } from '../../../main';
import { checkout, isEmpty, validateField, submitQuick } from '../../../data/checkout';

const router = useRouter();
const f = checkout.form;
const e = checkout.errors;

/** One field for the name: «Андрій Шевченко» → first word is the first name, the rest is the last name. */
const fullName = computed({
  get: () => [f.firstName, f.lastName].filter(Boolean).join(' '),
  set: (value: string) => {
    const [first = '', ...rest] = value.trim().split(/\s+/);
    f.firstName = first;
    f.lastName = rest.join(' ');
  },
});

async function onSubmit() {
  if (await submitQuick(['firstName', 'phone', 'email'])) router.push('/checkout-success');
}
</script>

<template>
  <form class="qf" @submit.prevent="onSubmit">
    <div class="qf__fields">
      <Input v-model="fullName" size="l" label="Ім'я та прізвище" placeholder="Ім'я та прізвище" :error="!!e.firstName" :hint="e.firstName" @focusout="validateField('firstName')" />
      <Input v-model="f.phone" size="l" type="tel" label="Телефон" placeholder="+38 (0XX) XXX-XX-XX" :error="!!e.phone" :hint="e.phone" @focusout="validateField('phone')" />
      <Input v-model="f.email" size="l" type="email" label="Е-пошта" placeholder="poshta@gmail.com" :error="!!e.email" :hint="e.email" @focusout="validateField('email')" />
    </div>
    <CheckoutConfirm
      v-model:newsletter="f.newsletter"
      v-model:terms="f.terms"
      class="qf__confirm"
      :disabled="!f.terms || isEmpty"
      :loading="checkout.submitting"
      @submit="onSubmit"
    />
  </form>
</template>

<style scoped>
/* Figma 58:8107: fields one under another (gap 16), then the checkboxes and the button. */
.qf,
.qf__fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}
/* CheckoutConfirm inside a card: no own frame. */
.qf__confirm {
  padding: 0;
  border: 0;
  border-radius: 0;
  background: none;
}
</style>
