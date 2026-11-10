import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GiftTag from './GiftTag.vue';

const TYPES = ['outline', 'filled'] as const;

/**
 * Метка «Подарунок» у товара в корзине (Figma `6215:85`). Type: **outline** (обводка `border/danger`) /
 * **filled** (фон `bg/danger/light`). Текст `DS/Special/Special 12 Regular`, `text/sale`, `radius/4`.
 */
const meta = {
  title: 'Cart & Checkout/GiftTag',
  component: GiftTag,
  tags: ['autodocs'],
  parameters: { maxWidth: 400 },
  argTypes: {
    label: { control: 'text', description: 'Figma: Label (также слот по умолчанию)' },
    type: { control: 'inline-radio', options: TYPES, description: 'Figma: Type' },
  },
  args: { label: 'Подарунок', type: 'outline' },
} satisfies Meta<typeof GiftTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outline: Story = {};
export const Filled: Story = { args: { type: 'filled' } };
export const English: Story = { args: { label: 'Gift' } };

export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { GiftTag },
    setup: () => ({ TYPES }),
    template: `
      <div style="display:flex;gap:var(--space-16);align-items:center;padding:var(--space-24)">
        <GiftTag v-for="t in TYPES" :key="t" :type="t" />
        <GiftTag label="Gift" />
      </div>`,
  }),
};
