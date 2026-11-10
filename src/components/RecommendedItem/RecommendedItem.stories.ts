import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RecommendedItem from './RecommendedItem.vue';

/**
 * Мини-карточка рекомендованного / похожего товара (Figma `6215:134`, recommended-item и similar-item — один компонент).
 * 140 px: фото 140×140, название `DS/Special/Special 13 Regular`, `Price` S, `button-front` Primary M «До кошика».
 * Фото — prop `image` (url), без него — `no-photo-24`.
 */
const meta = {
  title: 'Cart & Checkout/RecommendedItem',
  component: RecommendedItem,
  tags: ['autodocs'],
  parameters: { maxWidth: 140 },
  argTypes: {
    title: { control: 'text', description: 'Figma: Title' },
    image: { control: 'text', description: 'URL фото товара' },
    price: { control: 'text' },
    oldPrice: { control: 'text' },
    buttonLabel: { control: 'text' },
  },
  args: { title: 'Футболка Basic жіноча', price: '799 грн', oldPrice: '999 грн', buttonLabel: 'До кошика' },
} satisfies Meta<typeof RecommendedItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Карточка рекомендованного товара. */
export const Default: Story = {};

/** Длинное название (uk с Ґ Є І Ї). */
export const LongText: Story = {
  args: { title: 'Ґудзики Єдині Їжачки: жіночий светр преміум-класу з органічної бавовни' },
};

/** Английский текст. */
export const English: Story = { args: { title: 'Women ZigZag Sweatshirt', price: '$39', oldPrice: '$49', buttonLabel: 'Add to cart' } };

/** Ряд карточек. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { RecommendedItem },
    template: `
      <div style="display:flex;align-items:flex-start;gap:var(--space-16);padding:var(--space-24)">
        <RecommendedItem />
        <RecommendedItem title="Навушники Apple AirPods Max" price="20 899 грн" old-price="30 299 грн" />
        <RecommendedItem title="Ґринджоли Єдині Їжачки, довга назва товару для перевірки переносу" />
      </div>`,
  }),
};
