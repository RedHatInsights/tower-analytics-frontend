export type PFColor =
  | 'default'
  | 'green'
  | 'success'
  | 'blue'
  | 'info'
  | 'red'
  | 'danger'
  | 'yellow'
  | 'warning'
  | 'grey'
  | 'disabled';

export function getPatternflyColor(color: PFColor) {
  switch (color) {
    case 'default':
      return undefined;
    case 'green':
    case 'success':
      return pfSuccess;
    case 'red':
    case 'danger':
      return pfDanger;
    case 'yellow':
    case 'warning':
      return pfWarning;
    case 'blue':
    case 'info':
      return pfInfo;
    case 'grey':
    case 'disabled':
      return pfDisabled;
  }
}

const pfSuccess = 'var(--pf-global--success-color--100)';
const pfDanger = 'var(--pf-global--danger-color--100)';
const pfWarning = 'var(--pf-global--warning-color--100)';
const pfInfo = 'var(--pf-global--info-color--100)';
const pfDisabled = 'var(--pf-global--disabled-color--100)';

export type LabelColor =
  | 'blue'
  | 'cyan'
  | 'green'
  | 'orange'
  | 'purple'
  | 'red'
  | 'grey';
