<script setup lang="ts">
// Local block of the checkout screen: the single form card (Figma «form» in Checkout Tabs — Desktop).
// Built only from base components + tokens. Static content as in the mockup — no handlers, no data layer.
import { Input, Select, SectionTitle, ButtonFront, Icon, CheckoutConfirm } from '../../../main';
</script>

<template>
  <div class="form">
    <section class="form__section form__section--padded">
      <SectionTitle size="m" title="Одержувач замовлення" />
      <div class="form__fields">
        <div class="form__row">
          <Input size="l" label="Прізвище" model-value="Шевченко" />
          <Input size="l" label="Ім'я" model-value="Олександр" />
        </div>
        <div class="form__row">
          <Input size="l" label="Телефон" model-value="+38 (066) 123-45-67" />
          <Input size="l" label="Е-пошта" model-value="poshta@gmail.com" />
        </div>
        <div class="form__country">
          <Input size="l" label="Країна" model-value="Україна" />
          <p class="form__hint ds-text-special-special-13-regular">
            <span class="form__hint-label">Наприклад:</span> Україна
          </p>
        </div>
        <Input size="l" label="Місто" model-value="Київ" />
      </div>
      <div class="form__comment">
        <ButtonFront type="flat" size="m" label="Додати коментар до замовлення" />
      </div>
    </section>

    <section class="form__section">
      <SectionTitle class="form__title" size="m" title="Доставка" :show-action="false" />
      <div class="form__items">
        <Select size="l" :show-label="false" placeholder="Новою поштою" />
        <div class="form__address">
          <Select class="form__grow" size="l" :show-label="false" placeholder="виберіть відділення" />
          <ButtonFront type="default" size="l" label="Обрати на мапі" show-left-icon>
            <template #left><Icon name="location-24" /></template>
          </ButtonFront>
        </div>
      </div>
    </section>

    <section class="form__section">
      <SectionTitle class="form__title" size="m" title="Оплата" :show-action="false" />
      <div class="form__items">
        <Select size="l" :show-label="false" placeholder="На карту Visa/MasterCard" />
      </div>
    </section>

    <CheckoutConfirm class="form__confirm" />
  </div>
</template>

<style scoped>
.form {
  overflow: hidden;
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
  align-items: center;
  gap: var(--space-8);
}
.form__grow {
  flex: 1 1 0;
  min-width: 0;
}
.form__confirm {
  border-radius: 0;
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
