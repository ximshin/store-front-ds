import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Tooltip from './Tooltip.vue';

const POSITIONS = ['bottom', 'top'] as const;

/**
 * Подсказка (Figma `6149:8176`). Фон `surface/default`, тень `DS/Shadow/tooltip`, текст `DS/Paragraph/Tooltip`,
 * `radius/4`, ширина до 480. **Arrow position**: `bottom` — стрелка снизу (подсказка над элементом), `top` — сверху.
 */
const meta = {
  title: 'Overlays & Feedback/tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { maxWidth: 520 },
  argTypes: {
    arrowPosition: { control: 'inline-radio', options: POSITIONS, description: 'Figma: Arrow position' },
    text: { control: 'text', description: 'Текст подсказки (также слот по умолчанию); \\n — перенос строки' },
  },
  args: { arrowPosition: 'bottom' },
  decorators: [() => ({ template: '<div style="padding:var(--space-24)"><story /></div>' })],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArrowBottom: Story = {};
export const ArrowTop: Story = { args: { arrowPosition: 'top' } };
export const ShortText: Story = { args: { text: 'Доставка Новою поштою за 1–2 дні' } };
export const English: Story = { args: { text: 'Discounts do not apply when paying this way' } };

export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Tooltip },
    setup: () => ({ POSITIONS }),
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-32);padding:var(--space-24)">
        <Tooltip v-for="p in POSITIONS" :key="p" :arrow-position="p" />
      </div>`,
  }),
};
