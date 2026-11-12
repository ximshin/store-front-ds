<script setup lang="ts">
/**
 * CheckoutHeader — шапка оформления заказа, только для чекаута (Figma 6226:4, 1280, макет HOROSHOP-8318).
 * Текстовый логотип «LOGOTYPE» (Inter Black 14, верхний регистр, блок 200; слот `logo` — логотип магазина),
 * кнопка «Повернутись до покупок» (button-front Flat M 32, иконка слева arrow-back-16), промежуток space/24; телефоны
 * (phone-24 в 16 px), необязательная ссылка «Передзвонити вам?» (DS/Special/Special 12 Regular). Отступы space/32,
 * высота 80, нижняя линия 3 px (stroke/heavy, border/input-active). Содержимое не шире 1440 (по центру) — глобальное правило.
 *
 * Figma → props: Phones → phones, Callback label → callbackLabel, Show callback? → showCallback; backLabel — подпись кнопки (в Figma — переопределение на экземпляре).
 */
import Icon from '../Icon/Icon.vue';
import ButtonFront from '../ButtonFront/ButtonFront.vue';

withDefaults(
  defineProps<{
    phones?: string;
    backLabel?: string;
    callbackLabel?: string;
    showCallback?: boolean;
  }>(),
  {
    phones: '050 029-37-94, 063 500-89-85',
    backLabel: 'Повернутись до покупок',
    callbackLabel: 'Передзвонити вам?',
    showCallback: false,
  },
);

defineEmits<{ back: []; callback: [] }>();
</script>

<template>
  <header class="ds-checkout-header">
    <div class="ds-checkout-header__left">
      <span class="ds-checkout-header__logo"><slot name="logo">Logotype</slot></span>
      <ButtonFront class="ds-checkout-header__back" type="flat" size="m" show-left-icon :label="backLabel" @click="$emit('back')">
        <template #left><Icon name="arrow-back-16" /></template>
      </ButtonFront>
    </div>
    <div class="ds-checkout-header__contacts">
      <Icon name="phone-24" :size="16" class="ds-checkout-header__phone-icon" />
      <span>{{ phones }}</span>
      <a v-if="showCallback" class="ds-checkout-header__callback" href="#" @click.prevent="$emit('callback')">
        {{ callbackLabel }}
      </a>
    </div>
  </header>
</template>

<style scoped>
.ds-checkout-header {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  /* Global rule: header content not wider than 1440 (centred); the bar and the bottom line stay full width. */
  padding: 0 max(var(--space-32), calc((100% - 1440px) / 2 + var(--space-32)));
  border-bottom: var(--stroke-heavy) solid var(--border-input-active);
  background: var(--surface-default);
  color: var(--text-primary);
  font: var(--typo-special-special-16-regular);
}
.ds-checkout-header__left,
.ds-checkout-header__contacts {
  display: flex;
  align-items: center;
}
.ds-checkout-header__left {
  gap: var(--space-24);
}
/* Text wordmark, as in the checkout mockup (Inter Black 14, upper case, 200 wide). */
.ds-checkout-header__logo {
  display: inline-flex;
  align-items: center;
  flex: none;
  width: 200px;
  font-family: var(--font-sans);
  font-size: var(--font-size-14);
  font-weight: 900;
  line-height: 20px;
  text-transform: uppercase;
  color: var(--text-primary);
}
.ds-checkout-header__back {
  white-space: nowrap;
}
.ds-checkout-header__contacts {
  gap: var(--space-8);
  white-space: nowrap;
}
.ds-checkout-header__phone-icon {
  color: var(--icon-strong);
}
.ds-checkout-header__callback {
  color: inherit;
  font: var(--typo-special-special-12-regular);
  text-decoration: none;
}
</style>
