import type { Meta, StoryObj } from '@storybook/vue3-vite';
import OrderSummary from './OrderSummary.vue';

/**
 * Итог корзины/заказа (Figma `6220:152`). Заголовок, строки «ключ — значение», `DiscountLine`, разделитель,
 * «Всього» + `Price` L и `ButtonFront` Primary L. На экране оформления заголовок, скидка, разделитель и кнопка скрыты.
 */
const meta = {
  title: 'Cart & Checkout/OrderSummary',
  component: OrderSummary,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 400,
    docs: {
      description: {
        component:
          'Итог корзины/заказа (Figma `6220:152`). Карточка `border/card`, `radius/12`, ширина 400. Блоки управляются флагами `showTitle`, `showDiscount`, `showDivider`, `showButton`.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', description: 'Figma: Title' },
    itemsLabel: { control: 'text', description: 'Figma: Items label' },
    itemsTotal: { control: 'text', description: 'Figma: Items total' },
    deliveryLabel: { control: 'text', description: 'Figma: Delivery label' },
    deliveryValue: { control: 'text', description: 'Figma: Delivery value' },
    totalLabel: { control: 'text', description: 'Figma: Total label' },
    total: { control: 'text', description: 'Сумма «Всього» (Price L)' },
    discountLabel: { control: 'text' },
    discountAmount: { control: 'text' },
    buttonLabel: { control: 'text' },
    showTitle: { control: 'boolean' },
    showDiscount: { control: 'boolean' },
    showDivider: { control: 'boolean' },
    showButton: { control: 'boolean' },
  },
  args: {
    title: 'Разом',
    itemsLabel: '3 товари на суму',
    itemsTotal: '80 159 грн',
    deliveryLabel: 'Доставка',
    deliveryValue: 'За тарифами перевізника',
    totalLabel: 'Всього',
    total: '77 159 грн',
    discountLabel: 'Знижка за промокодом',
    discountAmount: '−3 000 грн',
    buttonLabel: 'Оформити замовлення',
    showTitle: true,
    showDiscount: true,
    showDivider: true,
    showButton: true,
  },
} satisfies Meta<typeof OrderSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Корзина: все блоки. */
export const Default: Story = {};
/** Экран оформления: без заголовка, скидки, разделителя и кнопки. */
export const Checkout: Story = {
  args: { showTitle: false, showDiscount: false, showDivider: false, showButton: false, deliveryValue: 'Нова пошта, 159 грн' },
};
export const WithoutDiscount: Story = { args: { showDiscount: false, total: '80 159 грн' } };
export const LongText: Story = {
  args: {
    itemsLabel: '12 товарів на суму, включно з подарунковими наборами',
    deliveryValue: 'Нова пошта, відділення №1, Київ, Пирогівський шлях',
    discountLabel: 'Знижка за промокодом «Єдина» для постійних клієнтів',
  },
};
export const English: Story = {
  args: {
    title: 'Total',
    itemsLabel: '3 items',
    itemsTotal: '$1,959',
    deliveryLabel: 'Delivery',
    deliveryValue: 'By carrier rates',
    discountLabel: 'Promo code discount',
    discountAmount: '−$75',
    totalLabel: 'Total',
    total: '$1,884',
    buttonLabel: 'Place order',
  },
};

/** Вариации видимости блоков. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { OrderSummary },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-24);padding:var(--space-24)">
        <div style="width:400px"><OrderSummary /></div>
        <div style="width:400px"><OrderSummary :show-title="false" :show-discount="false" :show-divider="false" :show-button="false" /></div>
        <div style="width:400px"><OrderSummary :show-discount="false" :show-button="false" /></div>
      </div>`,
  }),
};
