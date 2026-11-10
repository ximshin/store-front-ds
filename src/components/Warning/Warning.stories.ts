import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Warning from './Warning.vue';

const TYPES = ['warning', 'info', 'danger', 'success'] as const;

/**
 * Плашка-сообщение (Figma `6345:311`): иконка статуса 16 + текст `DS/Paragraph/P1` + подсказка (i).
 * Type: **warning / info / danger / success** — фон `bg/<status>/light`, иконка `icon/<status>`.
 * Подсказка (i) показывает `tooltip` по наведению / фокусу. Ширина — Fill.
 */
const meta = {
  title: 'Overlays & Feedback/warning',
  component: Warning,
  tags: ['autodocs'],
  parameters: { maxWidth: 460 },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES, description: 'Figma: Type' },
    text: { control: 'text', description: 'Figma: Text (также слот по умолчанию)' },
    showInfo: { control: 'boolean', description: 'Figma: Show info — иконка (i) с подсказкой' },
    tooltip: { control: 'text', description: 'Текст подсказки (слот `tooltip`); по умолчанию — текст из Figma' },
  },
  args: { type: 'warning', text: 'Знижки не діють під час оплати цим способом', showInfo: true },
} satisfies Meta<typeof Warning>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WarningType: Story = { name: 'Warning', args: { type: 'warning' } };
export const Info: Story = { args: { type: 'info', text: 'Безкоштовна доставка від 2 000 грн' } };
export const Danger: Story = { args: { type: 'danger', text: 'Товар закінчився на складі' } };
export const Success: Story = { args: { type: 'success', text: 'Промокод SMART10 застосовано' } };
export const WithoutInfo: Story = { args: { showInfo: false } };
export const LongText: Story = {
  args: { text: 'Ґарантійний термін для товарів із пошкодженою упаковкою може бути зменшено — уточнюйте в менеджера' },
};
export const English: Story = { args: { text: 'Discounts do not apply when paying this way', tooltip: 'Promo codes and gifts are unavailable.' } };

export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Warning },
    setup: () => ({ TYPES }),
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-16);max-width:460px;padding:var(--space-24)">
        <Warning v-for="t in TYPES" :key="t" :type="t" />
        <Warning type="info" :show-info="false" text="Без іконки підказки" />
      </div>`,
  }),
};
