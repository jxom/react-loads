// @flow
import React, { type Node } from 'react';
import { Action } from 'react-automata';

type State = 'success' | 'error' | 'timeout' | 'loading' | 'idle';
type ActionProps = {
  channel?: string,
  children: Function | Node
};

export const IfState = ({ channel, children, is, ...props }: { ...ActionProps, is: Array<State> | State }) =>
  typeof children === 'function' ? (
    <Action channel={channel} show={is} {...props} render={children} />
  ) : (
    <Action channel={channel} show={is} {...props}>
      {children}
    </Action>
  );
export const IfIdle = (props: ActionProps) => IfState({ is: 'idle', ...props });
export const IfLoading = (props: ActionProps) => IfState({ is: 'loading', ...props });
export const IfTimeout = (props: ActionProps) => IfState({ is: 'timeout', ...props });
export const IfSuccess = (props: ActionProps) => IfState({ is: 'success', ...props });
export const IfError = (props: ActionProps) => IfState({ is: 'error', ...props });
