import * as React from 'react';

// @ts-ignore
const noop = (...args: Array<any>) => {};

export default function useInterval(callback: () => void, delay: number | void) {
  const savedCallback = React.useRef(noop);

  React.useEffect(
    () => {
      savedCallback.current = callback;
    },
    [callback]
  );

  React.useEffect(
    () => {
      const handler = (...args: Array<any>) => savedCallback.current(...args);

      if (typeof delay === 'number') {
        const id = setInterval(handler, delay);
        return () => clearInterval(id);
      }
      return;
    },
    [delay]
  );
}
