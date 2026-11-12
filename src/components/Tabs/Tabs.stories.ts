import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import Tabs from './Tabs.vue';
import TabItem from '../TabItem/TabItem.vue';

const ITEMS = [
  { label: 'Опис', value: 'description' },
  { label: 'Характеристики', value: 'specs' },
  { label: 'Відгуки (12)', value: 'reviews' },
  { label: 'Доставка і оплата', value: 'delivery' },
];

/**
 * Вкладки страницы товара (Figma `6245:12658`): `TabItem` в ряд, шаг `space/32`, нижняя линия 1 px `border/divider`.
 * Ширина — Fill; на мобайле — горизонтальный скролл. Чекаут-вариант (без линии, шаг `space/24`, отступ вкладок 16)
 * собирается props `divider`, `gap`, `paddingX`. Вкладки — `items` + `v-model` или слот с `TabItem`.
 */
const meta = {
  title: 'Product/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { maxWidth: 1216 },
  argTypes: {
    items: { control: 'object', description: 'Список вкладок { label, value }' },
    modelValue: { control: 'text', description: 'Активная вкладка (v-model)' },
    divider: { control: 'boolean', description: 'Нижняя линия 1 px border/divider' },
    gap: { control: 'text', description: 'Шаг между вкладками (CSS), по умолчанию var(--space-32)' },
    paddingX: { control: 'text', description: 'Горизонтальный отступ вкладки (CSS), по умолчанию 0' },
  },
  args: { items: ITEMS, modelValue: 'description', divider: true, gap: 'var(--space-32)', paddingX: 'var(--space-0)' },
  render: (args) => ({
    components: { Tabs },
    setup: () => ({ args, active: ref(args.modelValue) }),
    template: '<Tabs v-bind="args" v-model="active" />',
  }),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Страница товара. Клик переключает вкладку. */
export const Default: Story = {};
/** Чекаут: без линии, шаг 24, отступ вкладок 16. */
export const Checkout: Story = {
  args: {
    items: [
      { label: 'Доставка', value: 'delivery' },
      { label: 'Оплата', value: 'payment' },
    ],
    modelValue: 'delivery',
    divider: false,
    gap: 'var(--space-24)',
    paddingX: 'var(--space-0)',
  },
};
/** Вкладки слотом. */
export const SlotItems: Story = {
  render: () => ({
    components: { Tabs, TabItem },
    template: `
      <Tabs>
        <TabItem label="Description" active />
        <TabItem label="Specifications" />
        <TabItem label="Reviews (12)" />
      </Tabs>`,
  }),
};

export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Tabs },
    setup: () => ({ ITEMS, a: ref('specs'), b: ref('delivery') }),
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-24);padding:var(--space-24)">
        <Tabs :items="ITEMS" v-model="a" />
        <Tabs :items="ITEMS.slice(0, 2)" v-model="b" :divider="false" gap="var(--space-24)" />
      </div>`,
  }),
};
