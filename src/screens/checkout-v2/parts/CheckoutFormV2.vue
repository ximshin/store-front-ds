<script setup lang="ts">
// Local block of /checkout-v2: the full form (Figma Checkout-v2 «Checkout — DS» 1:1048, frame «form»).
// No frame and no fill — the form lies on the page background, sections divided by border/divider.
// Recipient — RecipientFields (shared with the quick order). Delivery: Країна, Місто (select),
// delivery method and payment — Select Size=rich (name + logo / second line), branch + map.
// Wired to the same mock store as /checkout (src/data/checkout.ts).
import { computed, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import {
  Input, Select, SelectRichOption, SectionTitle, ButtonFront, Icon, CheckoutConfirm,
} from '../../../main';
import {
  checkout, deliveryOptions, paymentOptions, countries, popularCountries, cities, deliveryOption, paymentOption, isEmpty,
  setDelivery, setPayment, validateField, validateFields, clearError, submitOrder, logout, type FormField,
} from '../../../data/checkout';
import { showToast } from '../../../data/toast';
import RecipientFields from './RecipientFields.vue';
import CommentSection from './CommentSection.vue';
import SingleOption from './SingleOption.vue';

// single (/checkout-v2-single): the shop has one delivery and one payment method — shown as static text.
// labels left (/checkout-v2-labels-left): field labels in a column on the left (DS Label position=Left); elements
// without a label (payment, links, notes, confirm) carry .form__indent and line up with the fields (screen CSS).
// commentBottom (/checkout-v2-comment): the comment is its own section after «Оплата» (CommentSection, Figma 85:3784).
// parts (/checkout-v2-paycol, /checkout-v2-three): which blocks this instance renders — the screen splits the form
// across columns (several instances share the store). accordion (/checkout-v2-accordion): one section open at a time.
export type FormPart = 'recipient' | 'delivery' | 'payment' | 'comment' | 'confirm';
const props = withDefaults(defineProps<{ parts?: FormPart[]; accordion?: boolean; single?: boolean; labels?: 'top' | 'left'; narrow?: boolean; commentBottom?: boolean; patronymicBelow?: boolean; contactsFirst?: boolean; gated?: boolean; paymentLogo?: boolean }>(), { parts: undefined, accordion: false, single: false, labels: 'top', narrow: false, commentBottom: false, patronymicBelow: false, contactsFirst: false, gated: false, paymentLogo: false });
// paymentLogo (/checkout-v2-steps): payment options without the icon on the left; a brand mark (monobank) goes to the
// right of the title, as the carrier logo in delivery.
const brandIcon = (icon: string) => (icon === 'payment-24' ? '' : icon);
// gated (/checkout-v2-steps, as /checkout-mobile): the city appears once a country is chosen; delivery, branch / address
// and payment stay disabled until the city is chosen.
const locked = computed(() => props.gated && !f.city.trim());

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
// A single remaining method (instalments → only Nova Poshta, pickup → only cash) counts as chosen: the branch field
// shows and the «Оберіть…» check passes.
watch(deliveryStatic, (v) => { if (v) f.deliveryPicked = true; }, { immediate: true });
watch(paymentStatic, (v) => { if (v) f.paymentPicked = true; }, { immediate: true });
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
const has = (part: FormPart) => !props.parts || props.parts.includes(part);

/*
 * accordion (/checkout-v2-accordion, ref. briefs/checkout/refs-desktop/ui-accordion-41.png): sections 0 Одержувач,
 * 1 Доставка, 2 Оплата. One is open (step); the ones already passed (index < reached) collapse into a summary line
 * with «Змінити»; the ones ahead show only a muted title. «Далі» checks the section's fields and opens the next one not
 * passed yet. The comment and the confirm block appear once «Оплата» is reached.
 */
const step = ref(0);
const reached = ref(0);
const stepFields: FormField[][] = [['lastName', 'firstName', 'phone', 'email'], ['city', 'branch', 'courierAddress'], []];
const sectionEls = ref<HTMLElement[]>([]);
function stepState(i: number): 'open' | 'done' | 'todo' | undefined {
  if (!props.accordion) return undefined;
  if (i === step.value) return 'open';
  return i <= reached.value ? 'done' : 'todo';
}
const isOpen = (i: number) => !props.accordion || step.value === i;
function next(i: number) {
  if (!validateFields(stepFields[i])) return;
  reached.value = Math.max(reached.value, i + 1);
  step.value = reached.value;
  sectionEls.value[step.value]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function edit(i: number) {
  step.value = i;
}
const recipientSummary = computed(() =>
  [[f.lastName, f.firstName, f.patronymic].filter(Boolean).join(' '), f.phone, f.email].filter(Boolean).join(' · '),
);
const deliverySummary = computed(() =>
  [deliveryOption.value.name, f.city, f.delivery === 'courier' ? f.courierAddress : f.branch].filter(Boolean).join(' · '),
);
const tail = computed(() => !props.accordion || reached.value >= 2);

function showMap() {
  showToast('info', 'Карта відділень з’явиться в наступній версії');
}
</script>

<template>
  <div class="form" :class="{ 'form--left': labels === 'left', 'form--accordion': accordion }">
    <section v-if="has('recipient')" :ref="(el) => (sectionEls[0] = el as HTMLElement)" class="form__section" :class="stepState(0) && `form__section--${stepState(0)}`">
      <SectionTitle class="form__head" size="m" title="Одержувач замовлення">
        <template #action>
          <ButtonFront v-if="stepState(0) === 'done'" type="flat" size="m" label="Змінити" @click="edit(0)" />
          <template v-else-if="stepState(0) === 'todo'" />
          <ButtonFront v-else-if="!checkout.loggedIn" type="flat" size="m" label="Увійти" show-left-icon @click="router.push('/checkout-login')">
            <template #left><Icon name="user-24" /></template>
          </ButtonFront>
          <ButtonFront v-else type="flat" size="m" label="Вийти" show-left-icon @click="logout">
            <template #left><Icon name="logout-24" /></template>
          </ButtonFront>
        </template>
      </SectionTitle>
      <template v-if="isOpen(0)">
        <RecipientFields :labels="labels" :comment="!commentBottom" :patronymic-below="patronymicBelow" :contacts-first="contactsFirst" />
        <div v-if="accordion" class="form__next">
          <ButtonFront type="primary" size="l" label="Далі" @click="next(0)" />
        </div>
      </template>
      <p v-else-if="stepState(0) === 'done'" class="form__summary ds-text-paragraph-p1">{{ recipientSummary }}</p>
    </section>

    <section v-if="has('delivery')" :ref="(el) => (sectionEls[1] = el as HTMLElement)" class="form__section" :class="stepState(1) && `form__section--${stepState(1)}`">
      <SectionTitle class="form__head" size="m" title="Доставка" :show-action="stepState(1) === 'done'">
        <template #action><ButtonFront type="flat" size="m" label="Змінити" @click="edit(1)" /></template>
      </SectionTitle>
      <p v-if="!isOpen(1) && stepState(1) === 'done'" class="form__summary ds-text-paragraph-p1">{{ deliverySummary }}</p>
      <div v-if="isOpen(1)" class="form__items">
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
          :class="{ 'is-empty': !f.deliveryPicked }"
          :disabled="locked"
          :label-position="labels"
          label="Спосіб доставки"
          :placeholder="f.deliveryPicked ? deliveryOption.name : 'Оберіть спосіб доставки'"
          :sub="f.deliveryPicked ? deliveryOption.sub : ''"
        >
          <template v-if="f.deliveryPicked && deliveryOption.logo" #logo><img :src="deliveryOption.logo" alt="" width="16" height="16" /></template>
          <template #list>
            <SelectRichOption
              v-for="d in deliveryList"
              :key="d.id"
              :title="d.name"
              :sub="d.sub"
              :checked="f.deliveryPicked && d.id === f.delivery"
              @click="pickDelivery(d.id)"
            >
              <template v-if="d.logo" #logo><img :src="d.logo" alt="" width="16" height="16" /></template>
            </SelectRichOption>
          </template>
        </Select>
        <!-- Only one delivery method: static text with the label, the branch field stays below. -->
        <p v-if="e.deliveryPicked" class="form__indent form__error ds-text-special-special-12-regular">{{ e.deliveryPicked }}</p>
        <SingleOption v-if="deliveryStatic" :filled="single" :label-position="labels" label="Спосіб доставки" :title="deliveryOption.name" :sub="deliveryOption.sub" :logo="deliveryOption.logo" :note="deliveryNote" />
        <!-- Not chosen yet (gated): no branch / address / pickup note until a method is picked. -->
        <div v-if="f.deliveryPicked && deliveryOption.branches" class="form__address">
          <div class="form__grow">
            <Select v-model:show-list="open.branch" class="form__list" :class="{ 'is-empty': !f.branch }" size="l" :disabled="locked" :label-position="labels" label="Відділення" :placeholder="f.branch || 'Оберіть відділення'">
              <template #list>
                <SelectRichOption v-for="b in deliveryOption.branches" :key="b" :title="b" sub="" :checked="b === f.branch" @click="pickBranch(b)" />
              </template>
            </Select>
            <p v-if="e.branch" class="form__indent form__error ds-text-special-special-12-regular">{{ e.branch }}</p>
          </div>
          <!-- narrow (fields 400): icon only, a square 40 next to the branch field; the field is shorter by the button + gap, the row keeps the common right edge. -->
          <ButtonFront type="default" size="l" label="Обрати на мапі" :disabled="locked" show-left-icon :show-label="!narrow" :aria-label="narrow ? 'Обрати на мапі' : undefined" :title="narrow ? 'Обрати на мапі' : undefined" @click="showMap">
            <template #left><Icon name="location-stroke" /></template>
          </ButtonFront>
        </div>
        <Input
          v-else-if="f.deliveryPicked && f.delivery === 'courier'"
          v-model="f.courierAddress"
          size="l"
          :disabled="locked"
          :label-position="labels"
          label="Адреса доставки"
          placeholder="Вулиця, будинок, квартира"
          :error="!!e.courierAddress"
          :hint="e.courierAddress"
          @focusout="validateField('courierAddress')"
        />
        <p v-else-if="f.deliveryPicked" class="form__indent form__note ds-text-paragraph-p1">Магазин: Київ, вул. Велика Васильківська, 72 · Пн–Сб 10:00–20:00</p>
        <div v-if="accordion" class="form__next">
          <ButtonFront type="primary" size="l" label="Далі" @click="next(1)" />
        </div>
      </div>
    </section>

    <!-- Labels left: «Оплата» sits in the label column, on the level of the select (form__section--row). -->
    <section
      v-if="has('payment')"
      :ref="(el) => (sectionEls[2] = el as HTMLElement)"
      class="form__section"
      :class="[{ 'form__section--row': labels === 'left', 'form__section--locked': locked }, stepState(2) && `form__section--${stepState(2)}`]"
    >
      <SectionTitle class="form__head" size="m" title="Оплата" :show-action="false" />
      <div v-if="isOpen(2)" class="form__items">
        <!-- Payment — the same rich select as delivery: method / terms. -->
        <Select
          v-if="!paymentStatic"
          v-model:show-list="open.payment"
          size="rich"
          :disabled="locked"
          :show-label="false"
          :placeholder="f.paymentPicked ? paymentOption.label : 'Оберіть спосіб оплати'"
          :sub="f.paymentPicked ? paymentSub : ''"
        >
          <template v-if="f.paymentPicked && !paymentLogo" #icon><Icon :name="paymentOption.icon" :size="16" /></template>
          <template v-if="f.paymentPicked && paymentLogo && brandIcon(paymentOption.icon)" #logo><Icon :name="brandIcon(paymentOption.icon)" :size="16" /></template>
          <template #list>
            <SelectRichOption
              v-for="p in paymentList"
              :key="p.id"
              :title="p.label"
              :sub="p.sub"
              :checked="f.paymentPicked && p.id === f.payment"
              @click="pickPayment(p.id)"
            >
              <template v-if="!paymentLogo" #icon><Icon :name="p.icon" :size="16" /></template>
              <template v-if="paymentLogo && brandIcon(p.icon)" #logo><Icon :name="brandIcon(p.icon)" :size="16" /></template>
            </SelectRichOption>
          </template>
        </Select>
        <!-- Only one payment method: static text, no select (research_single_option.md). -->
        <p v-if="e.paymentPicked" class="form__indent form__error ds-text-special-special-12-regular">{{ e.paymentPicked }}</p>
        <SingleOption v-if="paymentStatic" :filled="single" :title="paymentOption.label" :sub="paymentSub" :icon="paymentLogo ? undefined : paymentOption.icon" :note="paymentNote" />
      </div>
    </section>

    <CommentSection v-if="commentBottom && has('comment') && tail" :labels="labels" />

    <CheckoutConfirm
      v-if="has('confirm') && tail"
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

/* ---------- accordion (/checkout-v2-accordion) ---------- */
.form__next {
  display: flex;
  padding-top: var(--space-24);
}
.form__summary {
  margin: 0;
  color: var(--text-secondary);
}
.form__section--todo :deep(.ds-section-title__text) {
  color: var(--text-secondary);
}
</style>
