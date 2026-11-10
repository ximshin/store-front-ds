import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PromoChip from './PromoChip.vue';

/**
 * Применённый промокод (Figma `6215:61`): код `DS/Special/Special 13 Regular` + удаление (`cross-16`, `icon/secondary`
 * в зоне 24). Высота 24, обводка 1 px `border/input`, `radius/8`. Удаление — событие `remove`.
 */
const meta = {
  title: 'Cart & Checkout/PromoChip',
  component: PromoChip,
  tags: ['autodocs'],
  parameters: { maxWidth: 400 },
  argTypes: {
    code: { control: 'text', description: 'Figma: Code (также слот по умолчанию)' },
  },
  args: { code: 'SMART10' },
} satisfies Meta<typeof PromoChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LongCode: Story = { args: { code: 'ҐЕРДЗ-ЄДИНИЙ-2026-ЇЖАК' } };
export const English: Story = { args: { code: 'WELCOME15' } };

export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { PromoChip },
    template: `
      <div style="display:flex;gap:var(--space-16);align-items:center;padding:var(--space-24)">
        <PromoChip />
        <PromoChip code="ЗИМА-2026" />
        <PromoChip code="WELCOME15" />
      </div>`,
  }),
};
