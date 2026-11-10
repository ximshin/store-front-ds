import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DropdownList from './DropdownList.vue';

const SORT = ['за популярністю', 'спочатку дешевше', 'спочатку дорожче'];

/**
 * Список выбора сортировки каталога (Figma `6131:9837`), без вариантов. Выбранный пункт подсвечен `surface/hover`.
 */
const meta = {
  title: 'Forms/dropdown-list',
  component: DropdownList,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 200,
    docs: {
      description: {
        component:
          'Список выбора (Figma `6131:9837`): фон `surface/default`, `radius/8`, вертикальный padding `space/4`, пункты `space/8 · space/12`, подпись `DS/Form/Input text`. Тень Figma — Effect «dropdown-menu»; в коде ближайший токен `--shadow-dropdown`.',
      },
    },
  },
  argTypes: {
    items: { control: 'object', description: 'Подписи пунктов' },
    modelValue: { control: 'select', options: SORT, description: 'Выбранный пункт' },
  },
  args: { items: SORT, modelValue: SORT[0] },
} satisfies Meta<typeof DropdownList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SecondSelected: Story = { args: { modelValue: SORT[1] } };
export const English: Story = {
  args: { items: ['most popular', 'price: low to high', 'price: high to low'], modelValue: 'most popular' },
};

/** Выбор живой: клик меняет выбранный пункт. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { DropdownList },
    setup: () => ({ SORT }),
    template: `
      <div style="display:flex;gap:var(--space-24);align-items:start;padding:var(--space-24)">
        <div style="width:200px"><DropdownList :items="SORT" :model-value="SORT[0]" /></div>
        <div style="width:200px"><DropdownList :items="SORT" :model-value="SORT[2]" /></div>
        <div style="width:200px"><DropdownList :items="SORT" /></div>
      </div>`,
  }),
};
