import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Breadcrumbs from './Breadcrumbs.vue';

const SIZES = ['11', '12', '13', '14'] as const;

/**
 * Хлебные крошки каталога (Figma `6131:9897`). Цвет `text/secondary`, разделитель `breadcrumbs-arrow-16`.
 * Размер текста — Size 11 / 12 / 13 / 14.
 */
const meta = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 480,
    docs: {
      description: {
        component:
          'Breadcrumbs (Figma `6131:9897`). Size 11 и 12 — `DS/Special/Special 12 Regular`, 13 — `Special 13 Regular`, 14 — `DS/Form/Input text`. Крошки — prop `items`; последняя — текущая страница.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES, description: 'Figma: Size' },
    items: { control: 'object', description: 'Текст крошек' },
  },
  args: { size: '11', items: ['Головна', 'Одяг та взуття', 'Жіночій одяг'] },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Size11: Story = {};
export const Size12: Story = { args: { size: '12' } };
export const Size13: Story = { args: { size: '13' } };
export const Size14: Story = { args: { size: '14' } };

/** Глубокая вложенность. */
export const Deep: Story = {
  args: { size: '13', items: ['Головна', 'Електроніка', 'Смартфони', 'Apple', 'iPhone 15 Pro'] },
};

/** Длинные названия (uk с Ґ Є І Ї + en). */
export const LongText: Story = {
  args: { size: '12', items: ['Головна', 'Ґаджети та Єдині набори', 'Іграшки / Kids & toys', 'Їжа'] },
};

export const English: Story = { args: { items: ['Home', 'Clothing & shoes', "Women's clothing"] } };

/** Все Size. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Breadcrumbs },
    setup: () => ({ SIZES }),
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-16);padding:var(--space-24)">
        <Breadcrumbs v-for="s in SIZES" :key="s" :size="s" />
      </div>`,
  }),
};
