import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Coupon from './Coupon.vue';

const STATES = ['collapsed', 'empty', 'filled', 'applied', 'error'] as const;

/**
 * Блок промокода в корзине и оформлении (Figma `6219:221`). Собран из `Input`, `ButtonFront` Primary M и `PromoChip`.
 * Состояния: **collapsed** (+ plus-16), **empty**, **filled** (крестик очистки), **applied** (PromoChip ниже), **error**.
 */
const meta = {
  title: 'Cart & Checkout/Coupon',
  component: Coupon,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 560,
    docs: {
      description: {
        component:
          'Блок промокода (Figma `6219:221`). Карточка `border/card`, `radius/12`, отступы `space/12` × `space/16`. Значение поля — `v-model`; в `error` поле с `border/danger` и текстом ошибки под рядом.',
      },
    },
  },
  argTypes: {
    state: { control: 'inline-radio', options: STATES, description: 'Figma: State' },
    title: { control: 'text', description: 'Figma: Title' },
    errorText: { control: 'text', description: 'Figma: Error text' },
    modelValue: { control: 'text', description: 'Значение поля (Filled / Error)' },
    placeholder: { control: 'text' },
    applyLabel: { control: 'text' },
    appliedCode: { control: 'text', description: 'Код в PromoChip (state=applied)' },
  },
  args: {
    state: 'collapsed',
    title: 'Додати промокод',
    errorText: 'Неправильний код',
    modelValue: '',
    applyLabel: 'Застосувати',
    appliedCode: 'SMART10',
  },
} satisfies Meta<typeof Coupon>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Свёрнутый блок (по умолчанию на экране корзины). */
export const Collapsed: Story = {};
export const Empty: Story = { args: { state: 'empty' } };
export const Filled: Story = { args: { state: 'filled', modelValue: 'Smart10' } };
export const Applied: Story = { args: { state: 'applied' } };
export const Error: Story = { args: { state: 'error', modelValue: 'Smart10' } };
export const English: Story = {
  args: {
    state: 'error',
    title: 'Add promo code',
    modelValue: 'Smart10',
    placeholder: 'Promo code or gift certificate',
    applyLabel: 'Apply',
    errorText: 'Invalid code',
  },
};

/** Все состояния. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Coupon },
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-16);max-width:560px;padding:var(--space-24)">
        <Coupon state="collapsed" />
        <Coupon state="empty" />
        <Coupon state="filled" model-value="Smart10" />
        <Coupon state="applied" />
        <Coupon state="error" model-value="Smart10" />
      </div>`,
  }),
};
