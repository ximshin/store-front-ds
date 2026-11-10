import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SectionTitle from './SectionTitle.vue';
import ButtonFront from '../ButtonFront/ButtonFront.vue';
import Icon from '../Icon/Icon.vue';

const SIZES = ['s', 'm', 'l'] as const;

/**
 * Заголовок блока формы / секции (Figma `6346:516`): «Одержувач», «Доставка», «Оплата», «Ваше замовлення».
 * Заголовок слева, слот `action` справа (по умолчанию ButtonFront Flat M «Увійти» с `user-24`).
 */
const meta = {
  title: 'Forms/SectionTitle',
  component: SectionTitle,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 568,
    docs: {
      description: {
        component:
          'Заголовок блока формы (Figma `6346:516`). Size: S — `DS/Heading/Group Title` 14/20, M — `DS/Heading/H4` 16/24, L — `DS/Heading/Page Title` 18/24; цвет `text/primary`. Нижний отступ `space/8`, ширина Fill. Слот `action` — справа.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES, description: 'Figma: Size (S / M / L)' },
    title: { control: 'text', description: 'Figma: Title' },
    showAction: { control: 'boolean', description: 'Figma: Show action' },
    action: { control: false, description: 'Слот: действие справа. По умолчанию ButtonFront Flat M «Увійти».' },
  },
  args: { size: 's', title: 'Одержувач замовлення', showAction: true },
} satisfies Meta<typeof SectionTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const S: Story = { args: { size: 's' } };
export const M: Story = { args: { size: 'm', title: 'Спосіб доставки' } };
export const L: Story = { args: { size: 'l', title: 'Оформлення замовлення' } };

/** Без действия. */
export const WithoutAction: Story = { args: { showAction: false, title: 'Спосіб оплати' } };

/** Своё действие в слоте `action`. */
export const CustomAction: Story = {
  args: { size: 'm', title: 'Ваше замовлення' },
  render: (args) => ({
    components: { SectionTitle, ButtonFront, Icon },
    setup: () => ({ args }),
    template: `
      <SectionTitle v-bind="args">
        <template #action>
          <ButtonFront type="flat" size="m" label="Змінити" show-left-icon>
            <template #left><Icon name="edit-16" /></template>
          </ButtonFront>
        </template>
      </SectionTitle>`,
  }),
};

/** Длинный заголовок (uk с Ґ Є І Ї) переносится, действие не сжимается. */
export const LongText: Story = {
  args: { size: 'm', title: 'Одержувач замовлення: Ґанок Єнакієвський, Їжакова вулиця, Іванівка — контактні дані' },
};

export const English: Story = { args: { size: 'm', title: 'Recipient details' } };

/** Все Size, с действием и без. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { SectionTitle },
    setup: () => ({ SIZES }),
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-16);max-width:568px;padding:var(--space-24)">
        <template v-for="s in SIZES" :key="s">
          <code class="ds-text-special-special-12-regular">{{ s }}</code>
          <SectionTitle :size="s" />
          <SectionTitle :size="s" :show-action="false" title="Доставка" />
        </template>
      </div>`,
  }),
};
