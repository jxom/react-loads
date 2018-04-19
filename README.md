# react-loads

> A simple, declarative and lightweight (1.11kB) React component to handle loading state.

## Motivation

There are a few motivations behind creating React Loads:

1. Managing loading state can be annoying and is prone to errors if you aren't careful.
2. Hate seeing a flash of loading state? A spinner that displays for half a second? Yeah, it's annoying.
3. Nested ternary's can get messy and hard to read. Example:

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

React Loads makes this a bit simpler and nicer.

## Install

```
$ npm install react-loads
```

## Example

```js
import React from 'react';
import Loads, { IfIdle, IfLoading, IfTimeout, IfSuccess, IfError } from 'react-loads';

const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');

export default () => (
  <Loads fn={getRandomDog}>
    {({ load, response, error }) => (
      <div>
        <IfIdle>
          <button onClick={load}>Load random dog</button>
        </IfIdle>
        <IfLoading>loading...</IfLoading>
        <IfTimeout>taking a while...</IfTimeout>
        <IfSuccess>
          {response && <img src={response.data.message} alt="Dog" />}
          <div>
            <button onClick={load}>Load another dog</button>
          </div>
        </IfSuccess>
        <IfError>Error! {error}</IfError>
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
  <tr><td>  children </td><td><code>({ response?: any, error?: any, load: Function, state: 'idle' | 'loading' | 'timeout' | 'success' | 'error' })</code></td><td>N/A (required)</td> <td></td></tr>
  <tr><td>  delay </td><td><code>number</code></td><td><code>300</code></td> <td>Number of milliseconds before component transitions to <code>loading</code> state upon invoking <code>fn</code>/<code>load</code>.</td></tr>
  <tr><td>  loadOnMount </td><td><code>boolean</code></td><td><code>false</code></td> <td>Whether or not to invoke the <code>fn</code> on mount.</td></tr>
  <tr><td>  fn </td><td><code>(...args: any) => Promise&lt;any&gt;</code></td><td>N/A (required)</td> <td>The promise to invoke.</td></tr>
  <tr><td>  timeout </td><td><code>number</code></td><td><code>0</code></td> <td>Number of milliseconds before component transitions to <code>timeout</code> state. Set to <code>0</code> to disable.</td></tr>
</tbody>
</table>

### `<IfIdle>`, `<IfLoading>`, `<IfTimeout>`, `<IfSuccess>`, `<IfError>`

These components determine what node to render based on the loading/response state.

#### Definitions

- `IfIdle` - Will render when the state is 'idle' (the initial state).
- `IfLoading` - Will render when the state is 'loading' (triggered when the promise (`fn`) is pending).
- `IfTimeout` - Will render when the state is 'timeout' (triggered when the promise (`fn`) has not resolved/rejected after a period of time).
- `IfSuccess` - Will render when the state is 'success' (triggered when the promise (`fn`) resolves).
- `IfError` - Will render when the state is 'error' (triggered when the promise (`fn`) rejects).

#### Props

<table>
<thead><tr><th>Prop</th><th>Type</th><th>Default value</th><th>Description</th></tr></thead>
<tbody>
  <tr><td>channel</td><td>string</td><td><code>null</code></td> <td>The key of the context from where to read the state.</td></tr>
  <tr><td>children</td><td>oneOfType(node, func)</td><td>N/A (required)</td> <td>The children to be rendered when the
  conditions match. Can also pass children as a function (render props).</td></tr>
  <tr><td>onShow</td><td>func</td><td></td> <td>The function invoked when the component becomes visible.</td></tr>
  <tr><td>onHide</td><td>func</td><td></td> <td>The function invoked when the component becomes hidden.</td></tr>
</tbody>
</table>

```jsx
<IfSuccess>
  Yaaassss!
</IfSuccess>
```

```jsx
<IfError>
  {visible => visible && <div>An error occured.</div>}
</IfError>
```

### `<IfState>`

A component to define which parts of the tree should be rendered for a set of states.

#### Props

<table>
<thead><tr><th>Prop</th><th>Type</th><th>Default value</th><th>Description</th></tr></thead>
<tbody>
  <tr><td>is</td><td>arrayOf(string)</td><td>N/A (required)</td> <td>The states(s) for which the children should be shown. Available states: <code>'idle'</code>, <code>'loading'</code>, <code>'timeout'</code>, <code>'success'</code>, <code>'error'</code></td></tr>
  <tr><td>channel</td><td>string</td><td><code>null</code></td> <td>The key of the context from where to read the state.</td></tr>
  <tr><td>children</td><td>oneOfType(node, func)</td><td>N/A (required)</td> <td>The children to be rendered when the
  conditions match. Can also pass children as a function (render props).</td></tr>
  <tr><td>onShow</td><td>func</td><td></td> <td>The function invoked when the component becomes visible.</td></tr>
  <tr><td>onHide</td><td>func</td><td></td> <td>The function invoked when the component becomes hidden.</td></tr>
</tbody>
</table>

```jsx
<IfState is={['idle', 'success']}>
  Hello world!
</IfState>
```

```jsx
<IfState is={['idle', 'success']}>
  {visible => visible && <div>Hello world!</div>}
</IfState>
```

## Special thanks

- [Michele Bertoli](https://github.com/MicheleBertoli) for creating [React Automata](https://github.com/MicheleBertoli/react-automata) - it's awesome and you should check it out.

## License

MIT © [jxom](http://jxom.io)
