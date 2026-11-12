<script setup lang="ts">
/**
 * Tabs — вкладки страницы товара (Figma 6245:12658): TabItem в ряд, шаг space/32, нижняя линия 1 px border/divider.
 * Чекаут-вариант (без линии, шаг space/24, вкладки без боковых отступов): `:divider="false" gap="var(--space-24)"`.
 * Вкладки — prop `items` (+ v-model) или слот с `TabItem`. Ширина — Fill; на мобайле — горизонтальный скролл.
 */
import TabItem from '../TabItem/TabItem.vue';

export interface TabsItem {
  label: string;
  value: string;
}

withDefaults(
  defineProps<{
    items?: TabsItem[];
    /** Значение активной вкладки (v-model). */
    modelValue?: string;
    /** Нижняя линия 1 px border/divider. */
    divider?: boolean;
    /** Шаг между вкладками (CSS-значение). */
    gap?: string;
    /** Горизонтальный отступ внутри каждой вкладки (CSS-значение). */
    paddingX?: string;
  }>(),
  { items: () => [], modelValue: undefined, divider: true, gap: 'var(--space-32)', paddingX: 'var(--space-0)' },
);
defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <div
    class="ds-tabs"
    :class="{ 'has-divider': divider }"
    role="tablist"
    :style="{ gap, '--ds-tab-padding-x': paddingX }"
  >
    <slot>
      <TabItem
        v-for="item in items"
        :key="item.value"
        :label="item.label"
        :active="item.value === modelValue"
        @click="$emit('update:modelValue', item.value)"
      />
    </slot>
  </div>
</template>

<style scoped>
.ds-tabs {
  display: flex;
  align-items: flex-start;
  width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
}
.ds-tabs::-webkit-scrollbar {
  display: none;
}
.ds-tabs.has-divider {
  border-bottom: var(--stroke-thin) solid var(--border-divider);
}
</style>
