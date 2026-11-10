import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CheckoutHeader from './CheckoutHeader.vue';

/**
 * Спрощена шапка оформлення замовлення (Figma `6226:4`, 1280): Logo, посилання «Повернутись до покупок»,
 * телефони, опційне «Передзвонити вам?». Нижня лінія 3 px (`stroke/heavy`, `border/input-active`).
 */
const meta = {
  title: 'Navigation/CheckoutHeader',
  component: CheckoutHeader,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 1280,
    docs: {
      description: {
        component:
          'Упрощённая шапка чекаута (Figma `6226:4`, макет HOROSHOP-8318): отступы `space/32`, высота 80, тексты `DS/Special/Special 16 Regular`, ссылка callback — `Special 12 Regular`.',
      },
    },
  },
  argTypes: {
    phones: { control: 'text', description: 'Figma: Phones' },
    backLabel: { control: 'text', description: 'Figma: Back label' },
    callbackLabel: { control: 'text', description: 'Figma: Callback label' },
    showCallback: { control: 'boolean', description: 'Figma: Show callback?' },
  },
  args: {
    phones: '050 029-37-94, 063 500-89-85',
    backLabel: 'Повернутись до покупок',
    callbackLabel: 'Передзвонити вам?',
    showCallback: false,
  },
} satisfies Meta<typeof CheckoutHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Со ссылкой «Передзвонити вам?». */
export const WithCallback: Story = { args: { showCallback: true } };

export const English: Story = {
  args: { backLabel: 'Back to shopping', phones: '+380 50 029-37-94', callbackLabel: 'Request a call?', showCallback: true },
};

/** Без callback и с callback. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { CheckoutHeader },
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-24);padding:var(--space-24)">
        <CheckoutHeader />
        <CheckoutHeader show-callback />
      </div>`,
  }),
};
