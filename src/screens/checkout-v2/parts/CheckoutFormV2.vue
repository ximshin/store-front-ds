<script setup lang="ts">
// Local block of /checkout-v2: the full form (Figma Checkout-v2 «Checkout — DS» 1:1048, frame «form»).
// No frame and no fill — the form lies on the page background, sections divided by border/divider.
// Recipient — RecipientFields (shared with the quick order). Delivery: Країна, Місто (select),
// delivery method and payment — Select Size=rich (name + logo / second line), branch + map.
// Wired to the same mock store as /checkout (src/data/checkout.ts).
import { computed, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import {
  Input, Select, SelectRichOption, SectionTitle, ButtonFront, Icon, CheckoutConfirm,
} from '../../../main';
import {
  checkout, deliveryOptions, paymentOptions, countries, popularCountries, cities, deliveryOption, paymentOption, isEmpty,
  setDelivery, setPayment, validateField, clearError, submitOrder, logout,
} from '../../../data/checkout';
import { showToast } from '../../../data/toast';
import RecipientFields from './RecipientFields.vue';
import CommentSection from './CommentSection.vue';
import SingleOption from './SingleOption.vue';

// single (/checkout-v2-single): the shop has one delivery and one payment method — shown as static text.
// labels left (/checkout-v2-labels-left): field labels in a column on the left (DS Label position=Left); elements
// without a label (payment, links, notes, confirm) carry .form__indent and line up with the fields (screen CSS).
// commentBottom (/checkout-v2-comment): the comment is its own section after «Оплата» (CommentSection, Figma 85:3784).
const props = withDefaults(defineProps<{ single?: boolean; labels?: 'top' | 'left'; narrow?: boolean; commentBottom?: boolean }>(), { single: false, labels: 'top', narrow: false, commentBottom: false });

const router = useRouter();
const f = checkout.form;
const e = checkout.errors;
const open = ref({ country: false, city: false, delivery: false, branch: false, payment: false });

/*
 * Searchable «Країна» / «Місто» as in the reference checkout (briefs/checkout/reference_country_city.md):
 * - Країна: focus opens the favourite countries (popularCountries; differs from the reference, as /checkout-mobile);
 *   search from the 1st character; leaving without a pick — back to the country;
 *   «Наприклад, Україна» under the field. No country — no «Місто».
 * - Місто: focus opens the favourites (cities[].popular); search from the 3rd character («Для пошуку введіть мінімум
 *   3 символи» in the empty field); nothing found — the list hides; leaving the field keeps the text as a custom city.
 * Matching — the start of any word («біла» / «церк»), names starting with the query go first.
 * Cities are known only for Україна; for another country «Місто» is a plain input.
 */
const CITY_MIN_CHARS = 3;
const countryQuery = ref('');
const cityQuery = ref('');
const norm = (s: string) => s.toLowerCase().replace(/[’ʼ'`]/g, '').trim();
function search(list: string[], q: string): string[] {
  const n = norm(q);
  return list
    .filter((x) => norm(x).split(/[\s-]+/).some((w) => w.startsWith(n)) || norm(x).startsWith(n))
    .sort((a, b) => Number(norm(b).startsWith(n)) - Number(norm(a).startsWith(n)));
}
/** Nothing typed — the favourites; a chosen country outside them goes first (as /checkout-mobile). */
const countryList = computed(() => {
  if (countryQuery.value.trim()) return search(countries, countryQuery.value);
  return f.country && !popularCountries.includes(f.country) ? [f.country, ...popularCountries] : popularCountries;
});
const cityList = computed(() =>
  cityQuery.value.trim().length >= CITY_MIN_CHARS
    ? search(cities.map((c) => c.name), cityQuery.value)
    : cities.filter((c) => c.popular).map((c) => c.name),
);
const cityKnown = computed(() => f.country === 'Україна');

function pickCountry(name: string) {
  if (name !== f.country) f.city = '';
  f.country = name;
  open.value.country = false;
}
function pickFirstCountry() {
  if (countryQuery.value.trim() && countryList.value.length) pickCountry(countryList.value[0]);
}
/** Custom city (text left in the field) or the cleared field — the list state is the Select's business. */
function setCity(c: string) {
  f.city = c;
  clearError('city');
}
function pickFirstCity() {
  if (cityList.value.length) pickCity(cityList.value[0]);
}

/*
 * Dependencies between delivery and payment (/checkout-v2 only):
 * - «Самовивіз з магазину» → payment only on receipt (paid in the shop, no carrier fee);
 * - «Покупка частинами» (monobank) → delivery only by Нова Пошта (the bank needs a tracked parcel).
 * When one option is left, it is shown as static text with the reason (research_single_option.md).
 * No dead end: the other list stays a select — changing it brings the full list back.
 */
const deliveryList = computed(() => (f.payment === 'parts' ? deliveryOptions.filter((d) => d.id === 'np') : deliveryOptions));
const paymentList = computed(() => (f.delivery === 'pickup' ? paymentOptions.filter((p) => p.id === 'cod') : paymentOptions));
watchEffect(() => {
  if (!deliveryList.value.some((d) => d.id === f.delivery)) setDelivery(deliveryList.value[0].id);
  if (!paymentList.value.some((p) => p.id === f.payment)) setPayment(paymentList.value[0].id);
});
const deliveryStatic = computed(() => props.single || deliveryList.value.length === 1);
const paymentStatic = computed(() => props.single || paymentList.value.length === 1);
const deliveryNote = computed(() =>
  !props.single && deliveryList.value.length === 1 ? 'Для «Покупки частинами» доступна лише доставка Новою Поштою' : '',
);
const paymentNote = computed(() =>
  !props.single && paymentList.value.length === 1 ? 'Для самовивозу доступна лише оплата при отриманні' : '',
);
/** Cash on receipt at the shop has no carrier fee — the second line follows the delivery. */
const paymentSub = computed(() =>
  f.payment === 'cod' && f.delivery === 'pickup' ? 'Оплата в магазині, без комісії' : paymentOption.value.sub,
);

function pickCity(c: string) {
  f.city = c;
  open.value.city = false;
  clearError('city');
}
function pickDelivery(id: typeof f.delivery) {
  setDelivery(id);
  open.value.delivery = false;
}
function pickBranch(b: string) {
  f.branch = b;
  open.value.branch = false;
  clearError('branch');
}
function pickPayment(id: typeof f.payment) {
  setPayment(id);
  open.value.payment = false;
}
async function onSubmit() {
  if (await submitOrder()) router.push('/checkout-success');
}
function showMap() {
  showToast('info', 'Карта відділень з’явиться в наступній версії');
}
</script>

<template>
  <div class="form" :class="{ 'form--left': labels === 'left' }">
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
      <RecipientFields :labels="labels" :comment="!commentBottom" />
    </section>

    <section class="form__section">
      <SectionTitle class="form__head" size="m" title="Доставка" :show-action="false" />
      <div class="form__items">
        <!-- Країна: search right in the field. -->
        <Select
          v-model:show-list="open.country"
          v-model:query="countryQuery"
          searchable
          class="form__list"
          size="l"
          :label-position="labels"
          label="Країна"
          :model-value="f.country"
          placeholder="Введіть назву своєї країни"
          :list-empty="!countryList.length"
          @enter="pickFirstCountry"
          @clear="f.country = ''; f.city = ''"
        >
          <template #list>
            <SelectRichOption v-for="c in countryList" :key="c" :title="c" sub="" :checked="c === f.country" @click="pickCountry(c)" />
          </template>
        </Select>
        <p class="form__indent form__example ds-text-special-special-12-regular">
          Наприклад, <button type="button" class="form__example-link" @click="pickCountry('Україна')">Україна</button>
        </p>
        <!-- Figma: Select Size=M (32) next to L inputs — taken as a mock slip, L (40) as the other fields. -->
        <div v-if="cityKnown">
          <!-- Search right in the field; nothing typed — the popular cities. -->
          <Select
            v-model:show-list="open.city"
            v-model:query="cityQuery"
            searchable
            class="form__list"
            size="l"
            :label-position="labels"
            label="Місто"
            :model-value="f.city"
            placeholder="Назва міста"
            search-placeholder="Для пошуку введіть мінімум 3 символи"
            allow-custom
            :list-empty="!cityList.length"
            @update:model-value="setCity"
            @enter="pickFirstCity"
            @clear="f.city = ''"
          >
            <template #list>
              <SelectRichOption v-for="c in cityList" :key="c" :title="c" sub="" :checked="c === f.city" @click="pickCity(c)" />
            </template>
          </Select>
          <p v-if="e.city" class="form__indent form__error ds-text-special-special-12-regular">{{ e.city }}</p>
        </div>
        <div v-else-if="f.country">
          <Input v-model="f.city" size="l" :label-position="labels" label="Місто" placeholder="Місто" :error="!!e.city" :hint="e.city" @focusout="validateField('city')" />
        </div>
        <Select
          v-if="!deliveryStatic"
          v-model:show-list="open.delivery"
          size="rich"
          :label-position="labels"
          label="Спосіб доставки"
          :placeholder="deliveryOption.name"
          :sub="deliveryOption.sub"
        >
          <template v-if="deliveryOption.logo" #logo><img :src="deliveryOption.logo" alt="" width="16" height="16" /></template>
          <template #list>
            <SelectRichOption
              v-for="d in deliveryList"
              :key="d.id"
              :title="d.name"
              :sub="d.sub"
              :checked="d.id === f.delivery"
              @click="pickDelivery(d.id)"
            >
              <template v-if="d.logo" #logo><img :src="d.logo" alt="" width="16" height="16" /></template>
            </SelectRichOption>
          </template>
        </Select>
        <!-- Only one delivery method: static text with the label, the branch field stays below. -->
        <SingleOption v-else :filled="single" :label-position="labels" label="Спосіб доставки" :title="deliveryOption.name" :sub="deliveryOption.sub" :logo="deliveryOption.logo" :note="deliveryNote" />
        <div v-if="deliveryOption.branches" class="form__address">
          <div class="form__grow">
            <Select v-model:show-list="open.branch" class="form__list" size="l" :label-position="labels" label="Відділення" :placeholder="f.branch || 'Оберіть відділення'">
              <template #list>
                <SelectRichOption v-for="b in deliveryOption.branches" :key="b" :title="b" sub="" :checked="b === f.branch" @click="pickBranch(b)" />
              </template>
            </Select>
            <p v-if="e.branch" class="form__indent form__error ds-text-special-special-12-regular">{{ e.branch }}</p>
          </div>
          <!-- narrow (fields 400): icon only, a square 40 next to the branch field; the field is shorter by the button + gap, the row keeps the common right edge. -->
          <ButtonFront type="default" size="l" label="Обрати на мапі" show-left-icon :show-label="!narrow" :aria-label="narrow ? 'Обрати на мапі' : undefined" :title="narrow ? 'Обрати на мапі' : undefined" @click="showMap">
            <template #left><Icon name="location-stroke" /></template>
          </ButtonFront>
        </div>
        <Input
          v-else-if="f.delivery === 'courier'"
          v-model="f.courierAddress"
          size="l"
          :label-position="labels"
          label="Адреса доставки"
          placeholder="Вулиця, будинок, квартира"
          :error="!!e.courierAddress"
          :hint="e.courierAddress"
          @focusout="validateField('courierAddress')"
        />
        <p v-else class="form__indent form__note ds-text-paragraph-p1">Магазин: Київ, вул. Велика Васильківська, 72 · Пн–Сб 10:00–20:00</p>
      </div>
    </section>

    <!-- Labels left: «Оплата» sits in the label column, on the level of the select (form__section--row). -->
    <section class="form__section" :class="{ 'form__section--row': labels === 'left' }">
      <SectionTitle class="form__head" size="m" title="Оплата" :show-action="false" />
      <div class="form__items">
        <!-- Payment — the same rich select as delivery: method / terms. -->
        <Select
          v-if="!paymentStatic"
          v-model:show-list="open.payment"
          size="rich"
          :show-label="false"
          :placeholder="paymentOption.label"
          :sub="paymentSub"
        >
          <template #icon><Icon :name="paymentOption.icon" :size="16" /></template>
          <template #list>
            <SelectRichOption
              v-for="p in paymentList"
              :key="p.id"
              :title="p.label"
              :sub="p.sub"
              :checked="p.id === f.payment"
              @click="pickPayment(p.id)"
            >
              <template #icon><Icon :name="p.icon" :size="16" /></template>
            </SelectRichOption>
          </template>
        </Select>
        <!-- Only one payment method: static text, no select (research_single_option.md). -->
        <SingleOption v-else :filled="single" :title="paymentOption.label" :sub="paymentSub" :icon="paymentOption.icon" :note="paymentNote" />
      </div>
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
/* Figma «form» 1:1063: no fill, no stroke (both hidden) — sections on the page background. */
.form__section {
  display: flex;
  flex-direction: column;
  padding: var(--space-16) 0;
  border-bottom: var(--stroke-thin) solid var(--border-divider);
}
/* Figma: SectionTitle M instances FIXED 40 (the action does not set the height any more). */
.form__head.ds-section-title {
  min-height: var(--space-40);
}
.form__items {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}
/* Labels left: the section title in the label column (--form-label-w), its 20 px line centred on the select's first
   text line (rich field: text from 14, line 16 → title from 12); the select takes the field column. */
.form__section--row {
  flex-direction: row;
  align-items: flex-start;
}
.form__section--row > .form__head.ds-section-title {
  flex: none;
  box-sizing: border-box;
  width: var(--form-label-w);
  min-height: 0;
  padding: var(--space-12) var(--space-8) 0 0;
}
.form__section--row > .form__items {
  flex: 1 1 0;
  min-width: 0;
}
/* City and branch lists — rows flush, as the rich lists (Select size=rich does the same for its menu). */
.form__list :deep(.ds-input-main__menu) {
  padding: 0;
  overflow-x: hidden;
}
/* «Наприклад, Україна» under the country (reference): a quiet hint, the country is a dotted pseudo-link. */
.form__example {
  margin: calc(-1 * var(--space-12)) 0 0;
  color: var(--text-secondary);
}
.form__example-link {
  margin: 0;
  padding: 0;
  border: 0;
  border-bottom: var(--stroke-thin) dashed currentColor;
  background: none;
  color: var(--text-primary);
  font: inherit;
  cursor: pointer;
}
.form__address {
  display: flex;
  align-items: flex-start;
  gap: var(--space-8);
}
/* The branch select has a visible label («Відділення», research_select_icons_labels.md): the map button lines up
   with the field — label line 16 + its bottom padding 4 (Select L). An error under the field does not move it. */
.form__address > :deep(.ds-button-wrap) {
  margin-top: calc(var(--font-line-height-16) + var(--space-4));
}
.form__grow {
  flex: 1 1 0;
  min-width: 0;
}
.form__error {
  margin: var(--space-4) 0 0;
  color: var(--text-danger);
}
.form__note {
  margin: 0;
  color: var(--text-secondary);
}
/* CheckoutConfirm on the bare background: no own frame, no side padding (as the sections). */
.form__confirm {
  border: 0;
  background: none;
  padding-left: 0;
  padding-right: 0;
}
@media (max-width: 600px) {
  .form__section--row {
    flex-direction: column;
    align-items: stretch;
  }
  .form__section--row > .form__head.ds-section-title {
    width: auto;
    min-height: var(--space-40);
    padding: 0 0 var(--space-8);
  }
  .form__address {
    flex-direction: column;
    align-items: stretch;
  }
  .form__address > :deep(.ds-button-wrap) {
    margin-top: 0;
  }
}
</style>
