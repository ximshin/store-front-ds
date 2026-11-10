<script setup lang="ts">
/**
 * EmptyState — пустое состояние (Figma 6256:243): иконка 40 (icon/primary) в круге 96 surface/hover,
 * заголовок DS/Heading/H2, текст DS/Paragraph/P1 (text/secondary), button-front Primary L.
 * Ширина 560 → Fill на мобайле.
 *
 * Figma → props: Type → type (cart | search | wishlist), Show action? → showAction.
 * Тексты по типу — по умолчанию как в Figma; переопределяются props title / description / action.
 */
import { computed } from 'vue';
import Icon from '../Icon/Icon.vue';
import ButtonFront from '../ButtonFront/ButtonFront.vue';

export type EmptyStateType = 'cart' | 'search' | 'wishlist';

const props = withDefaults(
  defineProps<{
    type?: EmptyStateType;
    showAction?: boolean;
    title?: string;
    description?: string;
    action?: string;
  }>(),
  { type: 'cart', showAction: true, title: undefined, description: undefined, action: undefined },
);

defineEmits<{ action: [] }>();

const CONTENT: Record<EmptyStateType, { icon: string; title: string; description: string; action: string }> = {
  cart: {
    icon: 'cart-24',
    title: 'Кошик порожній',
    description: 'Додайте товари з каталогу — вони з’являться тут.',
    action: 'Перейти до каталогу',
  },
  search: {
    icon: 'search-24',
    title: 'Нічого не знайдено',
    description: 'Спробуйте змінити запит або скинути фільтри.',
    action: 'Скинути фільтри',
  },
  wishlist: {
    icon: 'heart-24',
    title: 'Список бажань порожній',
    description: 'Натисніть «В бажання» на картці товару, щоб зберегти його тут.',
    action: 'Перейти до каталогу',
  },
};
const c = computed(() => CONTENT[props.type]);
</script>

<template>
  <div class="ds-empty-state">
    <span class="ds-empty-state__icon-wrap"><Icon class="ds-empty-state__icon" :name="c.icon" :size="24" /></span>
    <p class="ds-empty-state__title">{{ title ?? c.title }}</p>
    <p class="ds-empty-state__text">{{ description ?? c.description }}</p>
    <ButtonFront v-if="showAction" type="primary" size="l" :label="action ?? c.action" @click="$emit('action')" />
  </div>
</template>

<style scoped>
.ds-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-16);
  box-sizing: border-box;
  width: 100%;
  max-width: 560px;
  padding: var(--space-48) var(--space-24);
  color: var(--text-primary);
  text-align: center;
}
.ds-empty-state__icon-wrap {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: calc(var(--space-48) * 2);
  height: calc(var(--space-48) * 2);
  overflow: clip;
  border-radius: var(--radius-full);
  background: var(--surface-hover);
  color: var(--icon-primary);
}
/* Глиф 40: Icon не поддерживает size 40 — 24-глиф масштабируется до 40 (перекрывает inline-style Icon). */
.ds-empty-state__icon {
  width: var(--space-40) !important;
  height: var(--space-40) !important;
}
.ds-empty-state__title {
  min-width: 100%;
  margin: 0;
  font: var(--typo-heading-h2);
}
.ds-empty-state__text {
  min-width: 100%;
  margin: 0;
  color: var(--text-secondary);
  font: var(--typo-paragraph-p1);
}
</style>
