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
    id: 'checkout-login',
    name: 'Оформлення · вхід',
    description: 'Той самий екран оформлення під затемненням і модальне вікно «Вхід»: соцмережі, е-пошта, пароль, «Увійти», «Забули пароль?».',
    route: '/checkout-login',
    figma: 'Checkout Tabs — Login Modal · 6357:15636',
    component: () => import('./checkout-login/CheckoutLoginScreen.vue'),
  },
];
