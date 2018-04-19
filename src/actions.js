// @flow
import React, { type Node } from 'react';
import { Action } from 'react-automata';

type State = 'success' | 'error' | 'timeout' | 'loading' | 'idle';
type StateProps = {
  channel?: string,
  children: Function | Node
};

export const IfState = ({ channel, children, is, ...props }: { ...StateProps, is: Array<State> | State }) =>
  typeof children === 'function' ? (
    <Action channel={channel} show={is} {...props} render={children} />
  ) : (
    <Action channel={channel} show={is} {...props}>
      {children}
    </Action>
  );
export const IfIdle = (props: StateProps) => IfState({ is: 'idle', ...props });
export const IfLoading = (props: StateProps) => IfState({ is: 'loading', ...props });
export const IfTimeout = (props: StateProps) => IfState({ is: 'timeout', ...props });
export const IfSuccess = (props: StateProps) => IfState({ is: 'success', ...props });
export const IfError = (props: StateProps) => IfState({ is: 'error', ...props });
