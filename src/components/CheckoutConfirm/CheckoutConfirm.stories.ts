import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CheckoutConfirm from './CheckoutConfirm.vue';

/**
 * Подтверждение заказа внизу оформления (Figma `6220:182`): два `Checkbox` M (рассылка, согласие с условиями)
 * + `ButtonFront` Primary L «Оформити замовлення».
 */
const meta = {
  title: 'Cart & Checkout/CheckoutConfirm',
  component: CheckoutConfirm,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 652,
    docs: {
      description: {
        component:
          'Подтверждение заказа (Figma `6220:182`). Карточка `border/card`, `radius/12`, отступы `space/16`, промежуток `space/24`. Отметки — `v-model:newsletter` / `v-model:terms`.',
      },
    },
  },
  argTypes: {
    newsletter: { control: 'boolean', description: 'Чекбокс рассылки' },
    terms: { control: 'boolean', description: 'Чекбокс согласия с условиями' },
    newsletterLabel: { control: 'text' },
    termsLabel: { control: 'text' },
    buttonLabel: { control: 'text' },
  },
  args: {
    newsletter: false,
    terms: true,
    newsletterLabel: 'Хочу отримувати новини та спеціальні пропозиції від магазину',
    termsLabel: 'Підтверджуючи замовлення, я приймаю умови угоди користувача',
    buttonLabel: 'Оформити замовлення',
  },
} satisfies Meta<typeof CheckoutConfirm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const BothChecked: Story = { args: { newsletter: true, terms: true } };
export const Unchecked: Story = { args: { terms: false } };
export const English: Story = {
  args: {
    newsletterLabel: 'I want to receive news and special offers from the store',
    termsLabel: 'By confirming the order, I accept the user agreement',
    buttonLabel: 'Place order',
  },
};

export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { CheckoutConfirm },
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-16);max-width:652px;padding:var(--space-24)">
        <CheckoutConfirm />
        <CheckoutConfirm newsletter terms />
        <CheckoutConfirm :terms="false" />
      </div>`,
  }),
};
