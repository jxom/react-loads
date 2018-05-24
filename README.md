# React Loads

> A declarative and lightweight React component to handle loading state. Powered by [React Automata](https://github.com/MicheleBertoli/react-automata)

## Motivation

There are a few motivations behind creating React Loads:

1. Managing loading state can be annoying and is prone to errors if you aren't careful.
2. Hate seeing a flash of loading state? A spinner that displays for half a second? Yeah, it's annoying.
3. Nested ternaries can get messy and hard to read. Example:

```jsx
<div>
  {isLoading ? (
    <p>{hasTimedOut ? 'Taking a while...' : 'Loading...'}</p>
  ) : (
    <div>
      {!error && !response && <button onClick={this.handleLoad}>Click here to load!</button>}
      {response && <p>{response}</p>}
      {error && <p>{error.message}</p>}
    </div>
  )}
</div>
```

React Loads makes this a bit nicer to handle.

## Install

```
$ npm install react-loads
```

## Example

```js
import React from 'react';
import Loads from 'react-loads';

const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');

export default () => (
  <Loads fn={getRandomDog}>
    {({ isIdle, isLoading, isSuccess, load, response, state, error }) => (
      <div>
        {isIdle && <button onClick={load}>Load random dog</button>}
        {isLoading && <div>loading...</div>}
        {isSuccess && (
          <div>
            {response && <img src={response.data.message} alt="Dog" />}
            <div>
              <button onClick={load}>Load another dog</button>
            </div>
          </div>
        )}
      </div>
    )}
  </Loads>
);
```

### More examples

- [Code](./src/__stories__/index.stories.js)
- [Storybook](https://jxom.github.io/react-loads/)

## API

### `<Loads>`

#### Props

<table>
<thead><tr><th>Prop</th><th>Type</th><th>Default value</th><th>Description</th></tr></thead>
<tbody>
  <tr><td>  cacheKey </td><td><code>string</code></td><td></td> <td>Unique identifier to store the response/error data. Your application must be wrapped in a `<LoadsProvider>` to enable caching (see 'Caching response/error data' below).</td></tr>
  <tr><td>  children </td><td><code>({ response?: any, error?: any, load: (...args: any) => ?Promise&lt;any&gt;, resetState: Function })</code></td><td>N/A (required)</td> <td></td></tr>
  <tr><td>  delay </td><td><code>number</code></td><td><code>300</code></td> <td>Number of milliseconds before component transitions to <code>loading</code> state upon invoking <code>fn</code>/<code>load</code>.</td></tr>
  <tr><td>  loadOnMount </td><td><code>boolean</code></td><td><code>false</code></td> <td>Whether or not to invoke the <code>fn</code> on mount.</td></tr>
  <tr><td>  fn </td><td><code>(...args: any) => Promise&lt;any&gt;</code></td><td>N/A (required)</td> <td>The promise to invoke.</td></tr>
  <tr><td>  timeout </td><td><code>number</code></td><td><code>0</code></td> <td>Number of milliseconds before component transitions to <code>timeout</code> state. Set to <code>0</code> to disable.</td></tr>
</tbody>
</table>

##### `children` Render Props

<table>
<thead><tr><th>Prop</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
  <tr><td>  response </td><td><code>any</code></td><td>Response from the resolved promise (`fn`)</td></tr>
  <tr><td>  error </td><td><code>any</code></td><td>Error from the rejected promise (`fn`)</td></tr>
  <tr><td>  load </td><td><code>(...args: any) => ?Promise&lt;any&gt;</code></td><td>Trigger to load `fn`</td></tr>
  <tr><td>  hasResponseInCache </td><td><code>boolean</code></td><td>Returns `true` if data already exists in the context cache.</td></tr>
  <tr><td>  isIdle </td><td><code>boolean</code></td><td>Returns `true` if the state is idle (`fn` has not been triggered).</td></tr>
  <tr><td>  isLoading </td><td><code>boolean</code></td><td>Returns `true` if the state is loading (`fn` is in a pending state).</td></tr>
  <tr><td>  isTimeout </td><td><code>boolean</code></td><td>Returns `true` if the state is timeout (`fn` is in a pending state for longer than `delay` milliseconds).</td></tr>
  <tr><td>  isSuccess </td><td><code>boolean</code></td><td>Returns `true` if the state is success (`fn` has been resolved).</td></tr>
  <tr><td>  isError </td><td><code>boolean</code></td><td>Returns `true` if the state is error (`fn` has been rejected).</td></tr>
  <tr><td>  resetState </td><td><code>() => void</code></td><td>Reset state back to `idle`.</td></tr>
</tbody>
</table>

## Caching response/error data

React Loads has the ability to cache the response and error data. Your application must be wrapped in a `<LoadsProvider>` to enable caching. Here is an example to toggle on caching:

```jsx
import React from 'react';
import Loads, { LoadsProvider } from 'react-loads';

const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');

export default () => (
  <LoadsProvider>
    <Loads cacheKey="randomDog" loadOnMount fn={getRandomDog}>
      {({ hasResponseInCache, isLoading, isSuccess, load, response }) => (
        <div>
          {isLoading && <div>loading...</div>}
          {(isSuccess || hasResponseInCache) && (
            <div>
              {response && <img src={response.data.message} alt="Dog" />}
              <div>
                <button onClick={load}>Load another dog</button>
              </div>
            </div>
          )}
        </div>
      )}
    </Loads>
  </LoadsProvider>
);
```

## Special thanks

- [Michele Bertoli](https://github.com/MicheleBertoli) for creating [React Automata](https://github.com/MicheleBertoli/react-automata) - it's awesome and you should check it out.

## License

MIT © [jxom](http://jxom.io)
