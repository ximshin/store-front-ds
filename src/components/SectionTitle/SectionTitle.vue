<script setup lang="ts">
/**
 * SectionTitle — заголовок блока формы / секции (Figma 6346:516): «Одержувач», «Доставка», «Оплата», «Ваше замовлення».
 * Size: S — DS/Heading/Group Title 14/20, M — DS/Heading/H4 16/24, L — DS/Heading/Page Title 18/24.
 * Справа слот `action` (по умолчанию ButtonFront Flat M с user-24 «Увійти»). Нижний отступ space/8, ширина Fill.
 *
 * Figma → props: Size → size, Title → title, Show action → showAction, слот action → slot `action`.
 */
import ButtonFront from '../ButtonFront/ButtonFront.vue';
import Icon from '../Icon/Icon.vue';

export type SectionTitleSize = 's' | 'm' | 'l';

withDefaults(
  defineProps<{
    size?: SectionTitleSize;
    title?: string;
    showAction?: boolean;
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma.
    size: 's',
    title: 'Одержувач замовлення',
    showAction: true,
  },
);
</script>

<template>
  <div class="ds-section-title" :class="[`ds-section-title--${size}`, { 'has-action': showAction }]">
    <h3 class="ds-section-title__text">{{ title }}</h3>
    <div v-if="showAction" class="ds-section-title__action">
      <slot name="action">
        <ButtonFront type="flat" size="m" label="Увійти" show-left-icon>
          <template #left><Icon name="user-24" /></template>
        </ButtonFront>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.ds-section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  box-sizing: border-box;
  width: 100%;
  padding-bottom: var(--space-8);
}
/* Высота 40 — под кнопку действия; без неё заголовок по высоте строки (как в Figma). */
.ds-section-title.has-action {
  min-height: var(--space-40);
}
.ds-section-title__text {
  min-width: 0;
  margin: 0;
  color: var(--text-primary);
  overflow-wrap: anywhere;
}
.ds-section-title--s .ds-section-title__text {
  font: var(--typo-heading-group-title);
}
.ds-section-title--m .ds-section-title__text {
  font: var(--typo-heading-h4);
}
.ds-section-title--l .ds-section-title__text {
  font: var(--typo-heading-page-title);
}
.ds-section-title__action {
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--space-8);
  overflow: clip;
}
</style>
