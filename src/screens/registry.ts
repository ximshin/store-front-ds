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
  /** Index tab: «Десктоп» (default) or «Мобільна версія». */
  platform?: 'desktop' | 'mobile';
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
    description: 'Варіант без вкладок: над повною формою — згортувана картка «Швидке замовлення» (ім’я та прізвище, телефон, е-пошта, згоди, «Оформити замовлення»); «Передзвонити вам?» у шапці розгортає її.',
    route: '/checkout-accordion',
    figma: 'Checkout — варіант без вкладок · 1991:61158',
    component: () => import('./checkout/CheckoutScreen.vue'),
    props: { quickLayout: 'accordion' },
  },
  {
    id: 'checkout-v2',
    name: 'Оформлення · v2',
    description: 'Компактний перемикач «Звичайне оформлення | Швидке замовлення» за шириною підписів (активний — темний); форма на фоні без рамки (по батькові — за кнопкою); коментар — окрема секція після «Оплата», поле textarea; країна й місто в доставці; доставка й оплата — розширені селекти; швидке замовлення — скорочена повна форма; замовлення — дві картки: підсумок (поле промокоду завжди відкрите, без чипів — код видно рядком знижки, зняти хрестиком) і товари з оптовими цінами кнопками.',
    route: '/checkout-v2',
    figma: 'Checkout-v2 · Checkout — DS · 1:1048',
    component: () => import('./checkout-v2/CheckoutV2Screen.vue'),
    props: { commentBottom: true, promoAlways: true, switchLook: 'compact-dark' },
  },
  {
    id: 'checkout-v2-comment',
    name: 'Оформлення · v2, коментар окремою секцією',
    description: 'Той самий екран v2, але коментар — не в блоці одержувача, а окремою секцією після «Оплата», перед підтвердженням: кнопка «Додати коментар до замовлення» розгортає багаторядкове поле (textarea, 3 рядки, росте за текстом); у швидкому замовленні — так само перед підтвердженням. Промокод: поле завжди відкрите, без чипів і «Додати код» — застосований код видно лише рядком знижки в підсумку (з хрестиком).',
    route: '/checkout-v2-comment',
    figma: 'Checkout-v2 · form-section 85:3784',
    component: () => import('./checkout-v2/CheckoutV2Screen.vue'),
    props: { commentBottom: true, promoAlways: true, switchLook: 'compact' },
  },
  {
    id: 'checkout-v2-single',
    name: 'Оформлення · v2, один спосіб доставки й оплати',
    description: 'Той самий екран v2, коли в магазині один спосіб доставки (Нова Пошта) і один спосіб оплати (готівкою при отриманні): замість селектів — статичний рядок тієї ж висоти без стрілки; поле відділення лишається.',
    route: '/checkout-v2-single',
    figma: 'Checkout-v2 · 1:1048 (налаштування: один спосіб доставки й оплати; макета немає — research_single_option.md)',
    component: () => import('./checkout-v2/CheckoutV2Screen.vue'),
    props: { single: true },
  },
  {
    id: 'checkout-v2-labels-left',
    name: 'Оформлення · v2, підписи ліворуч',
    description: 'Той самий екран v2, але назви полів — ліворуч від полів, у колонці 160 (як у поточному оформленні магазину): поля по одному в рядку, посилання, оплата й підтвердження вирівняні по колонці полів; на телефоні підписи над полями.',
    route: '/checkout-v2-labels-left',
    figma: 'Checkout-v2 · 1:1048 + референс shop349369.horoshop.ua/checkout (підписи ліворуч)',
    component: () => import('./checkout-v2/CheckoutV2Screen.vue'),
    props: { labels: 'left' },
  },
  {
    id: 'checkout-v2-labels-left-400',
    name: 'Оформлення · v2, підписи ліворуч, поля 400',
    description: 'Варіант із підписами ліворуч, але всі поля однакові — 400: колонка форми 160 + 400, форма й замовлення разом по центру смуги (без великого проміжку між ними); «Обрати на мапі» — під полем відділення.',
    route: '/checkout-v2-labels-left-400',
    figma: 'Checkout-v2 · 1:1048 + референс shop349369.horoshop.ua/checkout (підписи ліворуч, поля однакової ширини)',
    component: () => import('./checkout-v2/CheckoutV2Screen.vue'),
    props: { labels: 'left', narrow: true },
  },
  {
    id: 'checkout-folder',
    name: 'Оформлення · вкладки-папки',
    description: 'Вкладки «Новий покупець | Увійти | Швидке замовлення» над однією карткою: повна форма, форма входу (як у попапі) або швидке замовлення; праворуч — замовлення до 600.',
    route: '/checkout-folder',
    figma: 'Checkout — вкладки-папки · 1986:29745',
    component: () => import('./checkout/CheckoutScreen.vue'),
    props: { quickLayout: 'folder' },
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
    id: 'checkout-mobile',
    name: 'Оформлення · мобільне',
    description: 'Мобільне оформлення: структура й логіка — як у поточному мобільному чекауті магазину, кольори — з десктопного v2. «Вхід для клієнтів», перемикач «Детальне | Замовити швидко» з десктопу v2 (48, підписи переносяться); поля розкладені як на десктопі: прізвище, імʼя, по батькові за кнопкою, телефон, е-пошта; доставка — країна → місто (нижні шторки з пошуком), спосіб, відділення й мапа; оплата; коментар окремим блоком; спосіб доставки й оплата відкриваються після вибору міста; кнопка активна після згоди з умовами. Замовлення — до форми, під «Вхід для клієнтів»: підсумок як на десктопі v2 (поле промокоду 48 і «Ок», без чипів — код видно рядком знижки), далі товари з лічильником, що згортаються в рядок фото, коли товарів більше двох.',
    route: '/checkout-mobile',
    figma: '— (ще немає; референс — shop349369.horoshop.ua/checkout/?v=mobile)',
    component: () => import('./checkout-mobile/CheckoutMobileScreen.vue'),
    platform: 'mobile',
  },
  {
    id: 'checkout-mobile-items',
    name: 'Оформлення · мобільне, товари як у новому кошику',
    description: 'Той самий мобільний екран, але рядки товарів — як у новому мобільному кошику магазину: фото 64, назва (основний чорний, як на десктопі), ціна й закреслена стара ціна ліворуч, сума жирним праворуч, під ними лічильник і видалення. Комплект «Разом дешевше»: заголовок над першим товаром, другий товар — фото 44 з відступом, ціна комплекту й стара ціна, сума, лічильник. З десктопу: мітка smart-знижки, мінімальне замовлення, електронний товар, оптові ціни кнопками, подарунок під товаром.',
    route: '/checkout-mobile-items',
    figma: '— (референс — new-cart.lb.stage.horoshop.ua/checkout/?v=mobile)',
    component: () => import('./checkout-mobile/CheckoutMobileScreen.vue'),
    props: { itemsLook: 'ref' },
    platform: 'mobile',
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
