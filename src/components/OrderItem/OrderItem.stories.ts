import type { Meta, StoryObj } from '@storybook/vue3-vite';
import OrderItem from './OrderItem.vue';

/**
 * Товар в составе заказа (Figma `6215:150`): фото 80 (`surface/hover`, radius/8), название P1, `Price` S, `Counter` и сумма.
 * Ширина 440 (колонка заказа). Фото — prop `image` (url), без него — `no-photo-24`.
 */
const meta = {
  title: 'Cart & Checkout/OrderItem',
  component: OrderItem,
  tags: ['autodocs'],
  parameters: { maxWidth: 440 },
  argTypes: {
    title: { control: 'text', description: 'Figma: Title' },
    sum: { control: 'text', description: 'Figma: Sum' },
    image: { control: 'text', description: 'URL фото товара' },
    price: { control: 'text' },
    oldPrice: { control: 'text' },
    quantity: { control: 'number' },
  },
  args: { title: 'Apple iPhone 15 Pro 256GB Natural Titanium', sum: '55 999 грн', price: '1 599 грн', oldPrice: '1 999 грн', quantity: 1 },
} satisfies Meta<typeof OrderItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Товар заказа. */
export const Default: Story = {};

/** Длинное название (uk с Ґ Є І Ї). */
export const LongText: Story = {
  args: { title: 'Ґринджоли Єдиної Їжі: чоловічі спортивні штани преміум-класу з органічної бавовни, колекція осінь–зима', sum: '4 598 грн' },
};

/** Английский текст. */
export const English: Story = { args: { title: 'Apple AirPods Max Silver', price: '$549', oldPrice: '$599', sum: '$1 098', quantity: 2 } };

/** Несколько товаров подряд. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { OrderItem },
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-16);max-width:440px;padding:var(--space-24)">
        <OrderItem />
        <OrderItem title="Футболка Basic чоловіча, темно-сіра" price="799 грн" old-price="999 грн" sum="1 598 грн" :quantity="2" />
        <OrderItem title="Навушники Apple AirPods Max, срібний" price="20 899 грн" old-price="30 299 грн" sum="20 899 грн" />
      </div>`,
  }),
};
