import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Scrollbar from './Scrollbar.vue';

/**
 * Полоса прокрутки 4×24 (Figma `6131:9077`) — служебная часть `DropdownItemsList` и Filter-item. Растягивается по высоте родителя.
 */
const meta = {
  title: 'Forms/scrollbar',
  component: Scrollbar,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 120,
    docs: {
      description: {
        component:
          'Полоса прокрутки (Figma `6131:9077`): дорожка `surface/hover` шириной 4 (`radius/full`), бегунок высотой 24 — `icon/secondary`. Вариантов нет; `thumbHeight` и `progress` — для живой привязки к прокрутке.',
      },
    },
  },
  argTypes: {
    thumbHeight: { control: { type: 'number', min: 8, step: 4 }, description: 'Высота бегунка, px (Figma: 24)' },
    progress: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Положение бегунка 0..1' },
  },
  args: { thumbHeight: 24, progress: 0 },
  render: (args) => ({
    components: { Scrollbar },
    setup: () => ({ args }),
    template: '<div style="display:flex;height:96px"><Scrollbar v-bind="args" /></div>',
  }),
} satisfies Meta<typeof Scrollbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Middle: Story = { args: { progress: 0.5 } };
export const Bottom: Story = { args: { progress: 1 } };

/** Положения бегунка. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Scrollbar },
    template: `
      <div style="display:flex;gap:var(--space-24);height:96px;padding:var(--space-24)">
        <Scrollbar :progress="0" /><Scrollbar :progress="0.5" /><Scrollbar :progress="1" /><Scrollbar :thumb-height="48" />
      </div>`,
  }),
};
