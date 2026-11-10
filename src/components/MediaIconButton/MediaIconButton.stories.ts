import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MediaIconButton from './MediaIconButton.vue';

const SHAPES = ['rounded', 'square'] as const;
const ICONS = ['heart-24', 'compare-24', 'cross-16', 'arrow-right-16', 'arrow-left-16'] as const;

/** Підкладка під «фото» товару: кнопка напівпрозора, тож показуємо її на темному тлі та на світлому. */
const BACKDROPS = ['var(--surface-hover)', 'var(--surface-action-primary)'] as const;

/**
 * Кнопка-іконка поверх фото товару, 32×32 (Figma `6211:20`). **Rounded** — обране, порівняння, видалення з порівняння;
 * **Square** — стрілки галереї (назад — `flip`). Фон `surface/media/control`, hover — `surface/media/control-hover`.
 */
const meta = {
  title: 'Actions/MediaIconButton',
  component: MediaIconButton,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 32,
    docs: {
      description: {
        component:
          'Кнопка-иконка поверх фото (Figma `6211:20`). Figma: Shape → `shape` (rounded / square), Icon (Instance Swap) → `icon`. У Square по умолчанию `arrow-right-16`; «назад» — `flip`. Hover — `:hover`.',
      },
    },
  },
  argTypes: {
    shape: { control: 'inline-radio', options: SHAPES, description: 'Figma: Shape' },
    icon: { control: 'select', options: [undefined, ...ICONS], description: 'Figma: Icon (Instance Swap); по умолчанию heart-24 / arrow-right-16' },
    flip: { control: 'boolean', description: 'Поворот иконки на 180° (стрелка «назад»)' },
    label: { control: 'text', description: 'aria-label — у кнопки нет текста' },
    disabled: { control: 'boolean' },
    nativeType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
  },
  args: { shape: 'rounded', flip: false, label: 'Додати в обране', disabled: false },
} satisfies Meta<typeof MediaIconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Обране на картці товару. */
export const Rounded: Story = {};

/** Порівняння. */
export const Compare: Story = { args: { icon: 'compare-24', label: 'Додати до порівняння' } };

/** Видалення товару з таблиці порівняння (CompareCard). */
export const Remove: Story = { args: { icon: 'cross-16', label: 'Прибрати з порівняння' } };

/** Стрілка галереї. */
export const Square: Story = { args: { shape: 'square', label: 'Next photo' } };

/** Стрілка «назад» — та сама іконка, повернута на 180°. */
export const SquareBack: Story = { args: { shape: 'square', flip: true, label: 'Попереднє фото' } };

export const Disabled: Story = { args: { disabled: true } };

/** Shape × іконки на світлому та темному тлі. Hover — наведіть курсор. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { MediaIconButton },
    setup: () => ({ BACKDROPS }),
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-24);padding:var(--space-24)">
        <div v-for="bg in BACKDROPS" :key="bg" :style="{ background: bg }" style="display:flex;flex-direction:column;gap:var(--space-16);padding:var(--space-24);border-radius:var(--radius-12)">
          <div style="display:flex;gap:var(--space-16);align-items:center">
            <MediaIconButton label="Обране" />
            <MediaIconButton icon="compare-24" label="Порівняння" />
            <MediaIconButton icon="cross-16" label="Прибрати" />
            <MediaIconButton disabled label="Обране" />
          </div>
          <div style="display:flex;gap:var(--space-16);align-items:center">
            <MediaIconButton shape="square" flip label="Назад" />
            <MediaIconButton shape="square" label="Вперед" />
            <MediaIconButton shape="square" disabled label="Вперед" />
          </div>
        </div>
      </div>`,
  }),
};
