import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TokenGallery from './TokenGallery.vue';

const meta = {
  title: 'Foundation',
  component: TokenGallery,
  parameters: { layout: 'fullscreen', controls: { disable: true } },
} satisfies Meta<typeof TokenGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SemanticColors: Story = { name: 'Цвета — смысловые (Semantic)', args: { section: 'semantic-colors' } };
export const PrimitiveColors: Story = { name: 'Цвета — базовые (Primitive)', args: { section: 'primitive-colors' } };
export const Typography: Story = { name: 'Типографика', args: { section: 'typography' } };
export const Spacing: Story = { name: 'Отступы', args: { section: 'spacing' } };
export const Radius: Story = { name: 'Радиусы', args: { section: 'radius' } };
export const Shadows: Story = { name: 'Тени', args: { section: 'shadows' } };
