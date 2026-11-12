<script setup lang="ts">
/**
 * CheckoutConfirm — подтверждение заказа внизу оформления (Figma 6220:182): два Checkbox M (рассылка, согласие
 * с условиями) + ButtonFront Primary L. Карточка border/card, radius/12, отступы space/16, gap space/24 (между чекбоксами — 12).
 *
 * Figma → props: тексты чекбоксов — newsletterLabel / termsLabel, отметки — v-model `newsletter` / `terms`
 * (в Figma второй отмечен), кнопка — buttonLabel (клик — событие `submit`).
 */
import Checkbox from '../Checkbox/Checkbox.vue';
import ButtonFront from '../ButtonFront/ButtonFront.vue';

withDefaults(
  defineProps<{
    newsletter?: boolean;
    terms?: boolean;
    newsletterLabel?: string;
    termsLabel?: string;
    buttonLabel?: string;
    /** Кнопка неактивна (например, без согласия с условиями или с пустой корзиной). */
    disabled?: boolean;
    /** Идёт отправка: кнопка неактивна, подпись — loadingLabel. */
    loading?: boolean;
    loadingLabel?: string;
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma.
    newsletter: false,
    terms: true,
    newsletterLabel: 'Хочу отримувати новини та спеціальні пропозиції від магазину',
    termsLabel: 'Підтверджуючи замовлення, я приймаю умови угоди користувача',
    buttonLabel: 'Оформити замовлення',
    disabled: false,
    loading: false,
    loadingLabel: 'Оформлюємо…',
  },
);

defineEmits<{
  'update:newsletter': [value: boolean];
  'update:terms': [value: boolean];
  submit: [event: MouseEvent];
}>();
</script>

<template>
  <div class="ds-checkout-confirm">
    <div class="ds-checkout-confirm__options">
      <Checkbox
        size="m"
        :show-icon="false"
        :show-counter="false"
        :checked="newsletter"
        :label="newsletterLabel"
        @update:checked="$emit('update:newsletter', $event)"
      />
      <Checkbox
        size="m"
        :show-icon="false"
        :show-counter="false"
        :checked="terms"
        :label="termsLabel"
        @update:checked="$emit('update:terms', $event)"
      />
    </div>
    <ButtonFront
      type="primary"
      size="l"
      :label="loading ? loadingLabel : buttonLabel"
      :disabled="disabled || loading"
      :aria-busy="loading || undefined"
      @click="$emit('submit', $event)"
    />
  </div>
</template>

<style scoped>
.ds-checkout-confirm {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-24);
  box-sizing: border-box;
  width: 100%;
  padding: var(--space-16);
  border: var(--stroke-thin) solid var(--border-card);
  border-radius: var(--radius-12);
  background: var(--surface-default);
}
.ds-checkout-confirm__options {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  width: 100%;
}
</style>
