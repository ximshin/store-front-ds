// App entry (npm run dev / production build): screens index, screens and the DS showcase. Library entry is src/main.ts.
import { createApp } from 'vue';
import './tokens/tokens.css';
import './tokens/typography.css';
import './styles/base.css';
import App from './App.vue';
import { router } from './router';

createApp(App).use(router).mount('#app');
