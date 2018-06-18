# React Loads

> A declarative and lightweight React component to handle loading state.

[Read the Medium article](https://medium.com/@jxom/introducing-react-loads-a-simple-react-component-to-handle-loading-response-state-fca9ec460faa)

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

React Loads makes this nicer to handle.

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
  <tr><td>  fn </td><td><code>function()</code></td><td></td> <td>The function to invoke - <strong>it must return a promise</strong>.</td></tr>
  <tr><td colspan="100" style="height: 10px"></td></tr>
  <tr><td>  delay </td><td><code>number</code></td><td><code>300</code></td> <td>Number of milliseconds before component transitions to <code>loading</code> state upon invoking <code>fn</code>/<code>load</code>.</td></tr>
  <tr><td>  loadOnMount </td><td><code>boolean</code></td><td><code>false</code></td> <td>Whether or not to invoke the <code>fn</code> on mount.</td></tr>
  <tr><td>  timeout </td><td><code>number</code></td><td><code>0</code></td> <td>Number of milliseconds before component transitions to <code>timeout</code> state. Set to <code>0</code> to disable.</td></tr>
  <tr><td colspan="100" style="height: 10px"></tr>
  <tr><td>  cacheKey </td><td><code>string</code></td><td></td> <td>Unique identifier to store the response/error data in cache. Your application must be wrapped in a <code>&lt;LoadsProvider&gt;</code> to enable caching (see 'Caching response/error data' below).</td></tr>
  <tr><td>enableBackgroundStates</td><td><code>boolean</code></td><td><code>false</code></td><td>If true and the data is in cache, <code>isIdle</code>, <code>isLoading</code> and <code>isTimeout</code> will be evaluated on subsequent loads. When <code>false</code> (default), these states are only evaluated on initial load and are falsy on subsequent loads - this is helpful if you want to show the cached response and not have a idle/loading/timeout indicator when <code>fn</code> is invoked again. You must have a  <code>cacheKey</code> set to enable background states.</td></tr>
  <tr><td>  enableLocalStorageCache </td><td><code>boolean</code></td><td><code>false</code></td> <td>Enable local storage caching of response data.</td></tr>
</tbody>
</table>

##### `children` Render Props

<table>
<thead><tr><th>Prop</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
  <tr><td>  response </td><td><code>any</code></td><td>Response from the resolved promise (<code>fn</code>)</td></tr>
  <tr><td>  error </td><td><code>any</code></td><td>Error from the rejected promise (<code>fn</code>)</td></tr>
  <tr><td>  load </td><td><code>function(...args)</code></td><td>Trigger to load <code>fn</code></td></tr>
  <tr><td>  hasResponseInCache </td><td><code>boolean</code></td><td>Returns <code>true</code> if data already exists in the context cache.</td></tr>
  <tr><td>  isIdle </td><td><code>boolean</code></td><td>Returns <code>true</code> if the state is idle (<code>fn</code> has not been triggered).</td></tr>
  <tr><td>  isLoading </td><td><code>boolean</code></td><td>Returns <code>true</code> if the state is loading (<code>fn</code> is in a pending state).</td></tr>
  <tr><td>  isTimeout </td><td><code>boolean</code></td><td>Returns <code>true</code> if the state is timeout (<code>fn</code> is in a pending state for longer than <code>delay</code> milliseconds).</td></tr>
  <tr><td>  isSuccess </td><td><code>boolean</code></td><td>Returns <code>true</code> if the state is success (<code>fn</code> has been resolved).</td></tr>
  <tr><td>  isError </td><td><code>boolean</code></td><td>Returns <code>true</code> if the state is error (<code>fn</code> has been rejected).</td></tr>
  <tr><td>  resetState </td><td><code>function()</code></td><td>Reset state back to <code>idle</code>.</td></tr>
</tbody>
</table>


### `<LoadsProvider>`

#### Props

<table>
<thead><tr><th>Prop</th><th>Type</th><th>Default value</th><th>Description</th></tr></thead>
<tbody>
  <tr><td>  storagePrefix </td><td><code>string</code></td><td>react-loads.</td><td>The prefix to use when storing items with this provider. It is recommended you set this to the name of your app or module to avoid namespace collisions in storage.</td></tr>
</tbody>
</table>

## Caching response/error data

React Loads has the ability to cache the response and error data on an application context level (meaning the cache will clear upon unmounting the application). Your application must be wrapped in a `<LoadsProvider>` to enable caching. Here is an example to enable it:

```jsx
import React from 'react';
import Loads, { LoadsProvider } from 'react-loads';

const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');

const RandomDog = () => (
  <Loads cacheKey="randomDog" loadOnMount fn={getRandomDog}>
    {({ isLoading, isSuccess, load, response }) => (
      <div>
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

const App = () => (
  <LoadsProvider>
    <RandomDog />
  </LoadsProvider>
);

export default App;
```

However, if you would like the ability to persist response data upon unmounting the application (e.g. page refresh or closing window). Local storage can also be utilised to cache response data. Just add the `enableLocalStorageCaching` prop (and set it to `true`) in `<Loads>`:

```jsx
import React from 'react';
import Loads, { LoadsProvider } from 'react-loads';

const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');

const RandomDog = () => (
  <Loads cacheKey="randomDog" enableLocalStorageCache loadOnMount fn={getRandomDog}>
    {({ isLoading, isSuccess, load, response }) => (
      <div>
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

const App = () => (
  <LoadsProvider>
    <RandomDog />
  </LoadsProvider>
);

export default App;
```


## Special thanks

- [Michele Bertoli](https://github.com/MicheleBertoli) for creating [React Automata](https://github.com/MicheleBertoli/react-automata) - it's awesome and you should check it out.

## License

MIT © [jxom](http://jxom.io)
