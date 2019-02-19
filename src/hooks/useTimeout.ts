import * as React from 'react';

export default function useTimeout(fn: () => any) {
  const timeout = React.useRef<number | undefined>(undefined);

  const _setTimeout = (ms: number) => {
    // @ts-ignore
    timeout.current = setTimeout(fn, ms);
  };
  const _clearTimeout = () => clearTimeout(timeout.current);

  React.useEffect(() => {
    return function cleanup() {
      if (timeout) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return [_setTimeout, _clearTimeout];
}
