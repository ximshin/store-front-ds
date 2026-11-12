// Checkout mock data layer (directive_wire_vue). One reactive store: cart, promo codes, delivery / payment,
// recipient form, validation, order submit, quick order, login. No backend — `delay()` imitates the network.
import { reactive, computed, watch } from 'vue';
import { money, delay } from './format';
import * as v from './validation';
import { showToast } from './toast';
// Product photos — from the DS CartItem image set (Figma), src/assets/products.
import imgAirpods from '../assets/products/airpods.png';
import imgTshirtNavy from '../assets/products/tshirt-navy.png';
import imgOveralls from '../assets/products/overalls.png';
import imgIphone from '../assets/products/iphone.png';
import imgDress from '../assets/products/dress.png';
import imgCandle from '../assets/products/candle.png';
import imgTshirtBurgundy from '../assets/products/tshirt-burgundy.png';
import imgSweatshirt from '../assets/products/sweatshirt.png';
import imgMacbook from '../assets/products/macbook.png';

// ---------- types ----------
export interface BundlePart {
  title: string;
  oldPrice: number;
  price: number;
  image?: string;
}
export interface CartLine {
  id: string;
  type: 'product' | 'bundle';
  title: string;
  /** Crossed-out price (per unit). */
  oldPrice?: number;
  /** Price per unit with all item discounts applied. */
  price: number;
  /** Item discount that comes from the SMART10 promo code. */
  smart?: { label: string; amount: number };
  qty: number;
  minQty?: number;
  minOrderText?: string;
  /** Wholesale tier: from `minQty` units the price per unit is lower by `discount`. */
  wholesale?: { minQty: number; discount: number };
  electronic?: boolean;
  gift?: { title: string; oldPrice: number; image?: string };
  parts?: BundlePart[];
  /** Product photo (url). */
  image?: string;
}
export type DeliveryId = 'np' | 'up' | 'courier' | 'pickup';
export type PaymentId = 'card' | 'cod' | 'parts';
export type Mode = 'full' | 'quick';

export const deliveryOptions: { id: DeliveryId; label: string; branches?: string[] }[] = [
  {
    id: 'np',
    label: 'Новою поштою',
    branches: [
      'Відділення №1: вул. Пирогівський шлях, 135',
      'Відділення №12: вул. Хрещатик, 22',
      'Поштомат №23891: вул. Драгоманова, 4',
    ],
  },
  {
    id: 'up',
    label: 'Укрпоштою',
    branches: ['Відділення 01001: вул. Хрещатик, 22', 'Відділення 02068: просп. Бажана, 8'],
  },
  { id: 'courier', label: "Кур'єром по Києву" },
  { id: 'pickup', label: 'Самовивіз з магазину' },
];
export const paymentOptions: { id: PaymentId; label: string }[] = [
  { id: 'card', label: 'На карту Visa/MasterCard' },
  { id: 'cod', label: 'Готівкою при отриманні' },
  { id: 'parts', label: '«Покупка частинами» від monobank' },
];
const COURIER_PRICE = 150;
const PROMOS: Record<string, string> = {
  SMART10: 'Знижки smart на товари',
  WELCOME: 'Знижка 500 грн на перше замовлення',
  DISCOUNT5: 'Знижка 5% на замовлення',
};
const WELCOME_AMOUNT = 500;

/** Mock account used by the login modal (password: password1234). */
const ACCOUNT = {
  email: 'customer@poshta.com',
  lastName: 'Коваленко',
  firstName: 'Марина',
  phone: '+38 (067) 123-45-67',
  city: 'Київ',
};

// ---------- initial data (as on the Figma screen) ----------
function initialLines(): CartLine[] {
  return [
    {
      id: 'airpods',
      type: 'product',
      title: 'Навушники Apple AirPods Max, Space Gray',
      image: imgAirpods,
      oldPrice: 25999,
      price: 21999,
      qty: 2,
      // «додайте ще 3 одиниці та заощадьте 1 200 грн»: 5 × 240
      wholesale: { minQty: 5, discount: 240 },
    },
    {
      id: 'bundle-basic',
      type: 'bundle',
      title: 'Разом дешевше',
      price: 2948,
      qty: 1,
      parts: [
        { title: 'Футболка чоловіча Basic, темно-синя', oldPrice: 899, price: 749, image: imgTshirtNavy },
        { title: 'Комбінезон джинсовий жіночий Relaxed Fit, світло-блакитний', oldPrice: 2499, price: 2199, image: imgOveralls },
      ],
    },
    {
      id: 'iphone',
      type: 'product',
      title: 'Apple iPhone 15 Pro 128GB Natural Titanium',
      image: imgIphone,
      oldPrice: 49999,
      price: 47499,
      smart: { label: 'smart-5', amount: 2500 },
      qty: 2,
      minQty: 2,
      minOrderText: 'Замовлення від 2 шт.',
    },
    {
      id: 'dress',
      type: 'product',
      title: 'Сукня-футболка оверсайз, сіра',
      image: imgDress,
      oldPrice: 1290,
      price: 990,
      qty: 1,
      gift: { title: 'Свічка ароматична «№7» — подарунок', oldPrice: 450, image: imgCandle },
    },
    {
      id: 'bundle-autumn',
      type: 'bundle',
      title: 'Разом дешевше',
      price: 2248,
      qty: 1,
      parts: [
        { title: 'Футболка жіноча Slim, бордова', oldPrice: 799, price: 649, image: imgTshirtBurgundy },
        { title: 'Світшот «Хвилі», сірий меланж', oldPrice: 1899, price: 1599, image: imgSweatshirt },
      ],
    },
    {
      id: 'macbook',
      type: 'product',
      title: 'Apple MacBook Air 13 M3, 16/512GB, Midnight',
      image: imgMacbook,
      oldPrice: 64999,
      price: 61999,
      smart: { label: 'smart-10', amount: 3000 },
      qty: 1,
      minOrderText: 'Замовлення від 1 шт.',
    },
    {
      id: 'applecare',
      type: 'product',
      title: 'AppleCare+ для iPhone 15 Pro, 2 роки (електронний ключ)',
      image: imgIphone,
      oldPrice: 8999,
      price: 8099,
      smart: { label: 'smart-10', amount: 900 },
      qty: 1,
      electronic: true,
    },
  ];
}
function initialForm() {
  return {
    lastName: 'Шевченко',
    firstName: 'Олександр',
    phone: '+38 (066) 123-45-67',
    email: 'poshta@gmail.com',
    country: 'Україна',
    city: 'Київ',
    comment: '',
    showComment: false,
    delivery: 'np' as DeliveryId,
    branch: '',
    courierAddress: '',
    payment: 'card' as PaymentId,
    newsletter: false,
    terms: true,
  };
}
type FormField = keyof ReturnType<typeof initialForm>;

// ---------- store ----------
export const checkout = reactive({
  mode: 'full' as Mode,
  lines: initialLines(),
  promos: ['SMART10'] as string[],
  promoInputOpen: false,
  promoInput: '',
  promoError: '',
  form: initialForm(),
  errors: {} as Partial<Record<FormField, string>>,
  submitting: false,
  loggedIn: false,
  login: { email: 'customer@poshta.com', password: 'password1234', error: '', loading: false },
  /** Snapshot of the last placed order / quick request for the success screen. */
  lastOrder: null as null | {
    kind: 'order' | 'quick';
    number: number;
    phone: string;
    email: string;
    recipient: string;
    delivery: string;
    payment: string;
    lines: { title: string; qty: number; sum: string }[];
    total: string;
  },
});

// ---------- derived values ----------
/** Discounts (smart item discounts, WELCOME) do not apply to installments. */
// Quick order has no payment choice (the manager settles it) — the installments rule applies only to the full form.
export const discountsBlocked = computed(() => checkout.mode === 'full' && checkout.form.payment === 'parts');
const smartActive = computed(() => checkout.promos.includes('SMART10') && !discountsBlocked.value);

export function unitPrice(line: CartLine): number {
  const base = line.smart && !smartActive.value ? line.price + line.smart.amount : line.price;
  return line.wholesale && line.qty >= line.wholesale.minQty ? base - line.wholesale.discount : base;
}
function units(n: number): string {
  const d = n % 10, dd = n % 100;
  if (d === 1 && dd !== 11) return `${n} одиницю`;
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return `${n} одиниці`;
  return `${n} одиниць`;
}
/** Wholesale hint while the tier is not reached: «додайте ще 3 одиниці та заощадьте 1 200 грн». */
export function wholesaleHint(line: CartLine): string | undefined {
  if (!line.wholesale || line.qty >= line.wholesale.minQty) return undefined;
  const need = line.wholesale.minQty - line.qty;
  return `додайте ще ${units(need)} та заощадьте ${money(line.wholesale.minQty * line.wholesale.discount)}`;
}
/** Click on the hint: add the missing units to reach the wholesale price. */
export function addToWholesale(id: string): void {
  const line = checkout.lines.find((l) => l.id === id);
  if (!line?.wholesale || line.qty >= line.wholesale.minQty) return;
  const need = line.wholesale.minQty - line.qty;
  line.qty = line.wholesale.minQty;
  showToast('success', `Додано ${units(need)} — діє оптова ціна`);
}
export function showSmart(line: CartLine): boolean {
  return !!line.smart && smartActive.value;
}
export function lineSum(line: CartLine): number {
  return unitPrice(line) * line.qty;
}
export function bundleOldSum(line: CartLine): number {
  return (line.parts ?? []).reduce((s, p) => s + p.oldPrice, 0) * line.qty;
}

export const isEmpty = computed(() => checkout.lines.length === 0);
export const subtotal = computed(() => checkout.lines.reduce((s, l) => s + lineSum(l), 0));
/** Order-level codes (SMART10 works on items, not here). */
export const discountCodes = computed(() => checkout.promos.filter((c) => c === 'WELCOME' || c === 'DISCOUNT5'));
export const promoDiscount = computed(() => {
  if (discountsBlocked.value || isEmpty.value) return 0;
  let d = 0;
  if (checkout.promos.includes('WELCOME')) d += WELCOME_AMOUNT;
  if (checkout.promos.includes('DISCOUNT5')) d += Math.round(subtotal.value * 0.05);
  return d;
});
/** «Проміжна сума» in the summary — at prices before the smart discount (the discount is its own line). */
export const grossSubtotal = computed(() =>
  checkout.lines.reduce((s, l) => s + (showSmart(l) && l.smart ? l.price + l.smart.amount : unitPrice(l)) * l.qty, 0),
);
export const smartDiscount = computed(() =>
  checkout.lines.reduce((s, l) => s + (showSmart(l) && l.smart ? l.smart.amount * l.qty : 0), 0),
);
/** Summary discount lines, one per code (Figma: «SMART10  −500 грн»). */
export const discountLines = computed(() => {
  if (discountsBlocked.value || isEmpty.value) return [];
  const out: { label: string; amount: number }[] = [];
  if (smartDiscount.value > 0) out.push({ label: 'SMART10', amount: smartDiscount.value });
  if (checkout.promos.includes('WELCOME')) out.push({ label: 'WELCOME', amount: WELCOME_AMOUNT });
  if (checkout.promos.includes('DISCOUNT5')) out.push({ label: 'DISCOUNT5', amount: Math.round(subtotal.value * 0.05) });
  return out;
});
/** Flow «додати купон» (Figma 1903:76187): no codes → the field is shown right away; «Додати код» swaps the chips row for the field. */
export const promoFormVisible = computed(() => checkout.promoInputOpen || checkout.promos.length === 0);
export const deliveryOption = computed(() => deliveryOptions.find((d) => d.id === checkout.form.delivery)!);
export const paymentOption = computed(() => paymentOptions.find((p) => p.id === checkout.form.payment)!);
export const deliveryCost = computed(() =>
  checkout.form.delivery === 'courier' ? COURIER_PRICE : checkout.form.delivery === 'pickup' ? 0 : null,
);
export const deliveryText = computed(() =>
  deliveryCost.value === null ? 'за тарифами перевізника' : deliveryCost.value === 0 ? 'Безкоштовно' : money(deliveryCost.value),
);
export const total = computed(() => Math.max(0, subtotal.value - promoDiscount.value + (deliveryCost.value ?? 0)));

// ---------- cart actions ----------
export function setQty(id: string, qty: number): void {
  const line = checkout.lines.find((l) => l.id === id);
  if (line) line.qty = Math.max(line.minQty ?? 1, qty);
}
export function removeLine(id: string): void {
  const i = checkout.lines.findIndex((l) => l.id === id);
  if (i < 0) return;
  const [line] = checkout.lines.splice(i, 1);
  showToast('info', `«${line.type === 'bundle' ? 'Набір' : line.title}» видалено з кошика`);
}

// ---------- promo codes ----------
export function applyPromo(): void {
  const code = checkout.promoInput.trim().toUpperCase();
  if (!code) {
    checkout.promoError = 'Введіть код';
    return;
  }
  if (!PROMOS[code]) {
    checkout.promoError = 'Неправильний код';
    return;
  }
  if (checkout.promos.includes(code)) {
    checkout.promoError = 'Цей код уже застосовано';
    return;
  }
  checkout.promos.push(code);
  checkout.promoInput = '';
  checkout.promoError = '';
  checkout.promoInputOpen = false;
  showToast('success', `Промокод ${code} застосовано`);
}
export function removePromo(code: string): void {
  checkout.promos = checkout.promos.filter((c) => c !== code);
}
export function openPromoInput(): void {
  checkout.promoInputOpen = true;
  checkout.promoError = '';
}
/** Back to the chips row — only when there is something to show there. */
export function closePromoInput(): void {
  if (!checkout.promos.length) return;
  checkout.promoInputOpen = false;
  checkout.promoInput = '';
  checkout.promoError = '';
}

// ---------- delivery / payment ----------
export function setDelivery(id: DeliveryId): void {
  checkout.form.delivery = id;
  checkout.form.branch = '';
  delete checkout.errors.branch;
  delete checkout.errors.courierAddress;
}
export function setPayment(id: PaymentId): void {
  checkout.form.payment = id;
}

// ---------- validation ----------
function fieldError(field: FormField): string {
  const f = checkout.form;
  switch (field) {
    case 'lastName':
      return v.required(f.lastName, 'Вкажіть прізвище') || v.maxLength(f.lastName, 60);
    case 'firstName':
      return v.required(f.firstName, "Вкажіть ім'я") || v.maxLength(f.firstName, 60);
    case 'phone':
      return v.phone(f.phone);
    case 'email':
      return v.email(f.email);
    case 'city':
      return v.required(f.city, 'Вкажіть місто');
    case 'comment':
      return v.maxLength(f.comment, 500);
    case 'branch':
      return deliveryOption.value.branches ? v.required(f.branch, 'Оберіть відділення') : '';
    case 'courierAddress':
      return checkout.form.delivery === 'courier' ? v.required(f.courierAddress, 'Вкажіть адресу доставки') : '';
    default:
      return '';
  }
}
/** Validate one field (on blur / on change) — shows only real errors. */
export function validateField(field: FormField): void {
  const e = fieldError(field);
  if (e) checkout.errors[field] = e;
  else delete checkout.errors[field];
}
function validateAll(fields: FormField[]): boolean {
  fields.forEach(validateField);
  return fields.every((f) => !checkout.errors[f]);
}
export function clearError(field: FormField): void {
  delete checkout.errors[field];
}
function clearErrors(): void {
  for (const k of Object.keys(checkout.errors) as FormField[]) delete checkout.errors[k];
}
// A field that already shows an error is re-checked while the user types: the hint disappears before
// the next click, so the layout does not shift under the pointer (focusout fires on mousedown).
watch(
  () => ({ ...checkout.form }),
  (now, before) => {
    for (const k of Object.keys(checkout.errors) as FormField[]) if (now[k] !== before[k]) validateField(k);
  },
);

// ---------- submit ----------
let orderNumber = 4820;
function snapshot(kind: 'order' | 'quick') {
  const f = checkout.form;
  return {
    kind,
    number: ++orderNumber,
    phone: f.phone,
    email: f.email,
    recipient: `${f.firstName} ${f.lastName}`.trim(),
    delivery:
      f.delivery === 'courier'
        ? `${deliveryOption.value.label}: ${f.courierAddress}`
        : f.branch
          ? `${deliveryOption.value.label}: ${f.branch}`
          : deliveryOption.value.label,
    payment: paymentOption.value.label,
    lines: checkout.lines.map((l) => ({
      title: l.type === 'bundle' ? (l.parts ?? []).map((p) => p.title).join(' + ') : l.title,
      qty: l.qty,
      sum: money(lineSum(l)),
    })),
    total: money(total.value),
  };
}
/** Mock network failure: a phone number ending with 000 always fails (edge case «сбой отправки»). */
function failsOnNetwork(): boolean {
  return checkout.form.phone.replace(/\D/g, '').endsWith('000');
}

/** Full checkout. Returns true when the order is placed (caller navigates to the success screen). */
export async function submitOrder(): Promise<boolean> {
  if (checkout.submitting || isEmpty.value) return false;
  const fields: FormField[] = ['lastName', 'firstName', 'phone', 'email', 'city', 'branch', 'courierAddress', 'comment'];
  if (!validateAll(fields)) {
    showToast('error', 'Перевірте поля, позначені червоним');
    return false;
  }
  checkout.submitting = true;
  await delay(1200);
  checkout.submitting = false;
  if (failsOnNetwork()) {
    showToast('error', 'Не вдалося оформити замовлення — перевірте зв’язок і спробуйте ще раз');
    return false;
  }
  checkout.lastOrder = snapshot('order');
  return true;
}

/** Quick order: phone (+ optional name). */
export async function submitQuick(): Promise<boolean> {
  if (checkout.submitting || isEmpty.value) return false;
  if (!validateAll(['phone'])) return false;
  checkout.submitting = true;
  await delay(1000);
  checkout.submitting = false;
  if (failsOnNetwork()) {
    showToast('error', 'Не вдалося надіслати заявку — спробуйте ще раз');
    return false;
  }
  checkout.lastOrder = snapshot('quick');
  return true;
}

// ---------- login (mock) ----------
function fillFromAccount(): void {
  Object.assign(checkout.form, {
    lastName: ACCOUNT.lastName,
    firstName: ACCOUNT.firstName,
    phone: ACCOUNT.phone,
    email: ACCOUNT.email,
    city: ACCOUNT.city,
  });
  clearErrors();
  checkout.loggedIn = true;
}
export async function login(): Promise<boolean> {
  const l = checkout.login;
  if (!l.email.trim() || !l.password) {
    l.error = 'Вкажіть пошту та пароль';
    return false;
  }
  l.loading = true;
  l.error = '';
  await delay(800);
  l.loading = false;
  if (l.password !== 'password1234') {
    l.error = 'Невірна пошта або пароль';
    return false;
  }
  fillFromAccount();
  showToast('success', `Ви увійшли як ${ACCOUNT.firstName} ${ACCOUNT.lastName}`);
  return true;
}
export async function loginSocial(network: string): Promise<boolean> {
  checkout.login.loading = true;
  await delay(600);
  checkout.login.loading = false;
  fillFromAccount();
  const name = network === 'apple' ? 'Apple ID' : network === 'facebook' ? 'Facebook' : 'Google';
  showToast('success', `Ви увійшли через ${name}`);
  return true;
}
export function forgotPassword(): void {
  showToast('info', 'Посилання для відновлення пароля надіслано на пошту');
}
export function logout(): void {
  checkout.loggedIn = false;
  showToast('info', 'Ви вийшли з акаунта');
}

/** Reset the whole scenario (after a placed order — «Оформити ще одне»). */
export function resetCheckout(): void {
  Object.assign(checkout, {
    mode: 'full',
    lines: initialLines(),
    promos: ['SMART10'],
    promoInputOpen: false,
    promoInput: '',
    promoError: '',
    submitting: false,
  });
  Object.assign(checkout.form, initialForm());
  clearErrors();
}
