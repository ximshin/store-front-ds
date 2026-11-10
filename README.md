# Store Front DS — Vue + Storybook

## Быстрый старт

```bash
npm ci
npm run storybook   # каталог: http://localhost:6006
npm run dev         # тестовая страница с палитрой, типографикой и компонентами
npm run build       # проверка типов + сборка
```

Нужен Node.js 18+. Компоненты импортируются из `src/main.ts` (`import { ButtonFront, Input } from './src/main'`).
Ссылки вида `../ds/…`, `../directives/…` ниже ведут в рабочую папку дизайн-системы (вне репозитория) — для разработки они не нужны.

Код дизайн-системы Store Front: Vue 3 (SFC) + TypeScript + обычный CSS, витрина — Storybook 10.
Источник правды — Figma-файл `NRAtBkFfwdQ4R0JxvA2HN0` (`../ds/source.md`); правила — `../ds/CONTRACT.md`, каталог — `../ds/components.md`, токены — `../ds/foundation.md`.
Порядок работы — `../directives/directive_vue_base.md` (база) и `../directives/directive_storybook_vue.md` (каталог).

## Команды

| Команда | Что делает |
|---|---|
| `npm run dev` | Тестовая страница (`src/App.vue`): палитра, типографика, галерея компонентов |
| `npm run storybook` | Storybook на http://localhost:6006 (в агенте — `npm run storybook -- --ci`) |
| `npm run tokens` | Пересобирает CSS токенов из `tokens/figma-export.tsv` (порядок обновления — `../directives/tokens_export.md`) |
| `npm run build-storybook` | Статическая сборка в `storybook-static/` |
| `node scripts/screenshot.mjs <story-id>…` | Скриншоты stories из статической сборки в `../.tmp/screens/` — сверка с Figma |
| `npx vue-tsc -b` | Проверка типов (её же запускает хук после правок `src/`) |

## Токены

```
Figma ──(use_figma, агент)──► tokens/figma-export.tsv ──(npm run tokens)──► tokens/tokens.json
                                                                          ├─► src/tokens/tokens.css      CSS-переменные (Primitive, Semantic → var(primitive), Dimension)
                                                                          ├─► src/tokens/typography.css  --typo-*, .ds-text-*, --shadow-*, --effect-*
                                                                          └─► src/tokens/meta.json       для Foundation и тестовой страницы
```

- Имя CSS-переменной = путь в Figma в kebab-case: `text/primary` → `--text-primary`, `surface/action/primary` → `--surface-action-primary`, `space/16` → `--space-16`, `radius/full` → `--radius-full`, `stroke/thin` → `--stroke-thin`.
- Текстовые стили: префикс `DS/` отбрасывается: `DS/Heading/H4` → `font: var(--typo-heading-h4)` или класс `.ds-text-heading-h4`; `DS/Special/Special 14 Medium` → `--typo-special-special-14-medium`. Цвет в стиле не зашит — отдельной семантикой.
- Тени: `DS/Shadow/menu` → `box-shadow: var(--shadow-menu)`.
- `src/tokens/*` и `tokens/*` — сгенерированы, руками не правятся.
- В компонентах — только эти переменные: ни одного прибитого hex, отступа или радиуса при наличии токена. Высоты 24 / 32 / 40 — через `--space-24/32/40`.

## Компоненты

`src/components/<Name>/` — `<Name>.vue` + `<Name>.stories.ts`. Имя папки и файла — имя компонента из Figma в PascalCase (`button-front` → `ButtonFront`, `CartItem` → `CartItem`, `warning` → `Warning`, `input-main` → `InputMain`); в `title` story — имя как в Figma (`Actions/button-front`, `Cart & Checkout/CartItem`).
**Эталон — `ButtonFront`** (`src/components/ButtonFront/`): устройство файла, props, приватные переменные, stories.

- Variant-свойства Figma → props с теми же значениями в нижнем регистре (`Type=Primary` → `type: 'primary'`, `Size=M(32)` → `size: 'm'`); `State=Hover` → `:hover`, `State=Disabled` → prop `disabled`, `State=Active/Selected` → prop `active` / `selected`; BOOLEAN → boolean props с теми же значениями по умолчанию (`Show label` → `showLabel`); TEXT → string prop; SLOT → слот Vue; INSTANCE_SWAP иконки → prop `icon` с именем иконки.
- Варианты внутри — приватные CSS-переменные `--_*` (см. `ButtonFront.vue`), стили `<style scoped>`.
- Составные компоненты собираются из компонентов базы (как инстансы в Figma): `CartItem` использует `Counter`, `Price`, `DiscountLabel`, `GiftTag`, `InfoTag`.
- Иконки — компонент `Icon` (`src/components/Icon`, `<Icon name="plus-16" />`). SVG — точные выгрузки из Figma в `src/assets/icons/<имя>.svg`, имя = имя компонента иконки в Figma; реестр `icons.ts` подхватывает файлы сам. Красятся через `currentColor`. Новые иконки руками не рисовать. **Если нужной иконки нет в ДС** — источник файл Icons-Sets `B9zdF1whUjNCpaycTEvksE`: сначала узел 1:16 (`deefault-set-stroke`, исходник иконок ДС), затем страница Sets v2 — набор A `12:2` (24 px, тот же стиль) и служебный S `15:1632` (16/24 px: шевроны, стрелки, close, view). Имя файла — по смыслу с размером, как в ДС (`eye-24`, `chevron-down-16`). Выгрузка — `download_assets` (svg) + `node ../execution/svg_extract_icon.mjs src/assets/icons` (основная сессия; сабагент перечисляет нужные иконки в ответе).
- Фокус полей — обводка 2 px `var(--border-input-active)`; у кнопок фокус не показывается.
- Переходы состояний — `transition` 0.15s ease на фон / обводку / цвет.

## Stories

- `tags: ['autodocs']` у каждого компонента, `argTypes` на каждый prop (перечисления — `inline-radio` / `select`, boolean — `boolean`, текст — `text`), JSDoc над `meta` и stories.
- Именованные stories на ключевые варианты + `AllVariants` (`parameters: { fullWidth: true, controls: { disable: true } }`) — вся матрица; для текстовых — `LongText` (uk с Ґ Є І Ї + en).
- Обёртка — общий декоратор (`.storybook/preview.ts`): ширина 100%, `parameters.maxWidth` — ширина компонента в Figma.
- Тексты — uk (основной) + en; контент — интернет-магазин (товары, ціни в грн, Нова пошта).

## Общие файлы

`src/main.ts`, `src/showcase/gallery.ts`, `src/components/Icon/*`, `src/tokens/*`, `.storybook/*`, `package.json`, `scripts/*` — правит только основная сессия. Сабагент (`story-writer`) описывает нужные изменения в ответе.

## Готовность компонента

`npx vue-tsc -b` и `npm run build-storybook -- --output-dir ../.tmp/sb-<компонент>` без ошибок, скриншот `AllVariants` (`node scripts/screenshot.mjs --static-dir ../.tmp/sb-<компонент> <story-id>`) сверен со скриншотом компонента в Figma.
