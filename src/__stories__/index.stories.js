// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';

import Loads from '../index';

storiesOf('Loads', module)
  .add('default usage', () => {
    const delayedFn = () => new Promise(resolve => setTimeout(() => resolve('This response resolved in 100ms.'), 1000));
    return (
      <Loads
        loadingFunc={delayedFn}
        onLoadingRenderer={() => <div>loading</div>}
        onLoadedRenderer={({ response, error }) => (error ? <div>nooo!</div> : <div>{response}</div>)}
      />
    );
  })
  .add('with delay on loading renderer', () => {
    const delayedFn = () =>
      new Promise(resolve =>
        setTimeout(() => resolve("This response resolved in 300ms.  We don't need no loading indicator!"), 300)
      );
    return (
      <Loads
        delay={500}
        loadingFunc={delayedFn}
        onLoadingRenderer={() => <div>loading</div>}
        onLoadedRenderer={({ response, error }) => (error ? <div>nooo!</div> : <div>{response}</div>)}
      />
    );
  })
  .add('with delay on loading renderer (longer resolve)', () => {
    const delayedFn = () =>
      new Promise(resolve => setTimeout(() => resolve('This response resolved in 1000ms.'), 1000));
    return (
      <Loads
        delay={500}
        loadingFunc={delayedFn}
        onLoadingRenderer={() => <div>loading</div>}
        onLoadedRenderer={({ response, error }) => (error ? <div>nooo!</div> : <div>{response}</div>)}
      />
    );
  })
  .add('with error', () => {
    const delayedFn = () =>
      new Promise((resolve, reject) => setTimeout(() => reject('This response rejected in 1000ms.'), 1000));
    return (
      <Loads
        delay={500}
        loadingFunc={delayedFn}
        onLoadingRenderer={() => <div>loading</div>}
        onLoadedRenderer={({ response, error }) => (error ? <div>nooo!</div> : <div>{response}</div>)}
      />
    );
  })
  .add('with timeout', () => {
    const delayedFn = () =>
      new Promise(resolve => setTimeout(() => resolve('This response resolved in 10000ms. It should time out.'), 3000));
    return (
      <Loads
        delay={500}
        timeout={2000}
        loadingFunc={delayedFn}
        onLoadingRenderer={({ hasTimedOut }) => (hasTimedOut ? <div>timed out</div> : <div>loading</div>)}
        onLoadedRenderer={({ response, error }) => (error ? <div>nooo!</div> : <div>{response}</div>)}
      />
    );
  });
