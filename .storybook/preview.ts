import type { Preview } from '@storybook/vue3-vite';
import '../src/tokens/tokens.css';
import '../src/tokens/typography.css';
import '../src/styles/base.css';

const preview: Preview = {
  // Story wrapper: no fixed width (lesson from DS Admin). Stories set `parameters.maxWidth` (Figma width) to cap it;
  // variant matrices set `parameters.fullWidth: true` to drop the cap.
  decorators: [
    (story, ctx) => ({
      components: { story },
      setup: () => ({
        style: ctx.parameters.fullWidth
          ? 'width:100%;box-sizing:border-box'
          : `width:100%;box-sizing:border-box;max-width:calc(${ctx.parameters.maxWidth ?? 1280}px + 2 * var(--space-24))`,
      }),
      template: '<div :style="style"><story /></div>',
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      test: 'todo',
    },
  },
};

export default preview;
