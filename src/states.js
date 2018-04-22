// @flow
import React, { type Node } from 'react';
import { State as AutomataState } from 'react-automata';

type State = 'success' | 'error' | 'timeout' | 'loading' | 'idle';
type StateProps = {
  channel?: string,
  children: Node
};

export const IfState = ({ channel, children, is, ...props }: { ...StateProps, is: Array<State> | State }) => (
  <AutomataState channel={channel} value={is} {...props}>
    {children}
  </AutomataState>
);
export const IfIdle = (props: StateProps) => IfState({ is: 'idle', ...props });
export const IfLoading = (props: StateProps) => IfState({ is: 'loading', ...props });
export const IfTimeout = (props: StateProps) => IfState({ is: 'timeout', ...props });
export const IfSuccess = (props: StateProps) => IfState({ is: 'success', ...props });
export const IfError = (props: StateProps) => IfState({ is: 'error', ...props });
