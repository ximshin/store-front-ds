import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AddressCard from './AddressCard.vue';

const STATES = ['normal', 'active', 'popup'] as const;

/**
 * Отделение/пункт выдачи в списке и на карте (Figma `6226:110`). **normal** — перевозчик, адрес, срок, цена;
 * **active** — плюс график работы и кнопка «Доставити сюди», обводка `border/input-active`;
 * **popup** — то же на карте, тень `DS/Shadow/menu`.
 */
const meta = {
  title: 'Cart & Checkout/AddressCard',
  component: AddressCard,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 284,
    docs: {
      description: {
        component:
          'Карточка отделения (Figma `6226:110`). Иконка перевозчика — prop `carrierIcon` (по умолчанию `location-24`, цвет `icon/danger`) или слот `carrier-icon` для логотипа.',
      },
    },
  },
  argTypes: {
    state: { control: 'inline-radio', options: STATES, description: 'Figma: State' },
    carrier: { control: 'text', description: 'Figma: Carrier' },
    address: { control: 'text', description: 'Figma: Address' },
    date: { control: 'text', description: 'Figma: Date' },
    price: { control: 'text', description: 'Figma: Price' },
    carrierIcon: { control: 'text', description: 'Figma: Carrier icon (swap) — имя иконки' },
    scheduleTitle: { control: 'text', description: 'Figma: Schedule title' },
    schedule: { control: 'text', description: 'Figma: Schedule (\\n — перенос строки)' },
    buttonLabel: { control: 'text' },
  },
  args: {
    state: 'normal',
    carrier: 'Нова Пошта №1',
    address: '№1, вул. Пирогівський шлях, 135',
    date: 'Відправимо завтра',
    price: '159 ₴',
    carrierIcon: 'location-24',
    scheduleTitle: 'Графік роботи',
    schedule: 'Пн-Пт: 09:00–18:00\nСб: 09:00–15:00',
    buttonLabel: 'Доставити сюди',
  },
} satisfies Meta<typeof AddressCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};
export const Active: Story = { args: { state: 'active' } };
export const Popup: Story = { args: { state: 'popup' } };
export const LongText: Story = {
  args: {
    state: 'active',
    address: '№17 (до 30 кг), вул. Хрещатик, 22, Київ, Шевченківський район, біля станції метро «Хрещатик»',
    date: 'Відправимо післязавтра, у понеділок',
  },
};
export const English: Story = {
  args: {
    state: 'active',
    carrier: 'Nova Post #1',
    address: '#1, Pyrohivskyi Shliakh St, 135',
    date: 'Ships tomorrow',
    scheduleTitle: 'Opening hours',
    schedule: 'Mon-Fri: 09:00–18:00\nSat: 09:00–15:00',
    buttonLabel: 'Deliver here',
  },
};

/** Все три состояния рядом. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { AddressCard },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-16);align-items:flex-start;padding:var(--space-24);background:var(--surface-subtle)">
        <div style="width:284px"><AddressCard state="normal" /></div>
        <div style="width:284px"><AddressCard state="active" /></div>
        <div style="width:284px"><AddressCard state="popup" /></div>
      </div>`,
  }),
};
