<script setup lang="ts">
// Screen «Оформлення · вхід» — Figma «Checkout Tabs — Login Modal» (6357:15636), mockup HOROSHOP-8318.
// The checkout screen under surface/overlay + Modal S with LoginForm. Wired (directive_wire_vue):
// close (✕ / click on the overlay / Esc) → back to checkout; login → recipient filled from the mock account.
import { onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { Modal, LoginForm } from '../../main';
import CheckoutScreen from '../checkout/CheckoutScreen.vue';
import { checkout, login, loginSocial, forgotPassword } from '../../data/checkout';

const router = useRouter();
const l = checkout.login;

function close() {
  l.error = '';
  router.push('/checkout');
}
async function onLogin() {
  if (await login()) router.push('/checkout');
}
async function onSocial(network: string) {
  if (await loginSocial(network)) router.push('/checkout');
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close();
}
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
  <div class="screen">
    <CheckoutScreen aria-hidden="true" inert />
    <div class="overlay" @click="close" />
    <div class="dialog">
      <Modal size="s" title="Вхід" :show-footer="false" @close="close" @update:open="close">
        <LoginForm
          v-model:email="l.email"
          v-model:password="l.password"
          :error="l.error"
          :loading="l.loading"
          :submit-label="l.loading ? 'Входимо…' : 'Увійти'"
          @submit="onLogin"
          @social="onSocial"
          @forgot="forgotPassword"
        />
      </Modal>
    </div>
  </div>
</template>

<style scoped>
.screen {
  position: relative;
  min-height: 100vh;
}
.overlay {
  position: absolute;
  inset: 0;
  background: var(--surface-overlay);
  cursor: pointer;
}
/* Figma: modal 480 wide, 100 from the top, horizontally centred. */
.dialog {
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 0 var(--space-16);
  pointer-events: none;
}
.dialog > * {
  pointer-events: auto;
}
</style>
