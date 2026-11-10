<script setup lang="ts">
/**
 * FreeShippingProgress — прогресс до бесплатной доставки (Figma 6226:141): info-16 (icon/primary) + текст
 * (DS/Special/Special 13 Regular) + полоса 4 px: трек surface/hover, заполнение surface/action/primary.
 *
 * Figma → props: Text → text (или слот). Ширина заполнения (в Figma правится на инстансе) — `progress`, 0–100 %
 * (в макете 280 из 400 = 70).
 */
import { computed } from 'vue';
import Icon from '../Icon/Icon.vue';

const props = withDefaults(defineProps<{ text?: string; progress?: number }>(), {
  text: 'До безкоштовної доставки залишилось 459 грн',
  progress: 70,
});

const percent = computed(() => Math.min(100, Math.max(0, props.progress)));
</script>

<template>
  <div class="ds-free-shipping">
    <div class="ds-free-shipping__label">
      <span class="ds-free-shipping__icon"><Icon name="info-16" /></span>
      <span class="ds-free-shipping__text"><slot>{{ text }}</slot></span>
    </div>
    <div
      class="ds-free-shipping__track"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="percent"
    >
      <div class="ds-free-shipping__progress" :style="{ width: `${percent}%` }" />
    </div>
  </div>
</template>

<style scoped>
.ds-free-shipping {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  width: 100%;
}
.ds-free-shipping__label {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}
.ds-free-shipping__icon {
  display: inline-flex;
  color: var(--icon-primary);
}
.ds-free-shipping__text {
  font: var(--typo-special-special-13-regular);
  color: var(--text-primary);
}
.ds-free-shipping__track {
  height: var(--space-4);
  overflow: clip;
  border-radius: var(--radius-full);
  background: var(--surface-hover);
}
.ds-free-shipping__progress {
  height: 100%;
  border-radius: var(--radius-full);
  background: var(--surface-action-primary);
  transition: width 0.15s ease;
}
</style>
