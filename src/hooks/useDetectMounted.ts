import * as React from 'react';

export default function useDetectMounted() {
  const hasMounted = React.useRef<boolean>(true);
  React.useEffect(() => {
    return function cleanup() {
      hasMounted.current = false;
    };
  }, []);

  return hasMounted;
}
