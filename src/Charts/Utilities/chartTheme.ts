import {
  t_chart_color_blue_300,
  t_chart_color_green_300,
  t_chart_color_red_orange_400,
  t_color_gray_90,
  t_global_background_color_100,
  t_global_border_color_100,
  t_global_text_color_regular,
  t_global_text_color_subtle,
} from '@patternfly/react-tokens';

// Reads the resolved value of a PF CSS custom property from the document root.
// PF redefines semantic tokens under .pf-v6-theme-dark, so dark mode is handled
// automatically without any manual isDark() check.
function pfVar(token: { name: string; value: string }): string {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(token.name)
      .trim() || token.value
  );
}

export function chartBackground(): string {
  return pfVar(t_global_background_color_100);
}

export function chartText(): string {
  return pfVar(t_global_text_color_regular);
}

// The exports below return the CSS variable reference rather than the resolved
// value. Use these for D3 .style() calls so colours update reactively when
// the user switches theme, without needing to redraw the chart.
export const chartTextVar = t_global_text_color_regular.var;
export const chartGridColorVar = t_global_border_color_100.var;
export const chartSuccessColorVar = t_chart_color_green_300.var;
export const chartDangerColorVar = t_chart_color_red_orange_400.var;
export const chartInfoColorVar = t_chart_color_blue_300.var;

export function chartTextSecondary(): string {
  return pfVar(t_global_text_color_subtle);
}

export function chartGridColor(): string {
  return pfVar(t_global_border_color_100);
}

// Tooltips use a fixed dark background with white text in both themes.
// SVG presentation attributes (fill=) don't resolve CSS variables, so we
// use a static palette value rather than pfVar().
export function chartTooltipBg(): string {
  return t_color_gray_90.value;
}
