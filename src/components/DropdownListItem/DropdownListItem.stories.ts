import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DropdownListItem from './DropdownListItem.vue';

/**
 * Пункт выпадающего меню / списка (Figma `2525:6068`). Hover — `:hover` (или prop `hovered` для показа в докe).
 */
const meta = {
  title: 'Forms/dropdown-list-item',
  component: DropdownListItem,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 240,
    docs: {
      description: {
        component:
          'Пункт меню (Figma `2525:6068`): padding `space/8`, gap `space/12`, подпись `DS/Form/Input text`, hover — `surface/hover`. Опционально Checkbox S 16 и иконка 16 (Instance Swap → `icon`). Красная подпись — `destructive` (пункт Destructive в `menu`).',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Подпись (или слот по умолчанию)' },
    showCheckbox: { control: 'boolean', description: 'Figma: Show Checkbox?' },
    showIcon: { control: 'boolean', description: 'Figma: Show Icon?' },
    icon: { control: 'text', description: 'Figma: Icon (swap) — имя иконки, напр. tick-16' },
    checked: { control: 'boolean', description: 'Состояние вложенного Checkbox' },
    destructive: { control: 'boolean', description: 'Красная подпись (text/danger)' },
    disabled: { control: 'boolean' },
    hovered: { control: 'boolean', description: 'Figma: State=Hover (принудительно)' },
  },
  args: {
    label: 'Спочатку дешеві',
    showCheckbox: false,
    showIcon: false,
    icon: 'tick-16',
    checked: false,
    destructive: false,
    disabled: false,
    hovered: false,
  },
} satisfies Meta<typeof DropdownListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { args: { hovered: true } };
export const WithCheckbox: Story = { args: { showCheckbox: true, checked: true, label: 'Нова пошта' } };
export const WithIcon: Story = { args: { showIcon: true, icon: 'tick-16', label: 'За популярністю' } };
export const Destructive: Story = { args: { destructive: true, label: 'Видалити зі списку' } };
export const Disabled: Story = { args: { disabled: true } };
export const English: Story = { args: { label: 'Price: low to high' } };

/** Все варианты: Default / Hover × без / Checkbox / иконка. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { DropdownListItem },
    template: `
      <div style="display:grid;grid-template-columns:repeat(2,240px);gap:var(--space-8) var(--space-24);padding:var(--space-24)">
        <DropdownListItem label="Default" />
        <DropdownListItem label="Hover" hovered />
        <DropdownListItem label="Checkbox" show-checkbox />
        <DropdownListItem label="Checkbox · checked · hover" show-checkbox checked hovered />
        <DropdownListItem label="Icon" show-icon />
        <DropdownListItem label="Icon · hover" show-icon hovered />
        <DropdownListItem label="Checkbox + Icon" show-checkbox show-icon icon="heart-24" />
        <DropdownListItem label="Destructive" destructive />
        <DropdownListItem label="Disabled" disabled />
        <DropdownListItem label="Спочатку дорожчі" />
      </div>`,
  }),
};
