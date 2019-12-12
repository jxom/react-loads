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
- **Resources** to allow your to hoist common loading functions for built-in caching & reusability
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

The `useLoads` function accepts three arguments: a **context key**, a **loading function**, and a **config object** (not used in this example). The **context key** will store the response of the `fetchRandomDog` function in the React Loads cache against the key. The **loading function** is a function that returns a promise, and is used to fetch your data.

The `useLoads` function also returns a set of values: `response`, `error`, and a finite set of states (`isPending`, `isResolved`, `isRejected`, and a few others). If your **loading function** resolves, it will update the `response` & `isResolved` values. If it rejects, it will update the `error` value.

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

### Deferring

### Context

### States & response/error data

### Variables

### Dependant loaders

### Caching & revalidation

### SSR & Initial data

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
