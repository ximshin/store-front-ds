import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Price from './Price.vue';

const SIZES = ['s', 'm', 'l'] as const;
const STATES = ['default', 'sale'] as const;

/**
 * Цена товара (Figma `6211:41`). Size: **S** 14 (строка корзины) / **M** 16 (карточка) / **L** 18 (итог).
 * State: **default** (`text/price`) / **sale** (`text/sale`). Старая цена — `DS/Price/Old`, зачёркнута.
 */
const meta = {
  title: 'Catalog/Price',
  component: Price,
  tags: ['autodocs'],
  parameters: { maxWidth: 400 },
  argTypes: {
    price: { control: 'text', description: 'Figma: Price' },
    oldPrice: { control: 'text', description: 'Figma: Old price' },
    showOldPrice: { control: 'boolean', description: 'Figma: Show old price' },
    size: { control: 'inline-radio', options: SIZES, description: 'Figma: Size (s=14, m=16, l=18)' },
    state: { control: 'inline-radio', options: STATES, description: 'Figma: State' },
  },
  args: { price: '1 599 грн', oldPrice: '1 999 грн', showOldPrice: true, size: 'm', state: 'default' },
} satisfies Meta<typeof Price>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Цена в карточке товара. */
export const Default: Story = {};
/** Акционная цена. */
export const Sale: Story = { args: { state: 'sale' } };
/** Цена в строке корзины. */
export const SizeS: Story = { args: { size: 's', price: '24 990 грн', oldPrice: '27 990 грн', state: 'sale' } };
/** Итог заказа. */
export const SizeL: Story = { args: { size: 'l', price: '48 380 грн', showOldPrice: false } };
export const WithoutOldPrice: Story = { args: { showOldPrice: false } };
export const English: Story = { args: { price: '$39.99', oldPrice: '$49.99', state: 'sale' } };

/** Size × State, со старой ценой и без. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { Price },
    setup: () => ({ SIZES, STATES }),
    template: `
      <div style="display:grid;grid-template-columns:max-content repeat(4,max-content);gap:var(--space-16) var(--space-32);align-items:baseline;padding:var(--space-24)">
        <span></span>
        <code v-for="st in STATES" :key="st" class="ds-text-special-special-12-regular">{{ st }}</code>
        <code v-for="st in STATES" :key="st + 'n'" class="ds-text-special-special-12-regular">{{ st }} · без старой</code>
        <template v-for="s in SIZES" :key="s">
          <code class="ds-text-special-special-12-regular">{{ s }}</code>
          <Price v-for="st in STATES" :key="s + st" :size="s" :state="st" />
          <Price v-for="st in STATES" :key="s + st + 'n'" :size="s" :state="st" :show-old-price="false" />
        </template>
      </div>`,
  }),
};
