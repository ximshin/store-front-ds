// Screens registry (directive_screens_vue). Single source for the router and the screens index page.
// Shared file — edited only by the main session. One entry per screen; component is lazy-loaded.
import type { Component } from 'vue';

export interface ScreenEntry {
  id: string;
  /** Tile title on the index page. */
  name: string;
  /** One line: key blocks of the screen. */
  description: string;
  /** Route path (hash history: opens as /#/<route>). */
  route: string;
  /** Figma frame the screen is built from. */
  figma: string;
  component: () => Promise<Component>;
  /** Props for the screen component — the same screen in another configuration (e.g. a shop setting off). */
  props?: Record<string, unknown>;
}

export const screens: ScreenEntry[] = [
  {
    id: 'checkout',
    name: 'Оформлення замовлення',
    description: 'Шапка оформлення, вкладки «Звичайне | Швидке», форма одержувача, доставка, оплата, підтвердження; праворуч — промокод, підсумок і 7 товарів (опт, набори, знижки, подарунок, електронний товар).',
    route: '/checkout',
    figma: 'Checkout Tabs — Desktop · 6355:10633',
    component: () => import('./checkout/CheckoutScreen.vue'),
  },
  {
    id: 'checkout-accordion',
    name: 'Оформлення · швидке замовлення карткою',
    description: 'Варіант без вкладок: над повною формою — згортувана картка «Швидке замовлення» (телефон, ім’я, «Надіслати заявку»); «Передзвонити вам?» у шапці розгортає її.',
    route: '/checkout-accordion',
    figma: 'Checkout — варіант без вкладок · 1991:61158',
    component: () => import('./checkout/CheckoutScreen.vue'),
    props: { quickLayout: 'accordion' },
  },
  {
    id: 'checkout-no-quick',
    name: 'Оформлення без швидкого замовлення',
    description: 'Той самий екран, коли швидке замовлення вимкнене в налаштуваннях магазину: без вкладок «Звичайне | Швидке» і без «Передзвонити вам?» у шапці — одразу повна форма.',
    route: '/checkout-no-quick',
    figma: 'Checkout Tabs — Desktop · 6355:10633 (налаштування: швидке замовлення вимкнене)',
    component: () => import('./checkout/CheckoutScreen.vue'),
    props: { quickOrder: false },
  },
  {
    id: 'checkout-login',
    name: 'Оформлення · вхід',
    description: 'Той самий екран оформлення під затемненням і модальне вікно «Вхід»: соцмережі, е-пошта, пароль, «Увійти», «Забули пароль?».',
    route: '/checkout-login',
    figma: 'Checkout Tabs — Login Modal · 6357:15636',
    component: () => import('./checkout-login/CheckoutLoginScreen.vue'),
  },
  {
    id: 'checkout-success',
    name: 'Замовлення оформлено',
    description: 'Результат оформлення або швидкої заявки: номер, одержувач, доставка, оплата, склад і сума, «Оформити ще одне». Відкривається після оформлення (без замовлення — повертає на оформлення).',
    route: '/checkout-success',
    figma: 'макета немає — зібрано з бази (PRD, крок 8)',
    component: () => import('./checkout-success/CheckoutSuccessScreen.vue'),
  },
];
