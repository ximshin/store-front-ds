<script setup lang="ts">
// Local block of /checkout-v2: the quick order — a shortened full form in the same style (no frame, sections with
// dividers): the recipient (RecipientFields: name, patronymic, phone, e-mail, comment) and the same
// checkboxes + «Оформити замовлення» block (CheckoutConfirm). Delivery and payment are settled by the manager.
import { useRouter } from 'vue-router';
import { SectionTitle, ButtonFront, Icon, CheckoutConfirm } from '../../../main';
import { checkout, isEmpty, submitQuick, logout } from '../../../data/checkout';
import RecipientFields from './RecipientFields.vue';
import CommentSection from './CommentSection.vue';

const router = useRouter();
withDefaults(defineProps<{ labels?: 'top' | 'left'; commentBottom?: boolean; patronymicBelow?: boolean; contactsFirst?: boolean }>(), { labels: 'top', commentBottom: false, patronymicBelow: false, contactsFirst: false });

const f = checkout.form;

async function onSubmit() {
  if (await submitQuick(['lastName', 'firstName', 'phone', 'email', 'comment'])) router.push('/checkout-success');
}
</script>

<template>
  <div class="form">
    <section class="form__section">
      <SectionTitle class="form__head" size="m" title="Одержувач замовлення">
        <template #action>
          <ButtonFront v-if="!checkout.loggedIn" type="flat" size="m" label="Увійти" show-left-icon @click="router.push('/checkout-login')">
            <template #left><Icon name="user-24" /></template>
          </ButtonFront>
          <ButtonFront v-else type="flat" size="m" label="Вийти" show-left-icon @click="logout">
            <template #left><Icon name="logout-24" /></template>
          </ButtonFront>
        </template>
      </SectionTitle>
      <p class="form__indent form__lead ds-text-paragraph-p1">Менеджер зателефонує, уточнить доставку й оплату та оформить замовлення за вас.</p>
      <RecipientFields :labels="labels" :comment="!commentBottom" :patronymic-below="patronymicBelow" :contacts-first="contactsFirst" />
    </section>

    <CommentSection v-if="commentBottom" :labels="labels" />

    <CheckoutConfirm
      v-model:newsletter="f.newsletter"
      v-model:terms="f.terms"
      class="form__indent form__confirm"
      :disabled="!f.terms || isEmpty"
      :loading="checkout.submitting"
      @submit="onSubmit"
    />
  </div>
</template>

<style scoped>
/* Same style as the full form (CheckoutFormV2): sections on the page background, divider below. */
.form__section {
  display: flex;
  flex-direction: column;
  padding: var(--space-16) 0;
  border-bottom: var(--stroke-thin) solid var(--border-divider);
}
.form__head.ds-section-title {
  min-height: var(--space-40);
}
.form__lead {
  margin: 0 0 var(--space-16);
  color: var(--text-secondary);
}
.form__confirm {
  border: 0;
  background: none;
  padding-left: 0;
  padding-right: 0;
}
</style>
