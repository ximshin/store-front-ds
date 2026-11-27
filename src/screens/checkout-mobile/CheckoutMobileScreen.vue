<script setup lang="ts">
// Screen /checkout-mobile — mobile checkout. Structure, sizes and logic — from the shop's current mobile checkout
// (shop349369.horoshop.ua/checkout/?v=mobile, references in .tmp/ref-mobile/); colours — DS semantic tokens, as
// the desktop /checkout-v2. Not in Figma yet. Local controls (fields 48 / radius 8, bottom-sheet selects) are
// candidates for mobile DS variants of Input / Select; Checkbox and Counter are from the DS base.
import './parts/mobile.css';
import { computed, nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Checkbox, Icon } from '../../main';
import { deliveryOptions, paymentOptions, isEmpty } from '../../data/checkout';
import { showToast } from '../../data/toast';
import { usePhoneMask } from '../../data/phoneMask';
import SheetSelect from './parts/SheetSelect.vue';
import MobileOrder from './parts/MobileOrder.vue';
import OrderCard from '../checkout/parts/OrderCard.vue';
import ModeSwitch from '../checkout-v2/parts/ModeSwitch.vue';
import {
  mobile, countryOptions, popularCountries, citiesOf, deliveryLocked, delivery, payment, canSubmit,
  pickCountry, pickCity, pickDelivery, pickPayment, pickBranch, validateField, submitMobile, type MobileMode,
} from './parts/mobileForm';

/** itemsLook: 'ref' — /checkout-mobile (since 2026-11-25), item rows as the shop's new mobile cart; 'desktop' — /checkout-mobile-desktop-items (passed to MobileOrder look). */
/** contactsFirst (/checkout-mobile-desktop-items): Телефон · Е-пошта before the name — as desktop /checkout-v2-comment. */
/**
 * layout (2026-11-25) — rhythm variants: only title sizes, spacing between sections and titles, dividers and neutral
 * grouping backgrounds change; fields, selects, their labels and all colours stay as they are (colours are set per shop).
 * 'airy' — large titles 32, lots of air; 'dense' — small caps titles 13, full-width lines between sections;
 * 'cards' — each section a white card on surface/subtle; 'steps' — numbered sections with a line on the left.
 */
export type MobileLayout = 'base' | 'airy' | 'dense' | 'cards' | 'steps';
const props = withDefaults(defineProps<{ itemsLook?: 'desktop' | 'ref'; contactsFirst?: boolean; layout?: MobileLayout }>(), {
  itemsLook: 'desktop',
  contactsFirst: false,
  layout: 'base',
});
/** Recipient blocks in DOM order (so Tab follows the visual order). */
const recipientOrder = computed(() => (props.contactsFirst ? ['contacts', 'name'] : ['name', 'contacts']));

const router = useRouter();
const e = mobile.errors;
/** Phone mask «+38 (0XX) XXX-XX-XX» as you type (Baymard: localized input mask; data/phoneMask.ts). */
const phoneMask = usePhoneMask(() => mobile.phone, (v) => (mobile.phone = v));
function onPhoneBlur() {
  phoneMask.onBlur();
  validateField('phone');
}
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
const commentEl = ref<HTMLTextAreaElement | null>(null);
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
  <div class="cm" :class="`cm--${layout}`">
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
        <!-- Field layout — as the desktop /checkout-v2: Одержувач (Прізвище, Ім'я, По батькові — always shown, Телефон,
             Е-пошта; contactsFirst — Телефон, Е-пошта first) → Доставка (Країна, Місто, спосіб, Відділення + «Обрати на мапі») → Оплата → коментар окремим
             блоком → підтвердження. Quick order — the same recipient block, then the comment. -->
        <!-- ---------- Одержувач ---------- -->
        <section class="cm__section">
          <h2 class="cm__title">Одержувач замовлення</h2>
          <p v-if="mobile.mode === 'quick'" class="cm__lead">Менеджер зателефонує, уточнить доставку й оплату та оформить замовлення за вас.</p>
          <div class="cm__fields">
            <template v-for="block in recipientOrder" :key="block">
              <template v-if="block === 'name'">
                <div>
                  <label class="m-label" for="cm-last">Прізвище</label>
                  <input id="cm-last" v-model="mobile.lastName" class="m-field" :class="{ 'is-error': !!e.lastName }" type="text" autocomplete="family-name" placeholder="Прізвище" @blur="validateField('lastName')" />
                  <p v-if="e.lastName" class="m-error">{{ e.lastName }}</p>
                </div>
                <div>
                  <label class="m-label" for="cm-first">Ім'я</label>
                  <input id="cm-first" v-model="mobile.firstName" class="m-field" :class="{ 'is-error': !!e.firstName }" type="text" autocomplete="given-name" placeholder="Ім'я" @blur="validateField('firstName')" />
                  <p v-if="e.firstName" class="m-error">{{ e.firstName }}</p>
                </div>
                <div>
                  <label class="m-label" for="cm-patronymic">По батькові</label>
                  <input id="cm-patronymic" v-model="mobile.patronymic" class="m-field" type="text" autocomplete="additional-name" placeholder="По батькові" />
                </div>
              </template>
              <template v-else>
                <div>
                  <label class="m-label" for="cm-phone">Телефон</label>
                  <input
                    id="cm-phone"
                    :value="mobile.phone"
                    class="m-field"
                    :class="{ 'is-error': !!e.phone }"
                    type="tel"
                    inputmode="tel"
                    autocomplete="tel"
                    placeholder="+38 (0XX) XXX-XX-XX"
                    @focus="phoneMask.onFocus"
                    @input="phoneMask.onInput"
                    @paste="phoneMask.onPaste"
                    @blur="onPhoneBlur"
                  />
                  <p v-if="e.phone" class="m-error">{{ e.phone }}</p>
                </div>
                <div>
                  <label class="m-label" for="cm-email">Е-пошта</label>
                  <input id="cm-email" v-model="mobile.email" class="m-field" :class="{ 'is-error': !!e.email }" type="email" inputmode="email" autocomplete="email" placeholder="name@mail.com" @blur="validateField('email')" />
                  <p v-if="e.email" class="m-error">{{ e.email }}</p>
                </div>
              </template>
            </template>
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

/* ================= layout variants (2026-11-25) =================
   Only rhythm: title sizes, space between titles / sections, dividers, neutral grouping backgrounds.
   Fields, selects, their labels and every colour stay untouched (colours are configured per shop). */

/* ---------- 1. airy: magazine rhythm — titles 32, a lot of air ---------- */
.cm--airy .cm__form {
  padding-top: var(--space-40);
}
.cm--airy .cm__section {
  padding-bottom: var(--space-48);
}
.cm--airy .cm__title {
  margin-bottom: var(--space-20);
  font-size: var(--font-size-32);
  line-height: var(--font-line-height-40);
  letter-spacing: -0.01em;
}
.cm--airy .cm__order {
  gap: var(--space-24);
  margin: var(--space-24) 0 var(--space-32);
}
.cm--airy .cm__confirm {
  gap: var(--space-20);
}
/* The order block follows the scale: total 24, items title 20. */
.cm--airy :deep(.ds-order-summary__total .ds-price__value),
.cm--airy :deep(.ds-order-summary__total .ds-price) {
  font-size: var(--font-size-24);
  line-height: var(--font-line-height-32);
}
.cm--airy :deep(.mo__head),
.cm--airy :deep(.mm__text) {
  font-size: var(--font-size-20);
  line-height: var(--font-line-height-28);
}

/* ---------- 2. dense: a form sheet — small caps titles, full-width lines between sections ---------- */
.cm--dense .cm__form {
  padding-top: var(--space-16);
}
.cm--dense .cm__section {
  /* the line runs edge to edge of the screen (bleeds through the 16 page padding) */
  margin: 0 calc(-1 * var(--space-16));
  padding: var(--space-24) var(--space-16);
  border-top: var(--stroke-thin) solid var(--border-divider);
}
.cm--dense .cm__title {
  margin-bottom: var(--space-12);
  color: var(--text-secondary);
  font-size: var(--font-size-13);
  font-weight: var(--font-weight-semibold);
  line-height: var(--font-line-height-16);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.cm--dense .cm__fields {
  gap: var(--space-12);
}
.cm--dense .cm__confirm {
  margin: 0 calc(-1 * var(--space-16));
  padding: var(--space-24) var(--space-16) 0;
  border-top: var(--stroke-thin) solid var(--border-divider);
}
.cm--dense .cm__order {
  gap: var(--space-12);
  margin: var(--space-12) 0;
}

/* ---------- 3. cards: each section a white card on a neutral page tint (surface/subtle, not a shop colour) ---------- */
.cm--cards,
.cm--cards .cm__header {
  background: linear-gradient(var(--surface-subtle), var(--surface-subtle)), var(--surface-default);
}
.cm--cards .cm__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  padding-top: var(--space-16);
}
.cm--cards .cm__section,
.cm--cards .cm__confirm {
  padding: var(--space-20);
  border-radius: var(--radius-16);
  background: var(--surface-default);
}
.cm--cards .cm__title {
  margin-bottom: var(--space-16);
  font-size: var(--font-size-20);
  font-weight: var(--font-weight-semibold);
  line-height: var(--font-line-height-28);
}
.cm--cards .cm__order {
  gap: var(--space-12);
  margin: var(--space-12) 0;
}
/* Cards of the order block join the same language: no border, radius 16 (white on the tint). */
.cm--cards :deep(.order--split .order__summary),
.cm--cards :deep(.mo) {
  border-color: transparent;
  border-radius: var(--radius-16);
}

/* ---------- 4. steps: numbered sections, a line on the left joins them ---------- */
.cm--steps .cm__form {
  padding-top: var(--space-32);
  counter-reset: cm-step;
}
.cm--steps .cm__section {
  position: relative;
  padding: 0 0 var(--space-32) var(--space-40);
}
/* Number circle 28 in the 40 gutter: outline + digit in text/primary (no fill — fills may be the shop colour). */
.cm--steps .cm__title {
  display: flex;
  align-items: center;
  min-height: var(--space-28);
  margin-bottom: var(--space-16);
  font-size: var(--font-size-20);
  line-height: var(--font-line-height-28);
  counter-increment: cm-step;
}
.cm--steps .cm__title::before {
  content: counter(cm-step);
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-28);
  height: var(--space-28);
  border: 1.5px solid currentColor;
  border-radius: var(--radius-full);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
}
/* The line: from under the circle down to the next section, centred on the circle (13.25 = (28 − 1.5) / 2). */
.cm--steps .cm__section:has(> .cm__title)::before {
  content: '';
  position: absolute;
  top: calc(var(--space-28) + var(--space-4));
  bottom: var(--space-4);
  left: 13px;
  border-left: 1.5px solid var(--border-divider);
}
/* No line under the last numbered section (Оплата in the full order, Одержувач in the quick one). */
.cm--steps .cm__section:has(> .cm__title):not(:has(~ .cm__section > .cm__title))::before {
  content: none;
}
.cm--steps .cm__confirm {
  padding-left: var(--space-40);
}
/* The comment button sits in the 40-indented column (303 wide): text 15 keeps «icon + label» on one line. */
.cm--steps .cm__comment-btn {
  font-size: var(--font-size-15);
}
</style>
