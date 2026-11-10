<script setup lang="ts">
/**
 * Logo — логотип магазина (Figma 6208:4). В ДС — плейсхолдер «logotype» с рамкой-пунктиром (border/divider);
 * в проекте заменяется картинкой через слот по умолчанию.
 *
 * Figma → props: размер 180×48 / 113×32 → size ('desktop' | 'mobile'). onDark — вариант для тёмного фона (подвал:
 * text/primary-white, рамка border/on-media). Слот по умолчанию — картинка логотипа вместо плейсхолдера.
 */
withDefaults(
  defineProps<{
    size?: 'desktop' | 'mobile';
    /** Подпись плейсхолдера. */
    label?: string;
    /** Для тёмного фона (подвал). */
    onDark?: boolean;
  }>(),
  { size: 'desktop', label: 'logotype', onDark: false },
);
</script>

<template>
  <div class="ds-logo" :class="[`ds-logo--${size}`, { 'is-dark': onDark }]">
    <slot><span class="ds-logo__text">{{ label }}</span></slot>
  </div>
</template>

<style scoped>
.ds-logo {
  --_border: var(--border-divider);
  --_fg: var(--text-primary);

  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: var(--stroke-thin) dashed var(--_border);
  border-radius: var(--radius-8);
  color: var(--_fg);
  overflow: hidden;
}
.ds-logo.is-dark {
  --_border: var(--border-on-media);
  --_fg: var(--text-primary-white);
}
.ds-logo--desktop {
  width: 180px;
  height: var(--space-48);
}
.ds-logo--mobile {
  width: 113px;
  height: var(--space-32);
}
.ds-logo__text {
  font: var(--typo-heading-h1);
  white-space: nowrap;
}
/* Мобайл: текст плейсхолдера 16 px (масштаб 2/3 от десктопа). */
.ds-logo--mobile .ds-logo__text {
  font-size: var(--font-size-16);
  line-height: var(--font-line-height-24);
}
</style>
