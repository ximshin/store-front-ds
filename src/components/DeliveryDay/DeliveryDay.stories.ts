import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DeliveryDay from './DeliveryDay.vue';

/**
 * Колонка дня доставки (Figma `6226:118`): дата (`DS/Special/Special 14 Bold`) + `TimeSlot`-ы.
 * В выборе дня — ряд `DeliveryDay`. Выбранный интервал — `v-model`.
 */
const meta = {
  title: 'Cart & Checkout/DeliveryDay',
  component: DeliveryDay,
  tags: ['autodocs'],
  parameters: { maxWidth: 200 },
  argTypes: {
    day: { control: 'text', description: 'Figma: Day' },
    slots: { control: 'object', description: 'Подписи интервалов (TimeSlot)' },
    modelValue: { control: 'text', description: 'Выбранный интервал (Active)' },
  },
  args: {
    day: '25 квітня (Пт)',
    slots: ['10:00–11:00', '11:00–12:00', '12:00–13:00', '13:00–14:00', '14:00–15:00', '15:00–16:00'],
    modelValue: '11:00–12:00',
  },
} satisfies Meta<typeof DeliveryDay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoSelection: Story = { args: { modelValue: '' } };
export const English: Story = { args: { day: 'April 25 (Fri)', slots: ['10 am – 11 am', '11 am – 12 pm'], modelValue: '10 am – 11 am' } };

/** Ряд дней, как в выборе дня доставки. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { DeliveryDay },
    template: `
      <div style="display:flex;gap:var(--space-24);align-items:flex-start;padding:var(--space-24)">
        <DeliveryDay day="25 квітня (Пт)" />
        <DeliveryDay day="26 квітня (Сб)" model-value="" />
        <DeliveryDay day="28 квітня (Пн)" model-value="15:00–16:00" />
      </div>`,
  }),
};
