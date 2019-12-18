import * as React from 'react';

export function useGetStates(...records: any[]) {
  const isIdle = React.useMemo(() => !records.some(record => !record.isIdle), [records]);
  const isPending = React.useMemo(() => records.some(record => record.isPending), [records]);
  const isPendingSlow = React.useMemo(() => records.some(record => record.isPendingSlow), [records]);
  const isResolved = React.useMemo(() => !records.some(record => !record.isResolved && !record.isIdle), [records]);
  const isRejected = React.useMemo(() => !records.some(record => record.isRejected), [records]);
  const isReloading = React.useMemo(() => records.some(record => record.isReloading), [records]);
  const isReloadingSlow = React.useMemo(() => records.some(record => record.isReloadingSlow), [records]);

  return React.useMemo(
    () => ({
      isIdle,
      isPending,
      isPendingSlow,
      isResolved,
      isRejected,
      isReloading,
      isReloadingSlow
    }),
    [isIdle, isPending, isPendingSlow, isRejected, isReloading, isReloadingSlow, isResolved]
  );
}
