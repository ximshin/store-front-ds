<script setup lang="ts">
/**
 * LoginForm — содержимое попапа входа (Figma 6228:108): SocialLoginButton ×3 (Fill в ряду), разделитель «або»,
 * Input Size=L «E-пошта» и «Пароль», ButtonFront Primary L «Увійти» (radius/8, Special 16 Medium),
 * ссылка «Забули пароль?» (Special 14 Medium, text/primary). Ширина 432 → Fill.
 *
 * Figma → props: Divider label → dividerLabel, Forgot label → forgotLabel. Поля — v-model:email / v-model:password.
 */
import SocialLoginButton from '../SocialLoginButton/SocialLoginButton.vue';
import Input from '../Input/Input.vue';
import ButtonFront from '../ButtonFront/ButtonFront.vue';

withDefaults(
  defineProps<{
    dividerLabel?: string;
    forgotLabel?: string;
    submitLabel?: string;
    emailLabel?: string;
    passwordLabel?: string;
    email?: string;
    password?: string;
    emailPlaceholder?: string;
    passwordPlaceholder?: string;
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma.
    dividerLabel: 'або',
    forgotLabel: 'Забули пароль?',
    submitLabel: 'Увійти',
    emailLabel: 'E-пошта',
    passwordLabel: 'Пароль',
    email: '',
    password: '',
    emailPlaceholder: 'customer@poshta.com',
    passwordPlaceholder: 'Введіть пароль',
  },
);

const emit = defineEmits<{
  'update:email': [value: string];
  'update:password': [value: string];
  submit: [];
  forgot: [];
  social: [network: 'google' | 'facebook' | 'apple'];
}>();
</script>

<template>
  <form class="ds-login-form" @submit.prevent="emit('submit')">
    <div class="ds-login-form__social">
      <SocialLoginButton class="ds-login-form__social-btn" network="google" @click="emit('social', 'google')" />
      <SocialLoginButton class="ds-login-form__social-btn" network="facebook" @click="emit('social', 'facebook')" />
      <SocialLoginButton class="ds-login-form__social-btn" network="apple" @click="emit('social', 'apple')" />
    </div>
    <div class="ds-login-form__divider">
      <span class="ds-login-form__line" />
      <span class="ds-login-form__divider-label">{{ dividerLabel }}</span>
      <span class="ds-login-form__line" />
    </div>
    <Input
      size="l"
      type="email"
      name="email"
      :label="emailLabel"
      :placeholder="emailPlaceholder"
      :model-value="email"
      @update:model-value="emit('update:email', $event)"
    />
    <div class="ds-login-form__password">
      <Input
        size="l"
        type="password"
        name="password"
        :label="passwordLabel"
        :placeholder="passwordPlaceholder"
        :model-value="password"
        @update:model-value="emit('update:password', $event)"
      />
    </div>
    <ButtonFront class="ds-login-form__submit" type="primary" size="l" native-type="submit" :label="submitLabel" />
    <div class="ds-login-form__forgot">
      <button type="button" class="ds-login-form__forgot-link" @click="emit('forgot')">{{ forgotLabel }}</button>
    </div>
  </form>
</template>

<style scoped>
.ds-login-form {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-16);
  width: 100%;
}
.ds-login-form__social {
  display: flex;
  gap: var(--space-8);
}
.ds-login-form__social-btn {
  flex: 1 1 0;
  min-width: 0;
}
.ds-login-form__divider {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  padding: var(--space-4) 0;
}
.ds-login-form__line {
  flex: 1 1 0;
  min-width: 1px;
  height: var(--stroke-thin);
  background: var(--border-divider);
}
.ds-login-form__divider-label {
  color: var(--text-secondary);
  font: var(--typo-paragraph-p1);
  white-space: nowrap;
}
.ds-login-form__password {
  display: flex;
  flex-direction: column;
  padding-bottom: var(--space-8);
}

/* Макет HOROSHOP-8318: «Увійти» — на всю ширину, radius/8, Special 16 Medium. */
.ds-login-form__submit {
  display: flex;
  width: 100%;
}
.ds-login-form__submit :deep(.ds-button) {
  width: 100%;
  border-radius: var(--radius-8);
  font: var(--typo-special-special-16-medium);
}

.ds-login-form__forgot {
  display: flex;
  justify-content: center;
  padding: var(--space-4) 0 var(--space-8);
}
.ds-login-form__forgot-link {
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: var(--text-primary);
  font: var(--typo-special-special-14-medium);
  cursor: pointer;
}
.ds-login-form__forgot-link:focus-visible {
  outline: none;
}
</style>
