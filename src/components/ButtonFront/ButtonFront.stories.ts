import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ButtonFront from './ButtonFront.vue';
import Icon from '../Icon/Icon.vue';

const TYPES = ['primary', 'default', 'destructive', 'delete', 'flat', 'dropdown'] as const;
const SIZES = ['l', 'm', 's'] as const;

/**
 * Кнопка витрины (Figma `2520:562`). **primary** — основное действие на экране (одно), **default** — второстепенные,
 * **delete** — только удаление, **destructive** — другие опасные действия. Hover — `:hover`, Disabled — prop `disabled`.
 */
const meta = {
  title: 'Actions/button-front',
  component: ButtonFront,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Кнопка витрины (Figma `2520:562`). Size: S 24 / M 32 / L 40, подписи `DS/Form/Button S|M|L label`. Радиус: L — radius/4, M — radius/8, S — radius/6. Иконки слева / справа — слоты `left` / `right`.',
      },
    },
  },
  argTypes: {
    type: { control: 'select', options: TYPES, description: 'Figma: Type' },
    size: { control: 'inline-radio', options: SIZES, description: 'Figma: Size (s=24, m=32, l=40)' },
    disabled: { control: 'boolean', description: 'Figma: State=Disabled' },
    label: { control: 'text' },
    showLeftIcon: { control: 'boolean' },
    showRightIcon: { control: 'boolean' },
    showLabel: { control: 'boolean' },
    showList: { control: 'boolean', description: 'Только для type="dropdown"' },
    nativeType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    block: { control: 'boolean', description: 'На всю ширину контейнера' },
  },
  args: {
    type: 'primary',
    size: 'l',
    disabled: false,
    label: 'Оформити замовлення',
    showLeftIcon: false,
    showRightIcon: false,
    showLabel: true,
    showList: false,
  },
} satisfies Meta<typeof ButtonFront>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Основное действие экрана. */
export const Primary: Story = {};

/** Второстепенное действие с иконкой. */
export const Default: Story = {
  args: { type: 'default', size: 'l', label: 'Обрати на мапі', showLeftIcon: true },
  render: (args) => ({
    components: { ButtonFront, Icon },
    setup: () => ({ args }),
    template: '<ButtonFront v-bind="args"><template #left><Icon name="location-24" /></template></ButtonFront>',
  }),
};

/** Плоская кнопка-ссылка (вход в блоке «Одержувач»). */
export const Flat: Story = {
  args: { type: 'flat', size: 'm', label: 'Увійти', showLeftIcon: true },
  render: (args) => ({
    components: { ButtonFront, Icon },
    setup: () => ({ args }),
    template: '<ButtonFront v-bind="args"><template #left><Icon name="user-24" /></template></ButtonFront>',
  }),
};

export const Delete: Story = { args: { type: 'delete', label: 'Видалити' } };
export const Destructive: Story = { args: { type: 'destructive', label: 'Скасувати замовлення' } };
export const Disabled: Story = { args: { disabled: true } };
export const English: Story = { args: { label: 'Place order' } };

/** Все Type × Size, Default и Disabled. Hover — наведите курсор. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { ButtonFront },
    setup: () => ({ TYPES, SIZES }),
    template: `
      <div style="display:grid;grid-template-columns:max-content repeat(6,max-content);gap:var(--space-16) var(--space-24);align-items:center;padding:var(--space-24)">
        <span></span>
        <code v-for="s in SIZES" :key="s + 'd'" class="ds-text-special-special-12-regular">{{ s }} · default</code>
        <code v-for="s in SIZES" :key="s + 'x'" class="ds-text-special-special-12-regular">{{ s }} · disabled</code>
        <template v-for="t in TYPES" :key="t">
          <code class="ds-text-special-special-12-regular">{{ t }}</code>
          <ButtonFront v-for="s in SIZES" :key="t + s" :type="t" :size="s" label="Кнопка" />
          <ButtonFront v-for="s in SIZES" :key="t + s + 'dis'" :type="t" :size="s" label="Кнопка" disabled />
        </template>
      </div>`,
  }),
};

/** Dropdown со списком. */
export const DropdownOpen: Story = {
  args: { type: 'dropdown', size: 'm', label: 'За популярністю', showLeftIcon: false, showRightIcon: true, showList: true },
  render: (args) => ({
    components: { ButtonFront },
    setup: () => ({ args }),
    template: `
      <div style="padding:var(--space-24);min-height:160px">
        <ButtonFront v-bind="args">
          <template #list>
            <div style="background:var(--surface-default);border-radius:var(--radius-8);box-shadow:var(--shadow-menu);padding:var(--space-4);min-width:180px">
              <div class="ds-text-form-input-text" style="padding:var(--space-8)">Спочатку дешеві</div>
              <div class="ds-text-form-input-text" style="padding:var(--space-8)">Спочатку дорогі</div>
              <div class="ds-text-form-input-text" style="padding:var(--space-8)">Новинки</div>
            </div>
          </template>
        </ButtonFront>
      </div>`,
  }),
};

/** Кнопка на всю ширину контейнера (`block`) — итоги заказа, карточка пункта выдачи. */
export const Block: Story = {
  args: { block: true, label: 'Оформити замовлення' },
  parameters: { maxWidth: 400 },
};
