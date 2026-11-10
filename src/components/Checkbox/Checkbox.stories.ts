import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Checkbox from './Checkbox.vue';

const SIZES = ['s', 'm', 'l'] as const;
const STATES = [
  { name: 'normal', props: {} },
  { name: 'checked', props: { checked: true } },
  { name: 'indeterminate', props: { indeterminate: true } },
  { name: 'disabled', props: { disabled: true } },
  { name: 'disabled-checked', props: { disabled: true, checked: true } },
];

/**
 * Чекбокс фильтров каталога (Figma `6124:2238`). Состояния: normal, hover (`:hover`), checked, indeterminate,
 * disabled, disabled-checked. Опционально — цветной образец (`showIcon`, только M / L) и счётчик товаров.
 */
const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 284,
    docs: {
      description: {
        component:
          'Чекбокс с подписью и счётчиком (Figma `6124:2238`). Size: S 16 (подпись Special 13) / M 20 (Form/Input text) / L 24 (Form/Mob Input Text), радиус квадрата radius/4. Отмечено — `surface/action/primary`, hover — `border/input-hover`, disabled — `surface/input/disabled` + `text/disabled`. Пустой `label` скрывает подпись.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES, description: 'Figma: Size (s=16, m=20, l=24)' },
    checked: { control: 'boolean', description: 'Figma: State=checked' },
    indeterminate: { control: 'boolean', description: 'Figma: State=indeterminate' },
    disabled: { control: 'boolean', description: 'Figma: State=disabled / disabled-checked' },
    showIcon: { control: 'boolean', description: 'Figma: Show icon? — цветной образец, только M / L' },
    color: { control: 'color', description: 'Цвет образца при showIcon' },
    label: { control: 'text', description: 'Подпись; пустая строка скрывает' },
    counter: { control: 'text', description: 'Счётчик товаров справа' },
    showCounter: { control: 'boolean' },
  },
  args: {
    size: 's',
    checked: false,
    indeterminate: false,
    disabled: false,
    showIcon: true,
    label: 'Nike',
    counter: 99,
    showCounter: true,
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Size S 16 — фильтр в сайдбаре каталога. */
export const SizeS: Story = { name: 'Size S', args: { size: 's', label: 'Нова пошта', counter: 128 } };
/** Size M 20 — с цветным образцом. */
export const SizeM: Story = { name: 'Size M', args: { size: 'm', checked: true, label: 'Рожевий', counter: 14 } };
/** Size L 24 — мобільна версія. */
export const SizeL: Story = { name: 'Size L', args: { size: 'l', label: 'Безкоштовна доставка', showIcon: false, counter: 56 } };
export const Checked: Story = { args: { checked: true, label: 'Знижка', counter: 32 } };
export const Indeterminate: Story = { args: { indeterminate: true, label: 'Усі бренди', counter: 240 } };
export const Disabled: Story = { args: { disabled: true, label: 'Немає в наявності', counter: 0 } };
export const DisabledChecked: Story = { args: { disabled: true, checked: true, label: 'Немає в наявності', counter: 0 } };
export const English: Story = { args: { label: 'Free shipping', counter: 56 } };
/** Без счётчика и подписи — квадрат для списков (DropdownListItem). */
export const BoxOnly: Story = { args: { label: '', showCounter: false } };

/** Все Size × State (колонки: размеры без / с образцом). Hover — наведите курсор. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Checkbox },
    setup: () => ({ SIZES, STATES }),
    template: `
      <div style="display:grid;grid-template-columns:max-content repeat(3,284px);gap:var(--space-16) var(--space-32);align-items:center;padding:var(--space-24)">
        <span></span>
        <code v-for="s in SIZES" :key="s" class="ds-text-special-special-12-regular">size {{ s }}</code>
        <template v-for="st in STATES" :key="st.name">
          <code class="ds-text-special-special-12-regular">{{ st.name }}</code>
          <Checkbox v-for="s in SIZES" :key="st.name + s" :size="s" v-bind="st.props" :show-icon="s !== 's'" label="Фільтр / Filter" :counter="99" />
        </template>
      </div>`,
  }),
};
