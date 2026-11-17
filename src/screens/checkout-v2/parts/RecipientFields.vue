<script setup lang="ts">
// Local block of /checkout-v2: the recipient fields — shared by the full form and the quick order
// (the quick order is a shortened full form). Figma 1:1048 «form-section» Одержувач:
// name row + «Додати по батькові» (the field takes one column, as «Прізвище»), phone / e-mail,
// «Додати коментар до замовлення» with comment-stroke (Figma 1:1137).
import { nextTick, ref } from 'vue';
import { Input, ButtonFront, Icon } from '../../../main';
import { checkout, validateField } from '../../../data/checkout';

// labels left: inputs get the DS Label position=Left; rows become one field per line, links line up with the fields.
withDefaults(defineProps<{ labels?: 'top' | 'left' }>(), { labels: 'top' });

const f = checkout.form;
const e = checkout.errors;
const patronymicEl = ref<HTMLElement | null>(null);
const commentEl = ref<HTMLElement | null>(null);

async function togglePatronymic() {
  f.showPatronymic = !f.showPatronymic;
  if (!f.showPatronymic) return (f.patronymic = '');
  await nextTick();
  patronymicEl.value?.querySelector('input')?.focus();
}
async function toggleComment() {
  f.showComment = !f.showComment;
  if (!f.showComment) return;
  await nextTick();
  commentEl.value?.querySelector('input')?.focus();
}
</script>

<template>
  <div class="rf" :class="{ 'rf--left': labels === 'left' }">
    <div class="rf__items">
      <!-- Figma inline-inputs 1:1071: the name row, then «Додати по батькові» (gap 8). -->
      <div class="rf__group">
        <div class="rf__row">
          <Input :label-position="labels" v-model="f.lastName" size="l" label="Прізвище" placeholder="Прізвище" :error="!!e.lastName" :hint="e.lastName" @focusout="validateField('lastName')" />
          <Input :label-position="labels" v-model="f.firstName" size="l" label="Ім'я" placeholder="Ім'я" :error="!!e.firstName" :hint="e.firstName" @focusout="validateField('firstName')" />
        </div>
        <!-- The patronymic is one column wide, under «Прізвище». -->
        <div v-if="f.showPatronymic" ref="patronymicEl" class="rf__row rf__patronymic">
          <Input :label-position="labels" v-model="f.patronymic" size="l" label="По батькові" placeholder="По батькові" clearable />
          <span class="rf__spacer" aria-hidden="true" />
        </div>
        <div class="rf__link form__indent">
          <ButtonFront type="flat" size="m" :label="f.showPatronymic ? 'Прибрати по батькові' : 'Додати по батькові'" @click="togglePatronymic" />
        </div>
      </div>
      <div class="rf__row">
        <Input :label-position="labels" v-model="f.phone" size="l" type="tel" label="Телефон" placeholder="+38 (0XX) XXX-XX-XX" :error="!!e.phone" :hint="e.phone" @focusout="validateField('phone')" />
        <Input :label-position="labels" v-model="f.email" size="l" type="email" label="Е-пошта" placeholder="name@mail.com" :error="!!e.email" :hint="e.email" @focusout="validateField('email')" />
      </div>
      <div v-if="f.showComment" ref="commentEl">
        <Input
          v-model="f.comment"
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
    </div>
    <div class="rf__link form__indent">
      <ButtonFront
        type="flat"
        size="m"
        show-left-icon
        :label="f.showComment ? 'Прибрати коментар' : 'Додати коментар до замовлення'"
        @click="toggleComment"
      >
        <!-- «Прибрати коментар» — cross-24 (DS 6113:4702), scaled to 16 as the other icons of the button. -->
        <template #left><Icon :name="f.showComment ? 'cross-24' : 'comment-stroke'" /></template>
      </ButtonFront>
    </div>
  </div>
</template>

<style scoped>
/* Figma items slot: gap 16, padding-bottom 8; the comment button follows it. */
.rf__items {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding-bottom: var(--space-8);
}
.rf__group {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}
.rf__row {
  display: flex;
  gap: var(--space-8);
}
/* The patronymic sits inside the name group (gap 8 to the link under it), but from the name row it needs the
   common field gap 16: 8 of the group + 8 here. */
.rf__patronymic {
  margin-top: var(--space-8);
}
.rf__row > * {
  flex: 1 1 0;
  min-width: 0;
}
.rf__link {
  display: flex;
}
.rf__link :deep(.ds-button) {
  font: var(--typo-special-special-14-medium);
}
@media (max-width: 600px) {
  .rf__row {
    flex-direction: column;
    align-items: stretch;
  }
  .rf__spacer {
    display: none;
  }
}
</style>
