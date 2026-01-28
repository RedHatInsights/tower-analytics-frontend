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

const pfSuccess = 'var(--pf-t--global--color--status--success--default)';
const pfDanger = 'var(--pf-t--global--color--status--danger--default)';
const pfWarning = 'var(--pf-t--global--color--status--warning--default)';
const pfInfo = 'var(--pf-t--global--color--status--info--default)';
const pfDisabled = 'var(--pf-t--global--color--disabled--100)';

export type LabelColor =
  | 'blue'
  | 'teal'
  | 'green'
  | 'orange'
  | 'purple'
  | 'red'
  | 'grey';
