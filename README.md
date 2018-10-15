# React Loads

> A headless React component to handle async data fetching.

## The problem

There are a few concerns in managing async data fetching manually:

- Managing loading state can be annoying and prone to a confusing user experience if you aren't careful.
- Managing data persistence across page transitions can be easily overlooked.
- Flashes of loading state & no feedback on something that takes a while to load can be annoying.
- Nested ternaries can get messy and hard to read. Example:

```jsx
<Fragment>
  {isLoading ? (
    <p>{hasTimedOut ? 'Taking a while...' : 'Loading...'}</p>
  ) : (
    <Fragment>
      {!error && !response &&
        <button onClick={this.handleLoad}>Click here to load!</button>
      }
      {response && <p>{response}</p>}
      {error && <p>{error.message}</p>}
    </Fragment>
  )}
</Fragment>
```

## The solution

React Loads comes with a handy set of features to help solve these concerns:

- Manage your async data & states with a declarative syntax that includes [render props](#children-render-props)
- Predictable outcomes with deterministic [state variables](#isidle) or [state components](#usage-with-state-components) to avoid messy state ternaries
- Invoke your loading function [on mount](#loadonmount)
- Pass any type of promise to your [loading function (`load`)](#load)
- Add a [delay](#delay) to prevent flashes of loading state
- Add a [timeout](#timeout) to provide feedback when your loading function is taking a while to resolve
- [Data caching](#basic-application-context-cache) (via Context) enabled by default to maximise user experience between page transitions
- Tell Loads [how to load](#loadpolicy) your data from the cache to prevent unnessessary invocations
- [Optimistic responses](#enableoptimisticresponse) to update your UI optimistically
- External [cache provider](#cacheprovider) support to enable something like local storage caching

## Table of Contents

- [React Loads](#react-loads)
  - [The problem](#the-problem)
  - [The solution](#the-solution)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Usage with state components](#usage-with-state-components)
    - [Usage with instances](#usage-with-instances)
    - [More examples](#more-examples)
  - [`<Loads>` Props](#loads-props)
    - [load](#load)
    - [delay](#delay)
    - [loadOnMount](#loadonmount)
    - [update](#update)
    - [contextKey](#contextkey)
    - [timeout](#timeout)
    - [loadPolicy](#loadpolicy)
    - [enableOptimisticResponse](#enableoptimisticresponse)
    - [enableBackgroundStates](#enablebackgroundstates)
    - [cacheProvider](#cacheprovider)
    - [`children` Render Props](#children-render-props)
      - [response](#response)
      - [error](#error)
      - [load](#load)
      - [update](#update)
      - [isIdle](#isidle)
      - [isLoading](#isloading)
      - [isTimeout](#istimeout)
      - [isSuccess](#issuccess)
      - [isError](#iserror)
      - [hasResponseInCache](#hasresponseincache)
  - [`<LoadsProvider>` Props](#loadsprovider-props)
    - [cacheProvider](#cacheprovider)
  - [Caching response data](#caching-response-data)
    - [Basic application context cache](#basic-application-context-cache)
    - [Using a cache provider](#using-a-cache-provider)
      - [Application-level cache provider](#application-level-cache-provider)
      - [`<Loads>`-level cache provider](#loads-level-cache-provider)
  - [Updating resources](#updating-resources)
  - [Optimistic responses](#optimistic-responses)
    - [setResponse({ contextKey, data }[, callback])](#setresponse-contextkey-data--callback)
      - [contextKey](#contextkey)
      - [data](#data)
      - [callback](#callback)
    - [setError({ contextKey, error })](#seterror-contextkey-error-)
      - [contextKey](#contextkey)
      - [error](#error)
    - [Basic example](#basic-example)
    - [Less basic example](#less-basic-example)
  - [Articles](#articles)
  - [Happy customers](#happy-customers)
  - [Special thanks](#special-thanks)
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

```jsx
import React, { Fragment } from 'react';
import Loads from 'react-loads';

const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');

export default () => (
  <Loads load={getRandomDog}>
    {({ isIdle, isLoading, isSuccess, isError, load, response, error }) => (
      <Fragment>
        {isIdle && <button onClick={load}>Load random dog</button>}
        {isLoading && <div>Loading...</div>}
        {isSuccess && <img src={response.data.message} alt="Dog" />}
        {isError && <div>An error occurred! {error.message}</div>}
        {(isSuccess || isError) && <button onClick={load}>Load another dog</button>}
      </Fragment>
    )}
  </Loads>
);
```

> Note: You don't always have to provide a 'getter' function to `load`. You can provide any type of promise!

### Usage with state components

You can also use state components to conditionally render children:

> Note: State components also accepts render props and has [identical render props](#children-render-props) as `<Loads>`

```jsx
import React, { Fragment } from 'react';
import Loads from 'react-loads';

const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');

export default () => (
  <Loads load={getRandomDog}>
    <Loads.Idle>{({ load }) => <button onClick={load}>Load random dog</button>}</Loads.Idle>
    <Loads.Loading>loading...</Loads.Loading>
    <Loads.Success>
      {({ response, load }) => <img src={response.data.message} alt="Dog" />}
    </Loads.Success>
    <Loads.Error>
      {({ error }) => <div>An error occurred! {error.message}</div>}
    </Loads.Error>
    <Loads.Success or={Loads.Error}>
      {({ load }) => <button onClick={load}>Load another dog</button>}
    </Loads.Success>
  </Loads>
);
```

### Usage with instances

You can also declare an instance of Loads and render accordingly - this can make nested Loads more readable:

> Note: The argument of `createLoader` has an [identical API](#loads-props) to `<Loads>`


```jsx
import React, { Fragment } from 'react';
import Loads, { createLoader } from 'react-loads';

export default () => {
  const GetRandomDog = createLoader({
    load: () => axios.get('https://dog.ceo/api/breeds/image/random')
  });
  return (
    <GetRandomDog>
      <GetRandomDog.Idle>{({ load }) => <button onClick={load}>Load random dog</button>}</GetRandomDog.Idle>
      <GetRandomDog.Loading>loading...</GetRandomDog.Loading>
      <GetRandomDog.Success>
        {({ response, load }) => <img src={response.data.message} alt="Dog" />}
      </GetRandomDog.Success>
      <GetRandomDog.Error>
        {({ error }) => <div>An error occurred! {error.message}</div>}
      </GetRandomDog.Error>
      <GetRandomDog.Success or={GetRandomDog.Error}>
        {({ load }) => <button onClick={load}>Load another dog</button>}
      </GetRandomDog.Success>
    </GetRandomDog>
  );
}
```

### More examples

- [Code](./src/__stories__/index.stories.js)
- [Storybook](https://jxom.github.io/react-loads/)

## `<Loads>` Props

### load

> `function(...args, { setResponse, setError })` | returns `Promise` | required

The function to invoke. **It must return a promise.**

The arguments `setResponse` and `setError` are optional and can be used if [`enableOptimisticResponse`](#enableoptimisticresponse) prop is set to true. These arguments are used for [optimistic responses](#optimistic-responses).

### delay

> `number` | default: `300`

Number of milliseconds before the component transitions to the `'loading'` state upon invoking `load`.

### loadOnMount

> `boolean` | default: `false`

Whether or not to invoke `load` on mount.

### update

> `function(...args, { setResponse, setError })` | returns `Promise | Array<Promise>` | required

A function to update the response from `load`. **It must return a promise.**

**IMPORTANT NOTE ON `update`**: It is recommended that your update function resolves with the same response schema as your loading function (`load`) to avoid erroneous & confusing behaviour in your UI.

Read more on the `update` function [here](#updating-resources)

### contextKey

> `string`

Unique identifier for the promise (`load`). If `contextKey` changes, then `load` will be invoked again.

*Note: If your application is wrapped in a `<LoadsProvider>`, then `contextKey` is required.*

### timeout

> `number` | default: `0`

Number of milliseconds before the component transitions to the `'timeout'` state. Set to `0` to disable.

*Note: `load` will still continue to try an resolve while in the `'timeout'` state*


### loadPolicy

> `"cache-first" | "cache-and-load" | "load-only"` | default: `"cache-and-load"`

A load policy allows you to specify whether or not you want your data to be resolved from the Loads cache and how it should load the data.

- `"cache-first"`: If a value for the promise already exists in the Loads cache, then Loads will return the value that is in the cache, otherwise it will invoke the promise.

- `"cache-and-load"`: This is the default value and means that Loads will return with the cached value if found, but regardless of whether or not a value exists in the cache, it will always invoke the promise.

- `"load-only"`: This means that Loads will not return the cached data altogether, and will only return the data resolved from the promise.

### enableOptimisticResponse

> `boolean` | default: `false`

Adds the `setResponse` and `setError` attributes to the loading function ([`load`](#load)) to enable [optimistic responses](#optimistic-responses).

### enableBackgroundStates

> `boolean` | default: `false`

If true and the data is in cache, `isIdle`, `isLoading` and `isTimeout` will be evaluated on subsequent loads. When `false` (default), these states are only evaluated on initial load and are falsy on subsequent loads - this is helpful if you want to show the cached response and not have a idle/loading/timeout indicator when `load` is invoked again. You must have a `contextKey` set and your application to be wrapped in a `<LoadsProvider>` to enable background states as it only effects data in the cache.

### cacheProvider

> `Object({ get: function(key), set: function(key, val) })`

Set a custom cache provider (e.g. local storage, session storate, etc). See [`<Loads>`-level cache provider](#loads-level-cache-provider) below for an example.

### `children` Render Props

> Note:  `<Loads.Idle>`, `<Loads.Loading>`, `<Loads.Timeout>`, `<Loads.Success>` and `<Loads.Error>` share the same render props as `<Loads>`.

#### response

> `any`

Response from the resolved promise (`load`).

#### error

> `any`

Error from the rejected promise (`load`).

#### load

> `function(...args, { setResponse, setError })`

Trigger to invoke [`load`](#load).

The arguments `setResponse` and `setError` are optional, and can be used for [optimistic responses](#optimistic-responses).

#### update

> `function(...args, { setResponse, setError })`

Trigger to invoke [`update`](#update).

#### isIdle

> `boolean`

Returns `true` if the state is idle (`load` has not been triggered).

#### isLoading

> `boolean`

Returns `true` if the state is loading (`load` is in a pending state).

#### isTimeout

> `boolean`

Returns `true` if the state is timeout (`load` is in a pending state for longer than `delay` milliseconds).

#### isSuccess

> `boolean`

Returns `true` if the state is success (`load` has been resolved).

#### isError

> `boolean`

Returns `true` if the state is error (`load` has been rejected).

#### hasResponseInCache

> `boolean`

Returns `true` if data already exists in the cache.

## `<LoadsProvider>` Props

### cacheProvider

> `Object({ get: function(key), set: function(key, val) })`

Set a custom cache provider (e.g. local storage, session storate, etc). See [Application-level cache provider](#application-level-cache-provider) below for an example.

## Caching response data

### Basic application context cache

React Loads has the ability to cache the response and error data on an application context level (meaning the cache will clear upon unmounting the application). Your application must be wrapped in a `<LoadsProvider>` to enable caching. Here is an example to enable it:

```jsx
import React, { Fragment } from 'react';
import Loads, { LoadsProvider } from 'react-loads';

const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');

const RandomDog = () => (
  <Loads contextKey="randomDog" loadOnMount load={getRandomDog}>
    {({ isLoading, isSuccess, load, response }) => (
      <Fragment>
        {isLoading && <div>Loading...</div>}
        {isSuccess && (
          <Fragment>
            <img src={response.data.message} alt="Dog" />
            <div>
              <button onClick={load}>Load another dog</button>
            </div>
          </Fragment>
        )}
      </Fragment>
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
    contextKey="randomDog"
    loadOnMount
    load={getRandomDog}
  >
    {({ isLoading, isSuccess, load, response }) => (
      <Fragment>
        {isLoading && <div>Loading...</div>}
        {isSuccess && (
          <Fragment>
            <img src={response.data.message} alt="Dog" />
            <div>
              <button onClick={load}>Load another dog</button>
            </div>
          </Fragment>
        )}
      </Fragment>
    )}
  </Loads>
);

const cacheProvider = {
  // Note: `key` maps to the `contextKey` which is provided to <Loads>.
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
  // Note: `key` maps to the `contextKey` which is provided to <Loads>.
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
    contextKey="randomDog"
    cacheProvider={cacheProvider}
    loadOnMount
    load={getRandomDog}
  >
    {({ isLoading, isSuccess, load, response }) => (
      <Fragment>
        {isLoading && <div>Loading...</div>}
        {isSuccess && (
          <Fragment>
            <img src={response.data.message} alt="Dog" />
            <div>
              <button onClick={load}>Load another dog</button>
            </div>
          </Fragment>
        )}
      </Fragment>
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

## Updating resources

Instead of nesting `<Loads>` to provide a way to update/amend a resource, you are able to specify an `update` function which mimics the `load` function. In order to use the `update` function, you must have a `load` function which shares the same response schema as your update function.

Here's an example of where you could use an `update` function:

```jsx
<Loads load={getRandomDog} update={updateRandomDog}>
  {({ load, update, response, error, isIdle, isLoading, isSuccess, isError }) => (
    <Fragment>
      {isIdle && <button onClick={load}>Load random dog</button>}
      {isLoading && <div>Loading...</div>}
      {isSuccess && (
        <div>
          <img src={response.data.message} alt="Dog" />
        </div>
      )}
      {isError && <div>An error occurred! {error.message}</div>}
      {(isSuccess || isError) && (
        <div>
          <button onClick={load}>Load another dog</button>
          <button onClick={update}>Update</button>
        </div>
      )}
    </Fragment>
  )}
</Loads>
```

## Optimistic responses

React Loads has the ability to optimistically update your data while it is still waiting for a response (if you know what the response will potentially look like). Once a response is received, then the optimistically updated data will be replaced by the response. [This article](https://uxplanet.org/optimistic-1000-34d9eefe4c05) explains the gist of optimistic UIs pretty well.

**To use optimistic responses, your application must be wrapped in a `<LoadsProvider>` and the `enableOptimisticResponse` prop on your `<Loads>` set to true.** The `setResponse` and `setError` functions are provided as the last argument of your loading function (`load`). The interface for these functions, along with an example implementation are seen below.

### setResponse({ contextKey, data }[, callback])

Optimistically sets a successful response.

#### contextKey

> `string` | optional

The context where the data will be updated. If not provided, then it will use the `contextKey` prop specified in `<Loads>`.

#### data

> `Object` or `function(cachedData) {}`

The updated data. If a function is provided, then the first argument will be the currently cached data in the context cache.

#### callback

> `function(cachedData) {}`

A callback can be also provided as a second parameter to `setResponse`, where the first and only parameter is the updated cached response (`data`).


### setError({ contextKey, error })

Optimistically (ironically) sets an errored response.

#### contextKey

> `string` | optional

The context where the error will be updated. If not provided, then it will use the `contextKey` prop specified in `<Loads>`.

#### error

> `Object`

The updated error.

### Basic example

```jsx
import React, { Component, Fragment } from 'react';
import Loads from 'react-loads';

class Dog extends Component {
  createDog = async (dog, { setResponse }) => {
    setResponse({ contextKey: 'dog', data: dog });
    // ... - create the dog
  }

  getDog = async () => {
    // ... - fetch and return the dog
  }

  render = () => {
    return (
      <Fragment>
        {/* Ensure you enable optimistic responses by setting the `enableOptimisticResponse` prop to true. */}
        <Loads enableOptimisticResponse load={this.createDog}>
          {({ load }) => (
            <button onClick={() => load({ name: 'Teddy', breed: 'Groodle' })}>Create</button>
          )}
        </Loads>

        <Loads contextKey="dog" loadOnMount load={this.getDog}>
          {({ response: dog }) => (
            <div>{dog.name}</div>
          )}
        </Loads>
      </Fragment>
    );
  }
}
```

### Less basic example

```jsx
import React, { Component, Fragment } from 'react';
import Loads from 'react-loads';

class Dog extends Component {
  updateDog = (id, dog, { setResponse }) => {
    setResponse({
      contextKey: `dog.${id}`,
      data: currentDog => ({ ...currentDog, dog }) }, updatedDog => {
        setResponse({
          contextKey: 'dogs',
          data: dogs => ([...dogs, updatedDog])
        })
      });
    // ... - update the dog
  }

  getDog = async () => {
    // ... - fetch and return the dog
  }

  getDogs = async () => {
    // ... - fetch and return the dogs
  }

  render = () => {
    return (
      <Fragment>
        {/* Ensure you enable optimistic responses by setting the `enableOptimisticResponse` prop to true. */}
        <Loads enableOptimisticResponse load={this.updateDog}>
          {({ load }) => (
            <button onClick={() => load(1, { name: 'Brian' })}>Update</button>
          )}
        </Loads>

        <Loads contextKey={`dog.${id}`} loadOnMount load={this.getDog}>
          {({ response: dog }) => (
            <div>{dog.name}</div>
          )}
        </Loads>

        <Loads contextKey="dogs" loadOnMount load={this.getDogs}>
          {({ response: dogs }) => (
            <Fragment>
              {dogs.map(dog => <div key={dog.id}>{dog.name}</div>)}
            </Fragment>
          )}
        </Loads>
      </Fragment>
    );
  }
}
```



## Articles

- [Introducing React Loads — A headless React component to handle promise states and response data](https://medium.freecodecamp.org/introducing-react-loads-a-headless-react-component-to-handle-promise-states-and-response-data-f45cb3621335)
- [Using React Loads and caching for a simple, snappy loading UX](https://medium.com/localz-engineering/using-react-loads-and-caching-for-a-simple-snappy-loading-ux-a91506cce5d1)

## Happy customers

- "I'm super excited about this package" - [Michele Bertoli](https://twitter.com/MicheleBertoli)
- "Love the API! And that nested ternary-boolean example is a perfect example of how messy React code commonly gets without structuring a state machine." - [David K. Piano](https://twitter.com/DavidKPiano)
- "Using case statements with React components is comparable to getting punched directly in your eyeball by a giraffe. This is a huge step up." - [Will Hackett](https://twitter.com/willhackett)


## Special thanks

- [Michele Bertoli](https://github.com/MicheleBertoli) for creating [React Automata](https://github.com/MicheleBertoli/react-automata) - it's awesome and you should check it out.

## License

MIT © [jxom](http://jxom.io)
