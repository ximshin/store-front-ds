<script setup lang="ts">
/**
 * Breadcrumbs — хлебные крошки каталога (Figma 6131:9897). Цвет text/secondary, разделитель breadcrumbs-arrow-16,
 * промежуток space/4, нижний отступ space/8. Размер текста: 11 и 12 — DS/Special/Special 12 Regular,
 * 13 — Special 13 Regular, 14 — DS/Form/Input text.
 *
 * Figma → props: Size=11/12/13/14 → size. Текст крошек — prop `items` (последняя — текущая страница).
 */
import Icon from '../Icon/Icon.vue';

export type BreadcrumbsSize = '11' | '12' | '13' | '14';

withDefaults(
  defineProps<{
    size?: BreadcrumbsSize;
    items?: string[];
  }>(),
  { size: '11', items: () => ['Головна', 'Одяг та взуття', 'Жіночій одяг'] },
);
</script>

<template>
  <nav class="ds-breadcrumbs" :class="`ds-breadcrumbs--${size}`" aria-label="Breadcrumbs">
    <template v-for="(item, i) in items" :key="i">
      <Icon v-if="i > 0" name="breadcrumbs-arrow-16" />
      <span v-if="i === items.length - 1" class="ds-breadcrumbs__item" aria-current="page">{{ item }}</span>
      <a v-else class="ds-breadcrumbs__item" href="#">{{ item }}</a>
    </template>
  </nav>
</template>

<style scoped>
.ds-breadcrumbs {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  padding-bottom: var(--space-8);
  color: var(--text-secondary);
  font: var(--typo-special-special-12-regular);
  white-space: nowrap;
}
.ds-breadcrumbs--13 {
  font: var(--typo-special-special-13-regular);
}
.ds-breadcrumbs--14 {
  font: var(--typo-form-input-text);
}
.ds-breadcrumbs__item {
  color: inherit;
  text-decoration: none;
}
</style>
