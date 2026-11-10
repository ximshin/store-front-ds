<script setup lang="ts">
/**
 * menu — выпадающее меню (Figma 1092:32969): список DropdownListItem (слот по умолчанию = items),
 * опционально пункт Destructive (слот destructive) и полоса прокрутки. Фон surface/default, тень DS/Shadow/menu, radius/8.
 *
 * Figma → props: Show Destructive? → showDestructive, Show scroll? → showScroll (список ограничен maxHeight и
 * прокручивается), items → слот по умолчанию, пункт Destructive → слот destructive (по умолчанию
 * DropdownListItem destructive с подписью destructiveLabel).
 */
import DropdownListItem from '../DropdownListItem/DropdownListItem.vue';

withDefaults(
  defineProps<{
    showDestructive?: boolean;
    showScroll?: boolean;
    destructiveLabel?: string;
    /** Высота области items при showScroll, px. */
    maxHeight?: number;
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma.
    showDestructive: true,
    showScroll: false,
    destructiveLabel: 'Option',
    maxHeight: 192,
  },
);
</script>

<template>
  <div class="ds-menu" role="menu">
    <div
      class="ds-menu__items"
      :class="{ 'has-scroll': showScroll }"
      :style="showScroll ? { maxHeight: `${maxHeight}px` } : undefined"
    >
      <slot />
    </div>
    <div v-if="showDestructive" class="ds-menu__destructive">
      <slot name="destructive">
        <DropdownListItem destructive :label="destructiveLabel" />
      </slot>
    </div>
  </div>
</template>

<style scoped>
.ds-menu {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  border-radius: var(--radius-8);
  background: var(--surface-default);
  box-shadow: var(--shadow-menu);
}
.ds-menu__items {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: var(--space-4);
}
.ds-menu__items.has-scroll {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border-input) transparent;
}
.ds-menu__destructive {
  box-sizing: border-box;
  padding: var(--space-4);
  background: var(--surface-default);
}
</style>
