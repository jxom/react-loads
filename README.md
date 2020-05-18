# React Loads

> React Loads is a backend agnostic library to help with external data fetching & caching in your UI components.

## Features

- **Hooks** and **Render Props** to manage your async states & response data
- **Backend agnostic.** Use React Loads with REST, GraphQL, or Web SDKs
- **Renderer agnostic.** Use React Loads with React DOM, React Native, React VR, etc
- **Automated caching & revalidation** to maximise user experience between page transitions
- **React Suspense** support
- **SSR** support
- **Preloading** support
- **Polling** support to load data every x seconds
- **Request deduping** to minimise over-fetching of your data
- **Focus revalidation** to re-fetch your data when the browser window is focused
- **Resources** to allow your to hoist common async functions for built-in caching & reusability
- **Finite set of state variables** to avoid cryptic ternaries and impossible states
- **External cache** support
- **Optimistic responses**
- Pretty small – **5kB gzipped**

## Table of Contents

- [Features](#features)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Guides](#guides)
  - [Starting out](#starting-out)
  - [Deferring](#deferring)
  - [Configuration](#configuration)
  - [Variables](#variables)
  - [Conditional loaders](#conditional-loaders)
  - [Dependant loaders](#dependant-loaders)
  - [Caching](#caching)
  - [Slow connections](#slow-connections)
  - [Polling](#polling)
  - [Deduping](#deduping)
  - [Suspense](#suspense)
  - [Optimistic responses](#optimistic-responses)
  - [Resources](#resources)
  - [External cache providers](#external-cache-providers)
  - [Preloading (experimental)](#preloading-experimental)
- [API](#api)
  - [useLoads](#useloads)
  - [useDeferredLoads](#usedeferredloads)
  - [useCache](#usecache)
  - [useGetStates](#usegetstates)
  - [&lt;Provider&gt;](#provider)
  - [createResource](#createresource)
  - [preload (experimental)](#preload-experimental-1)
  - [Config](#config)
- [Happy customers](#happy-customers)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## Installation

```
yarn add react-loads
```

or npm:

```
npm install react-loads
```

## Quick start

### With Hooks

```jsx
import React from 'react';
import * as Loads from 'react-loads';

async function fetchRandomDog() {
  // Dog fetcher logic here!
  // You can use any type of backend here - REST, GraphQL, you name it!
}

export default function RandomDog() {
  const {
    response,
    error,
    isPending,
    isResolved,
    isRejected
  } = Loads.useLoads('randomDog', fetchRandomDog);
  return (
    <div>
      {isPending && 'Loading...'}
      {isResolved && <img src={response.imgSrc} />}
      {isRejected && `Oh no! ${error.message}`}
    </div>
  )
}
```

[See the CodeSandbox example](https://codesandbox.io/s/react-loads-basic-example-38biz)

The `useLoads` function accepts three arguments: a **context key**, an **async function**, and a **config object** (not used in this example). The **context key** will store the response of the `fetchRandomDog` function in the React Loads cache against the key. The **async function** is a function that returns a promise, and is used to fetch your data.

The `useLoads` function also returns a set of values: `response`, `error`, and a finite set of states (`isIdle`, `isPending`, `isResolved`, `isRejected`, and a few others). If your **async function** resolves, it will update the `response` & `isResolved` values. If it rejects, it will update the `error` value.

> IMPORTANT NOTE: You must provide useLoads with a memoized promise (via `React.useCallback` or **bounded outside of your function component as seen in the above example**), otherwise useLoads will be invoked on every render.
>
> If you are using `React.useCallback`, the [`react-hooks` ESLint Plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) is incredibly handy to ensure your hook dependencies are set up correctly.

### With Render Props

If your codebase isn't quite hook ready yet, React Loads provides a Render Props interface which shares the same API as the hook:

```jsx
import React from 'react';
import { Loads } from 'react-loads';

async function fetchRandomDog() {
  // Dog fetcher logic here!
  // You can use any type of backend here - REST, GraphQL, you name it!
}

class RandomDog extends React.Component {
  render() {
    return (
      <Loads context="randomDog" fn={fetchRandomDog}>
        {({ response, error, isPending, isResolved, isRejected }) => (
          <div>
            {isPending && 'Loading...'}
            {isResolved && <img src={response.imgSrc} />}
            {isRejected && `Oh no! ${error.message}`}
          </div>
        )}
      </Loads>
    )
  }
}
```

[See the CodeSandbox example](https://codesandbox.io/s/react-loads-basic-example-class-component-3vg8v)

### More examples

- [Basic](./examples/basic)
- [Top movies](./examples/top-movies)
- [Resources](./examples/with-resources)
- [Typescript](./examples/with-typescript)
- Render-as-you-fetch
  - [Basic](./examples/render-as-you-fetch/basic)
  - [Resources](./examples/render-as-you-fetch/with-resources)
- [Stories](https://jxom.github.io/react-loads/)

## Guides

### Starting out

There are two main hooks: `useLoads` & `useDeferredLoads`.

- `useLoads` is called on first render,
- `useDeferredLoads` is called when you choose to invoke it (it's deferred until later).

Let's focus on the `useLoads` hook for now, we will explain `useDeferredLoads` in the next section.

The `useLoads` hook accepts 3 parameters:

- A [**"context key"**](#optionscontext) in the form of a **string**.
  - It will help us with identifying/storing data, deduping your requests & updating other `useLoad`'s sharing the same context
  - Think of it as the namespace for your data
- An [**"async function"**](#optionsfn) in the form of a **function that returns a promise**
  - This will be the function to resolve the data
- An optional [**"config"**](#config) in the form of an **object**

```jsx
import React from 'react';
import * as Loads from 'react-loads';

async function fetchRandomDog() {
  // Dog fetcher logic here!
  // You can use any type of backend here - REST, GraphQL, you name it!
}

export default function RandomDog() {
  const {
    response,
    error,
    load,
    isPending,
    isReloading,
    isResolved,
    isRejected
  } = Loads.useLoads('randomDog', fetchRandomDog);
  return (
    <div>
      {isPending && 'Loading...'}
      {isResolved && (
        <div>
          <img src={response.imgSrc} />
          <button onClick={load} disabled={isReloading}>Load another</button>
        </div>
      )}
      {isRejected && `Oh no! ${error.message}`}
    </div>
  )
}
```

[See the CodeSandbox example](https://codesandbox.io/s/react-loads-basic-example-38biz)

The `useLoads` hook represents a finite state machine and returns a set of state variables:

- `isIdle` if the async function hasn't been invoked yet (relevant for `useDeferredLoads`)
- `isPending` for when the async function is loading
- `isReloading` for when the async function is reloading (typically truthy when data already exists in the cache)
- `isResolved` for when the async function has resolved
- `isRejected` for when the async function has errored

It also returns a `response` variable if your function resolves, and an `error` variable if rejected.

If you want to reload your data, `useLoads` also returns a `load` variable, which you can invoke.

The `useLoads` hook returns [some other variables](#returns) as well.

### Deferring

Sometimes you don't want your async function to be invoked straight away. This is where the `useDeferredLoads` hook can be handy. It waits until you manually invoke it.

```jsx
import React from 'react';
import * as Loads from 'react-loads';

async function fetchRandomDog() {
  // Dog fetcher logic here!
  // You can use any type of backend here - REST, GraphQL, you name it!
}

export default function RandomDog() {
  const {
    response,
    error,
    load,
    isIdle,
    isPending,
    isReloading,
    isResolved,
    isRejected
  } = Loads.useDeferredLoads('randomDog', fetchRandomDog);
  return (
    <div>
      {isIdle && <button onClick={load}>Load a dog</button>}
      {isPending && 'Loading...'}
      {isResolved && (
        <div>
          <img src={response.imgSrc} />
          <button onClick={load} disabled={isReloading}>Load another</button>
        </div>
      )}
      {isRejected && `Oh no! ${error.message}`}
    </div>
  )
}
```

[See the CodeSandbox example](https://codesandbox.io/s/react-loads-basic-example-usedeferredloads-ev3vi)

In the above example, the dog image is fetched via the `load` variable returned from `useDeferredLoads`.

There are also some cases where including a **context key** may not make sense. You can omit it if you want like so:

```js
const { ... } = useDeferredLoads(fetchRandomDog);
```

### Configuration

You can set configuration on either a global level, or a local `useLoads` level.

#### On a global level

By setting configuration on a global level, you are setting defaults for all instances of `useLoads`.

```jsx
import * as Loads from 'react-loads';

const config = {
  dedupingInterval: 1000,
  timeout: 3000
};

export default function App() {
  return (
    <Loads.Provider config={config}>
      ...
    <Loads.Provider>
  )
}
```

> Warning: The `config` prop must be memoized. Either memoize it using `React.useMemo` or put it outside of the function component.

[See the full set of configuration options here](#config-1)

#### On a `useLoads` level

By setting configuration on a `useLoads` level, you are overriding any defaults set by `Loads.Provider`.

```jsx
const { ... } = useLoads('randomDog', fetchRandomDog, { dedupingInterval: 1000, timeout: 3000 });
```

[See the full set of configuration options here](#config-1)

### Variables

If your async function needs some dependant variables (such as an ID or query parameters), use the `variables` attribute in the `useLoads` config:

```jsx
async function fetchDog(id) {
  return axios.get(`https://dog.api/${id}`);
}

export default function DogImage(props) {
  const { ... } = useLoads('dog', fetchDog, { variables: [props.id] });
}
```

[See the CodeSandbox example](https://codesandbox.io/s/react-loads-variables-o6l5d)

The `variables` attribute accepts an array of values. If your async function accepts more than one argument, you can pass through just as many values to `variables` as the function accepts:

```jsx
async function fetchDog(id, foo, bar) {
  // id = props.id
  // foo = { hello: 'world' }
  // bar = true
  return axios.get(`https://dog.api/${id}`);
}

export default function DogImage(props) {
  const { ... } = useLoads('dog', fetchDog, {
    variables: [props.id, { hello: 'world' }, true]
  });
}
```

#### WARNING!

It may be tempting to not use the `variables` attribute at all, and just use the dependencies outside the scope of the function itself. While this works, it will probably produce unexpected results as the cache looks up the record against the **context key (`'dog'`)** and the set of **`variables`**. However, in this case, it will only look up the record against the `'dog'` context key meaning that every response will be stored against that key.

```jsx
// DON'T DO THIS! IT WILL CAUSE UNEXPECTED RESULTS!

export default function DogImage(props) {
  const id = props.id;
  const fetchDog = React.useCallback(() => {
    return axios.get(`https://dog.api/${id}`);
  })
  const { ... } = useLoads('dog', fetchDog);
}
```

### Conditional loaders

If you want to control when `useLoads` invokes it's async function via a variable, you can use the `defer` attribute in the config.

```jsx
export default function RandomDog(props) {
  // Don't fetch until shouldFetch is truthy.
  const { ... } = useLoads('randomDog', fetchRandomDog, {
    defer: !props.shouldFetch
  });
}
```

[See the CodeSandbox example](https://codesandbox.io/s/react-loads-conditional-fetching-bi8b2)

### Dependant loaders

There may be a case where one `useLoads` depends on the data of another `useLoads`, where you don't want subsequent `useLoads` to invoke the async function until the first `useLoads` resolves.

If you pass a function to `variables` and the function throws (due to `dog` being undefined), then the async function will be deferred while it is undefined. As soon as `dog` is defined, then the async function will be invoked.

```jsx
export default function RandomDog(props) {
  const { response: dog } = useLoads('randomDog', fetchRandomDog);
  const { response: friends } = useLoads('dogFriends', fetchDogFriends, {
    variables: () => [dog.id]
  })
}
```

[See the CodeSandbox example](https://codesandbox.io/s/react-loads-dependant-loaders-9hojp)

### Caching

Caching in React Loads comes for free with no initial configuration. React Loads uses the "stale while revalidate" strategy, meaning that `useLoads` will serve you with cached (stale) data, while it loads new data (revalidates) in the background, and then show the new data (and update the cache) to the user.

#### Caching strategy

React Loads uses the `context` argument given to `useLoads` to store the data in-memory against a **"cache key"**. If `variables` are present, then React Loads will generate a hash and attach it to the **cache key**. In a nutshell, **`cache key = context + variables`**.

```jsx
// The response of this will be stored against a "cache key" of `dog.1`
const { ... } = useLoads('dog', fetchDog, { variables: [1] });
```

React Loads will automatically revalidate whenever the cache key (`context` or `variables`) changes.

```jsx
// The fetchDog function will be fetched again if `props.context` or `props.id` changes.
const { ... } = useLoads(props.context, fetchDog, { variables: [props.id] });
```

You can change the caching behaviour by specifying a [`cacheStrategy` config option](#cachestrategy). By default, this is set to `"context-and-variables"`, meaning that the cache key will be a combination of the `context` + `variables`.

```jsx
// The response of this will be stored against a `dog` key, ignoring the variables.
const { ... } = useLoads('dog', fetchDog, { cacheStrategy: 'context-only', variables: [props.id] });
```


#### Stale data & revalidation

By default, React Loads automatically revalidates data in the cache after **5 minutes**. That is, when the `useLoads` is invoked and React Loads detects that the data is stale (hasn't been updated for 5 minutes), then `useLoads` will invoke the async function and update the cache with new data. You can change the revalidation time using the [`revalidateTime` config option](#revalidatetime).

```jsx
// Set it globally:
import * as Loads from 'react-loads';

const config = {
  revalidateTime: 600000
}

export default function App() {
  return (
    <Loads.Provider config={config}>
      ...
    </Loads.Provider>
  )
}

// Or, set it locally:
export default function RandomDog() {
  const { ... } = useLoads('randomDog', fetchRandomDog, { revalidateTime: 600000 });
}
```

#### Cache expiry

React Loads doesn't set a cache expiration by default. If you would like to set one, you can use the [`cacheTime` config option](#cachetime).

```jsx
// Set it globally:
import * as Loads from 'react-loads';

const config = {
  cacheTime: 600000
}

export default function App() {
  return (
    <Loads.Provider config={config}>
      ...
    </Loads.Provider>
  )
}

// Or, set it locally:
export default function RandomDog() {
  const { ... } = useLoads('randomDog', fetchRandomDog, { cacheTime: 600000 });
}
```

### Slow connections

On top of the `isPending` & `isReloading` states, there are substates called `isPendingSlow` & `isReloadingSlow`. If the request is still pending after 5 seconds, then the `isPendingSlow`/`isReloadingSlow` states will become truthy, allowing you to indicate to the user that the request is loading slow.

```jsx
export default function RandomDog() {
  const { isPending, isPendingSlow } = useLoads('randomDog', fetchRandomDog);
  return (
    <div>
      {isPending && `Loading... ${isPendingSlow && 'Taking a while...'}`}
    </div>
  )
}
```

By default, the timeout is **5 seconds**, you can change this with the [`timeout` config option](#timeout).

### Polling

React Loads supports request polling (reload data every `x` seconds) with the [`pollingInterval` config option](#pollingInterval).

```jsx
// Calls fetchRandomDog every 3 seconds.
const { ... } = useLoads('randomDog', fetchRandomDog, { pollingInterval: 3000 });
```

You can also add a [`pollWhile` config option](#pollWhile) if you wish to control the behaviour of when the polling should run.

```jsx
// Calls fetchRandomDog every 3 seconds while `shouldPoll` is truthy.
const shouldPoll = shouldTheDogBePollingRightNow();
const { ... } = useLoads('randomDog', fetchRandomDog, { pollingInterval: 3000, pollWhile: shouldPoll });
```

You can also access the `record` as the first parameter of `pollWhile` if you provide a function.

```jsx
// Calls processImage every 3 seconds while it's status is 'processing'.
const { ... } = useLoads(
  'randomDog',
  fetchRandomDog,
  { pollingInterval: 3000, pollWhile: record => record?.response?.status === 'processing' }
);
```

### Deduping

By default, all your requests are deduped on an interval of **500 milliseconds**. Meaning that if React Loads sees more than one request of the same cache key in under 500 milliseconds, it will not invoke the other requests. You can change the deduping interval with the [`dedupingInterval` config option](#dedupingInterval).

### Suspense

To use React Loads with Suspense, you can set the [`suspense` config option](#suspense) to `true`.

```jsx
// Set it globally:
import * as Loads from 'react-loads';

const config = {
  suspense: true
}

export default function App() {
  return (
    <Loads.Provider config={config}>
      ...
    </Loads.Provider>
  )
}

// Or, set it locally:
export default function RandomDog() {
  const { ... } = useLoads('randomDog', fetchRandomDog, { suspense: true });
}
```

Once enabled, you can use the `React.Suspense` component to replicate the `isPending` state, and use [error boundaries]() to display error states.

```jsx
function RandomDog() {
  const { response } = useLoads('randomDog', fetchRandomDog, { suspense: true });
  return <img src={response.imgSrc} />;
}

function App() {
  return (
    <React.Suspense fallback={<div>loading...</div>}>
      <RandomDog />
    </React.Suspense>
  )
}
```

### Optimistic responses

React Loads has the ability to optimistically update your data while it is still waiting for a response (if you know what the response will potentially look like). Once a response is received, then the optimistically updated data will be replaced by the response. [This article](https://uxplanet.org/optimistic-1000-34d9eefe4c05) explains the gist of optimistic UIs pretty well.

The `setResponse` function is provided in a `meta` object as seen below.

```jsx
import React from 'react';
import * as Loads from 'react-loads';

async function fetchDog(id) {
  // Fetch the dog
}

function updateDog(id, data) {
  return async meta => {
    meta.setResponse(data);
    // Fetch the dog
  }
}

export default function RandomDog(props) {
  const dogRecord = Loads.useLoads('dog', fetchDog, { variables: [props.id] });

  const updateDogRecord = Loads.useDeferredLoads('dog', updateDog);

  return (
    <div>
      {dogRecord.isPending && 'Loading...'}
      {dogRecord.isResolved && <img src={dogRecord.response.imgSrc} />}
      {dogRecord.isRejected && `Oh no! ${dogRecord.error.message}`}
      <button
        onClick={() => updateDogRecord.load(props.id, { imgSrc: 'cooldog.png' })}
      >
        Update dog
      </button>
    </div>
  )
}
```

### Resources

For async functions which may be used & invoked in many parts of your application, it may make sense to hoist and encapsulate them into resources.
A resource consists of one (or more) async function as well as a context.

Below is an example of a resource and it's usage:

```jsx
import React from 'react';
import * as Loads from 'react-loads';

// 1. Define your async function.
async function getUsers() {
  const response = await fetch('/users');
  const users = await response.json();
  return users;
}

// 2. Create your resource, and attach the loading function.
const usersResource = Loads.createResource({
  context: 'users',
  fn: getUsers
});

function MyComponent() {
  // 3. Invoke the useLoads function in your resource.
  const getUsersRecord = usersResource.useLoads();

  // 4. Use the record variables:
  const users = getUsersRecord.response || [];

  return (
    <div>
      {getUsersRecord.isPending && 'loading...'}
      {getUsersRecord.isResolved && (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

[See the CodeSandbox example](https://codesandbox.io/s/react-loads-resources-dg9xo)

You can attach more than one loading function to a resource. **But it's return value must be the same schema, as every response will update the cache.**

You can also provide an array of 2 items to the resource creator (seen below with `delete`); the first item being the async function, and the second being the [config](#config-1).

Here is an extended example using a resource with multiple async functions, split into two files (`resources/users.js` & `index.js`):

#### `resources/users.js`
```jsx
import * as Loads from 'react-loads';

async function getUser(id) {
  const response = await fetch(`/users/${id}`);
  const user = await response.json();
  return user;
}

function updateUser(id, data) {
  return async meta => {
    await fetch(`/users/${id}`, {
      method: 'post',
      body: JSON.stringify(data)
    });
    // `cachedRecord` is the record that's currently stored in the cache.
    const currentUser = meta.cachedRecord.response;
    const updatedUser = { ...currentUser, ...data };
    return updatedUser;
  }
}

async function deleteUser(id) {
  await fetch(`/users/${id}`, { method: 'delete' });
  return;
}

export default Loads.createResource({
  context: 'user',
  fn: getUser,
  // You can supply either a async function, or an array of async function/config pairs.
  update: [updateUser, { timeout: 3000 }],
  delete: deleteUser
});
```

#### `index.js`

```jsx
import React from 'react';

import DeleteUserButton from './DeleteUserButton';
import UpdateUserForm from './UpdateUserForm';
import usersResource from './resources/users';

function MyComponent(props) {
  const { userId } = props;

  const getUserRecord = usersResource.useLoads({
    variables: [userId]
  });
  const user = getUserRecord.response || {};

  const updateUserRecord = usersResource.update.useDeferredLoads({ variables: [userId] });
  const deleteUserRecord = usersResource.delete.useDeferredLoads({ variables: [userId] });

  return (
    <div>
      {getUserRecord.isPending && 'loading...'}
      {getUserRecord.isResolved && (
        <div>
          Username: {user.name}

          <DeleteUserButton
            isLoading={deleteUserRecord.isPending}
            onClick={deleteUserRecord.load}
          />

          <UpdateUserForm onSubmit={data => updateUserRecord.load(userId, data)} />
        </div>
      )}
    </div>
  )
}
```

### External cache providers

If you would like the ability to persist response data upon unmounting the application (e.g. page refresh or closing window), a cache provider can also be utilised to cache response data.

Here is an example using [Store.js](https://github.com/marcuswestin/store.js/). You can either set the external cache provider on a global level or a `useLoads` level.

#### On a global level

```jsx
import * as Loads from 'react-loads';
import store from 'store';

const config = {
  cacheProvider: {
    get: key => store.get(key),
    set: (key, val) => store.set(key, val),
    reset: () => store.clearAll()
  }
}

export default function App() {
  return (
    <Loads.Provider config={config}>
      ...
    </Loads.Provider>
  )
}
```

#### On a `useLoads` level

```jsx
import * as Loads from 'react-loads';
import store from 'store';

const cacheProvider = {
  get: key => store.get(key),
  set: (key, val) => store.set(key, val),
  reset: () => store.clearAll()
}

export default function RandomDog() {
  const { ... } = Loads.useLoads('randomDog', fetchRandomDog, { cacheProvider });
}
```

### Preloading (experimental)

React Loads comes with the ability to eagerly preload your data. You can do so using the `preload` function.

```jsx
const randomDogLoader = Loads.preload('randomDog', fetchRandomDog);
```

The `preload` function shares the same arguments as the `useLoads` function, however, `preload` is not a React Hook and shouldn't be called in your render function. Instead, use it inside event handlers, route preparation, or call it on first render.

The `preload` function will essentially fetch & cache your data in the background. It does not return any value apart from a `useLoads` hook. When the `useLoads` hook is invoked, it will read the data from the cache that was previously loaded by `preload`, and won't re-fetch your data. If no cached data exists, it will go ahead and fetch it.

```jsx
const randomDogLoader = Loads.preload('randomDog', fetchRandomDog);

function RandomDog() {
  const { response } = randomDogLoader.useLoads({ suspense: true });
  return <img src={response.imgSrc} />;
}

function App() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <RandomDog />
    </React.Suspense>
  )
}
```

[See the CodeSandbox example](https://codesandbox.io/s/react-loads-preloading-example-vn1xn)

#### Render-as-you-fetch

The `preload` function is designed to implement the ["render-as-you-fetch" pattern](https://reactjs.org/docs/concurrent-mode-suspense.html#approach-3-render-as-you-fetch-using-suspense). Ideally, `preload` can be invoked when preparing your routes, or inside an event handler, where you can then use the `useLoads` function inside your component.

[Basic example](https://codesandbox.io/s/react-loads-preloading-example-render-as-you-fetch-vvulq)

[Event handler example](https://codesandbox.io/s/jakes-top-actors-concurrent-event-handler-bqus6)

[Routing example](https://codesandbox.io/s/jakes-top-actors-concurrent-routing-gy6wz)

## API

### `useLoads`

```jsx
const {
  response,
  error,
  load,
  isIdle,
  isPending,
  isPendingSlow,
  isReloading,
  isReloadingSlow,
  isResolved,
  isRejected,
  reset,
  state,
  isCached
} = useLoads(context, fn, config);
```

#### Parameters

`context`

> `string`

A unique identifier for the request.

`fn`

> `function`

A function that returns a promise to retrieve your data.

`config`

> `object` | optional

A set of [configuration options](#config-1)

#### Returns

##### `response`

> `any`

Response from the resolved promise (`fn`).

##### `error`

> `any`

Error from the rejected promise (`fn`).

##### `load`

> `function`

Trigger to invoke [`fn`](#fn).

##### `isIdle`

> `boolean`

Returns `true` if the state is idle (`fn` has not been invoked).

##### `isPending`

> `boolean`

Returns `true` if the state is pending (`fn` is in a pending state).

##### `isPendingSlow`

> `boolean`

Returns `true` if the state is pending for longer than `timeout` milliseconds.

##### `isReloading`

> `boolean`

Returns `true` if the state is reloading (`fn` is in a pending state & `fn` has already been invoked or cached).

##### `isReloadingSlow`

> `boolean`

Returns `true` if the state is reloading for longer than `timeout` milliseconds.

##### `isResolved`

> `boolean`

Returns `true` if the state is resolved (`fn` has been resolved).

##### `isRejected`

> `boolean`

Returns `true` if the state is rejected (`fn` has been rejected).

##### `reset`

> `function`

Function to reset the state & response back to an idle state.

##### `state`

> `string`

State of the promise (`fn`).

##### `isCached`

> `boolean`

Returns `true` if data exists in the cache.

### `useDeferredLoads`

```jsx
const {
  response,
  error,
  load,
  isIdle,
  isPending,
  isPendingSlow,
  isReloading,
  isReloadingSlow,
  isResolved,
  isRejected,
  reset,
  state,
  isCached,
  update
} = useDeferredLoads(context, fn, config);
// OR
} = useDeferredLoads(fn, config);
```

#### Parameters

`context`

> `string` | optional

A unique identifier for the request. This is optional for `useDeferredLoads`.

`fn`

> `function`

A function that returns a promise to retrieve your data.

`config`

> `object` | optional

A set of [configuration options](#config-1)

#### Returns

[Same as `useLoads`](#useloads)

### `useCache`

A hook which enables you to retrieve a record from the cache.

```jsx
// Including `context` only
const randomDogRecord = useCache('randomDog');

// Including `context` & `variables`
const dogRecord = useCache('dog', { variables: [0] });
```

#### Parameters

##### `context`

The unique identifier of the record to retrieve.

##### `variables`

An array of variables (parameters).

#### Returns

##### `response`

> `any`

Response of the cached record.

##### `error`

> `any`

Error of the cached record.

##### `state`

> `any`

State of the cached record.

### `useGetStates`

A hook which composes a set of records, and gives you a singular state.

Without using `useGetStates`, you may run into situations like this:

```jsx
const randomDogRecord = useLoads('randomDog', fetchRandomDog);
const dogFriendsRecord = useLoads('dogFriends', fetchDogFriends);

<div>
  {(randomDogRecord.isPending || dogFriendsRecord.isPending) && 'Loading...'}
  {randomDogRecord.isResolved && dogFriendsRecord.isResolved && 'Loaded!'}
</div>
```

But, if you compose your records inside `useGetStates`, you can clean up your state variables:

```jsx
const randomDogRecord = useLoads('randomDog', fetchRandomDog);
const dogFriendsLoader = useLoads('dogFriends', fetchDogFriends);

const { isPending, isResolved, isRejected } = useGetStates(randomDogRecord, dogFriendsRecord);
```

### `<Provider>`

Set global configuration with the `<Provider>` component.

```jsx
import * as Loads from 'react-loads';

const config = {
  cacheTime: 600000
}

export default function App() {
  return (
    <Loads.Provider config={config}>
      {/* ... */}
    </Loads.Provider>
  )
}
```

#### Props

##### `config`

> `Object`

An object of [configuration options](#config-1)

### `createResource`

```jsx
const resource = createResource(options);
```

#### Parameters

##### `options.context`

> `string`

The context of the resource. Used to generate a cache key.

##### `options.fn`

> `function`

A function that returns a promise to retrieve your data.

##### Any key can be an async function!

Any key you provide to the resource is an async function.

```jsx
const dogsResource = createResource({
  context: 'dogs',
  fn: getDogs,
  create: createDog,
  foo: getDogFoo,
  bar: getDogBar,
  baz: getDogBaz
});

// In your function component - will invoke the `bar` async function in createResource:
dogsResource.bar.useLoads();
```

#### Returns

##### `useLoads`

A `useLoads` hook which can be invoked in your function component.

The arguments are a bit different to the standalone `useLoads` hook - it only optionally accepts a `config` object, and not a `context` or an async function (`fn`).

```jsx
resource.useLoads(config)
```

##### `useDeferredLoads`

A `useLoads` hook which can be invoked in your function component.

The arguments are a bit different to the standalone `useDeferredLoads` hook - it only optionally accepts a `config` object, and not a `context` or an async function (`fn`).

```jsx
resource.useDeferredLoads(config)
```

##### `preload` (experimental)

Same as the [`preload` function](#preload-experimental), however only accepts a `config` object as it's only parameter.

```jsx
resource.preload(config)
```

[See the CodeSandbox example](https://codesandbox.io/s/react-loads-preloading-resources-example-render-as-you-fetch-p33fs)

### `preload` (experimental)

```jsx
const loader = preload(context, fn, config);
```

#### Parameters

`context`

> `string` | optional

A unique identifier for the request. This is optional for `useDeferredLoads`.

`fn`

> `function`

A function that returns a promise to retrieve your data.

`config`

> `object` | optional

A set of [configuration options](#config-1)

#### Returns

`useLoads`

A `useLoads` hook which can be invoked in your function component.

The arguments are a bit different to the standalone `useLoads` hook - it only optionally accepts a `config` object, and not a `context` or an async function (`fn`).

```jsx
loader.useLoads(config)
```

### Config

```jsx
config = {
  cacheProvider,
  cacheStrategy,
  cacheTime,
  context,
  dedupingInterval,
  delay,
  defer,
  initialResponse,
  loadPolicy,
  onReject,
  onResolve,
  pollingInterval,
  pollWhenHidden,
  rejectRetryInterval,
  revalidateTime,
  revalidateOnWindowFocus,
  suspense,
  throwError,
  timeout,
  update,
  variables
}
```

#### `cacheProvider`

> `{ get: function(key), set: function(key, val), reset: function() }`

Set a custom cache provider (e.g. local storage, session storate, etc). See [external cache providers](#external-cache-providers) for an example.

#### `cacheStrategy`

> `string` | Default: `"context-and-variables"`

The caching strategy for your loader to determine the cache key.

Available values:

- `"context-only"`
  - Caches your data against the `context` key only.
- `"context-and-variables"`
  - Caches your data against a combination of the `context` key & `variables`.

#### `cacheTime`

> `number` | Default: `0`

Time (in milliseconds) that the data remains in the cache. After this time, the cached data will be removed.

#### `dedupingInterval`

> `number` | Default: `500`

Interval (in milliseconds) that requests will be deduped in this time span.

#### `delay`

> `number` | Default: `0`

Time (in milliseconds) before the component transitions to the `"pending"` state upon invoking `fn`.

#### `defer`

> `boolean`

If set to `true`, the async function (`fn`) won't be called automatically and will be deferred until later.

If `defer` is set to true, the initial state will be `idle`.

#### `initialResponse`

> `any`

Set initial data for the request. Useful for SSR.

#### `loadPolicy`

> `string` | Default: `"cache-and-load"`

A load policy allows you to specify whether or not you want your data to be resolved from the Loads cache and how it should load the data.

- `"cache-only"`: `useLoads` will only return data from the cache. It will not invoke the async function.

- `"cache-first"`: If a value for the loader already exists in the Loads cache, then `useLoads` will return the value that is in the cache, otherwise it will invoke the async function.

- `"cache-and-load"`: This is the default value and means that `useLoads` will return with the cached value if found, but regardless of whether or not a value exists in the cache, it will always invoke the async function.

- `"load-only"`: This means that `useLoads` will not return the cached data altogether, and will only return the data resolved from the async function.

#### `onReject`

> `function(error)`

A hook that is invoked when the async function (`fn`) rejects.

#### `onResolve`

> `function(response)`

A hook that is invoked when the async function (`fn`) resolves.

#### `pollingInterval`

> `number`

If set, then `useLoads` will invoke the async function (`fn`) every `x` amount of seconds.

#### `pollWhile`

> `boolean | function(record)`

If set, then `useLoads` will poll while the condition is truthy.

#### `pollWhenHidden`

> `boolean` | Default: `false`

If truthy, then `useLoads` will continue to poll when the window is not focused.

#### `rejectRetryInterval`

> `number | function(count)`

If set, and `useLoads` rejects, then `useLoads` will continue to try and resolve `fn` every `x` seconds. If a function is given, you can determine the interval time with that.

Example:

```js
// Retry every 1000 milliseconds.
rejectRetryInterval: 1000

// Retry every "error count" * "2000 milliseconds".
rejectRetryInterval: count => count * 2000
```

#### `revalidateTime`

> `number` | Default: `300000` (5 minutes)

Time that the data in the cache remains "fresh". After this time, data in the cache will be marked as "stale", meaning that the data will have to be reloaded on next invocation.

#### `revalidateOnWindowFocus`

> `boolean` | Default: `false`

If truthy, `useLoads` will load the async function (`fn`), when the browser window is focused again.

#### `suspense`

> `boolean` | Default: `false`

If truthy, this will enable React Suspense mode.

#### `throwError`

> `boolean` | Default: `false`

If truthy and the async function (`fn`) rejects, then `useLoads` or `load` will throw the error.

#### `timeout`

> `number` | Default: `5000` (5 seconds)

Number of milliseconds before the component transitions to the `isPendingSlow` or `isReloadingSlow` state. Set to `0` to disable.

Note: `useLoads` will still continue to try and resolve while in the `isPendingSlow` state

#### `variables`

> `Array<any>`

An array of variables (parameters) to pass to your async function (`fn`).

## Happy customers

- "I'm super excited about this package" - [Michele Bertoli](https://twitter.com/MicheleBertoli)
- "Love the API! And that nested ternary-boolean example is a perfect example of how messy React code commonly gets without structuring a state machine." - [David K. Piano](https://twitter.com/DavidKPiano)
- "Using case statements with React components is comparable to getting punched directly in your eyeball by a giraffe. This is a huge step up." - [Will Hackett](https://twitter.com/willhackett)
- "I used to get the shakes coding data fetch routines with React. Not anymore. Using react loads, I now achieve data fetching zen." - [Claudia Nadalin](https://github.com/thepenskefile)
- "After seeing https://twitter.com/dan_abramov/status/1039584557702553601?lang=en, we knew we had to change our loading lifecycles; React Loads was our saviour." - [Zhe Wang](https://twitter.com/auzwang)

## Acknowledgments

- [David K. Piano](https://twitter.com/DavidKPiano) for state machine inspiration
- [React Query](https://github.com/tannerlinsley/react-query) & [Zeit's SWR](https://github.com/zeit/swr) for design inspiration & ideas

## License

MIT © [jxom](http://jxom.io)
