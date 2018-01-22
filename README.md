# react-loads

> A simple React component to handle loading state and kills 'FOUL' (see below).

## Motivation

> FOUL

> (abbreviation: flash of unnecessary loading state) When a user interface responds to an action by immediately displaying a > spinner or placeholder, but the actual result only takes a few hundred milliseconds to load.

> E.g. every web app circa 2018. - Andrew Clark, 2018 (https://twitter.com/acdlite/status/955390801827135488)

## Install

```
$ npm install react-loads
```

## Usage

```js
import Loads from 'react-loads';

const delayedPromise = () => setTimeout(() => Promise.resolve(), 200);

export default () => (
  <Loads
    delay={500}
    loadingFunc={delayedFn}
    onLoadingRenderer={() => <div>loading</div>}
    onLoadedRenderer={({ response, error }) => (error ? <div>nooo!</div> : <div>{response}</div>)}
  />
);
```

## Props

<table>
<thead><tr><th>Prop</th><th>Type</th><th>Default value</th><th>Description</th></tr></thead>
<tbody>
  <tr><td>  delay </td><td>number</td><td>`300`</td> <td>Number of milliseconds before the loading component (`onLoadingRenderer`) appears.</td></tr>
 <tr><td>  loadingFunc </td><td>`() => Promise&lt;void&gt;`</td><td>N/A (required)</td> <td>The function to load.</td></tr>
 <tr><td>  onLoadingRenderer </td><td>`({ hasTimedOut: boolean }) => any`</td><td>N/A (required)</td> <td>The loading component renderer (displays when loading).</td></tr>
 <tr><td>  onLoadedRenderer </td><td>`({ response?: any, error?: any }) => any`</td><td>N/A (required)</td> <td>The loaded component renderer (displays on successful/errored load).</td></tr>
  <tr><td>  timeout </td><td>number</td><td>`0`</td> <td>Number of milliseconds before the loading component times out.</td></tr>
</tbody>
</table>

## License

MIT © [jxom](http://jxom.io)
