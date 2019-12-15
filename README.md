# React Loads

#### **React Loads is a backend agnostic library to help with external data fetching in your UI components.**

## Features

- **Hooks** and **Render Props** to manage your async states & response data
- **Backend agnostic.** Use React Loads with REST, GraphQL, or Web SDKs
- **Renderer agnostic.** Use React Loads with React DOM, React Native, React VR, etc
- **Automated caching & revalidation** to maximise user experience between page transitions
- **React Suspense** support
- **SSR** support
- **Preload** support to [implement the "render-as-you-fetch" pattern](#TODO)
- **Polling** support to load data every x seconds
- **Request deduping** to minimise over-fetching of your data
- **Focus revalidation** to re-fetch your data when the browser window is focused
- **Resources** to allow your to hoist common async functions for built-in caching & reusability
- **Finite set of state variables** to avoid cryptic ternaries and impossible states
- **External cache** support
- **Optimistic responses**

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
import { useLoads } from 'react-loads';

async function fetchRandomDog() {
  // Dog fetcher logic here!
  // You can use any type of backend here - REST, GraphQL, you name it!
}

export default function RandomDog() {
  const { response, error, isPending, isResolved, isRejected } = useLoads('randomDog', fetchRandomDog);
  return (
    <div>
      {isPending && 'Loading...'}
      {isResolved && <img src={response.imgSrc} />}
      {isRejected && `Oh no! ${error.message}`}
    </div>
  )
}
```

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
      <Loads context="randomDog" load={fetchRandomDog}>
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

### More examples

- [Basic](#TODO)
- [Top movies](#TODO)
- [Resources](#TODO)
- [Typescript](#TODO)
- [Render-as-you-fetch]()
  - [Basic](#TODO)
  - [Resources](#TODO)
- [Stories](#TODO)

## Guides

### Starting out

There are two main hooks: `useLoads` & `useDeferredLoads`.

- `useLoads` is called on first render,
- `useDeferredLoads` is called when you choose to invoke it (it's deferred until later).

Let's focus on the `useLoads` hook for now, we will explain `useDeferredLoads` in the next section.

The `useLoads` hook accepts 3 parameters:

- A [**"context key"**](#TODO) in the form of a **string**.
  - It will help us with identifying/storing data, deduping your requests & updating other `useLoad`'s sharing the same context
  - Think of it as the namespace for your data
- An [**"async function"**](#TODO) in the form of a **function that returns a promise**
  - This will be the function to resolve the data
- An optional [**"config"**](#TODO) in the form of an **object**

```jsx
import React from 'react';
import { useLoads } from 'react-loads';

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
  } = useLoads('randomDog', fetchRandomDog);
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

The `useLoads` hook represents a finite state machine and returns a set of state variables:

- `isIdle` if the async function hasn't been invoked yet (relevant for `useDeferredLoads`)
- `isPending` for when the async function is loading
- `isReloading` for when the async function is reloading (typically when `load` is manually invoked, or data exists in the cache)
- `isResolved` for when the async function has resolved
- `isRejected` for when the async function has errored

It also returns a `response` variable if your function resolves, and an `error` variable if rejected.

If you want to reload your data, `useLoads` also returns a `load` variable, which you can invoke.

The `useLoads` hook returns [some other variables](#TODO) as well.

### Deferring

Sometimes you don't want your async function to be invoked straight away. This is where the `useDeferredLoads` hook can be handy. It waits until you manually invoke it.

```jsx
import React from 'react';
import { useLoads } from 'react-loads';

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
  } = useDeferredLoads('randomDog', fetchRandomDog);
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

In the above example, the dog image is fetched via the `load` variable returned from `useDeferredLoads`.

There are also some cases where including a **context key** may not make sense. You can omit it if you want like so:

```js
const { ... } = useDeferredLoads(fetchRandomDog);
```

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

### Dependant loaders

There may be a case where one `useLoads` depends on the data of another `useLoads`, where you don't want subsequent `useLoads` to invoke the async function until the first `useLoads` resolves.

If you pass a function to `variables`, if the function throws (due to `dog` being undefined), then the async function will be deferred while it is undefined. As soon as `dog` is defined, then the async function will be invoked.

```jsx
export default function RandomDog(props) {
  const { response: dog } = useLoads('dog', fetchDog);
  const { response: friends } = useLoads('dogFriends', fetchDogFriends, {
    variables: () => [dog.id]
  })
}
```

### Caching & revalidation

### SSR & Initial data

### Slow connections

### Polling

### Retries

### Suspense

### Resources

### Optimistic responses

### Preloading

### Update functions

### External cache providers

### Configuration

## API

## Happy customers

## Acknowledgments

## License

MIT
