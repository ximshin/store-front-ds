import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Radio from './Radio.vue';

/**
 * Радио-кнопка (Figma `6254:424`): выбор одного из нескольких — способ доставки, оплаты. Hover — `:hover`.
 */
const meta = {
  title: 'Forms/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 320,
    docs: {
      description: {
        component:
          'Радио-кнопка 20 (radius/full). normal — `border/input`, hover — `border/input-hover`, checked — `surface/action/primary` + точка 8 `icon/on-color`, disabled — `surface/input/disabled`, disabled-checked — `surface/disabled`. Подпись `DS/Form/Input text`.',
      },
    },
  },
  argTypes: {
    checked: { control: 'boolean', description: 'Figma: State=checked' },
    disabled: { control: 'boolean', description: 'Figma: State=disabled / disabled-checked' },
    label: { control: 'text', description: 'Figma: Label' },
    showLabel: { control: 'boolean', description: 'Figma: Show label?' },
    name: { control: 'text', description: 'Нативное имя группы' },
    value: { control: 'text' },
  },
  args: { checked: false, disabled: false, label: 'Нова пошта — у відділення', showLabel: true },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};
export const Checked: Story = { args: { checked: true, label: 'Кур’єр Нової пошти' } };
export const Disabled: Story = { args: { disabled: true, label: 'Самовивіз (недоступно)' } };
export const DisabledChecked: Story = { args: { disabled: true, checked: true, label: 'Самовивіз (недоступно)' } };
export const NoLabel: Story = { args: { showLabel: false } };
export const English: Story = { args: { label: 'Pick up at a branch' } };

/** Все состояния. Hover — наведите курсор. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Radio },
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-16);padding:var(--space-24)">
        <Radio label="normal · Оплата карткою" />
        <Radio checked label="checked · Оплата при отриманні" />
        <Radio disabled label="disabled · Apple Pay" />
        <Radio disabled checked label="disabled-checked · Google Pay" />
        <Radio label="Pay by card" />
      </div>`,
  }),
};

/** Группа: выбор способа доставки. */
export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { Radio },
    data: () => ({ v: 'np' }),
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-12)">
        <Radio name="del" value="np" :checked="v === 'np'" label="Нова пошта — у відділення" @update:checked="v = 'np'" />
        <Radio name="del" value="courier" :checked="v === 'courier'" label="Кур’єр Нової пошти" @update:checked="v = 'courier'" />
        <Radio name="del" value="pickup" :checked="v === 'pickup'" label="Самовивіз" @update:checked="v = 'pickup'" />
      </div>`,
  }),
};
