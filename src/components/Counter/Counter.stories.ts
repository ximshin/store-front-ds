import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import Counter from './Counter.vue';

/**
 * Счётчик количества товара «− число +» (Figma `6129:500`). Hover (State=Hover) — наведите курсор на кнопку.
 * Show units — подпись «шт.» справа.
 */
const meta = {
  title: 'Forms/counter',
  component: Counter,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 120,
    docs: {
      description: {
        component:
          'Счётчик (Figma `6129:500`): 120×40, обводка border/input, радиус 4, кнопки minus-16 / plus-16. Hover кнопки — фон surface/hover. Значение — v-model, границы `min` / `max`.',
      },
    },
  },
  argTypes: {
    modelValue: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    showUnits: { control: 'boolean', description: 'Figma: Show units' },
    units: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: { modelValue: 1, min: 1, max: 999, showUnits: false, units: 'шт.', disabled: false },
  render: (args) => ({
    components: { Counter },
    setup: () => {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: '<Counter v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** С единицами измерения. */
export const WithUnits: Story = { args: { showUnits: true, modelValue: 3 } };

export const AtMax: Story = { args: { modelValue: 5, max: 5, showUnits: true } };
export const Disabled: Story = { args: { disabled: true, modelValue: 2 } };
export const English: Story = { args: { showUnits: true, units: 'pcs', modelValue: 2 } };

/** Normal и с единицами; Hover — наведите курсор на кнопку. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Counter },
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-16);padding:var(--space-24);align-items:flex-start">
        <Counter :model-value="1" />
        <Counter :model-value="12" show-units />
        <Counter :model-value="5" :max="5" show-units />
        <Counter :model-value="2" disabled show-units />
      </div>`,
  }),
};
