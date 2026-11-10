import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DiscountLine from './DiscountLine.vue';

/**
 * Строка скидки в итогах корзины/заказа (Figma `6215:69`): иконка 16 (`icon/primary`) + название `DS/Paragraph/P1`
 * слева, сумма `DS/Price/S` справа. Ширина — Fill. Не путать с `DiscountLabel` (метка у товара).
 */
const meta = {
  title: 'Cart & Checkout/DiscountLine',
  component: DiscountLine,
  tags: ['autodocs'],
  parameters: { maxWidth: 400 },
  argTypes: {
    label: { control: 'text', description: 'Figma: Label (также слот по умолчанию)' },
    amount: { control: 'text', description: 'Figma: Amount' },
    icon: { control: 'text', description: 'Имя иконки, по умолчанию tag-16' },
  },
  args: { label: 'Накопичувальна знижка', amount: '−20 грн', icon: 'tag-16' },
} satisfies Meta<typeof DiscountLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Promo: Story = { args: { label: 'Промокод SMART10', amount: '−649 грн', icon: 'coupon-16' } };
export const LongText: Story = {
  args: { label: 'Знижка за оплату карткою «Єдина» для постійних клієнтів магазину', amount: '−1 250 грн' },
};
export const English: Story = { args: { label: 'Loyalty discount', amount: '−$20' } };

export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { DiscountLine },
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-8);max-width:400px;padding:var(--space-24)">
        <DiscountLine />
        <DiscountLine label="Промокод SMART10" amount="−649 грн" icon="coupon-16" />
        <DiscountLine label="Loyalty discount" amount="−$20" />
      </div>`,
  }),
};
