// Local form state of /checkout-mobile. Logic follows the shop's current mobile checkout
// (shop349369.horoshop.ua/checkout/?v=mobile): the form starts empty; «Місто» waits for «Країна»;
// «Доставка» and «Оплата» wait for the city; «Оформити замовлення» waits for the terms checkbox.
// The cart, coupons and totals come from the shared mock store (src/data/checkout.ts); the delivery choice
// is synced into it (setDelivery / setPayment) so the order total follows.
import { computed, reactive } from 'vue';
import {
  checkout, deliveryOptions, paymentOptions, setDelivery, setPayment, isEmpty, lineSum, total,
  type DeliveryId, type PaymentId,
} from '../../../data/checkout';
import { delay, money } from '../../../data/format';
import * as v from '../../../data/validation';
import { showToast } from '../../../data/toast';

export type MobileMode = 'full' | 'quick';
type Field = 'lastName' | 'firstName' | 'phone' | 'email' | 'country' | 'city' | 'branch' | 'address' | 'comment';

/** Quick choice in the country sheet before typing; the search looks through `countryOptions`. */
export const popularCountries = ['Україна', 'Польща', 'Молдова', 'Німеччина', 'Чехія'];
export const countryOptions = [
  'Австрія', 'Бельгія', 'Болгарія', 'Велика Британія', 'Грузія', 'Данія', 'Естонія', 'Ізраїль', 'Іспанія', 'Італія',
  'Канада', 'Латвія', 'Литва', 'Молдова', 'Нідерланди', 'Німеччина', 'Норвегія', 'Польща', 'Португалія', 'Румунія',
  'Словаччина', 'США', 'Туреччина', 'Угорщина', 'Україна', 'Фінляндія', 'Франція', 'Хорватія', 'Чехія', 'Швейцарія', 'Швеція',
];
/** Cities by country (mock). The first five are the quick choice before typing, as on the reference. */
export const citiesByCountry: Record<string, string[]> = {
  Україна: [
    'Київ', 'Харків', 'Дніпро', 'Одеса', 'Львів', 'Запоріжжя', 'Вінниця', 'Полтава', 'Чернігів', 'Ужгород',
    'Біла Церква', 'Бровари', 'Житомир', 'Івано-Франківськ', 'Кропивницький', 'Луцьк', 'Миколаїв', 'Рівне',
    'Суми', 'Тернопіль', 'Ірпінь', 'Хмельницький', 'Черкаси', 'Чернівці',
  ],
  Польща: ['Варшава', 'Краків', 'Вроцлав', 'Гданськ', 'Познань'],
  Молдова: ['Кишинів', 'Бєльці', 'Кагул'],
  Німеччина: ['Берлін', 'Мюнхен', 'Гамбург', 'Франкфурт-на-Майні'],
  Чехія: ['Прага', 'Брно', 'Острава'],
  Словаччина: ['Братислава', 'Кошице'],
  Румунія: ['Бухарест', 'Клуж-Напока', 'Ясси'],
};
/** The other countries of the mock — the capital only. */
const capitals: Record<string, string> = {
  Австрія: 'Відень', Бельгія: 'Брюссель', Болгарія: 'Софія', 'Велика Британія': 'Лондон', Грузія: 'Тбілісі',
  Данія: 'Копенгаген', Естонія: 'Таллінн', Ізраїль: 'Єрусалим', Іспанія: 'Мадрид', Італія: 'Рим', Канада: 'Оттава',
  Латвія: 'Рига', Литва: 'Вільнюс', Нідерланди: 'Амстердам', Норвегія: 'Осло', Португалія: 'Лісабон', США: 'Вашингтон',
  Туреччина: 'Анкара', Угорщина: 'Будапешт', Фінляндія: 'Гельсінкі', Франція: 'Париж', Хорватія: 'Загреб',
  Швейцарія: 'Берн', Швеція: 'Стокгольм',
};
export function citiesOf(country: string): string[] {
  return citiesByCountry[country] ?? (capitals[country] ? [capitals[country]] : []);
}
/** Branches of the carriers by city — mock: the store's list for every city. */
export function branchesFor(delivery: DeliveryId): string[] {
  return deliveryOptions.find((d) => d.id === delivery)?.branches ?? [];
}

export const mobile = reactive({
  mode: 'full' as MobileMode,
  lastName: '',
  firstName: '',
  /** Optional, behind «Додати по батькові» (as /checkout-v2). */
  patronymic: '',
  showPatronymic: false,
  phone: '',
  email: '',
  country: '',
  city: '',
  showComment: false,
  comment: '',
  delivery: 'np' as DeliveryId,
  branch: '',
  address: '',
  payment: 'card' as PaymentId,
  newsletter: false,
  terms: false,
  errors: {} as Partial<Record<Field, string>>,
  submitting: false,
});

/** Delivery and payment open once the city is known (reference: the sections are dimmed before that). */
export const deliveryLocked = computed(() => !mobile.city);
export const delivery = computed(() => deliveryOptions.find((d) => d.id === mobile.delivery)!);
export const payment = computed(() => paymentOptions.find((p) => p.id === mobile.payment)!);
export const canSubmit = computed(() => mobile.terms && !isEmpty.value && !mobile.submitting);

export function pickCountry(c: string): void {
  if (c === mobile.country) return;
  mobile.country = c;
  mobile.city = '';
  mobile.branch = '';
  delete mobile.errors.country;
}
export function pickCity(c: string): void {
  mobile.city = c;
  mobile.branch = '';
  delete mobile.errors.city;
  // Reference: with the city chosen the carrier's first branch is preselected.
  mobile.branch = branchesFor(mobile.delivery)[0] ?? '';
}
export function pickDelivery(id: DeliveryId): void {
  mobile.delivery = id;
  mobile.branch = mobile.city ? branchesFor(id)[0] ?? '' : '';
  delete mobile.errors.branch;
  delete mobile.errors.address;
  setDelivery(id);
}
export function pickPayment(id: PaymentId): void {
  mobile.payment = id;
  setPayment(id);
}
export function pickBranch(b: string): void {
  mobile.branch = b;
  delete mobile.errors.branch;
}

function fieldError(f: Field): string {
  switch (f) {
    case 'lastName':
      return v.required(mobile.lastName, 'Вкажіть прізвище') || v.maxLength(mobile.lastName, 60);
    case 'firstName':
      return v.required(mobile.firstName, "Вкажіть ім'я") || v.maxLength(mobile.firstName, 60);
    case 'phone':
      return v.phone(mobile.phone);
    case 'email':
      return mobile.email.trim() ? v.email(mobile.email) : '';
    case 'country':
      return mobile.country ? '' : 'Оберіть країну';
    case 'city':
      return mobile.city ? '' : 'Оберіть місто';
    case 'branch':
      return delivery.value.branches && !mobile.branch ? 'Оберіть відділення' : '';
    case 'address':
      return mobile.delivery === 'courier' ? v.required(mobile.address, 'Вкажіть адресу доставки') : '';
    case 'comment':
      return v.maxLength(mobile.comment, 500);
  }
}
export function validateField(f: Field): void {
  const e = fieldError(f);
  if (e) mobile.errors[f] = e;
  else delete mobile.errors[f];
}
function validateAll(fields: Field[]): boolean {
  fields.forEach(validateField);
  return fields.every((f) => !mobile.errors[f]);
}

/** Submit of either tab. Returns true when placed — the caller routes to /checkout-success. */
export async function submitMobile(): Promise<boolean> {
  if (!canSubmit.value) return false;
  const quick = mobile.mode === 'quick';
  const fields: Field[] = quick
    ? ['lastName', 'firstName', 'phone', 'email']
    : ['lastName', 'firstName', 'phone', 'email', 'country', 'city', 'branch', 'address', 'comment'];
  if (!validateAll(fields)) {
    showToast('error', 'Перевірте поля, позначені червоним');
    return false;
  }
  mobile.submitting = true;
  await delay(1000);
  mobile.submitting = false;
  // Same mock failure as the desktop store: a phone ending with 000 fails.
  if (mobile.phone.replace(/\D/g, '').endsWith('000')) {
    showToast('error', 'Не вдалося оформити замовлення — перевірте зв’язок і спробуйте ще раз');
    return false;
  }
  const d = delivery.value;
  checkout.lastOrder = {
    kind: quick ? 'quick' : 'order',
    number: 4900 + Math.floor(Math.random() * 99),
    phone: mobile.phone,
    email: mobile.email,
    recipient: [mobile.lastName, mobile.firstName, mobile.showPatronymic ? mobile.patronymic : ''].map((x) => x.trim()).filter(Boolean).join(' '),
    delivery: quick
      ? ''
      : `${d.label}, ${mobile.city}${mobile.delivery === 'courier' ? `: ${mobile.address}` : mobile.branch ? `: ${mobile.branch}` : ''}`,
    payment: quick ? '' : payment.value.label,
    lines: checkout.lines.map((l) => ({
      title: l.type === 'bundle' ? (l.parts ?? []).map((p) => p.title).join(' + ') : l.title,
      qty: l.qty,
      sum: money(lineSum(l)),
    })),
    total: money(total.value),
  };
  return true;
}
