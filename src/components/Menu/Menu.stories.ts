import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Menu from './Menu.vue';
import DropdownListItem from '../DropdownListItem/DropdownListItem.vue';

const ITEMS = ['Мої замовлення', 'Обране', 'Порівняння', 'Адреси доставки', 'Бонуси та купони', 'Налаштування', 'Допомога', 'Про магазин'];

/**
 * Выпадающее меню (Figma `1092:32969`): пункты `DropdownListItem` в слоте, опционально пункт Destructive и скролл.
 */
const meta = {
  title: 'Forms/menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 240,
    docs: {
      description: {
        component:
          'Меню (Figma `1092:32969`), ширина 240. Фон `surface/default`, тень `DS/Shadow/menu`, `radius/8`, padding списка `space/4`. Слот по умолчанию — список `DropdownListItem`, слот `destructive` — опасный пункт внизу (по умолчанию красный `DropdownListItem`). `showScroll` ограничивает высоту списка и включает прокрутку.',
      },
    },
  },
  argTypes: {
    showDestructive: { control: 'boolean', description: 'Figma: Show Destructive?' },
    showScroll: { control: 'boolean', description: 'Figma: Show scroll?' },
    destructiveLabel: { control: 'text', description: 'Подпись пункта Destructive' },
    maxHeight: { control: { type: 'number', min: 64, step: 8 }, description: 'Высота списка при showScroll, px' },
  },
  args: { showDestructive: true, showScroll: false, destructiveLabel: 'Вийти', maxHeight: 192 },
  render: (args) => ({
    components: { Menu, DropdownListItem },
    setup: () => ({ args, ITEMS }),
    template: `
      <Menu v-bind="args">
        <DropdownListItem v-for="(l, i) in ITEMS.slice(0, 5)" :key="l" :label="l" :hovered="i === 1" />
      </Menu>`,
  }),
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoDestructive: Story = { args: { showDestructive: false } };
export const Scroll: Story = {
  args: { showScroll: true, maxHeight: 160 },
  render: (args) => ({
    components: { Menu, DropdownListItem },
    setup: () => ({ args, ITEMS }),
    template: '<Menu v-bind="args"><DropdownListItem v-for="l in ITEMS" :key="l" :label="l" /></Menu>',
  }),
};
export const WithIconsAndCheckbox: Story = {
  render: (args) => ({
    components: { Menu, DropdownListItem },
    setup: () => ({ args }),
    template: `
      <Menu v-bind="args" :show-destructive="false">
        <DropdownListItem show-checkbox checked label="Нова пошта" />
        <DropdownListItem show-checkbox label="Укрпошта" />
        <DropdownListItem show-icon icon="heart-24" label="Додати в обране" />
      </Menu>`,
  }),
};
export const English: Story = {
  args: { destructiveLabel: 'Log out' },
  render: (args) => ({
    components: { Menu, DropdownListItem },
    setup: () => ({ args }),
    template: `
      <Menu v-bind="args">
        <DropdownListItem label="My orders" />
        <DropdownListItem label="Wishlist" />
        <DropdownListItem label="Settings" />
      </Menu>`,
  }),
};

/** Матрица: без / с Destructive × без / со скроллом. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Menu, DropdownListItem },
    setup: () => ({ ITEMS }),
    template: `
      <div style="display:grid;grid-template-columns:repeat(4,240px);gap:var(--space-24);align-items:start;padding:var(--space-24)">
        <Menu :show-destructive="false"><DropdownListItem v-for="l in ITEMS.slice(0,4)" :key="l" :label="l" /></Menu>
        <Menu destructive-label="Вийти"><DropdownListItem v-for="l in ITEMS.slice(0,4)" :key="l" :label="l" /></Menu>
        <Menu show-scroll :show-destructive="false" :max-height="128"><DropdownListItem v-for="l in ITEMS" :key="l" :label="l" /></Menu>
        <Menu show-scroll destructive-label="Видалити акаунт" :max-height="128"><DropdownListItem v-for="l in ITEMS" :key="l" :label="l" /></Menu>
      </div>`,
  }),
};
