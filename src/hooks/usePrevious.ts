import * as React from 'react';

export default function usePrevious(value: any) {
  const ref = React.useRef();

  React.useEffect(
    () => {
      ref.current = value;
    },
    [value]
  );

  return ref.current;
}
