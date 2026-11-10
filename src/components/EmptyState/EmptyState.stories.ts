import type { Meta, StoryObj } from '@storybook/vue3-vite';
import EmptyState from './EmptyState.vue';

const TYPES = ['cart', 'search', 'wishlist'] as const;

/**
 * Пустое состояние (Figma `6256:243`): иконка 40 в круге 96, заголовок H2, текст P1 и кнопка Primary L.
 * Ширина 560 → Fill на мобайле.
 */
const meta = {
  title: 'Overlays & Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 560,
    docs: {
      description: {
        component:
          'Пустое состояние (Figma `6256:243`). Figma: Type → `type` (cart / search / wishlist), Show action? → `showAction`. Тексты и иконка зависят от типа; переопределяются `title`, `description`, `action`.',
      },
    },
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES, description: 'Figma: Type' },
    showAction: { control: 'boolean', description: 'Figma: Show action?' },
    title: { control: 'text', description: 'Заголовок (по умолчанию — по типу)' },
    description: { control: 'text', description: 'Текст (по умолчанию — по типу)' },
    action: { control: 'text', description: 'Подпись кнопки (по умолчанию — по типу)' },
  },
  args: { type: 'cart', showAction: true },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cart: Story = {};
export const Search: Story = { args: { type: 'search' } };
export const Wishlist: Story = { args: { type: 'wishlist' } };
export const NoAction: Story = { args: { showAction: false } };

export const English: Story = {
  args: {
    title: 'Your cart is empty',
    description: 'Add items from the catalog — they will appear here.',
    action: 'Go to catalog',
  },
};

/** Длинные тексты с Ґ Є І Ї переносятся по центру. */
export const LongText: Story = {
  args: {
    type: 'search',
    title: 'За запитом «ґудзики єнотові їжакові» нічого не знайдено',
    description: 'Перевірте правопис, спробуйте коротший запит або оберіть іншу категорію чи скиньте всі фільтри в каталозі.',
  },
};

/** Все Type × Show action. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { EmptyState },
    setup: () => ({ TYPES }),
    template: `
      <div style="display:grid;grid-template-columns:repeat(3,560px);gap:var(--space-24);padding:var(--space-24)">
        <template v-for="t in TYPES" :key="t">
          <EmptyState :type="t" />
        </template>
        <template v-for="t in TYPES" :key="t + 'n'">
          <EmptyState :type="t" :show-action="false" />
        </template>
      </div>`,
  }),
};
