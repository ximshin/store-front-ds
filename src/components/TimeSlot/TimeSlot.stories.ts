import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TimeSlot from './TimeSlot.vue';

/**
 * Интервал доставки курьером (Figma `6226:116`). `DS/Form/Input text`, отступы `space/4` × `space/8`, `radius/4`.
 * State=Active — обводка `border/input-active`.
 */
const meta = {
  title: 'Cart & Checkout/TimeSlot',
  component: TimeSlot,
  tags: ['autodocs'],
  parameters: { maxWidth: 200 },
  argTypes: {
    label: { control: 'text', description: 'Figma: Label' },
    active: { control: 'boolean', description: 'Figma: State=Active' },
  },
  args: { label: '10:00–15:00', active: false },
} satisfies Meta<typeof TimeSlot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};
export const Active: Story = { args: { active: true } };
export const English: Story = { args: { label: '10 am – 3 pm' } };

export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { TimeSlot },
    template: `
      <div style="display:flex;gap:var(--space-24);align-items:flex-start;padding:var(--space-24)">
        <TimeSlot label="10:00–15:00" />
        <TimeSlot label="10:00–15:00" active />
      </div>`,
  }),
};
