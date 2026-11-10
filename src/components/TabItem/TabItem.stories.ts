import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TabItem from './TabItem.vue';

/**
 * Вкладка (Figma `6245:12657`), `DS/Special/Special 16 Medium`. **Default** — `text/secondary`, **Active** — `text/primary`
 * и нижняя линия 2 px `border/input-active`. Горизонтальный отступ — CSS-переменная `--ds-tab-padding-x` (по умолчанию 0).
 */
const meta = {
  title: 'Product/TabItem',
  component: TabItem,
  tags: ['autodocs'],
  parameters: { maxWidth: 400 },
  argTypes: {
    label: { control: 'text', description: 'Figma: Label (также слот по умолчанию)' },
    active: { control: 'boolean', description: 'Figma: State=Active' },
  },
  args: { label: 'Опис', active: false },
} satisfies Meta<typeof TabItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Active: Story = { args: { active: true } };
export const English: Story = { args: { label: 'Reviews (12)', active: true } };

/** Default (+ hover при наведении) и Active. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { TabItem },
    template: `
      <div style="display:flex;gap:var(--space-32);align-items:flex-start;padding:var(--space-24)">
        <TabItem label="Характеристики" />
        <TabItem label="Характеристики" active />
      </div>`,
  }),
};
