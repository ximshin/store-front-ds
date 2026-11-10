import type { Meta, StoryObj } from '@storybook/vue3-vite';
import IconButton from './IconButton.vue';

const ICONS = ['menu-24', 'user-24', 'cart-24', 'search-24', 'delete-16', 'cross-16', 'heart-24'] as const;

/**
 * Кнопка-иконка 32×32 без фона (Figma `6208:19`): мобильная шапка (меню, профіль, кошик, пошук), видалення товару в
 * кошику. Іконка 16 (`icon/strong`), радіус `radius/8`. Зона натискання розширена до 44 px (`size/touch-min`).
 */
const meta = {
  title: 'Actions/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 32,
    docs: {
      description: {
        component:
          'Кнопка-иконка 32×32 без фона (Figma `6208:19`). Figma: Icon (Instance Swap) → prop `icon` (имя иконки со страницы Icons) или слот по умолчанию. Фокус не показывается.',
      },
    },
  },
  argTypes: {
    icon: { control: 'select', options: ICONS, description: 'Figma: Icon (Instance Swap)' },
    label: { control: 'text', description: 'aria-label — у кнопки нет текста' },
    disabled: { control: 'boolean' },
    nativeType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
  },
  args: { icon: 'menu-24', label: 'Меню', disabled: false },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Меню в мобильной шапке (значение по умолчанию). */
export const Menu: Story = {};

/** Видалення товару в кошику. */
export const Delete: Story = { args: { icon: 'delete-16', label: 'Видалити товар' } };

export const Search: Story = { args: { icon: 'search-24', label: 'Search' } };

export const Disabled: Story = { args: { disabled: true } };

/** Іконки, що використовуються в шапці та кошику. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { IconButton },
    setup: () => ({ ICONS }),
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-24);align-items:center;padding:var(--space-24)">
        <div v-for="i in ICONS" :key="i" style="display:flex;flex-direction:column;align-items:center;gap:var(--space-8)">
          <IconButton :icon="i" :label="i" />
          <code class="ds-text-special-special-12-regular">{{ i }}</code>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:var(--space-8)">
          <IconButton disabled label="Меню" />
          <code class="ds-text-special-special-12-regular">disabled</code>
        </div>
      </div>`,
  }),
};
