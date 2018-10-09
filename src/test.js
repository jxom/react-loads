import 'jest-dom/extend-expect';
import 'react-testing-library/cleanup-after-each';
import 'babel-polyfill';
import React, { Fragment } from 'react';
import { fireEvent, render, waitForElement } from 'react-testing-library';
import Loads, { LoadsProvider } from './index';

it('invokes fn - when load is invoked', () => {
  const mockFn = jest.fn().mockResolvedValue('resolved');
  const { getByText } = render(
    <Loads fn={mockFn}>
      {({ load }) => (
        <div>
          <button onClick={load}>load</button>
        </div>
      )}
    </Loads>
  );
  const test = getByText('load');
  expect(mockFn).toHaveBeenCalledTimes(0);
  fireEvent.click(test);
  expect(mockFn).toHaveBeenCalledTimes(1);
});

it('invokes fn on mount - when loadOnMount is provided as a prop', () => {
  const mockFn = jest.fn().mockResolvedValue('resolved');
  render(
    <Loads fn={mockFn} loadOnMount>
      {({ load }) => <div>Hello world</div>}
    </Loads>
  );
  expect(mockFn).toHaveBeenCalledTimes(1);
});

it('sets isIdle state to true and displays isIdle children - when fn has not yet been invoked', () => {
  const mockFn = jest.fn().mockResolvedValue('resolved');
  const { getByText } = render(<Loads fn={mockFn}>{({ isIdle }) => (isIdle ? <p>idle</p> : null)}</Loads>);
  expect(getByText('idle')).toBeTruthy();
});

it('sets isLoading state to true and displays isLoading children - when fn is in a pending state', async () => {
  const mockFn = jest.fn().mockReturnValue(new Promise(res => setTimeout(() => res('resolved'), 50)));
  const { getByText } = render(
    <div>
      <Loads fn={mockFn} delay={0} loadOnMount>
        {({ isLoading }) => (isLoading ? <p>loading</p> : null)}
      </Loads>
    </div>
  );
  await waitForElement(() => getByText('loading'));
  expect(getByText('loading')).toBeTruthy();
});

it('sets isTimeout state to true and displays isTimeout children - when fn is in a pending state and pass the timeout', async () => {
  const mockFn = jest.fn().mockReturnValue(new Promise(res => setTimeout(() => res('resolved'), 100)));
  const { getByText } = render(
    <div>
      <Loads fn={mockFn} delay={0} timeout={50} loadOnMount>
        {({ isTimeout }) => (isTimeout ? <p>timeout</p> : null)}
      </Loads>
    </div>
  );
  await waitForElement(() => getByText('timeout'));
  expect(getByText('timeout')).toBeTruthy();
});

it('sets isSuccess state to true and displays isSuccess children - when fn has been resolved', async () => {
  const mockFn = jest.fn().mockReturnValue(new Promise(res => setTimeout(() => res('resolved'), 50)));
  const { getByText } = render(
    <Loads fn={mockFn} loadOnMount>
      {({ isSuccess }) => (isSuccess ? <p>success</p> : null)}
    </Loads>
  );
  await waitForElement(() => getByText('success'));
  expect(getByText('success')).toBeTruthy();
});

it('sets isError state to true and displays isError children - when fn has been rejected', async () => {
  const mockFn = jest.fn().mockReturnValue(new Promise((res, rej) => setTimeout(() => rej('rejected'), 50)));
  const { getByText } = render(
    <Loads fn={mockFn} loadOnMount>
      {({ isError }) => (isError ? <p>error</p> : null)}
    </Loads>
  );
  await waitForElement(() => getByText('error'));
  expect(getByText('error')).toBeTruthy();
});

it('sets response to the resolved data - when fn has been resolved', async () => {
  const response = 'resolved';
  const mockFn = jest.fn().mockReturnValue(new Promise(res => res(response)));
  const { getByText } = render(
    <Loads fn={mockFn} loadOnMount>
      {({ response, isSuccess }) => (isSuccess ? <p>{response}</p> : null)}
    </Loads>
  );
  await waitForElement(() => getByText(response));
  expect(getByText(response)).toBeTruthy();
});

it('sets error to the rejected data - when fn has been rejected', async () => {
  const error = 'rejected';
  const mockFn = jest.fn().mockReturnValue(new Promise((res, rej) => rej(error)));
  const { getByText } = render(
    <Loads fn={mockFn} loadOnMount>
      {({ error, isError }) => (isError ? <p>{error}</p> : null)}
    </Loads>
  );
  await waitForElement(() => getByText(error));
  expect(getByText(error)).toBeTruthy();
});

it('sets the response in cache when resolved and uses that response on a subsequent load', async () => {
  const response = 'resolved';
  const mockFn = jest.fn().mockReturnValue(new Promise(res => setTimeout(() => res(response), 100)));
  const { getByText } = render(
    <LoadsProvider>
      <Loads contextKey="test" delay={0} fn={mockFn} loadOnMount>
        {({ load, response, hasResponseInCache, isLoading, isSuccess }) => (
          <Fragment>
            {isLoading && <p>loading</p>}
            {isSuccess && <p>{response}</p>}
            {hasResponseInCache && <p>cached</p>}
            <button onClick={load}>load</button>
          </Fragment>
        )}
      </Loads>
    </LoadsProvider>
  );
  await waitForElement(() => getByText('loading'));
  expect(getByText('loading')).toBeTruthy();
  await waitForElement(() => getByText(response));
  expect(getByText(response)).toBeTruthy();
  fireEvent.click(getByText('load'));
  expect(getByText(response)).toBeTruthy();
  expect(getByText('cached')).toBeTruthy();
});

it('loads the cached data and does not invoke fn when loadPolicy is set to "cache-first"', async () => {
  const response = 'resolved';
  const mockFn = jest.fn().mockReturnValue(new Promise(res => setTimeout(() => res(response), 100)));
  const { getByText } = render(
    <LoadsProvider>
      <Loads contextKey="test" delay={0} fn={mockFn} loadOnMount loadPolicy="cache-first">
        {({ load, response, hasResponseInCache, isLoading, isSuccess }) => (
          <Fragment>
            {isLoading && <p>loading</p>}
            {isSuccess && <p>{response}</p>}
            {hasResponseInCache && <p>cached</p>}
            <button onClick={load}>load</button>
          </Fragment>
        )}
      </Loads>
    </LoadsProvider>
  );
  expect(mockFn).toHaveBeenCalledTimes(1);
  await waitForElement(() => getByText(response));
  expect(getByText(response)).toBeTruthy();
  fireEvent.click(getByText('load'));
  expect(mockFn).toHaveBeenCalledTimes(1);
  expect(getByText(response)).toBeTruthy();
});
