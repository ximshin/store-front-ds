import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PopupTitle from './PopupTitle.vue';

/**
 * Шапка попапа (Figma `6315:219`): заголовок H2, счётчик «• N», кнопка закрытия и описание. Используется в попапах
 * «Кошик» и «Товари закінчилися». Ширина — Fill по ширине попапа.
 */
const meta = {
  title: 'Overlays & Feedback/PopupTitle',
  component: PopupTitle,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 800,
    docs: {
      description: {
        component:
          'Шапка попапа (Figma `6315:219`). Заголовок `DS/Heading/H2`, счётчик `• N` (`text/secondary`), закрытие — `IconButton` (cross-16), описание `DS/Paragraph/P1`.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', description: 'Figma: Title' },
    showCounter: { control: 'boolean', description: 'Figma: Show counter?' },
    counter: { control: 'text', description: 'Figma: Counter' },
    showDescription: { control: 'boolean', description: 'Figma: Show description?' },
    description: { control: 'text', description: 'Figma: Description' },
    showClose: { control: 'boolean', description: 'Figma: Show close?' },
    closeLabel: { control: 'text', description: 'Доступное имя кнопки закрытия' },
  },
  args: {
    title: 'Товари закінчилися',
    showCounter: false,
    counter: '9',
    showDescription: true,
    showClose: true,
  },
} satisfies Meta<typeof PopupTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Заголовок с описанием (Out of stock — Popup). */
export const WithDescription: Story = {};

/** Шапка корзины со счётчиком. */
export const WithCounter: Story = {
  args: { title: 'Кошик', showCounter: true, counter: '9', showDescription: false },
};

/** Только заголовок. */
export const TitleOnly: Story = { args: { title: 'Швидке замовлення', showDescription: false } };

/** Без кнопки закрытия. */
export const NoClose: Story = { args: { showClose: false } };

export const English: Story = {
  args: {
    title: 'Items out of stock',
    showCounter: true,
    counter: '3',
    description: 'These items are no longer available and will be removed from your order. You can place the order without them or go back to shopping.',
  },
};

/** Длинный заголовок и описание с Ґ Є І Ї. */
export const LongText: Story = {
  args: {
    title: 'Ґанок, Єнот, Їжак та Індик — товари закінчилися',
    description:
      'Ґудзики, єдиний їжачок, індиго й інші товари з Нової пошти наразі відсутні на складі, тому вони будуть вилучені із замовлення.',
  },
};

/** Все сочетания Show counter / Show description / Show close. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { PopupTitle },
    template: `
      <div style="display:grid;gap:var(--space-16);padding:var(--space-24);max-width:800px">
        <PopupTitle title="Кошик" show-counter counter="9" :show-description="false" />
        <PopupTitle title="Товари закінчилися" />
        <PopupTitle title="Товари закінчилися" show-counter counter="3" />
        <PopupTitle title="Промокод" :show-description="false" :show-close="false" />
      </div>`,
  }),
};
