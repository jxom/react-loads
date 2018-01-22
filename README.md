# react-loads

> A simple React component to handle loading state and kills 'FOUL' (see below).

[https://jxom.github.io/react-loads/](https://jxom.github.io/react-loads/)

## Motivation

> FOUL
>
> (abbreviation: flash of unnecessary loading state) When a user interface responds to an action by immediately displaying a > spinner or placeholder, but the actual result only takes a few hundred milliseconds to load.
>
> E.g. every web app circa 2018. - Andrew Clark, 2018 (https://twitter.com/acdlite/status/955390801827135488)

## Install

```
$ npm install react-loads
```

## Usage

```js
import React, { Fragment } from 'react';
import Loads from 'react-loads';

const delayedFn = () => new Promise(resolve => setTimeout(() => resolve('This response resolved in 1000ms.'), 1000));

export default () => (
  <Loads
    delay={500}
    timeout={10000}
    loadingFunc={delayedFn}
    onLoadingRenderer={({ hasTimedOut }) => (hasTimedOut ? <div>timed out</div> : <div>loading</div>)}
  >
    {({ response, error, handleLoad }) =>
      <Fragment>
        {error && <div>no!</div>}
        {response && <div>{response}</div>}
        <button onClick={handleLoad}>Click me!</button>
      </Fragment>
    }
  </Loads>
);
```

## Props

<table>
<thead><tr><th>Prop</th><th>Type</th><th>Default value</th><th>Description</th></tr></thead>
<tbody>
  <tr><td>  delay </td><td><code>number</code></td><td><code>300</code></td> <td>Number of milliseconds before the loading component (`onLoadingRenderer`) appears.</td></tr>
  <tr><td>  loadingFunc </td><td><code>() => Promise&lt;void&gt;</code></td><td>N/A (required)</td> <td>The function to load.</td></tr>
  <tr><td>  onLoadingRenderer </td><td><code>({ hasTimedOut: boolean }) => any</code></td><td>N/A (required)</td> <td>The loading component renderer (displays when loading).</td></tr>
  <tr><td>  onLoadedRenderer </td><td><code>({ response?: any, error?: any }) => any</code></td><td>N/A (required)</td> <td>The loaded component renderer (displays on successful/errored load).</td></tr>
  <tr><td>  timeout </td><td><code>number</code></td><td><code>0</code></td> <td>Number of milliseconds before the loading component times out.</td></tr>
</tbody>
</table>

## License

MIT © [jxom](http://jxom.io)
