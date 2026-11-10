import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CountryItem from './CountryItem.vue';

/**
 * Пункт списка стран/городов (Figma `6226:139`): флаг-эмодзи (`DS/Display/S`) + название (`DS/Paragraph/P1`).
 * State=Hover — наведение курсора (`:hover`, фон `surface/hover`).
 */
const meta = {
  title: 'Cart & Checkout/CountryItem',
  component: CountryItem,
  tags: ['autodocs'],
  parameters: { maxWidth: 284 },
  argTypes: {
    label: { control: 'text', description: 'Figma: Label' },
    flag: { control: 'text', description: 'Figma: Flag (эмодзи)' },
  },
  args: { label: 'Україна', flag: '🇺🇦' },
} satisfies Meta<typeof CountryItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Poland: Story = { args: { label: 'Польща', flag: '🇵🇱' } };
export const LongText: Story = { args: { label: 'Сполучені Штати Америки та залежні території', flag: '🇺🇸' } };
export const English: Story = { args: { label: 'Germany', flag: '🇩🇪' } };

/** Список стран; Hover — наведите курсор. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { CountryItem },
    template: `
      <div style="display:flex;flex-direction:column;align-items:flex-start;width:284px;padding:var(--space-24)">
        <CountryItem />
        <CountryItem label="Польща" flag="🇵🇱" />
        <CountryItem label="Німеччина" flag="🇩🇪" />
        <CountryItem label="Чехія" flag="🇨🇿" />
      </div>`,
  }),
};
