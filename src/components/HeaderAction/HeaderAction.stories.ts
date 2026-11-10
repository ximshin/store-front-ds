import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HeaderAction from './HeaderAction.vue';

const ICONS = ['user-24', 'phone-24', 'heart-24', 'compare-24', 'currency-24', 'location-24', 'clock-24', 'filter-24'] as const;

/**
 * Действие в шапке (Figma `6209:55`): иконка + подпись (+ стрелка). **M** — верхний ряд (иконка 24, высота 40),
 * **S** — тёмная плашка (иконка 16, высота 32). Dark рисуется на тёмном фоне контейнера.
 */
const meta = {
  title: 'Navigation/HeaderAction',
  component: HeaderAction,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 320,
    docs: {
      description: {
        component:
          'Действие в шапке (Figma `6209:55`). Паддинг `space/8 × space/12`, `radius/8`. Icon (Instance Swap) → prop `icon` или слот `icon`.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Figma: Label' },
    showLabel: { control: 'boolean', description: 'Figma: Show label?' },
    showArrow: { control: 'boolean', description: 'Figma: Show arrow?' },
    icon: { control: 'select', options: ICONS, description: 'Figma: Icon (Instance Swap)' },
    size: { control: 'inline-radio', options: ['m', 's'], description: 'Figma: Size' },
    theme: { control: 'inline-radio', options: ['light', 'dark'], description: 'Figma: Theme' },
    nativeType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
  },
  args: { label: 'Вхід', showLabel: true, showArrow: false, icon: 'user-24', size: 'm', theme: 'light' },
} satisfies Meta<typeof HeaderAction>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Вхід в шапці (M, Light). */
export const MediumLight: Story = {};

/** Контакти с выпадающим списком. */
export const WithArrow: Story = { args: { label: '095 123-45-67', icon: 'phone-24', showArrow: true } };

/** Только иконка. */
export const IconOnly: Story = { args: { showLabel: false } };

/** Тёмная плашка (S, Dark). */
export const SmallDark: Story = {
  args: { size: 's', theme: 'dark', label: 'Бажання', icon: 'heart-24' },
  render: (args) => ({
    components: { HeaderAction },
    setup: () => ({ args }),
    template: '<div style="background:var(--surface-action-primary);display:inline-block"><HeaderAction v-bind="args" /></div>',
  }),
};

export const English: Story = { args: { label: 'Sign in' } };

/** Size × Theme × Show arrow. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { HeaderAction },
    template: `
      <div style="display:grid;grid-template-columns:repeat(2,max-content);gap:var(--space-16) var(--space-24);align-items:center;padding:var(--space-24)">
        <div><HeaderAction label="Вхід" /></div>
        <div style="background:var(--surface-action-primary)"><HeaderAction theme="dark" label="Вхід" /></div>
        <div><HeaderAction label="095 123-45-67" icon="phone-24" show-arrow /></div>
        <div style="background:var(--surface-action-primary)"><HeaderAction theme="dark" label="095 123-45-67" icon="phone-24" show-arrow /></div>
        <div><HeaderAction size="s" label="Бажання" icon="heart-24" /></div>
        <div style="background:var(--surface-action-primary)"><HeaderAction size="s" theme="dark" label="Бажання" icon="heart-24" /></div>
        <div><HeaderAction size="s" label="UAH" icon="currency-24" show-arrow /></div>
        <div style="background:var(--surface-action-primary)"><HeaderAction size="s" theme="dark" label="UAH" icon="currency-24" show-arrow /></div>
      </div>`,
  }),
};
