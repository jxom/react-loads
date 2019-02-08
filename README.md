# React Loads

> A React Hook to handle promise state & response data.

## The problem

There are a few concerns in managing async data fetching manually:

- Managing loading state can be annoying and prone to a confusing user experience if you aren't careful.
- Managing data persistence across page transitions can be easily overlooked.
- Flashes of loading state & no feedback on something that takes a while to load can be annoying.
- Nested ternaries can get messy and hard to read. Example:

```jsx
<Fragment>
  {isPending ? (
    <p>{hasTimedOut ? 'Taking a while...' : 'Loading...'}</p>
  ) : (
    <Fragment>
      {!error && !response && <button onClick={this.handleLoad}>Click here to load!</button>}
      {response && <p>{response}</p>}
      {error && <p>{error.message}</p>}
    </Fragment>
  )}
</Fragment>
```

## The solution

React Loads comes with a handy set of features to help solve these concerns:

## Table of contents

- [React Loads](#react-loads)
  - [The problem](#the-problem)
  - [The solution](#the-solution)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Usage with state components](#usage-with-state-components)
    - [More examples](#more-examples)
  - [`useLoads(load[, config[, inputs]])`](#useloadsload-config-inputs)
    - [load](#load)
    - [config](#config)
      - [defer](#defer)
      - [delay](#delay)
      - [context](#context)
      - [timeout](#timeout)
      - [loadPolicy](#loadpolicy)
      - [enableBackgroundStates](#enablebackgroundstates)
      - [cacheProvider](#cacheprovider)
    - [inputs](#inputs)
    - [`loader`](#loader)
      - [response](#response)
      - [error](#error)
      - [load](#load-1)
      - [isIdle](#isidle)
      - [isPending](#ispending)
      - [isTimeout](#istimeout)
      - [isResolved](#isresolved)
      - [isRejected](#isrejected)
      - [Idle](#idle)
      - [Pending](#pending)
      - [Timeout](#timeout)
      - [Resolved](#resolved)
      - [Rejected](#rejected)
      - [isCached](#iscached)
  - [`setCacheProvider(cacheProvider)`](#setcacheprovidercacheprovider)
    - [cacheProvider](#cacheprovider-1)
  - [Caching response data](#caching-response-data)
    - [Basic cache](#basic-cache)
    - [External cache](#external-cache)
      - [Global cache provider](#global-cache-provider)
      - [Local cache provider](#local-cache-provider)
  - [Articles](#articles)
  - [Happy customers](#happy-customers)
  - [License](#license)

## Installation

```
npm install react-loads@next --save
```

or install with [Yarn](https://yarnpkg.com) if you prefer:

```
yarn add react-loads@next
```

## Usage

```jsx
import React from 'react';
import { useLoads } from 'react-loads';

export default function DogApp() {
  const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
  const { response, error, load, isRejected, isPending, isResolved } = useLoads(getRandomDog);

  return (
    <div>
      {isPending && <div>loading...</div>}
      {isResolved && (
        <div>
          <div>
            <img src={response.data.message} width="300px" alt="Dog" />
          </div>
          <button onClick={load}>Load another</button>
        </div>
      )}
      {isRejected && <div type="danger">{error.message}</div>}
    </div>
  );
}
```

> Note: You don't always have to provide a 'getter' function to `load`. You can provide any type of promise!

### Usage with state components

You can also use state components to conditionally render children:

```jsx
import React from 'react';
import { useLoads } from 'react-loads';

export default function DogApp() {
  const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
  const { response, error, load, Pending, Resolved, Rejected } = useLoads(getRandomDog);

  return (
    <div>
      <Pending>
        <div>loading...</div>
      </Pending>
      <Resolved>
        <div>
          <div>
            {response && <img src={response.data.message} width="300px" alt="Dog" />}
          </div>
          <button onClick={load}>Load another</button>
        </div>
      </Resolved>
      <Error>
        <div type="danger">{error.message}</div>
      </Error>
      <Resolved or={[Pending, Rejected]}>
        This will show when the state is pending, resolved or rejected.
      </Resolved>
    </div>
  );
}
```

### More examples

- [Stories](./src/__stories__/index.stories.js)
- [Tests](./src/__tests__/useLoads.test.tsx)

## `useLoads(load[, config[, inputs]])`

> returns [an object (`loader`)](#loader)

### load

> `function(...args)` | returns `Promise` | required

The function to invoke. **It must return a promise.**

### config

#### defer

> `boolean` | default: `false`

By default, the loading function will be invoked on initial render. However, if you want to defer the loading function (call the loading function at another time), then you can set `defer` to true.

> If `defer` is set to true, the initial loading state will be `"idle"`.

Example:

```jsx
const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
const { response, error, load, Pending, Resolved, Rejected } = useLoads(getRandomDog, { defer: true });

return (
  <div>
    <Idle>
      <button onClick={load}>Load dog</button>
    </Idle>
    <Pending>
      <div>loading...</div>
    </Pending>
    <Resolved>
      <div>
        <div>
          {response && <img src={response.data.message} width="300px" alt="Dog" />}
        </div>
        <button onClick={load}>Load another</button>
      </div>
    </Resolved>
  </div>
);
```

#### delay

> `number` | default: `300`

Number of milliseconds before the component transitions to the `'pending'` state upon invoking `load`.

#### context

> `string`

Unique identifier for the promise (`load`). Enables the ability to [persist the response data](#caching-response-data). If `context` changes, then `load` will be invoked again.

#### timeout

> `number` | default: `0`

Number of milliseconds before the component transitions to the `'timeout'` state. Set to `0` to disable.

_Note: `load` will still continue to try an resolve while in the `'timeout'` state_

#### loadPolicy

> `"cache-first" | "cache-and-load" | "load-only"` | default: `"cache-and-load"`

A load policy allows you to specify whether or not you want your data to be resolved from the Loads cache and how it should load the data.

- `"cache-first"`: If a value for the promise already exists in the Loads cache, then Loads will return the value that is in the cache, otherwise it will invoke the promise.

- `"cache-and-load"`: This is the default value and means that Loads will return with the cached value if found, but regardless of whether or not a value exists in the cache, it will always invoke the promise.

- `"load-only"`: This means that Loads will not return the cached data altogether, and will only return the data resolved from the promise.

#### enableBackgroundStates

> `boolean` | default: `false`

If true and the data is in cache, `isIdle`, `isPending` and `isTimeout` will be evaluated on subsequent loads. When `false` (default), these states are only evaluated on initial load and are falsy on subsequent loads - this is helpful if you want to show the cached response and not have a idle/pending/timeout indicator when `load` is invoked again. You must have a `context` set to enable background states as it only effects data in the cache.

#### cacheProvider

> `Object({ get: function(key), set: function(key, val) })`

Set a custom cache provider (e.g. local storage, session storate, etc). See [external cache](#external-cache) below for an example.

### inputs

> `Array<any>`

You can optionally pass an array of `inputs` (or an empty array), which `useLoads` will use to determine whether or not to load the loading function. If any of the values in the `inputs` array change, then it will reload the loading function.

```jsx
const getRandomDog = () => axios.get(`https://dog.ceo/api/breeds/image/${props.id}`);
const { response, error, load, Pending, Resolved, Rejected } = useLoads(getRandomDog, {}, [props.id]);

return (
  <div>
    <Idle>
      <button onClick={load}>Load dog</button>
    </Idle>
    <Pending>
      <div>loading...</div>
    </Pending>
    <Resolved>
      <div>
        <div>
          {response && <img src={response.data.message} width="300px" alt="Dog" />}
        </div>
        <button onClick={load}>Load another</button>
      </div>
    </Resolved>
  </div>
);
```

### `loader`

#### response

> `any`

Response from the resolved promise (`load`).

#### error

> `any`

Error from the rejected promise (`load`).

#### load

> `function(...args)`

Trigger to invoke [`load`](#load).

#### isIdle

> `boolean`

Returns `true` if the state is idle (`load` has not been triggered).

#### isPending

> `boolean`

Returns `true` if the state is pending (`load` is in a pending state).

#### isTimeout

> `boolean`

Returns `true` if the state is timeout (`load` is in a pending state for longer than `delay` milliseconds).

#### isResolved

> `boolean`

Returns `true` if the state is resolved (`load` has been resolved).

#### isRejected

> `boolean`

Returns `true` if the state is rejected (`load` has been rejected).

#### Idle

> `ReactComponent`

Renders it's children when the state is idle.

[See here for an example](#usage-with-state-components)

#### Pending

> `ReactComponent`

Renders it's children when the state is pending.

[See here for an example](#usage-with-state-components)

#### Timeout

> `ReactComponent`

Renders it's children when the state is timeout.

[See here for an example](#usage-with-state-components)

#### Resolved

> `ReactComponent`

Renders it's children when the state is resolved.

[See here for an example](#usage-with-state-components)

#### Rejected

> `ReactComponent`

Renders it's children when the state is rejected.

[See here for an example](#usage-with-state-components)

#### isCached

> `boolean`

Returns `true` if data exists in the cache.

## `setCacheProvider(cacheProvider)`

### cacheProvider

> `Object({ get: function(key), set: function(key, val) })`

Set a custom cache provider (e.g. local storage, session storate, etc). See [external cache](#external-cache) below for an example.

## Caching response data

### Basic cache

React Loads has the ability to cache the response and error data. The cached data will persist while the application is mounted, however, will clear when the application is unmounted (on page refresh or window close). Here is an example to use it:

```jsx
import React from 'react';
import { useLoads } from 'react-loads';

export default function DogApp() {
  const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
  const { response, error, load, Pending, Resolved, Rejected } = useLoads(getRandomDog, { context: 'random-dog' });

  return (
    <div>
      <Pending>
        <div>loading...</div>
      </Pending>
      <Resolved>
        <div>
          <div>
            {response && <img src={response.data.message} width="300px" alt="Dog" />}
          </div>
          <button onClick={load}>Load another</button>
        </div>
      </Resolved>
      <Error>
        <div type="danger">{error.message}</div>
      </Error>
    </div>
  );
}
```

### External cache

#### Global cache provider

If you would like the ability to persist response data upon unmounting the application (e.g. page refresh or closing window), a cache provider can also be utilised to cache response data.

Here is an example using [Store.js](https://github.com/marcuswestin/store.js/) and setting the cache provider on an application level using `setCacheProvider`. If you would like to set a cache provider on a hooks level with `useLoads`, see [Local cache provider](#local-cache-provider).

`index.js`
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { setCacheProvider } from 'react-loads';

const cacheProvider = {
  get: key => store.get(key),
  set: (key, val) => store.set(key, val)
}
setCacheProvider(cacheProvider);

ReactDOM.render(/* Your app here */)
```

#### Local cache provider

A cache provider can also be specified on a component level with `useLoads`. If a `cacheProvider` is provided to `useLoads`, it will override the global cache provider if one is already set.

```jsx
import React from 'react';
import { useLoads } from 'react-loads';

const cacheProvider = {
  get: key => store.get(key),
  set: (key, val) => store.set(key, val)
}

export default function DogApp() {
  const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
  const { response, error, load, Pending, Resolved, Rejected } = useLoads(getRandomDog, {
    cacheProvider,
    context: 'random-dog'
  });

  return (
    <div>
      <Pending>
        <div>loading...</div>
      </Pending>
      <Resolved>
        <div>
          <div>
            {response && <img src={response.data.message} width="300px" alt="Dog" />}
          </div>
          <button onClick={load}>Load another</button>
        </div>
      </Resolved>
      <Error>
        <div type="danger">{error.message}</div>
      </Error>
    </div>
  );
}
```

## Articles

- [Introducing React Loads — A headless React component to handle promise states and response data](https://medium.freecodecamp.org/introducing-react-loads-a-headless-react-component-to-handle-promise-states-and-response-data-f45cb3621335)
- [Using React Loads and caching for a simple, snappy loading UX](https://medium.com/localz-engineering/using-react-loads-and-caching-for-a-simple-snappy-loading-ux-a91506cce5d1)

## Happy customers

- "I'm super excited about this package" - [Michele Bertoli](https://twitter.com/MicheleBertoli)
- "Love the API! And that nested ternary-boolean example is a perfect example of how messy React code commonly gets without structuring a state machine." - [David K. Piano](https://twitter.com/DavidKPiano)
- "Using case statements with React components is comparable to getting punched directly in your eyeball by a giraffe. This is a huge step up." - [Will Hackett](https://twitter.com/willhackett)

## License

MIT © [jxom](http://jxom.io)
