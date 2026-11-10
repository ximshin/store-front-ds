<script setup lang="ts">
/**
 * SocialLoginButton — кнопка входа через соцсеть (Figma 6228:106).
 * Логотип 16 (фирменные цвета логотипа — контент; Apple — icon/strong) + DS/Special/Special 16 Medium.
 * Высота 40, обводка border/input снаружи (в layout не входит), радиус radius/8, ширина 136 (Fill в ряду).
 *
 * Figma → props: Network (Google / Facebook / Apple ID) → network ('google' | 'facebook' | 'apple').
 */
import { computed } from 'vue';
import Icon from '../Icon/Icon.vue';
import googleLogo from '../../assets/icons/google-24.svg?url';
import facebookLogo from '../../assets/icons/facebook-24.svg?url';

export type SocialLoginNetwork = 'google' | 'facebook' | 'apple';

const props = withDefaults(
  defineProps<{
    network?: SocialLoginNetwork;
    /** Подпись; по умолчанию — название сети (Google / Facebook / Apple ID). */
    label?: string;
    disabled?: boolean;
    nativeType?: 'button' | 'submit' | 'reset';
  }>(),
  {
    network: 'google',
    label: undefined,
    disabled: false,
    nativeType: 'button',
  },
);

defineEmits<{ click: [event: MouseEvent] }>();

const NAMES: Record<SocialLoginNetwork, string> = { google: 'Google', facebook: 'Facebook', apple: 'Apple ID' };
const text = computed(() => props.label ?? NAMES[props.network]);
const logo = computed(() => (props.network === 'google' ? googleLogo : props.network === 'facebook' ? facebookLogo : null));
</script>

<template>
  <button class="ds-social-login" :type="nativeType" :disabled="disabled" @click="$emit('click', $event)">
    <img v-if="logo" class="ds-social-login__logo" :src="logo" alt="" />
    <span v-else class="ds-social-login__logo ds-social-login__logo--mono"><Icon name="apple-24" :size="16" /></span>
    <span class="ds-social-login__label"><slot>{{ text }}</slot></span>
  </button>
</template>

<style scoped>
.ds-social-login {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  box-sizing: border-box;
  min-width: 136px;
  height: var(--space-40);
  margin: 0;
  padding: var(--space-8) var(--space-12);
  /* Обводка снаружи layout: рисуется тенью, размеры не меняет. */
  border: 0;
  box-shadow: 0 0 0 var(--stroke-thin) var(--border-input);
  border-radius: var(--radius-8);
  background: var(--surface-default);
  color: var(--text-primary);
  font: var(--typo-special-special-16-medium);
  white-space: nowrap;
  cursor: pointer;
  transition: box-shadow 0.15s ease;
}
.ds-social-login:hover:not(:disabled) {
  box-shadow: 0 0 0 var(--stroke-thin) var(--border-hover-card);
}
.ds-social-login:disabled {
  cursor: default;
  opacity: 0.4;
}
.ds-social-login:focus-visible {
  outline: none;
}

.ds-social-login__logo {
  display: inline-flex;
  flex: none;
  width: var(--space-16);
  height: var(--space-16);
}
.ds-social-login__logo--mono {
  color: var(--icon-strong);
}
</style>
