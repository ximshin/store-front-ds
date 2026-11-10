import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Logo from './Logo.vue';

/**
 * Логотип магазина (Figma `6208:4`): плейсхолдер с рамкой-пунктиром `border/divider`. В проекте заменяется картинкой
 * через слот по умолчанию. Desktop 180×48, Mobile 113×32; `onDark` — для подвала (тёмный фон).
 */
const meta = {
  title: 'Navigation/Logo',
  component: Logo,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 180,
    docs: {
      description: {
        component:
          'Логотип магазина (Figma `6208:4`). Размер: 180×48 (desktop) / 113×32 (mobile). Слот по умолчанию — картинка логотипа вместо плейсхолдера.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['desktop', 'mobile'], description: 'Figma: размер 180×48 / 113×32' },
    label: { control: 'text', description: 'Подпись плейсхолдера' },
    onDark: { control: 'boolean', description: 'Для тёмного фона (подвал)' },
  },
  args: { size: 'desktop', label: 'logotype', onDark: false },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Десктопный плейсхолдер 180×48. */
export const Desktop: Story = {};

/** Мобильный плейсхолдер 113×32. */
export const Mobile: Story = { args: { size: 'mobile' } };

/** Вариант для тёмного фона (подвал). */
export const OnDark: Story = {
  args: { onDark: true },
  render: (args) => ({
    components: { Logo },
    setup: () => ({ args }),
    template: '<div style="background:var(--surface-action-primary);padding:var(--space-24)"><Logo v-bind="args" /></div>',
  }),
};

/** Название магазина вместо плейсхолдера. */
export const CustomLabel: Story = { args: { label: 'Мій Магазин' } };

/** Все варианты. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Logo },
    template: `
      <div style="display:flex;gap:var(--space-24);align-items:center;padding:var(--space-24)">
        <Logo />
        <Logo size="mobile" />
        <div style="background:var(--surface-action-primary);padding:var(--space-16)"><Logo on-dark /></div>
        <div style="background:var(--surface-action-primary);padding:var(--space-16)"><Logo size="mobile" on-dark /></div>
      </div>`,
  }),
};
