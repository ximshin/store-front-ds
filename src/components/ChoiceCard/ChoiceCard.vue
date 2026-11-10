<script setup lang="ts">
/**
 * ChoiceCard — выбор способа доставки / оплаты (Figma 6254:522).
 * Layout=Card — карточка с рамкой (Selected — border/input-active + surface/subtle); Layout=Row — строка списка
 * без рамки с нижней линией border/divider. Внутри Radio, название, описание, цена (DS/Price/S) и иконка 24.
 * Show params + слот `params` — поля выбранного способа в ряд (по умолчанию Select + ButtonFront «Обрати на мапі»).
 *
 * Figma → props: Title → title, Description → description, Price → price, Show description / Show price /
 * Show icon / Show params → showDescription / showPrice / showIcon / showParams, Icon (swap) → icon (имя иконки)
 * или слот `icon`, Layout → layout (card | row), State=Selected → selected, State=Disabled → disabled,
 * State=Hover → :hover, слот params → slot `params`.
 */
import Radio from '../Radio/Radio.vue';
import Select from '../Select/Select.vue';
import ButtonFront from '../ButtonFront/ButtonFront.vue';
import Icon from '../Icon/Icon.vue';

export type ChoiceCardLayout = 'card' | 'row';

const props = withDefaults(
  defineProps<{
    layout?: ChoiceCardLayout;
    title?: string;
    description?: string;
    price?: string;
    showDescription?: boolean;
    showPrice?: boolean;
    showIcon?: boolean;
    /** Имя иконки из `src/assets/icons` (Figma: Icon, instance swap). */
    icon?: string;
    showParams?: boolean;
    selected?: boolean;
    disabled?: boolean;
    /** `name` радио-кнопки — для группы карточек. */
    name?: string;
    value?: string;
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma.
    layout: 'card',
    title: 'Нова Пошта — відділення',
    description: 'Завтра, 8 жовтня',
    price: '70 грн',
    showDescription: true,
    showPrice: true,
    showIcon: true,
    icon: 'location-24',
    showParams: false,
    selected: false,
    disabled: false,
  },
);

const emit = defineEmits<{ 'update:selected': [value: boolean]; select: [] }>();

function onClick() {
  if (props.disabled || props.selected) return;
  emit('update:selected', true);
  emit('select');
}
</script>

<template>
  <div
    class="ds-choice"
    :class="[`ds-choice--${layout}`, { 'is-selected': selected, 'is-disabled': disabled }]"
    @click="onClick"
  >
    <div class="ds-choice__row">
      <Radio
        :checked="selected"
        :disabled="disabled"
        :show-label="false"
        :name="name"
        :value="value"
        :label="title"
      />
      <div class="ds-choice__text">
        <span class="ds-choice__title">{{ title }}</span>
        <span v-if="showDescription" class="ds-choice__description">{{ description }}</span>
      </div>
      <span v-if="showPrice" class="ds-choice__price">{{ price }}</span>
      <span v-if="showIcon" class="ds-choice__icon">
        <slot name="icon"><Icon :name="icon" :size="24" /></slot>
      </span>
    </div>
    <div v-if="showParams" class="ds-choice__params" @click.stop>
      <slot name="params">
        <Select class="ds-choice__select" placeholder="Оберіть відділення" :show-label="false" size="m" :disabled="disabled" />
        <ButtonFront type="default" size="m" label="Обрати на мапі" show-left-icon :disabled="disabled">
          <template #left><Icon name="location-24" /></template>
        </ButtonFront>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.ds-choice {
  --_bg: var(--surface-default);
  --_border: var(--border-card);
  --_title: var(--text-primary);
  --_secondary: var(--text-secondary);
  --_price: var(--text-primary);

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-16);
  box-sizing: border-box;
  width: 100%;
  padding: var(--space-16);
  background: var(--_bg);
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

/* ---- Layout=Card ---- */
.ds-choice--card {
  border: var(--stroke-thin) solid var(--_border);
  border-radius: var(--radius-8);
}
.ds-choice--card:hover:not(.is-disabled):not(.is-selected) {
  --_border: var(--border-hover-card);
}
.ds-choice--card.is-selected {
  --_bg: var(--surface-subtle);
  --_border: var(--border-input-active);
}
.ds-choice--card.is-disabled {
  --_bg: var(--surface-subtle);
  --_border: var(--border-disabled);
}

/* ---- Layout=Row ---- */
.ds-choice--row {
  --_border: var(--border-divider);
  border-bottom: var(--stroke-thin) solid var(--_border);
}
.ds-choice--row:hover:not(.is-disabled) {
  --_bg: var(--surface-hover);
}

/* ---- Disabled ---- */
.ds-choice.is-disabled {
  --_title: var(--text-disabled);
  --_secondary: var(--text-disabled);
  --_price: var(--text-disabled);
  cursor: default;
}

/* Наведение на карточку подсвечивает и радио (в Figma State=Hover у радио тоже hover). */
.ds-choice:hover:not(.is-disabled):not(.is-selected) :deep(.ds-radio) {
  --_border: var(--border-input-hover);
}

.ds-choice__row {
  display: flex;
  align-items: flex-start;
  gap: var(--space-12);
  width: 100%;
  overflow: clip;
}
.ds-choice__text {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
  overflow-wrap: anywhere;
}
.ds-choice__title {
  color: var(--_title);
}
.ds-choice--card .ds-choice__title {
  font: var(--typo-heading-group-title);
}
.ds-choice--row .ds-choice__title {
  font: var(--typo-paragraph-p1);
}
.ds-choice__description {
  color: var(--_secondary);
  font: var(--typo-paragraph-p1);
}
.ds-choice__price {
  flex: none;
  color: var(--_price);
  font: var(--typo-price-s);
  white-space: nowrap;
}
.ds-choice__icon {
  display: inline-flex;
  flex: none;
  color: var(--icon-primary);
}

.ds-choice__params {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  width: 100%;
  overflow: clip;
  cursor: default;
}
.ds-choice__select {
  flex: 1 1 0;
}
</style>
