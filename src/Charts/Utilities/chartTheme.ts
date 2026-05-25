function isDark(): boolean {
  if (typeof document === 'undefined') return false;
  const cl = document.documentElement.classList;
  return cl.contains('pf-v6-theme-dark') || cl.contains('pf-theme-dark');
}

export function chartBackground(): string {
  return isDark() ? '#1b1d21' : '#ffffff';
}

export function chartText(): string {
  return isDark() ? '#e0e0e0' : '#151515';
}

export function chartTextSecondary(): string {
  return isDark() ? '#c9c9c9' : '#4f5255';
}

export function chartGridColor(): string {
  return isDark() ? '#444548' : '#d2d2d2';
}

export function chartTooltipBg(): string {
  return isDark() ? '#e0e0e0' : '#151515';
}

export function chartSuccessColor(): string {
  return isDark() ? '#5ba352' : '#3e8635';
}

export function chartDangerColor(): string {
  return isDark() ? '#fe5142' : '#c9190b';
}

export function chartInfoColor(): string {
  return isDark() ? '#1fa7f8' : '#0066cc';
}
