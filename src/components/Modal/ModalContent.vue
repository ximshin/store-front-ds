<script setup lang="ts">
/**
 * ModalContent — плейсхолдер содержимого Modal (Figma 6220:207). В проекте заменяется содержимым (форма, список).
 *
 * Figma → props: текст плейсхолдера → слот по умолчанию.
 */
</script>

<template>
  <div class="ds-modal-content">
    <slot>Вміст попапа — Instance Swap на свій компонент</slot>
  </div>
</template>

<style scoped>
.ds-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  padding: var(--space-24);
  border: var(--stroke-thin) dashed var(--border-divider);
  border-radius: var(--radius-8);
  background: var(--surface-subtle);
  color: var(--text-secondary);
  font: var(--typo-special-special-13-regular);
}
</style>
