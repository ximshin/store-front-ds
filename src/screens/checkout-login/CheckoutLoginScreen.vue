<script setup lang="ts">
// Screen «Оформлення · вхід» — Figma «Checkout Tabs — Login Modal» (6357:15636), mockup HOROSHOP-8318.
// The checkout screen under surface/overlay + Modal S with LoginForm (top 100, centred). Static — no handlers.
import { Modal, LoginForm } from '../../main';
import CheckoutScreen from '../checkout/CheckoutScreen.vue';
</script>

<template>
  <div class="screen">
    <CheckoutScreen aria-hidden="true" inert />
    <div class="overlay" />
    <div class="dialog">
      <Modal size="s" title="Вхід" :show-footer="false">
        <LoginForm email="customer@poshta.com" password="password1234" />
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
}
</style>
