import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SearchBar from './SearchBar.vue';
import SearchIconSize from './SearchIconSize.vue';
import CrossIconSize from './CrossIconSize.vue';

const SIZES = ['s', 'm', 'l'] as const;

/**
 * Поиск в шапке и каталоге (Figma `6127:2471`). Height **S/M/L** = 32 / 40 / 48, Icon size **S/M/L** = 20 / 24 / 32.
 * Иконки — части `search-icon-size` (`6127:2496`) и `cross-icon-size` (`6127:2510`).
 */
const meta = {
  title: 'Forms/search-bar',
  component: SearchBar,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 493,
    docs: {
      description: {
        component:
          'Поиск (Figma `6127:2471`). Собран из `InputMain`, иконки — `SearchIconSize` / `CrossIconSize` (внутренние части той же папки). Рамка border/divider, радиус 8. Крестик очищает значение (`clear`).',
      },
    },
  },
  argTypes: {
    modelValue: { control: 'text' },
    placeholder: { control: 'text' },
    height: { control: 'inline-radio', options: SIZES, description: 'Figma: Height (s=32, m=40, l=48)' },
    iconSize: { control: 'inline-radio', options: SIZES, description: 'Figma: Icon size (s=20, m=24, l=32)' },
    showLeftIcon: { control: 'boolean', description: 'Figma: Show left icon' },
    showRightIcon: { control: 'boolean', description: 'Figma: Show right icon' },
  },
  args: {
    modelValue: 'пошук товарів',
    placeholder: 'пошук товарів',
    height: 's',
    iconSize: 's',
    showLeftIcon: true,
    showRightIcon: true,
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Как в Figma: Height S, Icon size S. */
export const Default: Story = {};

export const HeightM: Story = { args: { height: 'm', iconSize: 'm' } };
export const HeightL: Story = { args: { height: 'l', iconSize: 'l' } };
export const Empty: Story = { args: { modelValue: '', placeholder: 'Пошук товарів: кросівки, куртки…', showRightIcon: false } };
export const English: Story = { args: { modelValue: 'search products', placeholder: 'search products' } };

/** Длинный запрос с Ґ Є І Ї обрезается полем. */
export const LongText: Story = {
  args: { modelValue: 'Ґумові чоботи для дівчинки, їжачок Євген, Іванка — зимова колекція, розмір 36–38', height: 'm', iconSize: 'm' },
};

/** Height × Icon size (9 вариантов Figma). */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { SearchBar },
    setup: () => ({ SIZES }),
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-16);padding:var(--space-24);max-width:493px">
        <template v-for="h in SIZES" :key="h">
          <SearchBar v-for="i in SIZES" :key="h + i" :height="h" :icon-size="i" model-value="пошук товарів" />
        </template>
      </div>`,
  }),
};

/** Части search-bar: search-icon-size и cross-icon-size, 20 / 24 / 32. */
export const IconParts: Story = {
  name: 'Части: search-icon-size / cross-icon-size',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { SearchIconSize, CrossIconSize },
    template: `
      <div style="display:flex;gap:var(--space-32);align-items:center;padding:var(--space-24);color:var(--text-primary)">
        <SearchIconSize icon-size="20"/><SearchIconSize icon-size="24"/><SearchIconSize icon-size="32"/>
        <SearchIconSize icon-size="24" show-count :count="3"/>
        <CrossIconSize icon-size="20"/><CrossIconSize icon-size="24"/><CrossIconSize icon-size="32"/>
      </div>`,
  }),
};
