import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Header from './Header.vue';

/**
 * Шапка витрини (Figma `6210:264`). **Desktop** 1280 — ряд main + тёмная плашка; **Mobile** 430×48 — бургер, Logo,
 * вход и корзина. Собрана из Logo, NavItem, HeaderAction, CartButton, SocialIcon, IconButton.
 */
const meta = {
  title: 'Navigation/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 1280,
    docs: {
      description: {
        component:
          'Шапка витрины (Figma `6210:264`). Device: Desktop 1280 / Mobile 430×48. Мобайл — фон `surface/hover`. Пункты меню, телефон и корзина — props.',
      },
    },
  },
  argTypes: {
    device: { control: 'inline-radio', options: ['desktop', 'mobile'], description: 'Figma: Device' },
    phone: { control: 'text', description: 'Телефон в HeaderAction' },
    cartCount: { control: 'text', description: 'Счётчик CartButton' },
    cartPrice: { control: 'text', description: 'Сумма CartButton' },
    mainNav: { control: 'object', description: 'Верхний ряд меню (NavItem Light)' },
    infoNav: { control: 'object', description: 'Меню тёмной плашки; последний пункт — со стрелкой' },
    socials: { control: 'object', description: 'Соцсети в плашке' },
  },
  args: { device: 'desktop' },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

/** Мобильная шапка 430×48. */
export const Mobile: Story = { args: { device: 'mobile' }, parameters: { maxWidth: 430 } };

/** Контент на английском. */
export const English: Story = {
  args: {
    phone: '+380 95 123-45-67',
    cartCount: '3',
    cartPrice: '$ 249',
    mainNav: ['Men', 'Women', 'Shoes', 'Kids', 'Accessories'],
    infoNav: ['About', 'Payment & delivery', 'Returns', 'More'],
  },
};

/** Desktop и Mobile. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Header },
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-24);padding:var(--space-24)">
        <Header device="desktop" />
        <div style="width:430px;max-width:100%"><Header device="mobile" /></div>
      </div>`,
  }),
};
