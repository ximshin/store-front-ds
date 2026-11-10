// Icon registry. Every SVG in src/assets/icons is an exact Figma export and is picked up automatically:
// icon name = file name without .svg. To add an icon, drop its exported SVG into src/assets/icons.
//
// Figma exports bake the instance color into the file (e.g. fill="black" fill-opacity="0.5").
// Icons are drawn as a CSS mask filled with `currentColor`, so any baked opacity would multiply with the
// token's own alpha. The registry therefore strips opacity attributes and uses only the glyph's shape —
// the color always comes from the component's token (e.g. `color: var(--icon-primary)`).
const files = import.meta.glob('../../assets/icons/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const toMask = (svg: string) =>
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(svg.replace(/\s(fill-opacity|stroke-opacity|opacity)="[^"]*"/g, ''));

export const ICON_SOURCES: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([p, raw]) => [p.split('/').pop()!.replace(/\.svg$/, ''), toMask(raw)]),
);

/** Icons that are another icon rotated, exactly like the Figma components. */
export const DERIVED_ICONS: Record<string, { from: string; rotate: number }> = {};

export const iconNames: string[] = [...Object.keys(ICON_SOURCES), ...Object.keys(DERIVED_ICONS)].sort();
