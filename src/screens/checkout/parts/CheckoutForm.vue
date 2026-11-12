<script setup lang="ts">
// Local block of the checkout screen: the form card (Figma «form» in Checkout Tabs — Desktop).
// Wired to the mock store (src/data/checkout.ts): fields, validation on blur, delivery / payment lists, submit.
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  Input, Select, SectionTitle, ButtonFront, Icon, CheckoutConfirm, DropdownListItem,
} from '../../../main';
import {
  checkout, deliveryOptions, paymentOptions, deliveryOption, paymentOption, isEmpty,
  setDelivery, setPayment, validateField, clearError, submitOrder, logout,
} from '../../../data/checkout';
import { showToast } from '../../../data/toast';

// showLogin=false: «Увійти» lives elsewhere (the folder-tabs variant has its own «Увійти» tab).
const props = withDefaults(defineProps<{ showLogin?: boolean }>(), { showLogin: true });
const router = useRouter();
const f = checkout.form;
const e = checkout.errors;
const open = ref({ delivery: false, branch: false, payment: false });

function pickDelivery(id: typeof f.delivery) {
  setDelivery(id);
  open.value.delivery = false;
}
function pickBranch(b: string) {
  f.branch = b;
  open.value.branch = false;
  clearError('branch');
}
function pickPayment(id: typeof f.payment) {
  setPayment(id);
  open.value.payment = false;
}
async function onSubmit() {
  if (await submitOrder()) router.push('/checkout-success');
}
function showMap() {
  showToast('info', 'Карта відділень з’явиться в наступній версії');
}
</script>

<template>
  <div class="form">
    <section class="form__section form__section--padded">
      <SectionTitle size="m" title="Одержувач замовлення" :show-action="checkout.loggedIn || props.showLogin">
        <template #action>
          <ButtonFront v-if="!checkout.loggedIn && props.showLogin" type="flat" size="m" label="Увійти" show-left-icon @click="router.push('/checkout-login')">
            <template #left><Icon name="user-24" /></template>
          </ButtonFront>
          <ButtonFront v-else-if="checkout.loggedIn" type="flat" size="m" label="Вийти" show-left-icon @click="logout">
            <template #left><Icon name="logout-24" /></template>
          </ButtonFront>
        </template>
      </SectionTitle>
      <div class="form__fields">
        <div class="form__row">
          <Input v-model="f.lastName" size="l" label="Прізвище" placeholder="Прізвище" :error="!!e.lastName" :hint="e.lastName" @focusout="validateField('lastName')" />
          <Input v-model="f.firstName" size="l" label="Ім'я" placeholder="Ім'я" :error="!!e.firstName" :hint="e.firstName" @focusout="validateField('firstName')" />
        </div>
        <div class="form__row">
          <Input v-model="f.phone" size="l" type="tel" label="Телефон" placeholder="+38 (0XX) XXX-XX-XX" :error="!!e.phone" :hint="e.phone" @focusout="validateField('phone')" />
          <Input v-model="f.email" size="l" type="email" label="Е-пошта" placeholder="name@mail.com" :error="!!e.email" :hint="e.email" @focusout="validateField('email')" />
        </div>
        <div class="form__country">
          <Input v-model="f.country" size="l" label="Країна" placeholder="Країна" />
          <p class="form__hint ds-text-special-special-13-regular">
            <span class="form__hint-label">Наприклад:</span> Україна
          </p>
        </div>
        <Input v-model="f.city" size="l" label="Місто" placeholder="Місто" :error="!!e.city" :hint="e.city" @focusout="validateField('city')" />
        <Input
          v-if="f.showComment"
          v-model="f.comment"
          size="l"
          label="Коментар до замовлення"
          placeholder="Наприклад, зателефонуйте перед доставкою"
          clearable
          :error="!!e.comment"
          :hint="e.comment"
          @focusout="validateField('comment')"
        />
      </div>
      <div class="form__comment">
        <ButtonFront
          type="flat"
          size="m"
          :label="f.showComment ? 'Прибрати коментар' : 'Додати коментар до замовлення'"
          @click="f.showComment = !f.showComment"
        />
      </div>
    </section>

    <section class="form__section">
      <SectionTitle class="form__title" size="m" title="Доставка" :show-action="false" />
      <div class="form__items">
        <Select v-model:show-list="open.delivery" size="l" :show-label="false" :placeholder="deliveryOption.label">
          <template #list>
            <DropdownListItem v-for="d in deliveryOptions" :key="d.id" :label="d.label" :checked="d.id === f.delivery" @click="pickDelivery(d.id)" />
          </template>
        </Select>
        <div v-if="deliveryOption.branches" class="form__address">
          <div class="form__grow">
            <Select v-model:show-list="open.branch" size="l" :show-label="false" :placeholder="f.branch || 'виберіть відділення'">
              <template #list>
                <DropdownListItem v-for="b in deliveryOption.branches" :key="b" :label="b" @click="pickBranch(b)" />
              </template>
            </Select>
            <p v-if="e.branch" class="form__error ds-text-special-special-12-regular">{{ e.branch }}</p>
          </div>
          <ButtonFront type="default" size="l" label="Обрати на мапі" show-left-icon @click="showMap">
            <template #left><Icon name="location-24" /></template>
          </ButtonFront>
        </div>
        <Input
          v-else-if="f.delivery === 'courier'"
          v-model="f.courierAddress"
          size="l"
          label="Адреса доставки"
          placeholder="Вулиця, будинок, квартира"
          :error="!!e.courierAddress"
          :hint="e.courierAddress"
          @focusout="validateField('courierAddress')"
        />
        <p v-else class="form__note ds-text-paragraph-p1">Магазин: Київ, вул. Велика Васильківська, 72 · Пн–Сб 10:00–20:00</p>
      </div>
    </section>

    <section class="form__section">
      <SectionTitle class="form__title" size="m" title="Оплата" :show-action="false" />
      <div class="form__items">
        <Select v-model:show-list="open.payment" size="l" :show-label="false" :placeholder="paymentOption.label">
          <template #list>
            <DropdownListItem v-for="p in paymentOptions" :key="p.id" :label="p.label" :checked="p.id === f.payment" @click="pickPayment(p.id)" />
          </template>
        </Select>
      </div>
    </section>

    <CheckoutConfirm
      v-model:newsletter="f.newsletter"
      v-model:terms="f.terms"
      class="form__confirm"
      :disabled="!f.terms || isEmpty"
      :loading="checkout.submitting"
      @submit="onSubmit"
    />
  </div>
</template>

<style scoped>
.form {
  border: var(--stroke-thin) solid var(--border-card);
  border-radius: var(--radius-8);
  background: var(--surface-default);
}
.form__section {
  display: flex;
  flex-direction: column;
  padding: var(--space-16) 0;
  border-bottom: var(--stroke-thin) solid var(--border-divider);
}
.form__section--padded {
  padding: var(--space-16);
}
.form__title {
  padding: 0 var(--space-16);
}
/* Figma: «Доставка» / «Оплата» — instance height 40 (as with the action button) though the action is hidden. */
.form__title:deep(.ds-section-title),
.form__title.ds-section-title {
  min-height: var(--space-40);
}
.form__fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding-bottom: var(--space-16);
}
.form__row {
  display: flex;
  gap: var(--space-8);
}
.form__row > * {
  flex: 1 1 0;
  min-width: 0;
}
.form__country {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.form__hint {
  margin: 0;
  color: var(--text-primary);
}
.form__hint-label {
  color: var(--text-secondary);
}
.form__comment :deep(.ds-button) {
  padding-left: 0;
  padding-right: 0;
  font: var(--typo-special-special-14-medium);
}
.form__items {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding: 0 var(--space-16);
}
.form__address {
  display: flex;
  align-items: flex-start;
  gap: var(--space-8);
}
.form__grow {
  flex: 1 1 0;
  min-width: 0;
}
.form__error {
  margin: var(--space-4) 0 0;
  color: var(--text-danger);
}
.form__note {
  margin: 0;
  color: var(--text-secondary);
}
.form__confirm {
  border-radius: 0 0 var(--radius-8) var(--radius-8);
  border: 0;
}
@media (max-width: 600px) {
  .form__row,
  .form__address {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
