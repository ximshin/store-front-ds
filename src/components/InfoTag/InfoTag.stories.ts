import type { Meta, StoryObj } from '@storybook/vue3-vite';
import InfoTag from './InfoTag.vue';

/**
 * Информационный тег товара (Figma `6213:10`): иконка 16 (`icon/strong`) + `DS/Special/Special 12 Regular`,
 * фон `surface/hover`, `radius/4`. Иконка — prop `icon` (имя из DS) или слот `icon`.
 */
const meta = {
  title: 'Cart & Checkout/InfoTag',
  component: InfoTag,
  tags: ['autodocs'],
  parameters: { maxWidth: 400 },
  argTypes: {
    label: { control: 'text', description: 'Figma: Label (также слот по умолчанию)' },
    icon: { control: 'text', description: 'Figma: Icon (swap) — имя иконки, напр. file-16' },
  },
  args: { label: 'Електронний товар', icon: 'file-16' },
} satisfies Meta<typeof InfoTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const OtherIcon: Story = { args: { label: 'Безкоштовна доставка', icon: 'tag-16' } };
export const LongText: Story = { args: { label: 'Ґарантія від виробника 24 місяці · Єдиний сервіс · Warranty included' } };
export const English: Story = { args: { label: 'Digital product' } };

export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { InfoTag },
    template: `
      <div style="display:flex;gap:var(--space-16);flex-wrap:wrap;padding:var(--space-24)">
        <InfoTag />
        <InfoTag label="Знижка" icon="tag-16" />
        <InfoTag label="Повернення 14 днів" icon="return-16" />
        <InfoTag label="Digital product" />
      </div>`,
  }),
};
