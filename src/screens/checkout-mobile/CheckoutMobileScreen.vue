<script setup lang="ts">
// Screen /checkout-mobile — mobile checkout. Structure, sizes and logic — from the shop's current mobile checkout
// (shop349369.horoshop.ua/checkout/?v=mobile, references in .tmp/ref-mobile/); colours — DS semantic tokens, as
// the desktop /checkout-v2. Not in Figma yet. Local controls (fields 48 / radius 8, bottom-sheet selects) are
// candidates for mobile DS variants of Input / Select; Checkbox and Counter are from the DS base.
import './parts/mobile.css';
import { computed, nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ButtonFront, Checkbox, Icon } from '../../main';
import { deliveryOptions, paymentOptions, isEmpty } from '../../data/checkout';
import { showToast } from '../../data/toast';
import SheetSelect from './parts/SheetSelect.vue';
import MobileOrder from './parts/MobileOrder.vue';
import OrderCard from '../checkout/parts/OrderCard.vue';
import ModeSwitch from '../checkout-v2/parts/ModeSwitch.vue';
import {
  mobile, countryOptions, popularCountries, citiesOf, deliveryLocked, delivery, payment, canSubmit,
  pickCountry, pickCity, pickDelivery, pickPayment, pickBranch, validateField, submitMobile, type MobileMode,
} from './parts/mobileForm';

/** itemsLook 'ref' (/checkout-mobile-items): item rows laid out as the shop's new mobile cart (MobileOrder look="ref"). */
withDefaults(defineProps<{ itemsLook?: 'desktop' | 'ref' }>(), { itemsLook: 'desktop' });

const router = useRouter();
const e = mobile.errors;
const tabs: { value: MobileMode; label: string }[] = [
  { value: 'full', label: 'Детальне замовлення' },
  { value: 'quick', label: 'Замовити швидко' },
];

const cityList = computed(() => citiesOf(mobile.country));
/** Quick choice in the city sheet — the first five of the country (reference). */
const popularCities = computed(() => cityList.value.slice(0, 5));
const deliveryLabels = deliveryOptions.map((d) => d.label);
const paymentLabels = paymentOptions.map((p) => p.label);
/** Second lines in the fit sheets: delivery price / payment terms (as the desktop rich selects). */
const deliverySubs = Object.fromEntries(deliveryOptions.map((d) => [d.label, d.sub]));
const paymentSubs = Object.fromEntries(paymentOptions.map((p) => [p.label, p.sub]));
function onDelivery(label: string) {
  const d = deliveryOptions.find((o) => o.label === label);
  if (d) pickDelivery(d.id);
}
function onPayment(label: string) {
  const p = paymentOptions.find((o) => o.label === label);
  if (p) pickPayment(p.id);
}
const patronymicEl = ref<HTMLInputElement | null>(null);
const commentEl = ref<HTMLTextAreaElement | null>(null);
async function togglePatronymic() {
  mobile.showPatronymic = !mobile.showPatronymic;
  if (!mobile.showPatronymic) return (mobile.patronymic = '');
  await nextTick();
  patronymicEl.value?.focus();
}
async function openComment() {
  mobile.showComment = true;
  await nextTick();
  commentEl.value?.focus();
}
function showMap() {
  showToast('info', 'Карта відділень з’явиться в наступній версії');
}
async function onSubmit() {
  if (await submitMobile()) router.push('/checkout-success');
}
</script>

<template>
  <div class="cm">
    <header class="cm__header">
      <button type="button" class="cm__back" @click="router.push('/')">
        <Icon name="arrow-left-24" :size="24" />
        Повернутись до покупок
      </button>
    </header>

    <main class="cm__main">
      <button type="button" class="m-btn m-btn--block" @click="router.push('/checkout-login')">
        <Icon name="user-24" :size="24" />
        Вхід для клієнтів
      </button>

      <!-- Order before the form: the summary card exactly as on desktop /checkout-v2 (OrderCard split, promo row →
           field, warning, Проміжна сума / знижки / Доставка / Загальна сума), then the items card, folded when long. -->
      <div class="cm__order">
        <OrderCard split summary-only promo-always promo-look="mobile" />
        <MobileOrder :look="itemsLook" />
      </div>

      <!-- Mode switch — the one from desktop /checkout-v2-labels-left-400 (ModeSwitch look="filled"), instead of the
           reference's underline tabs: min height 48, long labels wrap to a new line, no sideways scroll. -->
      <ModeSwitch
        class="cm__switch"
        :model-value="mobile.mode"
        :items="tabs"
        label="Спосіб оформлення"
        look="filled"
        @update:model-value="mobile.mode = $event as MobileMode"
      />

      <form class="cm__form" novalidate @submit.prevent="onSubmit">
        <!-- Field layout — as the desktop /checkout-v2: Одержувач (Прізвище, Ім'я, «Додати по батькові», Телефон,
             Е-пошта) → Доставка (Країна, Місто, спосіб, Відділення + «Обрати на мапі») → Оплата → коментар окремим
             блоком → підтвердження. Quick order — the same recipient block, then the comment. -->
        <!-- ---------- Одержувач ---------- -->
        <section class="cm__section">
          <h2 class="cm__title">Одержувач замовлення</h2>
          <p v-if="mobile.mode === 'quick'" class="cm__lead">Менеджер зателефонує, уточнить доставку й оплату та оформить замовлення за вас.</p>
          <div class="cm__fields">
            <div class="cm__group">
              <div>
                <label class="m-label" for="cm-last">Прізвище</label>
                <input id="cm-last" v-model="mobile.lastName" class="m-field" :class="{ 'is-error': !!e.lastName }" type="text" autocomplete="family-name" placeholder="Прізвище" @blur="validateField('lastName')" />
                <p v-if="e.lastName" class="m-error">{{ e.lastName }}</p>
              </div>
              <div class="cm__next">
                <label class="m-label" for="cm-first">Ім'я</label>
                <input id="cm-first" v-model="mobile.firstName" class="m-field" :class="{ 'is-error': !!e.firstName }" type="text" autocomplete="given-name" placeholder="Ім'я" @blur="validateField('firstName')" />
                <p v-if="e.firstName" class="m-error">{{ e.firstName }}</p>
              </div>
              <div v-if="mobile.showPatronymic" class="cm__next">
                <label class="m-label" for="cm-patronymic">По батькові</label>
                <input id="cm-patronymic" ref="patronymicEl" v-model="mobile.patronymic" class="m-field" type="text" autocomplete="additional-name" placeholder="По батькові" />
              </div>
              <div class="cm__action">
                <ButtonFront type="flat" size="m" :label="mobile.showPatronymic ? 'Прибрати по батькові' : 'Додати по батькові'" @click="togglePatronymic" />
              </div>
            </div>
            <div>
              <label class="m-label" for="cm-phone">Телефон</label>
              <input id="cm-phone" v-model="mobile.phone" class="m-field" :class="{ 'is-error': !!e.phone }" type="tel" inputmode="tel" autocomplete="tel" placeholder="+38 (0XX) XXX-XX-XX" @blur="validateField('phone')" />
              <p v-if="e.phone" class="m-error">{{ e.phone }}</p>
            </div>
            <div>
              <label class="m-label" for="cm-email">Е-пошта</label>
              <input id="cm-email" v-model="mobile.email" class="m-field" :class="{ 'is-error': !!e.email }" type="email" inputmode="email" autocomplete="email" placeholder="name@mail.com" @blur="validateField('email')" />
              <p v-if="e.email" class="m-error">{{ e.email }}</p>
            </div>
          </div>
        </section>

        <template v-if="mobile.mode === 'full'">
          <!-- ---------- Доставка: country → city; the method and branch wait for the city ---------- -->
          <section class="cm__section">
            <h2 class="cm__title">Доставка</h2>
            <div class="cm__fields">
              <SheetSelect
                label="Країна"
                :model-value="mobile.country"
                :options="countryOptions"
                placeholder="Оберіть країну"
                search
                search-placeholder="Пошук країни"
                :popular="popularCountries"
                popular-title="Популярні країни"
                :error="e.country"
                @update:model-value="pickCountry"
              />
              <SheetSelect
                label="Місто"
                :model-value="mobile.city"
                :options="cityList"
                :placeholder="mobile.country ? 'Оберіть місто' : 'Спочатку оберіть країну'"
                :disabled="!mobile.country"
                search
                search-placeholder="назва міста або поштовий індекс"
                :popular="popularCities"
                popular-title="Популярні міста"
                :error="e.city"
                @update:model-value="pickCity"
              />
              <SheetSelect
                label="Спосіб доставки"
                :model-value="delivery.label"
                :options="deliveryLabels"
                :subs="deliverySubs"
                fit
                :disabled="deliveryLocked"
                @update:model-value="onDelivery"
              />
              <template v-if="delivery.branches">
                <SheetSelect
                  label="Відділення"
                  :model-value="mobile.branch"
                  :options="delivery.branches"
                  placeholder="Оберіть відділення"
                  :disabled="deliveryLocked"
                  search
                  search-placeholder="номер або адреса відділення"
                  :error="e.branch"
                  @update:model-value="pickBranch"
                />
                <!-- Desktop ≤600: the map button goes under the branch field, full width. -->
                <button type="button" class="m-btn m-btn--block" :disabled="deliveryLocked" @click="showMap">
                  <Icon name="location-stroke" :size="16" />
                  Обрати на мапі
                </button>
              </template>
              <div v-else-if="mobile.delivery === 'courier'">
                <label class="m-label" for="cm-address">Адреса</label>
                <input id="cm-address" v-model="mobile.address" class="m-field" :class="{ 'is-error': !!e.address }" type="text" autocomplete="street-address" placeholder="Вулиця, будинок, квартира" @blur="validateField('address')" />
                <p v-if="e.address" class="m-error">{{ e.address }}</p>
              </div>
              <p v-else class="cm__note">Магазин: Київ, вул. Велика Васильківська, 72 · Пн–Сб 10:00–20:00</p>
            </div>
          </section>

          <!-- ---------- Оплата: locked until the city is chosen (reference logic) ---------- -->
          <section class="cm__section" :class="{ 'is-locked': deliveryLocked }">
            <h2 class="cm__title">Оплата</h2>
            <SheetSelect
              title="Оплата"
              :model-value="payment.label"
              :options="paymentLabels"
              :subs="paymentSubs"
              fit
              :disabled="deliveryLocked"
              @update:model-value="onPayment"
            />
          </section>

          <!-- ---------- Коментар: own block under «Оплата», no title (place — desktop /checkout-v2). Look — the reference:
               the outline button turns into the «Коментар» field in its place, focused; no way back. Full order only. ---------- -->
          <section class="cm__section">
            <!-- Icon — the desktop one (CommentSection: comment-stroke), shown at 24 as «Вхід для клієнтів». With the icon
                 the label does not fit 18 on a 343 button (293 + 24 + 8 + 24 = 349) — text 16 keeps it on one line. -->
            <button v-if="!mobile.showComment" type="button" class="m-btn m-btn--block cm__comment-btn" @click="openComment">
              <Icon name="comment-stroke" :size="24" />
              Додати коментар до замовлення
            </button>
            <div v-else>
              <label class="m-label" for="cm-comment">Коментар</label>
              <textarea id="cm-comment" ref="commentEl" v-model="mobile.comment" class="m-field cm__comment" :class="{ 'is-error': !!e.comment }" rows="2" @blur="validateField('comment')" />
              <p v-if="e.comment" class="m-error">{{ e.comment }}</p>
            </div>
          </section>
        </template>

        <!-- ---------- Confirm ---------- -->
        <div class="cm__confirm">
          <Checkbox v-model:checked="mobile.newsletter" class="cm__check" size="l" :show-icon="false" :show-counter="false" label="Бажаю отримувати новини та спеціальні пропозиції магазину" />
          <Checkbox v-model:checked="mobile.terms" class="cm__check" size="l" :show-icon="false" :show-counter="false" label="">
            Підтверджуючи замовлення, я приймаю умови <a class="cm__link" href="#" @click.prevent>угоди користувача</a>
          </Checkbox>
          <button type="submit" class="m-btn m-btn--block m-btn--primary" :disabled="!canSubmit">
            {{ mobile.submitting ? 'Оформлюємо…' : 'Оформити замовлення' }}
          </button>
          <p v-if="!mobile.terms && !isEmpty" class="cm__hint">Щоб оформити замовлення, прийміть умови угоди користувача</p>
        </div>
      </form>
    </main>

    <footer class="cm__footer">
      <p class="cm__phones">
        <a href="tel:+380500293794">050 029-37-94</a>
        <a href="tel:+380635008985">063 500-89-85</a>
      </p>
      <a class="cm__footer-link" href="#" @click.prevent>Контактна інформація</a>
      <a class="cm__footer-link" href="#/checkout-v2">Повна версія сайту</a>
      <span>© 2026</span>
    </footer>
  </div>
</template>

<style scoped>
.cm {
  min-height: 100vh;
  background: var(--surface-default);
  color: var(--text-primary);
  font-family: var(--font-sans);
}
/* Reference: the header with the back link stays on top while scrolling. */
.cm__header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--surface-default);
}
.cm__back {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  width: 100%;
  min-height: var(--space-48);
  padding: 0 var(--space-16);
  border: 0;
  background: none;
  color: var(--text-primary);
  font: inherit;
  font-size: var(--font-size-18);
  text-align: left;
  cursor: pointer;
}
.cm__main {
  box-sizing: border-box;
  max-width: 600px;
  margin: 0 auto;
  padding: var(--space-16) var(--space-16) var(--space-40);
}
/* Order block: 16 under «Вхід для клієнтів», cards 16 apart (as the desktop order column), 16 to the tabs. */
.cm__order {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  margin: var(--space-16) 0;
}
/* Mode switch (desktop filled look): segments at least 48 (touch, as the mobile buttons); a label that does not fit
   wraps inside its half — the two halves stay equal, nothing scrolls sideways. */
.cm .cm__switch :deep(.ms__item) {
  min-height: var(--space-48);
  padding: var(--space-8) var(--space-16);
  font-size: var(--font-size-18);
  line-height: var(--font-line-height-24);
  white-space: normal;
  overflow-wrap: break-word;
}
/* Sections as the reference: no lines, only space — 20 under each section, the next title right after it;
   16 from the tabs to the first title. */
.cm__form {
  padding-top: var(--space-24);
}
.cm__section {
  padding-bottom: var(--space-20);
}
/* Section titles: 18 bold as on the reference; colour — text/primary (desktop), not the reference blue. */
.cm__title {
  margin: 0 0 var(--space-16);
  padding: 0;
  color: var(--text-primary);
  font-size: var(--font-size-18);
  font-weight: var(--font-weight-bold);
  line-height: var(--font-line-height-24);
}
.is-locked .cm__title {
  color: var(--text-disabled);
}
.cm__fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}
/* Name group as desktop RecipientFields: fields 16 apart, the «Додати по батькові» link 8 under them. */
.cm__group {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}
.cm__next {
  margin-top: var(--space-8);
}
.cm__action {
  display: flex;
}
.cm__action :deep(.ds-button) {
  font: var(--typo-special-special-14-medium);
}
.cm__lead {
  margin: 0 0 var(--space-16);
  color: var(--text-secondary);
  font-size: var(--font-size-14);
  line-height: var(--font-line-height-20);
}
/* Comment field as the reference: 90 high (2 rows), grows by the vertical handle. */
/* Text 16 and sides 8: «icon + label» fits one line down to a 360 screen (24 + 8 + 260 + 16 = 308 ≤ 312). */
.cm .cm__comment-btn {
  padding: 0 var(--space-8);
  font-size: var(--font-size-16);
}
.cm .cm__comment {
  display: block;
  min-height: 90px;
}
.cm__note {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-14);
  line-height: var(--font-line-height-20);
}
.cm__confirm {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}
.cm__check :deep(.ds-checkbox__label) {
  font-size: var(--font-size-14);
  line-height: var(--font-line-height-20);
  white-space: normal;
}
.cm__link {
  color: var(--text-link);
}
.cm__hint {
  margin: calc(-1 * var(--space-8)) 0 0;
  color: var(--text-secondary);
  font-size: var(--font-size-13);
  line-height: var(--font-line-height-16);
  text-align: center;
}
.cm__footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-12);
  padding: var(--space-24) var(--space-16) calc(var(--space-24) + env(safe-area-inset-bottom));
  background: var(--surface-subtle);
  color: var(--text-secondary);
  font-size: var(--font-size-14);
}
.cm__phones {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-4) var(--space-16);
  margin: 0;
  font-size: var(--font-size-18);
}
.cm__phones a,
.cm__footer-link {
  color: inherit;
  text-decoration: none;
}
</style>
