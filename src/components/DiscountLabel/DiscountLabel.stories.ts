import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DiscountLabel from './DiscountLabel.vue';

/**
 * Метка скидки у товара (Figma `6348:657`): `coupon-16` (`icon/success`) + `DS/Paragraph/P1` `text/success`,
 * промежуток `space/4`. Не путать с `DiscountLine` (строка итогов).
 */
const meta = {
  title: 'Cart & Checkout/DiscountLabel',
  component: DiscountLabel,
  tags: ['autodocs'],
  parameters: { maxWidth: 400 },
  argTypes: {
    label: { control: 'text', description: 'Figma: Label (также слот по умолчанию)' },
    showIcon: { control: 'boolean', description: 'Figma: Show icon' },
  },
  args: { label: 'smart-10 (−649 грн)', showIcon: true },
} satisfies Meta<typeof DiscountLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithoutIcon: Story = { args: { showIcon: false } };
export const LongText: Story = { args: { label: 'Акція «Ґрандіозний розпродаж» (−1 250 грн)' } };
export const English: Story = { args: { label: 'spring-15 (−$25)' } };

export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { DiscountLabel },
    template: `
      <div style="display:flex;gap:var(--space-24);align-items:center;padding:var(--space-24)">
        <DiscountLabel />
        <DiscountLabel :show-icon="false" />
        <DiscountLabel label="spring-15 (−$25)" />
      </div>`,
  }),
};
