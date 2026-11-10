<script setup lang="ts">
/**
 * dropdown-list-item — пункт выпадающего меню / списка (Figma 2525:6068).
 * Опционально Checkbox (S 16) и иконка 16, затем подпись `DS/Form/Input text`.
 *
 * Figma → props: Show Checkbox? → showCheckbox, Show Icon? → showIcon, Icon (swap) → icon (имя иконки) / слот icon,
 * State=Hover → :hover (и prop hovered для принудительного показа), подпись → слот по умолчанию / label.
 * Дополнительно: checked (состояние вложенного Checkbox), destructive (красная подпись, пункт Destructive в Menu), disabled.
 */
import Icon from '../Icon/Icon.vue';
import Checkbox from '../Checkbox/Checkbox.vue';

const props = withDefaults(
  defineProps<{
    label?: string;
    showCheckbox?: boolean;
    showIcon?: boolean;
    /** Имя иконки из `src/assets/icons` (INSTANCE_SWAP; по умолчанию tick-16). */
    icon?: string;
    checked?: boolean;
    destructive?: boolean;
    disabled?: boolean;
    /** Принудительно показать State=Hover (для документации); в обычном виде работает :hover. */
    hovered?: boolean;
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma.
    label: 'Option',
    showCheckbox: false,
    showIcon: false,
    icon: 'tick-16',
    checked: false,
    destructive: false,
    disabled: false,
    hovered: false,
  },
);

const emit = defineEmits<{ click: [event: MouseEvent]; 'update:checked': [value: boolean] }>();

function onClick(e: MouseEvent) {
  if (props.disabled) return;
  if (props.showCheckbox) emit('update:checked', !props.checked);
  emit('click', e);
}
</script>

<template>
  <div
    class="ds-dropdown-item"
    :class="{ 'is-hovered': hovered, 'is-destructive': destructive, 'is-disabled': disabled }"
    :role="showCheckbox ? 'menuitemcheckbox' : 'menuitem'"
    :aria-checked="showCheckbox ? checked : undefined"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : 0"
    @click="onClick"
    @keydown.enter.prevent="($event.target as HTMLElement).click()"
    @keydown.space.prevent="($event.target as HTMLElement).click()"
  >
    <span v-if="showCheckbox" class="ds-dropdown-item__checkbox">
      <Checkbox size="s" :checked="checked" :disabled="disabled" label="" :show-counter="false" :show-icon="false" tabindex="-1" />
    </span>
    <span v-if="showIcon" class="ds-dropdown-item__icon">
      <slot name="icon"><Icon :name="icon" /></slot>
    </span>
    <span class="ds-dropdown-item__label"><slot>{{ label }}</slot></span>
  </div>
</template>

<style scoped>
.ds-dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  box-sizing: border-box;
  width: 100%;
  padding: var(--space-8);
  border-radius: var(--radius-4);
  color: var(--text-primary);
  font: var(--typo-form-input-text);
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.ds-dropdown-item:hover:not(.is-disabled),
.ds-dropdown-item.is-hovered {
  background: var(--surface-hover);
}
.ds-dropdown-item:focus-visible {
  outline: var(--stroke-bold) solid var(--border-input-active);
  outline-offset: calc(-1 * var(--stroke-bold));
}
.ds-dropdown-item.is-destructive {
  color: var(--text-danger);
}
.ds-dropdown-item.is-disabled {
  color: var(--text-disabled);
  cursor: default;
}

.ds-dropdown-item__checkbox,
.ds-dropdown-item__icon {
  display: inline-flex;
  align-items: center;
  flex: none;
}
.ds-dropdown-item__checkbox {
  pointer-events: none;
}
.ds-dropdown-item__checkbox :deep(.ds-checkbox) {
  width: auto;
}
.ds-dropdown-item__label {
  min-width: 0;
}
</style>
