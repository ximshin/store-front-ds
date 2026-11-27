<script setup lang="ts">
// Local block of /checkout-v2: the recipient fields — shared by the full form and the quick order
// (the quick order is a shortened full form). Figma 1:1048 «form-section» Одержувач:
// name row Прізвище · Ім'я · По батькові (patronymic always shown — was «Додати по батькові»), phone / e-mail,
// «Додати коментар до замовлення» with comment-stroke (Figma 1:1137).
import { nextTick, ref } from 'vue';
import { Input, ButtonFront, Icon } from '../../../main';
import { checkout, validateField } from '../../../data/checkout';

// labels left: inputs get the DS Label position=Left; rows become one field per line, links line up with the fields.
// comment=false (/checkout-v2-comment): the comment lives in its own section after «Оплата» (CommentSection).
// patronymicBelow (/checkout-v2-comment): «По батькові» on its own row under Прізвище · Ім'я, as wide as «Прізвище»
// (the row keeps two equal columns: the field + an empty one); on phones / labels left — full width like the others.
// contactsFirst (/checkout-v2-comment): Телефон · Е-пошта come first, then the name — in the DOM too, so Tab follows.
withDefaults(defineProps<{ labels?: 'top' | 'left'; comment?: boolean; patronymicBelow?: boolean; contactsFirst?: boolean }>(), {
  labels: 'top',
  comment: true,
  patronymicBelow: false,
  contactsFirst: false,
});

const f = checkout.form;
const e = checkout.errors;
const commentEl = ref<HTMLElement | null>(null);

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
      <!-- Contacts first (contactsFirst) or after the name (default). -->
      <div v-if="contactsFirst" class="rf__row">
        <Input :label-position="labels" v-model="f.phone" size="l" type="tel" label="Телефон" placeholder="+38 (0XX) XXX-XX-XX" :error="!!e.phone" :hint="e.phone" @focusout="validateField('phone')" />
        <Input :label-position="labels" v-model="f.email" size="l" type="email" label="Е-пошта" placeholder="name@mail.com" :error="!!e.email" :hint="e.email" @focusout="validateField('email')" />
      </div>
      <!-- Name row: Прізвище · Ім'я · По батькові — the patronymic is always shown, in one row (experiment). -->
      <div class="rf__row">
        <Input :label-position="labels" v-model="f.lastName" size="l" label="Прізвище" placeholder="Прізвище" :error="!!e.lastName" :hint="e.lastName" @focusout="validateField('lastName')" />
        <Input :label-position="labels" v-model="f.firstName" size="l" label="Ім'я" placeholder="Ім'я" :error="!!e.firstName" :hint="e.firstName" @focusout="validateField('firstName')" />
        <Input v-if="!patronymicBelow" :label-position="labels" v-model="f.patronymic" size="l" label="По батькові" placeholder="По батькові" />
      </div>
      <div v-if="patronymicBelow" class="rf__row">
        <Input :label-position="labels" v-model="f.patronymic" size="l" label="По батькові" placeholder="По батькові" />
        <span class="rf__spacer" aria-hidden="true" />
      </div>
      <div v-if="!contactsFirst" class="rf__row">
        <Input :label-position="labels" v-model="f.phone" size="l" type="tel" label="Телефон" placeholder="+38 (0XX) XXX-XX-XX" :error="!!e.phone" :hint="e.phone" @focusout="validateField('phone')" />
        <Input :label-position="labels" v-model="f.email" size="l" type="email" label="Е-пошта" placeholder="name@mail.com" :error="!!e.email" :hint="e.email" @focusout="validateField('email')" />
      </div>
      <div v-if="comment && f.showComment" ref="commentEl">
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
    <div v-if="comment" class="rf__link form__indent">
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
.rf__row {
  display: flex;
  gap: var(--space-8);
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
