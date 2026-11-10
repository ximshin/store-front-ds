import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DropdownItemsList from './DropdownItemsList.vue';
import Checkbox from '../Checkbox/Checkbox.vue';

const BRANDS = [
  { label: 'Nike', counter: 128, checked: true },
  { label: 'Adidas', counter: 96, checked: true },
  { label: 'Puma', counter: 54, checked: true },
];

/**
 * Список значений фильтра каталога (Figma `6131:9523`): строки с `Checkbox` M 20 без образца + `Scrollbar`.
 */
const meta = {
  title: 'Forms/dropdown-items-list',
  component: DropdownItemsList,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 304,
    docs: {
      description: {
        component:
          'Список фильтра (Figma `6131:9523`, Property 1=Default): рамка `border/input`, `radius/8`, padding `space/8` по вертикали. Слот items — строки высотой 32 с боковым отступом `space/12`, справа `Scrollbar` (`showScrollBar`).',
      },
    },
  },
  argTypes: {
    showScrollBar: { control: 'boolean', description: 'Figma: Show scroll-bar?' },
    scrollProgress: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Положение бегунка Scrollbar' },
  },
  args: { showScrollBar: true, scrollProgress: 0 },
  render: (args) => ({
    components: { DropdownItemsList, Checkbox },
    setup: () => ({ args, BRANDS }),
    template: `
      <DropdownItemsList v-bind="args">
        <div v-for="b in BRANDS" :key="b.label"><Checkbox size="m" :show-icon="false" :checked="b.checked" :label="b.label" :counter="b.counter" /></div>
      </DropdownItemsList>`,
  }),
} satisfies Meta<typeof DropdownItemsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoScrollBar: Story = { args: { showScrollBar: false } };
export const ScrolledDown: Story = { args: { scrollProgress: 1 } };
export const English: Story = {
  render: (args) => ({
    components: { DropdownItemsList, Checkbox },
    setup: () => ({ args }),
    template: `
      <DropdownItemsList v-bind="args">
        <div><Checkbox size="m" :show-icon="false" label="In stock" :counter="210" checked /></div>
        <div><Checkbox size="m" :show-icon="false" label="On sale" :counter="64" /></div>
        <div><Checkbox size="m" :show-icon="false" label="New" :counter="18" /></div>
      </DropdownItemsList>`,
  }),
};

/** С / без Scrollbar. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { DropdownItemsList, Checkbox },
    setup: () => ({ BRANDS }),
    template: `
      <div style="display:grid;grid-template-columns:repeat(2,304px);gap:var(--space-24);align-items:start;padding:var(--space-24)">
        <DropdownItemsList>
          <div v-for="b in BRANDS" :key="b.label"><Checkbox size="m" :show-icon="false" :checked="b.checked" :label="b.label" :counter="b.counter" /></div>
        </DropdownItemsList>
        <DropdownItemsList :show-scroll-bar="false">
          <div v-for="b in BRANDS" :key="b.label"><Checkbox size="m" :show-icon="false" :label="b.label" :counter="b.counter" /></div>
        </DropdownItemsList>
      </div>`,
  }),
};
