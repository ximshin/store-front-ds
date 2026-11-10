import type { Meta, StoryObj } from '@storybook/vue3-vite';
import LoginForm from './LoginForm.vue';

/**
 * Содержимое попапа входа (Figma `6228:108`): вход через соцсети, разделитель «або», поля «E-пошта» и «Пароль»
 * (Input Size=L), кнопка «Увійти», ссылка «Забули пароль?». Ширина 432 → Fill.
 */
const meta = {
  title: 'Overlays & Feedback/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 432,
    docs: {
      description: {
        component:
          'Форма входа (Figma `6228:108`). Figma: Divider label → `dividerLabel`, Forgot label → `forgotLabel`. Собрана из `SocialLoginButton` ×3, `Input` (Size=L), `ButtonFront` Primary L (radius/8, Special 16 Medium). Используется как содержимое `Modal` Size S/M.',
      },
    },
  },
  argTypes: {
    dividerLabel: { control: 'text', description: 'Figma: Divider label' },
    forgotLabel: { control: 'text', description: 'Figma: Forgot label' },
    submitLabel: { control: 'text', description: 'Подпись кнопки «Увійти»' },
    emailLabel: { control: 'text' },
    passwordLabel: { control: 'text' },
    email: { control: 'text', description: 'v-model:email' },
    password: { control: 'text', description: 'v-model:password' },
    emailPlaceholder: { control: 'text' },
    passwordPlaceholder: { control: 'text' },
  },
  args: {
    dividerLabel: 'або',
    forgotLabel: 'Забули пароль?',
    submitLabel: 'Увійти',
    emailLabel: 'E-пошта',
    passwordLabel: 'Пароль',
    email: 'customer@poshta.com',
    password: 'password1234',
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Заполненная форма (как в Figma). */
export const Filled: Story = {};

/** Пустые поля с подсказками. */
export const Empty: Story = { args: { email: '', password: '' } };

export const English: Story = {
  args: {
    dividerLabel: 'or',
    forgotLabel: 'Forgot password?',
    submitLabel: 'Sign in',
    emailLabel: 'E-mail',
    passwordLabel: 'Password',
    email: '',
    password: '',
    passwordPlaceholder: 'Enter password',
  },
};

/** Длинные подписи с Ґ Є І Ї не ломают ряд. */
export const LongText: Story = {
  args: {
    emailLabel: 'Електронна пошта або номер телефону для Нової пошти',
    forgotLabel: 'Ґаздо, забули пароль? Відновіть доступ до акаунта',
    email: '',
  },
};

/** Единственный вариант — матрица состояний (Empty / Filled) для сверки с Figma. */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { LoginForm },
    template: `
      <div style="display:flex;gap:var(--space-48);align-items:flex-start;padding:var(--space-24)">
        <div style="width:432px"><LoginForm email="customer@poshta.com" password="password1234" /></div>
        <div style="width:432px"><LoginForm /></div>
      </div>`,
  }),
};
