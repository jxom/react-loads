# react-loads

> A simple, declarative and lightweight (1.11kB) React component to handle loading state.

## Motivation

There are a few motivations behind creating React Loads:

1. Managing loading state can be annoying and is prone to errors if you aren't careful.
2. Hate seeing a flash of loading state? A spinner that displays for half a second? Yeah, it's annoying.
3. Nested ternary's can get messy and hard to read. React Loads makes it a bit simpler and nicer. Example:

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

## Install

```
$ npm install react-loads
```

## Example

```js
import React from 'react';
import Loads, { Action } from 'react-loads';

const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');

export default () => (
  <Loads fn={getRandomDog}>
    {({ load, response, error }) => (
      <div>
        <Action show="idle">
          <button onClick={load}>Load random dog</button>
        </Action>
        <Action show="loading">loading...</Action>
        <Action show="timeout">taking a while...</Action>
        <Action show="success">
          {response && <img src={response.data.message} alt="Dog" />}
          <div>
            <button onClick={load}>Load another dog</button>
          </div>
        </Action>
        <Action show="error">Error! {error}</Action>
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
  <tr><td>  delay </td><td><code>number</code></td><td><code>300</code></td> <td>Number of milliseconds before component transitions to `loading` state upon invoking `fn`/`load`.</td></tr>
  <tr><td>  loadOnMount </td><td><code>boolean</code></td><td><code>false</code></td> <td>Whether or not to invoke the `fn` on mount.</td></tr>
  <tr><td>  fn </td><td><code>(...args: any) => Promise&lt;any&gt;</code></td><td>N/A (required)</td> <td>The function to load.</td></tr>
  <tr><td>  timeout </td><td><code>number</code></td><td><code>0</code></td> <td>Number of milliseconds before component transitions to `timeout` state. Set to `0` to disable.</td></tr>
</tbody>
</table>

### `<Action>`

A component to define which parts of the tree should be rendered for a given action (or set of actions).

#### Props

This component is just an export of `<Action>` from [React Automata](https://github.com/MicheleBertoli/react-automata#action-).

<table>
<thead><tr><th>Prop</th><th>Type</th><th>Default value</th><th>Description</th></tr></thead>
<tbody>
  <tr><td>show</td><td><code>oneOfType(string, arrayOf(string))</code></td><td><code>N/A (required)</code></td> <td>The action(s) for which the children should be shown. Available actions: `idle`, `loading`, `timeout`, `success`, `error`</td></tr>
</tbody>
</table>

## Special thanks

- [Michele Bertoli](https://github.com/MicheleBertoli) for creating [React Automata](https://github.com/MicheleBertoli/react-automata) - it's awesome and you should check it out.

## License

MIT © [jxom](http://jxom.io)
