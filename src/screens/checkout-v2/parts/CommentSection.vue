<script setup lang="ts">
// Local block of /checkout-v2-comment: the order comment as its own form section after «Оплата», before the confirm
// block — Figma Checkout-v2 form-section 85:3784 (padding 16 0, gap 8, divider below; no section title).
// Closed: flat button M «Додати коментар до замовлення» with comment-stroke. Open (as hidden 84:1420): the field above,
// the button «Прибрати коментар» under it. The field is a textarea (Input multiline), 3 lines, grows with the text.
import { nextTick, ref } from 'vue';
import { Input, ButtonFront, Icon } from '../../../main';
import { checkout, validateField } from '../../../data/checkout';

withDefaults(defineProps<{ labels?: 'top' | 'left' }>(), { labels: 'top' });

const f = checkout.form;
const e = checkout.errors;
const fieldEl = ref<HTMLElement | null>(null);

async function toggle() {
  f.showComment = !f.showComment;
  if (!f.showComment) return;
  await nextTick();
  fieldEl.value?.querySelector('textarea')?.focus();
}
</script>

<template>
  <section class="cs">
    <div v-if="f.showComment" ref="fieldEl">
      <Input
        v-model="f.comment"
        multiline
        :rows="3"
        :label-position="labels"
        size="l"
        label="Коментар до замовлення"
        placeholder="Наприклад, зателефонуйте перед доставкою"
        clearable
        :error="!!e.comment"
        :hint="e.comment"
        @focusout="validateField('comment')"
      />
    </div>
    <div class="cs__link form__indent">
      <ButtonFront
        type="flat"
        size="m"
        show-left-icon
        :label="f.showComment ? 'Прибрати коментар' : 'Додати коментар до замовлення'"
        @click="toggle"
      >
        <template #left><Icon :name="f.showComment ? 'cross-24' : 'comment-stroke'" /></template>
      </ButtonFront>
    </div>
  </section>
</template>

<style scoped>
/* Figma form-section 85:3784: vertical, padding 16 0, gap 8, border-bottom border/divider. */
.cs {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding: var(--space-16) 0;
  border-bottom: var(--stroke-thin) solid var(--border-divider);
}
.cs__link {
  display: flex;
}
/* Same label style as the other form links (RecipientFields). */
.cs__link :deep(.ds-button) {
  font: var(--typo-special-special-14-medium);
}
</style>
