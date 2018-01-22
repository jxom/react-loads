// @flow

import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';

import Loads from '../index';

storiesOf('Loads', module)
  .add('default usage', () => {
    const delayedFn = () =>
      new Promise(resolve => setTimeout(() => resolve('This response resolved in 1000ms.'), 1000));
    return (
      <Loads
        loadingFunc={delayedFn}
        onLoadingRenderer={() => <div>loading</div>}
      >
        {({ load, response, error }) =>
          <Fragment>
            {error && <div>no!</div>}
            {response && <div>{response}</div>}
            {!error && !response && <div>content <button onClick={load}>Load content</button></div>}
          </Fragment>
        }
      </Loads>
    );
  })
  .add('with delay on loading renderer', () => {
    const delayedFn = () =>
      new Promise(resolve =>
        setTimeout(() => resolve("This response resolved in 300ms.  We don't need a loading indicator!"), 300)
      );
    return (
      <Loads
        delay={500}
        loadingFunc={delayedFn}
        onLoadingRenderer={() => <div>loading</div>}
      >
        {({ load, response, error }) =>
          <Fragment>
            {error && <div>no!</div>}
            {response && <div>{response}</div>}
            {!error && !response && <div>content <button onClick={load}>Load content</button></div>}
          </Fragment>
        }
      </Loads>
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
      >
        {({ load, response, error }) =>
          <Fragment>
            {error && <div>no!</div>}
            {response && <div>{response}</div>}
            {!error && !response && <div>content <button onClick={load}>Load content</button></div>}
          </Fragment>
        }
      </Loads>
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
      >
        {({ load, response, error }) =>
          <Fragment>
            {error && <div>no!</div>}
            {response && <div>{response}</div>}
            {!error && !response && <div>content <button onClick={load}>Load content</button></div>}
          </Fragment>
        }
      </Loads>
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
      >
        {({ load, response, error }) =>
          <Fragment>
            {error && <div>no!</div>}
            {response && <div>{response}</div>}
            {!error && !response && <div>content <button onClick={load}>Load content</button></div>}
          </Fragment>
        }
      </Loads>
    );
  })
  .add('with load immediately', () => {
    const delayedFn = () =>
      new Promise(resolve => setTimeout(() => resolve('This response resolved in 10000ms. It should time out.'), 3000));
    return (
      <Loads
        loadImmediately
        delay={500}
        timeout={2000}
        loadingFunc={delayedFn}
        onLoadingRenderer={({ hasTimedOut }) => (hasTimedOut ? <div>timed out</div> : <div>loading</div>)}
      >
        {({ load, response, error }) =>
          <Fragment>
            {error && <div>no!</div>}
            {response && <div>{response}</div>}
            {!error && !response && <div>content</div>}
          </Fragment>
        }
      </Loads>
    );
  });
