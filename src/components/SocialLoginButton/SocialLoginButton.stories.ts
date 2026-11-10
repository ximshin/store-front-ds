import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SocialLoginButton from './SocialLoginButton.vue';

const NETWORKS = ['google', 'facebook', 'apple'] as const;

/**
 * Кнопка входу через соцмережу (Figma `6228:106`) у попапі «Вхід» (LoginForm). Логотип 16 — у фірмових кольорах
 * (Apple — `icon/strong`), підпис `DS/Special/Special 16 Medium`. Висота 40, обводка `border/input` ззовні, радіус `radius/8`.
 */
const meta = {
  title: 'Actions/SocialLoginButton',
  component: SocialLoginButton,
  tags: ['autodocs'],
  parameters: {
    maxWidth: 136,
    docs: {
      description: {
        component:
          'Кнопка входа через соцсеть (Figma `6228:106`). Figma: Network (Google / Facebook / Apple ID) → `network` (google / facebook / apple). Ширина 136, в ряду — Fill (растягивается контейнером). Hover — `:hover`.',
      },
    },
  },
  argTypes: {
    network: { control: 'inline-radio', options: NETWORKS, description: 'Figma: Network (Apple ID = apple)' },
    label: { control: 'text', description: 'Подпись; по умолчанию — название сети' },
    disabled: { control: 'boolean' },
    nativeType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
  },
  args: { network: 'google', disabled: false },
} satisfies Meta<typeof SocialLoginButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Google: Story = {};
export const Facebook: Story = { args: { network: 'facebook' } };
export const Apple: Story = { args: { network: 'apple' } };

/** Підпис українською та довший текст — кнопка росте за вмістом. */
export const CustomLabel: Story = { args: { network: 'google', label: 'Увійти через Google' } };

export const Disabled: Story = { args: { disabled: true } };

/** Три мережі в ряду, як у LoginForm: кожна кнопка розтягується (Fill). */
export const AllVariants: Story = {
  name: 'Все варианты',
  parameters: { controls: { disable: true }, fullWidth: true },
  render: () => ({
    components: { SocialLoginButton },
    setup: () => ({ NETWORKS }),
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--space-24);padding:var(--space-24);max-width:480px">
        <div style="display:flex;gap:var(--space-8)">
          <SocialLoginButton v-for="n in NETWORKS" :key="n" :network="n" style="flex:1" />
        </div>
        <div style="display:flex;gap:var(--space-8)">
          <SocialLoginButton v-for="n in NETWORKS" :key="n + 'd'" :network="n" disabled style="flex:1" />
        </div>
        <div style="display:flex;gap:var(--space-8)">
          <SocialLoginButton network="google" label="Увійти через Google" style="flex:1" />
          <SocialLoginButton network="apple" label="Sign in with Apple" style="flex:1" />
        </div>
      </div>`,
  }),
};
