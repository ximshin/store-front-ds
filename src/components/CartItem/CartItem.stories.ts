import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CartItem from './CartItem.vue';

const TYPES = ['product', 'bundle'] as const;
const SIZES = ['default', 'compact'] as const;

const BUNDLE_ITEMS = [
  { title: 'Футболка Basic чоловіча, темно-сіра', oldPrice: '30 299 грн', price: '20 899 грн' },
  { title: 'Навушники Apple AirPods Max, срібний', oldPrice: '30 299 грн', price: '20 899 грн' },
];

/**
 * Строка товара в корзине (Figma `6303:12634`). **Type**: `product` / `bundle` (набор), **Size**: `default` (1091, адаптив — Fill) /
 * `compact` (480, правая колонка оформления и попапы). Собирается из `Counter`, `Price`, `DiscountLabel`, `GiftTag`, `InfoTag`,
 * `IconButton`. Фото — данные товара: prop `image` (url), без него — нейтральная плашка `surface/hover`.
 * Булевы `show*` — одноимённые свойства Figma (`Show min-order` → `showMinOrder`).
 */
const meta = {
  title: 'Cart & Checkout/CartItem',
  component: CartItem,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 1091,
    docs: {
      description: {
        component:
          'Size=Compact: удаление absolute справа сверху, цена + скидка (`DiscountLabel`), «мін. замовлення» отдельной строкой, снизу — счётчик · InfoTag · сумма. `Show gift` — блок подарка под товаром (`border/gift`). Bundle Compact — «Разом дешевше» + состав + общая сумма.',
      },
    },
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES, description: 'Figma: Type' },
    size: { control: 'inline-radio', options: SIZES, description: 'Figma: Size' },
    title: { control: 'text' },
    image: { control: 'text', description: 'URL фото товара' },
    price: { control: 'text' },
    oldPrice: { control: 'text' },
    sum: { control: 'text' },
    oldSum: { control: 'text', description: 'Старая сумма (набор Compact)' },
    quantity: { control: 'number' },
    minOrderText: { control: 'text', description: 'Figma: Min-order text' },
    wholesaleText: { control: 'text', description: 'Figma: Wholesale text' },
    discountLabel: { control: 'text' },
    giftTagLabel: { control: 'text' },
    electronicLabel: { control: 'text' },
    setCounterText: { control: 'text' },
    mods: { control: 'object', description: 'Модификации; либо слот `mods`' },
    items: { control: 'object', description: 'Набор: [{ title, image, oldPrice, price }]' },
    bundleTitle: { control: 'text' },
    moreCount: { control: 'text' },
    gift: { control: 'object', description: 'Подарок под товаром (Compact): { title, image, oldPrice }' },
    showMinOrder: { control: 'boolean', description: 'Figma: Show min-order' },
    showOldPrice: { control: 'boolean', description: 'Figma: Show old price' },
    showElectronic: { control: 'boolean', description: 'Figma: Show electronic' },
    showWholesale: { control: 'boolean', description: 'Figma: Show wholesale' },
    showCounter: { control: 'boolean', description: 'Figma: Show counter' },
    showGiftTag: { control: 'boolean', description: 'Figma: Show gift-tag' },
    showDiscount: { control: 'boolean', description: 'Figma: Show discount' },
    showGiftOnImg: { control: 'boolean', description: 'Figma: Show gift-on-img' },
    showSetCounter: { control: 'boolean', description: 'Figma: Show set-counter' },
    showDelete: { control: 'boolean', description: 'Figma: Show delete' },
    showDeleteCost: { control: 'boolean', description: 'Figma: Show delete-cost (Default)' },
    showDeleteCount: { control: 'boolean', description: 'Figma: Show delete-count (в проверенных вариантах не используется)' },
    showMods: { control: 'boolean', description: 'Figma: Show mods' },
    showGift: { control: 'boolean', description: 'Figma: Show gift (Compact Product)' },
  },
  args: {
    type: 'product',
    size: 'default',
    title: 'Навушники Apple AirPods Max, срібний',
    price: '20 899 грн',
    oldPrice: '30 299 грн',
    sum: '41 798 грн',
    quantity: 2,
    items: BUNDLE_ITEMS,
    oldSum: '60 598 грн',
  },
} satisfies Meta<typeof CartItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Product Default — строка корзины на десктопе. */
export const ProductDefault: Story = {};

/** Product Default со всеми дополнениями: модификации, скидка, электронный товар, опт, подарок. */
export const ProductDefaultFull: Story = {
  args: {
    showMods: true,
    showDiscount: true,
    showElectronic: true,
    showWholesale: true,
    showSetCounter: true,
    showGiftOnImg: true,
    showGiftTag: true,
  },
};

/** Bundle Default — набор: миниатюры 2×2 + «+N», раскрытие. */
export const BundleDefault: Story = {
  args: { type: 'bundle', title: 'Комплект «Спортивний стиль»', moreCount: '+99' },
};

/** Product Compact — правая колонка оформления (480). */
export const ProductCompact: Story = {
  parameters: { maxWidth: 480 },
  args: { size: 'compact', title: 'Футболка Basic чоловіча, темно-сіра, розмір M' },
};

/** Product Compact со скидкой, электронным товаром и оптом, без блока подарка. */
export const ProductCompactFull: Story = {
  parameters: { maxWidth: 480 },
  args: {
    size: 'compact',
    title: 'Футболка Basic чоловіча, темно-сіра, розмір M',
    showMods: true,
    showDiscount: true,
    showElectronic: true,
    showWholesale: true,
    showGift: false,
  },
};

/** Подарок под товаром (Show gift, `border/gift`). */
export const ProductCompactGift: Story = {
  parameters: { maxWidth: 480 },
  args: { size: 'compact', showGift: true },
};

/** Bundle Compact — «Разом дешевше». */
export const BundleCompact: Story = {
  parameters: { maxWidth: 480 },
  args: { type: 'bundle', size: 'compact' },
};

/** Длинное название (uk с Ґ Є І Ї). */
export const LongText: Story = {
  parameters: { maxWidth: 480 },
  args: {
    size: 'compact',
    title:
      'Ґудзики Єдина Їжа Інтернет-магазин — чоловіча футболка преміум-класу з органічної бавовни, регулярний крій, колекція осінь–зима',
    minOrderText: 'Мінімальне замовлення — від 2 одиниць, Нова пошта',
    showGift: false,
  },
};

/** Английский текст. */
export const English: Story = {
  parameters: { maxWidth: 480 },
  args: {
    size: 'compact',
    title: 'Stylish Indigo Comfort Stretch Denim Jeans for Men Classic Fit, Durable and Versatile',
    minOrderText: 'Minimum order: 2 items',
    price: '$209',
    oldPrice: '$303',
    sum: '$418',
    gift: { title: 'Apple iPhone 15 Pro Max 256GB Blue', oldPrice: '$1 299' },
    giftTagLabel: 'Gift',
  },
};

/** Все Type × Size. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { CartItem },
    setup: () => ({ TYPES, SIZES, BUNDLE_ITEMS }),
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-24);padding:var(--space-24)">
        <template v-for="s in SIZES" :key="s">
          <div v-for="t in TYPES" :key="s + t" :style="{ maxWidth: s === 'compact' ? '480px' : '1091px', width: '100%' }">
            <code class="ds-text-special-special-12-regular">{{ t }} · {{ s }}</code>
            <CartItem :type="t" :size="s" :items="BUNDLE_ITEMS" old-sum="60 598 грн" sum="41 798 грн" :quantity="2" />
          </div>
        </template>
      </div>`,
  }),
};

const VERY_LONG_TITLE =
  'Ґудзики Єдина Їжа Інтернет-магазин — чоловіча футболка преміум-класу з органічної бавовни, регулярний крій, колекція осінь–зима, з ґумкою на манжетах, подарункова упаковка Їжачок';

/** Дуже довга назва (3+ рядки, uk з Ґ Є І Ї) — Default: назва переноситься, ціна та лічильник не зсуваються. */
export const VeryLongTitleDefault: Story = {
  args: { title: VERY_LONG_TITLE, showMods: true },
};

/** Дуже довга назва (3+ рядки) — Compact: перенос усередині колонки, кнопка видалення не перекриває текст. */
export const VeryLongTitleCompact: Story = {
  parameters: { maxWidth: 480 },
  args: { size: 'compact', title: VERY_LONG_TITLE, showMods: true, showGift: false },
};

/** Величезні суми: «1 299 999 грн» у ціні, старій ціні та сумі по рядку. */
export const HugePrices: Story = {
  args: {
    price: '1 299 999 грн',
    oldPrice: '1 999 999 грн',
    sum: '12 999 990 грн',
    quantity: 10,
    showDiscount: true,
    discountLabel: 'smart-10 (−699 999 грн)',
  },
};

/** Величезні суми — Compact (480): ціна та сума поруч із лічильником. */
export const HugePricesCompact: Story = {
  parameters: { maxWidth: 480 },
  args: {
    size: 'compact',
    price: '1 299 999 грн',
    oldPrice: '1 999 999 грн',
    sum: '12 999 990 грн',
    quantity: 10,
    showGift: false,
  },
};

/** Усі булеві прикраси одночасно — Compact: знижка, мін. замовлення, електронний, опт, подарунок. */
export const AllBooleansCompact: Story = {
  parameters: { maxWidth: 480 },
  args: {
    size: 'compact',
    showMods: true,
    showDiscount: true,
    showMinOrder: true,
    showElectronic: true,
    showWholesale: true,
    showGift: true,
    showGiftTag: true,
    showGiftOnImg: true,
    showSetCounter: true,
  },
};

/** Усі булеві прикраси одночасно — Default. */
export const AllBooleansDefault: Story = {
  args: {
    showMods: true,
    showDiscount: true,
    showMinOrder: true,
    showElectronic: true,
    showWholesale: true,
    showGiftTag: true,
    showGiftOnImg: true,
    showSetCounter: true,
  },
};

/** Без лічильника (`showCounter: false`) — Default та Compact. */
export const CounterHidden: Story = {
  parameters: { fullWidth: true },
  args: { showCounter: false },
  render: (args) => ({
    components: { CartItem },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-24)">
        <CartItem v-bind="args" />
        <div style="max-width:480px"><CartItem v-bind="args" size="compact" :show-gift="false" /></div>
      </div>`,
  }),
};

/** Набір із двох товарів з довгими назвами — Compact та Default. */
export const BundleLongItems: Story = {
  parameters: { fullWidth: true },
  args: { type: 'bundle', title: 'Комплект «Ґрунтовний підхід до Єдиної Їжі»' },
  render: (args) => ({
    components: { CartItem },
    setup: () => ({
      args,
      items: [
        { title: 'Ґудзики Єдина Їжа Інтернет-магазин — чоловіча футболка преміум-класу з органічної бавовни, регулярний крій', oldPrice: '1 999 999 грн', price: '1 299 999 грн' },
        { title: 'Їжачок Інтернет-магазин — шкарпетки жіночі бавовняні з малюнком «Ґанок», набір із п’яти пар, розмір 36–40', oldPrice: '30 299 грн', price: '20 899 грн' },
      ],
    }),
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-24)">
        <div style="max-width:480px"><CartItem v-bind="args" size="compact" :items="items" old-sum="2 030 298 грн" sum="1 320 898 грн" /></div>
        <CartItem v-bind="args" :items="items" more-count="+2" />
      </div>`,
  }),
};

/** Максимальна кількість — лічильник у верхній межі (999, `max` за замовчуванням), кнопка «+» вимкнена. */
export const QuantityAtMax: Story = {
  parameters: { fullWidth: true },
  args: { quantity: 999, sum: '20 878 101 грн' },
  render: (args) => ({
    components: { CartItem },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-24)">
        <CartItem v-bind="args" />
        <div style="max-width:480px"><CartItem v-bind="args" size="compact" :show-gift="false" /></div>
      </div>`,
  }),
};

/** English: the same stress case with long English title. */
export const LongTitleEnglishDefault: Story = {
  args: {
    title: 'Stylish Indigo Comfort Stretch Denim Jeans for Men Classic Fit, Durable and Versatile, Limited Autumn–Winter Collection',
    price: '$1 299',
    oldPrice: '$1 999',
    sum: '$2 598',
    quantity: 2,
    minOrderText: 'Minimum order: 2 items',
  },
};
