import * as React from 'react';
import { cleanup, render, waitForElement, wait, fireEvent } from '@testing-library/react';
import { cache, useLoads, useDeferredLoads } from '../index';

afterEach(() => cleanup());

describe('states', () => {
  beforeEach(() => cache.records.clear());

  it('renders idle correctly the loading function has not been invoked', () => {
    const fn = jest.fn().mockReturnValue(new Promise(res => setTimeout(res, 500)));
    const Component = () => {
      const testLoader = useDeferredLoads(fn);
      return <React.Fragment>{testLoader.isIdle && 'idle'}</React.Fragment>;
    };

    const { container } = render(<Component />);

    expect(fn).toBeCalledTimes(0);
    expect(container).toMatchSnapshot();
  });

  describe('with load on initial render', () => {
    it('renders loading indicator correctly (default delay)', async () => {
      const fn = jest.fn().mockReturnValue(new Promise(res => setTimeout(res, 500)));
      const Component = () => {
        const testLoader = useLoads('test', fn);
        return <React.Fragment>{testLoader.isPending && 'loading'}</React.Fragment>;
      };

      const { container, getByText } = render(<Component />);

      await waitForElement(() => getByText('loading'));
      expect(fn).toBeCalledTimes(1);
      expect(container).toMatchSnapshot();
    });

    it('renders timeout indicator correctly', async () => {
      const fn = jest.fn().mockReturnValue(new Promise(res => setTimeout(res, 1000)));
      const Component = () => {
        const testLoader = useLoads('test', fn, { timeout: 400 });
        return (
          <React.Fragment>
            {testLoader.isPending && <div>loading</div>}
            {testLoader.isPendingSlow && <div>timeout</div>}
          </React.Fragment>
        );
      };

      const { container, getByText } = render(<Component />);

      await waitForElement(() => getByText('loading'));
      await waitForElement(() => getByText('timeout'));
      expect(fn).toBeCalledTimes(1);
      expect(container).toMatchSnapshot();
    });

    it('renders success correctly when the function has been resolved', async () => {
      const fn = jest.fn().mockReturnValue(new Promise(res => res()));
      const Component = () => {
        const testLoader = useLoads('test', fn);
        return (
          <React.Fragment>
            {testLoader.isIdle && 'idle'}
            {testLoader.isPending && 'loading'}
            {testLoader.isResolved && 'success'}
          </React.Fragment>
        );
      };

      const { container, getByText } = render(<Component />);

      await waitForElement(() => getByText('success'));
      expect(fn).toBeCalledTimes(1);
      expect(container).toMatchSnapshot();
    });

    it('renders success correctly when the function resolves after 500ms', async () => {
      const fn = jest.fn().mockReturnValue(new Promise(res => setTimeout(res, 500)));
      const Component = () => {
        const testLoader = useLoads('test', fn);
        return (
          <React.Fragment>
            {testLoader.isIdle && 'idle'}
            {testLoader.isPending && 'loading'}
            {testLoader.isResolved && 'success'}
          </React.Fragment>
        );
      };

      const { container, getByText } = render(<Component />);

      await waitForElement(() => getByText('loading'));
      await waitForElement(() => getByText('success'));
      expect(fn).toBeCalledTimes(1);
      expect(container).toMatchSnapshot();
    });

    it('renders error correctly when the function rejects after 500ms', async () => {
      const fn = jest.fn().mockReturnValue(new Promise((res, rej) => setTimeout(rej, 500)));
      const Component = () => {
        const testLoader = useLoads('test', fn);
        return (
          <React.Fragment>
            {testLoader.isIdle && 'idle'}
            {testLoader.isPending && 'loading'}
            {testLoader.isRejected && 'error'}
          </React.Fragment>
        );
      };

      const { container, getByText } = render(<Component />);

      await waitForElement(() => getByText('loading'));
      await waitForElement(() => getByText('error'));
      expect(fn).toBeCalledTimes(1);
      expect(container).toMatchSnapshot();
    });
  });

  describe('with deferred load', () => {
    it('renders loading indicator correctly (default delay)', async () => {
      const fn = jest.fn().mockReturnValue(new Promise(res => setTimeout(res, 500)));
      const Component = () => {
        const testLoader = useDeferredLoads(fn);
        return (
          <React.Fragment>
            <button onClick={testLoader.load}>load</button>
            {testLoader.isPending && 'loading'}
          </React.Fragment>
        );
      };

      const { container, getByText } = render(<Component />);

      expect(fn).toBeCalledTimes(0);
      fireEvent.click(getByText('load'));
      expect(fn).toBeCalledTimes(1);
      await waitForElement(() => getByText('loading'));
      expect(container).toMatchSnapshot();
    });

    it('renders timeout indicator correctly', async () => {
      const fn = jest.fn().mockReturnValue(new Promise(res => setTimeout(res, 1000)));
      const Component = () => {
        const testLoader = useDeferredLoads(fn, { timeout: 400 });
        return (
          <React.Fragment>
            <button onClick={testLoader.load}>load</button>
            {testLoader.isPending && <div>loading</div>}
            {testLoader.isPendingSlow && <div>timeout</div>}
          </React.Fragment>
        );
      };

      const { container, getByText } = render(<Component />);

      expect(fn).toBeCalledTimes(0);
      fireEvent.click(getByText('load'));
      expect(fn).toBeCalledTimes(1);
      await waitForElement(() => getByText('loading'));
      await waitForElement(() => getByText('timeout'));
      expect(container).toMatchSnapshot();
    });

    it('renders success correctly when the function has been resolved', async () => {
      const fn = jest.fn().mockReturnValue(new Promise(res => res()));
      const Component = () => {
        const testLoader = useDeferredLoads(fn);
        return (
          <React.Fragment>
            <button onClick={testLoader.load}>load</button>
            {testLoader.isIdle && 'idle'}
            {testLoader.isPending && 'loading'}
            {testLoader.isResolved && 'success'}
          </React.Fragment>
        );
      };

      const { container, getByText } = render(<Component />);

      expect(fn).toBeCalledTimes(0);
      expect(container).toMatchSnapshot();
      fireEvent.click(getByText('load'));
      expect(fn).toBeCalledTimes(1);
      await waitForElement(() => getByText('success'));
      expect(container).toMatchSnapshot();
    });

    it('renders success correctly when the function resolves after 500ms', async () => {
      const fn = jest.fn().mockReturnValue(new Promise(res => setTimeout(res, 500)));
      const Component = () => {
        const testLoader = useDeferredLoads(fn);
        return (
          <React.Fragment>
            <button onClick={testLoader.load}>load</button>
            {testLoader.isIdle && 'idle'}
            {testLoader.isPending && 'loading'}
            {testLoader.isResolved && 'success'}
          </React.Fragment>
        );
      };

      const { container, getByText } = render(<Component />);

      expect(fn).toBeCalledTimes(0);
      expect(container).toMatchSnapshot();
      fireEvent.click(getByText('load'));
      await waitForElement(() => getByText('loading'));
      await waitForElement(() => getByText('success'));
      expect(fn).toBeCalledTimes(1);
      expect(container).toMatchSnapshot();
    });

    it('renders error correctly when the function rejects after 500ms', async () => {
      const fn = jest.fn().mockReturnValue(new Promise((res, rej) => setTimeout(rej, 500)));
      const Component = () => {
        const testLoader = useDeferredLoads(fn);
        return (
          <React.Fragment>
            <button onClick={testLoader.load}>load</button>
            {testLoader.isIdle && 'idle'}
            {testLoader.isPending && 'loading'}
            {testLoader.isRejected && 'error'}
          </React.Fragment>
        );
      };

      const { container, getByText } = render(<Component />);

      expect(fn).toBeCalledTimes(0);
      expect(container).toMatchSnapshot();
      fireEvent.click(getByText('load'));
      await waitForElement(() => getByText('loading'));
      await waitForElement(() => getByText('error'));
      expect(fn).toBeCalledTimes(1);
      expect(container).toMatchSnapshot();
    });
  });
});

describe('context (cache)', () => {
  describe('with load on mount', () => {
    describe('on success', () => {
      it('initially renders & caches data correctly', async () => {
        const fn = jest.fn().mockReturnValue(new Promise(res => setTimeout(() => res('mockData'), 50)));
        const Component = () => {
          const testLoader = useLoads('success', fn);
          return (
            <React.Fragment>
              {testLoader.isPending && <span>loading</span>}
              {testLoader.isResolved && <span>success</span>}
              <span>{testLoader.response}</span>
            </React.Fragment>
          );
        };

        const { container, getByText } = render(<Component />);

        await waitForElement(() => getByText('loading'));
        await waitForElement(() => getByText('success'));
        expect(fn).toBeCalledTimes(1);
        expect(container).toMatchSnapshot();
      });

      it('renders the cached data correctly on subsequent load', async () => {
        const fn = jest.fn().mockReturnValue(new Promise(res => setTimeout(() => res('mockData'), 50)));
        const Component = () => {
          const testLoader = useLoads('success', fn);
          return (
            <React.Fragment>
              {testLoader.isPending && <span>loading</span>}
              {testLoader.isResolved && <span>success</span>}
              <span>{testLoader.response}</span>
            </React.Fragment>
          );
        };

        const { container, getByText } = render(<Component />);

        expect(fn).toBeCalledTimes(0);
        await waitForElement(() => getByText('success'));
        expect(container).toMatchSnapshot();
      });
    });
  });

  describe('with deferred load', () => {
    it('initially renders & caches data correctly', async () => {
      const fn = jest.fn().mockReturnValue(new Promise(res => setTimeout(() => res('mockData'), 50)));
      const Component = () => {
        const testLoader = useDeferredLoads(fn);
        return (
          <React.Fragment>
            <button onClick={testLoader.load}>load</button>
            {testLoader.isPending && <span>loading</span>}
            {testLoader.isResolved && <span>success</span>}
            <span>{testLoader.response}</span>
          </React.Fragment>
        );
      };

      const { container, getByText } = render(<Component />);

      fireEvent.click(getByText('load'));
      await waitForElement(() => getByText('loading'));
      await waitForElement(() => getByText('success'));
      expect(fn).toBeCalledTimes(1);
      expect(container).toMatchSnapshot();
    });

    it('renders the cached data correctly on subsequent load', async () => {
      const fn = jest.fn().mockReturnValue(new Promise(res => setTimeout(() => res('mockData'), 50)));
      const Component = () => {
        const testLoader = useDeferredLoads('deferred', fn);
        return (
          <React.Fragment>
            <button onClick={testLoader.load}>load</button>
            {testLoader.isPending && <span>loading</span>}
            {testLoader.isResolved && <span>success</span>}
            <span>{testLoader.response}</span>
          </React.Fragment>
        );
      };

      const { container, getByText } = render(<Component />);

      fireEvent.click(getByText('load'));
      await waitForElement(() => getByText('success'));
      expect(container).toMatchSnapshot();
    });
  });
});
