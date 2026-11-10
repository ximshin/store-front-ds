<script setup lang="ts">
/**
 * AddressCard — отделение/пункт выдачи в списке и на карте (Figma 6226:110, address-list-item).
 * State: normal — перевозчик (DS/Paragraph/P1, text/secondary), адрес (Special 16 Regular), срок (Heading/H4), цена;
 * active — плюс график работы и ButtonFront Primary L «Доставити сюди», обводка border/input-active;
 * popup — то же на карте, тень DS/Shadow/menu.
 *
 * Figma → props: Carrier → carrier, Address → address, Date → date, Price → price, Carrier icon (swap) → `carrierIcon`
 * (имя иконки, по умолчанию location-24, цвет icon/danger) или слот `carrier-icon` (логотип перевозчика),
 * Schedule title → scheduleTitle, Schedule → schedule (переносы строк сохраняются), State → state.
 * Дополнительно: buttonLabel. События: click (карточка), choose (кнопка).
 */
import Icon from '../Icon/Icon.vue';
import ButtonFront from '../ButtonFront/ButtonFront.vue';

export type AddressCardState = 'normal' | 'active' | 'popup';

withDefaults(
  defineProps<{
    state?: AddressCardState;
    carrier?: string;
    address?: string;
    date?: string;
    price?: string;
    carrierIcon?: string;
    scheduleTitle?: string;
    schedule?: string;
    buttonLabel?: string;
  }>(),
  {
    // Значения по умолчанию — как у компонента в Figma.
    state: 'normal',
    carrier: 'Нова Пошта №1',
    address: '№1, вул. Пирогівський шлях, 135',
    date: 'Відправимо завтра',
    price: '159 ₴',
    carrierIcon: 'location-24',
    scheduleTitle: 'Графік роботи',
    schedule: 'Пн-Пт: 09:00–18:00\nСб: 09:00–15:00',
    buttonLabel: 'Доставити сюди',
  },
);

defineEmits<{ click: [event: MouseEvent]; choose: [event: MouseEvent] }>();
</script>

<template>
  <div class="ds-address-card" :class="`ds-address-card--${state}`" @click="$emit('click', $event)">
    <span class="ds-address-card__carrier">
      <slot name="carrier-icon"><Icon :name="carrierIcon" :size="24" /></slot>
    </span>
    <div class="ds-address-card__info">
      <p class="ds-address-card__name">{{ carrier }}</p>
      <p class="ds-address-card__address">{{ address }}</p>
      <p class="ds-address-card__date">{{ date }}</p>
      <p class="ds-address-card__price">{{ price }}</p>
      <template v-if="state !== 'normal'">
        <div class="ds-address-card__schedule">
          <Icon name="clock-24" :size="24" />
          <div class="ds-address-card__hours">
            <p class="ds-address-card__hours-title">{{ scheduleTitle }}</p>
            <p class="ds-address-card__hours-text">{{ schedule }}</p>
          </div>
        </div>
        <ButtonFront
          block
          class="ds-address-card__choose"
          type="primary"
          size="l"
          :label="buttonLabel"
          @click.stop="$emit('choose', $event)"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.ds-address-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-12);
  box-sizing: border-box;
  width: 100%;
  padding: var(--space-12) var(--space-16);
  border-radius: var(--radius-8);
  background: var(--surface-default);
  color: var(--text-primary);
  transition: box-shadow 0.15s ease, background-color 0.15s ease;
}
/* Обводка — внутренняя (в Figma stroke inside), размер карточки не меняется. */
.ds-address-card--active {
  box-shadow: inset 0 0 0 var(--stroke-thin) var(--border-input-active);
}
.ds-address-card--popup {
  box-shadow: var(--shadow-menu);
}

.ds-address-card__carrier {
  display: inline-flex;
  flex: none;
  color: var(--icon-danger);
}
.ds-address-card__info {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
  min-width: 0;
}
.ds-address-card__info p {
  margin: 0;
}
.ds-address-card__name {
  font: var(--typo-paragraph-p1);
  color: var(--text-secondary);
}
.ds-address-card__address,
.ds-address-card__price {
  font: var(--typo-special-special-16-regular);
}
.ds-address-card__address {
  align-self: stretch;
}
.ds-address-card__date {
  font: var(--typo-heading-h4);
}

.ds-address-card__schedule {
  display: flex;
  align-items: flex-start;
  gap: var(--space-12);
  padding-top: var(--space-8);
}
.ds-address-card__hours {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.ds-address-card__hours-title {
  font: var(--typo-paragraph-p1);
  color: var(--text-secondary);
}
.ds-address-card__hours-text {
  font: var(--typo-special-special-16-regular);
  white-space: pre-line;
}

.ds-address-card__choose {
  display: flex;
  align-self: stretch;
}
</style>
