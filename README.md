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

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [More examples](#more-examples)
- [`<Loads>` Props](#basic-loads-props)
  - [fn](#fn)
  - [delay](#delay)
  - [loadOnMount](#loadonmount)
  - [timeout](#timeout)
  - [cacheKey](#cacheKey)
  - [enableBackgroundStates](#enablebackgroundstates)
  - [cacheProvider](#cacheProvider)
  - [`children` Render Props](#children-render-props)
    - [response](#response)
    - [error](#error)
    - [load](#load)
    - [isIdle](#isIdle)
    - [isLoading](#isLoading)
    - [isTimeout](#isTimeout)
    - [isSuccess](#isSuccess)
    - [isError](#isError)
    - [hasResponseInCache](#hasResponseInCache)
- [`<LoadsProvider>` Props](#loadsprovider-props)
  - [cacheProvider](#cacheprovider)
- [Caching response data](#caching-response-data)
  - [Basic application context cache](#basic-application-context-cache)
  - [Using a cache provider](#using-a-cache-provider)
    - [Application-level cache provider](#application-level-cache-provider)
    - [`<Loads>`-level cache provider](#loads-level-cache-provider)
- [Special thanks](#special-thanks)
- [License](#license)


## Installation

```
npm install react-loads
```

or install with [Yarn](https://yarnpkg.com) if you prefer:

```
yarn add react-loads
```

## Usage

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

## `<Loads>` Props

### fn

> `function()` | returns `Promise` | required

The function to invoke. **It must return a promise.**

### delay

> `number` | default: `300`

Number of milliseconds before the component transitions to the `'loading'` state upon invoking `fn`.

### loadOnMount

> `boolean` | default: `false`

Whether or not to invoke `fn` on mount.

### timeout

> `number` | default: `0`

Number of milliseconds before the component transitions to the `'timeout'` state. Set to `0` to disable.

*Note: `fn` will still continue to try an resolve while in the `'timeout'` state*

### cacheKey

> `string`

Unique identifier to store the response/error data in cache. Your application must be wrapped in a `<LoadsProvider>` to enable caching (see [Caching response data](#caching-response-data) below).

### enableBackgroundStates

> `boolean` | default: `false`

If true and the data is in cache, `isIdle`, `isLoading` and `isTimeout` will be evaluated on subsequent loads. When `false` (default), these states are only evaluated on initial load and are falsy on subsequent loads - this is helpful if you want to show the cached response and not have a idle/loading/timeout indicator when `fn` is invoked again. You must have a `cacheKey` set to enable background states as it only effects data in the cache.

### cacheProvider

> `Object({ get: function(key), set: function(key, val) })`

Set a custom cache provider (e.g. local storage, session storate, etc). See [`<Loads>`-level cache provider](#loads-level-cache-provider) below for an example.

### `children` Render Props

#### response

> `any`

Response from the resolve promise (`fn`).

#### error

> `any`

Error from the rejected promise (`fn`).

#### load

> `function(...args)`

Trigger to invoke `fn`.

#### isIdle

> `boolean`

Returns `true` if the state is idle (`fn` has not been triggered).

#### isLoading

> `boolean`

Returns `true` if the state is loading (`fn` is in a pending state).

#### isTimeout

> `boolean`

Returns `true` if the state is timeout (`fn` is in a pending state for longer than `delay` milliseconds).

#### isSuccess

> `boolean`

Returns `true` if the state is success (`fn` has been resolved).

#### isError

> `boolean`

Returns `true` if the state is error (`fn` has been rejected).

#### hasResponseInCache

> `boolean`

Returns `true` if data already exists in the cache.****

## `<LoadsProvider>` Props

### cacheProvider

> `Object({ get: function(key), set: function(key, val) })`

Set a custom cache provider (e.g. local storage, session storate, etc). See [Application-level cache provider](#application-level-cache-provider) below for an example.

## Caching response data

### Basic application context cache

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

### Using a cache provider

#### Application-level cache provider

If you would like the ability to persist response data upon unmounting the application (e.g. page refresh or closing window), a `cacheProvider` can also be utilised to cache response data.

Here is an example using [Store.js](https://github.com/marcuswestin/store.js/) and setting the cache provider on an application level using `<LoadsProvider>`. If you would like to set a `cacheProvider` on a component level within `<Loads>`, see [Local cache provider](#local-cache-provider):

```jsx
import React from 'react';
import Loads, { LoadsProvider } from 'react-loads';
import store from 'store';

const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');

const RandomDog = () => (
  <Loads
    cacheKey="randomDog"
    loadOnMount
    fn={getRandomDog}
  >
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

const cacheProvider = {
  // Note: `key` maps to the `cacheKey` which is provided to <Loads>.
  get: key => {
    return store.get(`dog-app.${key}`);
  },
  set: (key, val) => {
    return store.set(`dog-app.${key}`, val);
  }
};

const App = () => (
  <LoadsProvider cacheProvider={cacheProvider}>
    <RandomDog />
  </LoadsProvider>
);

export default App;
```

#### `<Loads>`-level cache provider

A cache provider can also be specified on a component level. If a `cacheProvider` is provided to `<Loads>`, it will override the application cache provider if one is already specified.

```jsx
import React from 'react';
import Loads, { LoadsProvider } from 'react-loads';
import store from 'store';

const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');

const cacheProvider = {
  // Note: `key` maps to the `cacheKey` which is provided to <Loads>.
  // In this case, the key will be 'randomDog'.
  get: key => {
    return store.get(key);
  },
  set: (key, val) => {
    return store.set(key, val);
  }
};

const RandomDog = () => (
  <Loads
    cacheKey="randomDog"
    cacheProvider={cacheProvider}
    loadOnMount
    fn={getRandomDog}
  >
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
