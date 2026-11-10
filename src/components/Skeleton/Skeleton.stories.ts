import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Skeleton from './Skeleton.vue';

const SHAPES = ['text', 'rect', 'circle'] as const;

/**
 * Заглушка загрузки (Figma `6275:15436`). Заливка `surface/hover`, пульсация opacity.
 * Размер задаётся на экземпляре: `width` / `height`.
 */
const meta = {
  title: 'Overlays & Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 240,
    docs: {
      description: {
        component:
          'Заглушка (Figma `6275:15436`). Figma: Shape → `shape` (text — строка 16, radius/4; rect — блок, radius/8; circle — radius/full). Размеры по умолчанию как в Figma: 200×16 / 120×120 / 40×40. Пульсацию отключает `static` (и `prefers-reduced-motion`).',
      },
    },
  },
  argTypes: {
    shape: { control: 'inline-radio', options: SHAPES, description: 'Figma: Shape' },
    width: { control: 'text', description: 'Ширина: число (px) или CSS-значение' },
    height: { control: 'text', description: 'Высота: число (px) или CSS-значение' },
    static: { control: 'boolean', description: 'Без пульсации' },
  },
  args: { shape: 'text', static: false },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {};
export const Rect: Story = { args: { shape: 'rect' } };
export const Circle: Story = { args: { shape: 'circle' } };
export const Static: Story = { args: { shape: 'rect', static: true } };

/** Строки произвольной ширины — подпись товара «Ґудзики Єнот» и цена. */
export const CustomSize: Story = { args: { shape: 'text', width: '100%', height: 20 } };

/** Все Shape. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Skeleton },
    setup: () => ({ SHAPES }),
    template: `
      <div style="display:flex;gap:var(--space-24);align-items:center;padding:var(--space-24)">
        <Skeleton v-for="s in SHAPES" :key="s" :shape="s" />
      </div>`,
  }),
};
