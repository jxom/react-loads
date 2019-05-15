# React Loads

> A React Hook to handle promise state & response data.

**Important note: As of v7, React Loads is a [React Hook](https://reactjs.org/docs/hooks-intro.html), meaning you can only use `useLoads` inside a [function component](https://reactjs.org/docs/components-and-props.html#function-and-class-components). If you want to use React Loads in a class component, read [Compatibility with class components](#compatibility-with-class-components)**

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

- Manage your async data & states with a declarative syntax with [React Hooks](#children-render-props)
- Predictable outcomes with deterministic [state variables](#isidle) or [state components](#usage-with-state-components) to avoid messy state ternaries
- Invoke your loading function **on initial render** and/or [on demand](#defer)
- Pass any type of promise to your [loading function](#load)
- Add a [delay](#delay) to prevent flashes of loading **state**
- Add a [timeout](#timeout) to provide feedback when your loading function is taking a while to resolve
- [Data caching](#caching-response-data) enabled by default to maximise user experience between page transitions
- Tell Loads [how to load](#loadpolicy) your data from the cache to prevent unnessessary invocations
- [External cache](#external-cache) support to enable something like local storage caching
- [Optimistic responses](#optimistic-responses) to update your UI optimistically

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
      - [update](#update)
    - [inputs](#inputs)
    - [`loader`](#loader)
      - [response](#response)
      - [error](#error)
      - [load](#load-1)
      - [update](#update-1)
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
  - [Optimistic responses](#optimistic-responses)
    - [setResponse(data[, opts[, callback]]) / setError(data[, opts[, callback]])](#setresponsedata-opts-callback--seterrordata-opts-callback)
      - [data](#data)
      - [opts](#opts)
        - [opts.context](#optscontext)
      - [callback](#callback)
    - [Basic example](#basic-example)
    - [Example updating another `useLoads` optimistically](#example-updating-another-useloads-optimistically)
  - [Updating resources](#updating-resources)
  - [Articles](#articles)
  - [Happy customers](#happy-customers)
  - [License](#license)

## Installation

```
npm install react-loads --save
```

or install with [Yarn](https://yarnpkg.com) if you prefer:

```
yarn add react-loads
```

## Usage

**Important note: In v7, React Loads is a [React Hook](https://reactjs.org/docs/hooks-intro.html), meaning you can only use `useLoads` inside a [function component](https://reactjs.org/docs/components-and-props.html#function-and-class-components). If you want to use React Loads in a class component, read [Compatibility with class components](#compatibility-with-class-components)**

```jsx
import React from 'react';
import { useLoads } from 'react-loads';

export default function DogApp() {
  async function getRandomDog() {
    return axios.get('https://dog.ceo/api/breeds/image/random')
  }
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
  async function getRandomDog() {
    return axios.get('https://dog.ceo/api/breeds/image/random')
  }
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
      <Rejected>
        <div type="danger">{error.message}</div>
      </Rejected>
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

> `function(...args, { setResponse, setError })` | returns `Promise` | required

The function to invoke. **It must return a promise.**

The arguments `setResponse` & `setError` are optional and are used for optimistic responses. [Read more on optimistic responses](#optimistic-responses).

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

#### update

`function(...args, { setResponse, setError })` | returns `Promise | Array<Promise>`

A function to update the response from `load`. **It must return a promise.** Think of `update` like a secondary `load`, which has a different way of fetching/loading data.

**IMPORTANT NOTE ON `update`**: It is recommended that your update function resolves with the same response schema as your loading function (load) to avoid erroneous & confusing behaviour in your UI.

Read more on the `update` function [here](#updating-resources).

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

> `function(...args, { setResponse, setError })` | returns `Promise`

Trigger to invoke [`load`](#load).

The arguments `setResponse` & `setError` are optional and are used for optimistic responses. [Read more on optimistic responses](#optimistic-responses).

#### update

> `function(...args, { setResponse, setError })` or `Array<function(...args, { setResponse, setError })>`

Trigger to invoke [`update`(#update)]

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
      <Rejected>
        <div type="danger">{error.message}</div>
      </Rejected>
    </div>
  );
}
```

### External cache

#### Global cache provider

If you would like the ability to persist response data upon unmounting the application (e.g. page refresh or closing window), a cache provider can also be utilised to cache response data.

Here is an example using [Store.js](https://github.com/marcuswestin/store.js/) and setting the cache provider on an application level using `<LoadsContext.Provider>`. If you would like to set a cache provider on a hooks level with `useLoads`, see [Local cache provider](#local-cache-provider).

`index.js`
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { setCacheProvider } from 'react-loads';

const cacheProvider = {
  get: key => store.get(key),
  set: (key, val) => store.set(key, val)
}

ReactDOM.render(
  <LoadsContext.Provider cacheProvider={cacheProvider}>
    {/* ... */}
  </LoadsContext.Provider>
)
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

## Optimistic responses

React Loads has the ability to optimistically update your data while it is still waiting for a response (if you know what the response will potentially look like). Once a response is received, then the optimistically updated data will be replaced by the response. [This article](https://uxplanet.org/optimistic-1000-34d9eefe4c05) explains the gist of optimistic UIs pretty well.

The `setResponse` and `setError` functions are provided as the last argument of your loading function (`load`). The interface for these functions, along with an example implementation are seen below.

### setResponse(data[, opts[, callback]]) / setError(data[, opts[, callback]])

Optimistically sets a successful response or error.

#### data

> `Object` or `function(currentData) {}` | required

The updated data. If a function is provided, then the first argument will be the current loaded (or cached) data.

#### opts

> `Object{ context }`

##### opts.context

> `string` | optional

The context where the data will be updated. If not provided, then it will use the `context` prop specified in `useLoads`. If a `context` is provided, it will update the responses of all `useLoads` using that context immediately.

#### callback

> function(currentData) {}

A callback can be also provided as a *second or third* parameter to `setResponse`, where the first and only parameter is the current loaded (or cached) response (`currentData`).

### Basic example

```jsx
import React from 'react';
import { useLoads } from 'react-loads';

export default function DogApp() {
  const getRandomDog = ({ setResponse }) => {
    setResponse({ data: { message: 'https://images.dog.ceo/breeds/doberman/n02107142_17147.jpg' } })
    return axios.get('https://dog.ceo/api/breeds/image/random');
  }
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

### Example updating another `useLoads` optimistically

```jsx
import React from 'react';
import { useLoads } from 'react-loads';

export default function DogApp() {
  async function createDog(dog, { setResponse }) {
    setResponse(dog, { context: 'dog' });
    // ... - create the dog
  }
  const createDogLoader = useLoads(createDog, { defer: true });

  async function getDog() {
    // ... - fetch and return the dog
  }
  const getDogLoader = useLoads(getDog, { context: 'dog' });

  return (
    <React.Fragment>
      <button onClick={() => createDogLoader.load({ name: 'Teddy', breed: 'Groodle' })}>Create</button>
      {getDogLoader.response && <div>{getDogLoader.response.name}</div>}
    </React.Fragment>
  )
}
```

## Updating resources

Instead of using multiple `useLoads`'s to provide a way to update/amend a resource, you are able to specify an `update` function which mimics the `load` function. In order to use the `update` function, you must have a `load` function which shares the same response schema as your `update` function.

Here's an example of how you could use an update function:

```jsx
import React from 'react';
import { useLoads } from 'react-loads';

export default function DogApp() {
  const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
  const getRandomDoberman = () => axios.get('https://dog.ceo/api/breed/doberman/images/random');
  const getRandomPoodle = () => axios.get('https://dog.ceo/api/breed/poodle/images/random');
  const {
    response,
    load,
    update: [loadDoberman, loadPoodle],
    isPending,
    isResolved
  } = useLoads(getRandomDog, {
    update: [getRandomDoberman, getRandomPoodle]
  });

  return (
    <div>
      {isPending && 'Loading...'}
      {isResolved && (
        <div>
          <div>
            <img src={response.data.message} width="300px" alt="Dog" />
          </div>
          <button onClick={load}>Load another random dog</button>
          <button onClick={loadDoberman}>Load doberman</button>
          <button onClick={loadPoodle}>Load poodle</button>
        </div>
      )}
    </div>
  );
}
```

## Compatibility with class components

React Loads v7 is a [React Hook](https://reactjs.org/docs/hooks-intro.html) that can only be used inside [function components](https://reactjs.org/docs/components-and-props.html#function-and-class-components). If you need to use React Loads inside class components, you can do one of the following:

- If you **don't want to use React Hooks** and still wish use React Loads inside class (and/or function) components, then check out the [v6 docs](https://github.com/jxom/react-loads/tree/v6).

- If you have **React Loads v6 installed**, and **want to use React Loads v7** (for hook support), you can install v7 with `yarn add react-loads-hook` and import it accordingly.

- If you have **React Loads v7 installed**, and also **want to use React Loads v6** (for class component support), you can install v6 with `yarn add react-loads-legacy` and import it accordingly.


## Articles

- [Introducing React Loads — A headless React component to handle promise states and response data](https://medium.freecodecamp.org/introducing-react-loads-a-headless-react-component-to-handle-promise-states-and-response-data-f45cb3621335)
- [Using React Loads and caching for a simple, snappy loading UX](https://medium.com/localz-engineering/using-react-loads-and-caching-for-a-simple-snappy-loading-ux-a91506cce5d1)

## Happy customers

- "I'm super excited about this package" - [Michele Bertoli](https://twitter.com/MicheleBertoli)
- "Love the API! And that nested ternary-boolean example is a perfect example of how messy React code commonly gets without structuring a state machine." - [David K. Piano](https://twitter.com/DavidKPiano)
- "Using case statements with React components is comparable to getting punched directly in your eyeball by a giraffe. This is a huge step up." - [Will Hackett](https://twitter.com/willhackett)

## License

MIT © [jxom](http://jxom.io)
