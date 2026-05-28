import useResizeObserver from '@react-hook/resize-observer';
import React, {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

function isDarkTheme(): boolean {
  if (typeof document === 'undefined') return false;
  const cl = document.documentElement.classList;
  return cl.contains('pf-v6-theme-dark') || cl.contains('pf-theme-dark');
}

export function Scrollable(props: {
  children?: ReactNode;
  borderTop?: boolean;
  borderBottom?: boolean;
  style?: CSSProperties;
}) {
  const divEl = useRef<HTMLDivElement>(null);
  const [topShadow, setTopShadow] = useState(0);
  const [bottomShadow, setBottomShadow] = useState(0);
  const update = useCallback(() => {
    /* istanbul ignore else */
    if (divEl.current) {
      setTopShadow(Math.min(1, divEl.current.scrollTop / 8));
      const scrollBottom =
        divEl.current.scrollHeight -
        divEl.current.scrollTop -
        divEl.current.clientHeight -
        1;
      setBottomShadow(Math.max(0, Math.min(1, scrollBottom / 8)));
    }
  }, []);
  useEffect(() => update(), [update, props.children]);
  useResizeObserver(divEl, () => {
    update();
  });

  const dark = isDarkTheme();
  const shadowBase = dark ? '255,255,255' : '0,0,0';
  const shadowMultiplier = dark ? 6 : 1;
  const shadowOpacityTop = 0.2 * topShadow * shadowMultiplier;
  const shadowOpacityBottom = 0.2 * bottomShadow * shadowMultiplier;

  /* istanbul ignore next */
  const borderTop = props.borderTop
    ? `thin solid ${dark ? 'var(--pf-t--global--border--color--100)' : 'rgba(0, 0, 0, 0.12)'}`
    : '';

  /* istanbul ignore next */
  const borderBottom = props.borderBottom
    ? `thin solid ${dark ? 'var(--pf-t--global--border--color--100)' : 'rgba(0, 0, 0, 0.12)'}`
    : '';

  return (
    <div
      style={{
        ...props.style,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        overflowY: 'hidden',
        position: 'relative',
      }}
    >
      <div
        ref={divEl}
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflowY: 'auto',
          borderTop,
          borderBottom,
        }}
        onScroll={update}
      >
        {props.children}
      </div>
      {
        /* istanbul ignore next */ shadowOpacityTop > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              height: '10px',
              width: '100%',
              background: `linear-gradient(rgba(${shadowBase},${shadowOpacityTop}), rgba(${shadowBase},0))`,
            }}
          />
        )
      }
      {
        /* istanbul ignore next */ shadowOpacityBottom > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              height: '10px',
              width: '100%',
              background: `linear-gradient(rgba(${shadowBase},0), rgba(${shadowBase},${shadowOpacityBottom}))`,
            }}
          />
        )
      }
    </div>
  );
}
