import * as React from 'react';

export default function useDetectMounted() {
  const hasMounted = React.useRef<boolean>(false);
  React.useEffect(() => {
    hasMounted.current = true;
    return function cleanup() {
      hasMounted.current = false;
    };
  }, []);

  return hasMounted;
}
