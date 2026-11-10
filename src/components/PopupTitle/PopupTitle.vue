<script setup lang="ts">
/**
 * PopupTitle — шапка попапа (Figma 6315:219): заголовок DS/Heading/H2, счётчик «• N» (text/secondary),
 * кнопка закрытия IconButton (cross-16) и описание DS/Paragraph/P1. Ширина — Fill по ширине попапа.
 *
 * Figma → props: Title → title, Show counter? → showCounter, Counter → counter, Show description? → showDescription,
 * Description → description, Show close? → showClose.
 */
import IconButton from '../IconButton/IconButton.vue';

withDefaults(
  defineProps<{
    title?: string;
    showCounter?: boolean;
    counter?: string;
    showDescription?: boolean;
    description?: string;
    showClose?: boolean;
    /** Доступное имя кнопки закрытия. */
    closeLabel?: string;
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma.
    title: 'Товари закінчилися',
    showCounter: false,
    counter: '9',
    showDescription: true,
    description:
      'Цих товарів більше немає в наявності, тому вони будуть вилучені із замовлення. Ви можете оформити замовлення без цих товарів або повернутись до покупок, щоб доповнити кошик.',
    showClose: true,
    closeLabel: 'Закрити',
  },
);

defineEmits<{ close: [] }>();
</script>

<template>
  <div class="ds-popup-title">
    <div class="ds-popup-title__row">
      <span class="ds-popup-title__title">{{ title }}</span>
      <span v-if="showCounter" class="ds-popup-title__counter"><span>•</span><span>{{ counter }}</span></span>
      <span class="ds-popup-title__spacer" />
      <IconButton v-if="showClose" icon="cross-16" :label="closeLabel" @click="$emit('close')" />
    </div>
    <p v-if="showDescription" class="ds-popup-title__description">{{ description }}</p>
  </div>
</template>

<style scoped>
.ds-popup-title {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-8);
  box-sizing: border-box;
  width: 100%;
  padding: var(--space-16) var(--space-20);
  background: var(--surface-default);
  color: var(--text-primary);
}
.ds-popup-title__row {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  overflow: clip;
}
.ds-popup-title__title,
.ds-popup-title__counter {
  font: var(--typo-heading-h2);
  white-space: nowrap;
}
.ds-popup-title__counter {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  color: var(--text-secondary);
}
.ds-popup-title__spacer {
  flex: 1 1 0;
  min-width: 1px;
}
.ds-popup-title__description {
  margin: 0;
  font: var(--typo-paragraph-p1);
}
</style>
