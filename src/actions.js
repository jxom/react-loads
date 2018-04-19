// @flow
import React, { type Node } from 'react';
import { Action as AutomataAction } from 'react-automata';

type States = 'success' | 'error' | 'timeout' | 'loading' | 'idle';
type ActionProps = {
  channel?: string,
  children: Function | Node
};

export const IfState = ({ channel, children, is, ...props }: { ...ActionProps, is: Array<States> }) =>
  typeof children === 'function' ? (
    <AutomataAction channel={channel} show={is} {...props} render={children} />
  ) : (
    <AutomataAction channel={channel} show={is} {...props}>
      {children}
    </AutomataAction>
  );
export const IfIdle = (props: ActionProps) => IfState({ is: ['idle'], ...props });
export const IfLoading = (props: ActionProps) => IfState({ is: ['loading'], ...props });
export const IfTimeout = (props: ActionProps) => IfState({ is: ['timeout'], ...props });
export const IfSuccess = (props: ActionProps) => IfState({ is: ['success'], ...props });
export const IfError = (props: ActionProps) => IfState({ is: ['error'], ...props });
