import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CartButton from './CartButton.vue';

/**
 * Корзина в шапке (Figma `6209:57`): `cart-24` + счётчик товаров + сумма. Счётчик и сумма включаются независимо.
 */
const meta = {
  title: 'Navigation/CartButton',
  component: CartButton,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 200,
    docs: {
      description: {
        component:
          'Корзина в шапке (Figma `6209:57`). Счётчик — `surface/action/primary`, `DS/Special/Counter`, обводка `border/on-color`; сумма — `DS/Form/Button M label`.',
      },
    },
  },
  argTypes: {
    count: { control: 'text', description: 'Figma: Count' },
    price: { control: 'text', description: 'Figma: Price' },
    showCount: { control: 'boolean', description: 'Figma: Show count?' },
    showPrice: { control: 'boolean', description: 'Figma: Show price?' },
    nativeType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
  },
  args: { count: '1', price: '1 299 грн', showCount: true, showPrice: true },
} satisfies Meta<typeof CartButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Счётчик и сумма. */
export const Default: Story = {};

/** Только иконка со счётчиком (мобайл). */
export const CountOnly: Story = { args: { showPrice: false, count: '3' } };

/** Только иконка. */
export const IconOnly: Story = { args: { showCount: false, showPrice: false } };

/** Двузначный счётчик и большая сумма. */
export const ManyItems: Story = { args: { count: '12', price: '24 780 грн' } };

export const English: Story = { args: { count: '2', price: '$ 149.00' } };

/** Show count × Show price. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { CartButton },
    template: `
      <div style="display:flex;gap:var(--space-24);align-items:center;padding:var(--space-24)">
        <CartButton />
        <CartButton :show-price="false" />
        <CartButton :show-count="false" />
        <CartButton :show-count="false" :show-price="false" />
        <CartButton count="12" price="24 780 грн" />
      </div>`,
  }),
};
