import * as React from 'react';

export default function useDetectMounted() {
  const hasMounted = React.useRef<boolean>(true);
  const hasRendered = React.useRef<boolean>(false);

  React.useEffect(() => {
    hasRendered.current = true;
    return function cleanup() {
      hasMounted.current = false;
    };
  }, []);

  return [hasMounted, hasRendered];
}
