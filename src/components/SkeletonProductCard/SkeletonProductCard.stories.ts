import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SkeletonProductCard from './SkeletonProductCard.vue';

const STATES = ['default', 'compact'] as const;

/**
 * Заглушка карточки товара (Figma `6275:15451`) во время загрузки каталога и подборок: фото + 4 строки `Skeleton`.
 */
const meta = {
  title: 'Overlays & Feedback/SkeletonProductCard',
  component: SkeletonProductCard,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 300,
    docs: {
      description: {
        component:
          'Заглушка карточки (Figma `6275:15451`). Figma: State → `state` (default 300 — как ProductCard Default; compact 183 — мобайл). Собрана из `Skeleton`. `static` отключает пульсацию.',
      },
    },
  },
  argTypes: {
    state: { control: 'inline-radio', options: STATES, description: 'Figma: State' },
    static: { control: 'boolean', description: 'Без пульсации' },
  },
  args: { state: 'default', static: false },
} satisfies Meta<typeof SkeletonProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Compact: Story = { args: { state: 'compact' }, parameters: { maxWidth: 183 } };

/** Сетка заглушек при загрузке каталога. */
export const Grid: Story = {
  parameters: { fullWidth: true, controls: { disable: true } },
  render: () => ({
    components: { SkeletonProductCard },
    template: `
      <div style="display:grid;grid-template-columns:repeat(4,300px);gap:var(--space-16);padding:var(--space-24)">
        <SkeletonProductCard v-for="i in 4" :key="i" />
      </div>`,
  }),
};

/** Все State. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { SkeletonProductCard },
    setup: () => ({ STATES }),
    template: `
      <div style="display:flex;gap:var(--space-24);align-items:flex-start;padding:var(--space-24)">
        <SkeletonProductCard v-for="s in STATES" :key="s" :state="s" />
      </div>`,
  }),
};
