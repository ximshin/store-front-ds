import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FreeShippingProgress from './FreeShippingProgress.vue';

/**
 * Прогресс до бесплатной доставки (Figma `6226:141`): `info-16` + текст `Special 13 Regular` + полоса 4 px
 * (трек `surface/hover`, заполнение `surface/action/primary`). Ширина заполнения — `progress`, %.
 */
const meta = {
  title: 'Cart & Checkout/FreeShippingProgress',
  component: FreeShippingProgress,
  tags: ['autodocs'],
  parameters: { maxWidth: 400 },
  argTypes: {
    text: { control: 'text', description: 'Figma: Text (также слот по умолчанию)' },
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 }, description: 'Ширина заполнения, % (в Figma 280 из 400 = 70)' },
  },
  args: { text: 'До безкоштовної доставки залишилось 459 грн', progress: 70 },
} satisfies Meta<typeof FreeShippingProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Started: Story = { args: { progress: 15, text: 'До безкоштовної доставки залишилось 1 699 грн' } };
export const Completed: Story = { args: { progress: 100, text: 'Доставка безкоштовна' } };
export const LongText: Story = {
  args: { text: 'До безкоштовної доставки Новою поштою у відділення залишилось ще 459 грн — додайте товар' },
};
export const English: Story = { args: { text: 'Add 459 UAH more to get free shipping' } };

export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { FreeShippingProgress },
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-24);max-width:400px;padding:var(--space-24)">
        <FreeShippingProgress :progress="0" text="До безкоштовної доставки залишилось 2 000 грн" />
        <FreeShippingProgress />
        <FreeShippingProgress :progress="100" text="Доставка безкоштовна" />
      </div>`,
  }),
};
