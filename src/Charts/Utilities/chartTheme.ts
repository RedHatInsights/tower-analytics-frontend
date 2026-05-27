import {
  t_chart_color_blue_300,
  t_chart_color_green_300,
  t_chart_color_red_orange_400,
  t_global_background_color_100,
  t_global_background_color_inverse_default,
  t_global_border_color_100,
  t_global_text_color_regular,
  t_global_text_color_subtle,
} from '@patternfly/react-tokens';

// Reads the resolved value of a PF CSS custom property from the document root.
// PF redefines semantic tokens under .pf-v6-theme-dark, so dark mode is handled
// automatically without any manual isDark() check.
function pfVar(token: { name: string; value: string }): string {
  if (typeof document === 'undefined') return token.value;
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

export function chartTextSecondary(): string {
  return pfVar(t_global_text_color_subtle);
}

export function chartGridColor(): string {
  return pfVar(t_global_border_color_100);
}

export function chartTooltipBg(): string {
  return pfVar(t_global_background_color_inverse_default);
}

export function chartSuccessColor(): string {
  return pfVar(t_chart_color_green_300);
}

export function chartDangerColor(): string {
  return pfVar(t_chart_color_red_orange_400);
}

export function chartInfoColor(): string {
  return pfVar(t_chart_color_blue_300);
}
