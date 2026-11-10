<script setup lang="ts">
/**
 * CheckoutHeader — упрощённая шапка оформления заказа (Figma 6226:4, 1280, макет HOROSHOP-8318).
 * Logo, ссылка «Повернутись до покупок» (arrow-back-16 + DS/Special/Special 16 Regular), телефоны (phone-24 в 16 px),
 * необязательная ссылка «Передзвонити вам?» (DS/Special/Special 12 Regular). Отступы space/32, высота 80,
 * нижняя линия 3 px (stroke/heavy, border/input-active).
 *
 * Figma → props: Phones → phones, Back label → backLabel, Callback label → callbackLabel, Show callback? → showCallback.
 */
import Icon from '../Icon/Icon.vue';
import Logo from '../Logo/Logo.vue';

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
      <Logo />
      <a class="ds-checkout-header__back" href="#" @click.prevent="$emit('back')">
        <Icon name="arrow-back-16" />
        <span>{{ backLabel }}</span>
      </a>
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
  padding: 0 var(--space-32);
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
  gap: var(--space-32);
}
.ds-checkout-header__back {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  color: inherit;
  text-decoration: none;
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
