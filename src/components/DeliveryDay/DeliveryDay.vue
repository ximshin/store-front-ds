<script setup lang="ts">
/**
 * DeliveryDay — колонка дня доставки (Figma 6226:118): дата (DS/Special/Special 14 Bold) + TimeSlot-ы, gap space/8.
 * В выборе дня — ряд DeliveryDay.
 *
 * Figma → props: Day → day. Интервалы — `slots` (список подписей), выбранный — v-model `modelValue`
 * (в Figma активен второй).
 */
import TimeSlot from '../TimeSlot/TimeSlot.vue';

withDefaults(defineProps<{ day?: string; slots?: string[]; modelValue?: string }>(), {
  day: '25 квітня (Пт)',
  slots: () => ['10:00–11:00', '11:00–12:00', '12:00–13:00', '13:00–14:00', '14:00–15:00', '15:00–16:00'],
  modelValue: '11:00–12:00',
});
defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <div class="ds-delivery-day">
    <p class="ds-delivery-day__day">{{ day }}</p>
    <TimeSlot
      v-for="slot in slots"
      :key="slot"
      :label="slot"
      :active="slot === modelValue"
      @click="$emit('update:modelValue', slot)"
    />
  </div>
</template>

<style scoped>
.ds-delivery-day {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-8);
}
.ds-delivery-day__day {
  margin: 0;
  font: var(--typo-special-special-14-bold);
  color: var(--text-primary);
  white-space: nowrap;
}
</style>
