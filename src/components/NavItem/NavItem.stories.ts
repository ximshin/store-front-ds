import type { Meta, StoryObj } from '@storybook/vue3-vite';
import NavItem from './NavItem.vue';

/**
 * Пункт меню шапки (Figma `6208:17`). **Light** — верхний ряд, **Dark** — тёмная плашка и подвал. `showArrow` —
 * выпадающий пункт («Ще»). Паддинг `space/8`, высота 32.
 */
const meta = {
  title: 'Navigation/NavItem',
  component: NavItem,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 240,
    docs: {
      description: {
        component:
          'Пункт меню шапки (Figma `6208:17`). Light — `DS/Form/Button M label`, `text/primary`; Dark — `DS/Special/Special 12 Regular`, `text/primary-white` (на тёмном фоне).',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Figma: Label' },
    showArrow: { control: 'boolean', description: 'Figma: Show arrow?' },
    theme: { control: 'inline-radio', options: ['light', 'dark'], description: 'Figma: Theme' },
    href: { control: 'text' },
  },
  args: { label: 'Жінкам', showArrow: false, theme: 'light' },
} satisfies Meta<typeof NavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Верхний ряд меню. */
export const Light: Story = {};

/** Выпадающий пункт. */
export const WithArrow: Story = { args: { label: 'Ще', showArrow: true } };

/** Тёмная плашка. */
export const Dark: Story = {
  args: { theme: 'dark', label: 'Оплата і доставка' },
  render: (args) => ({
    components: { NavItem },
    setup: () => ({ args }),
    template: '<div style="background:var(--surface-action-primary);display:inline-block"><NavItem v-bind="args" /></div>',
  }),
};

export const English: Story = { args: { label: 'Women' } };

/** Длинная подпись (uk с Ґ Є І Ї + en). */
export const LongText: Story = { args: { label: 'Ґаджети, Єдина колекція, Ігри, Їжа / Sports & outdoor equipment' } };

/** Theme × Show arrow. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { NavItem },
    template: `
      <div style="display:grid;grid-template-columns:repeat(2,max-content);gap:var(--space-16) var(--space-24);align-items:center;padding:var(--space-24)">
        <div><NavItem label="Жінкам" /></div>
        <div style="background:var(--surface-action-primary)"><NavItem theme="dark" label="Про нас" /></div>
        <div><NavItem label="Ще" show-arrow /></div>
        <div style="background:var(--surface-action-primary)"><NavItem theme="dark" label="Ще" show-arrow /></div>
      </div>`,
  }),
};
