import * as React from 'react';
import { render, waitForElement, wait, fireEvent } from 'react-testing-library';
import useLoads from '../useLoads';

describe('states', () => {
  it('renders idle correctly the loading function has not been invoked', () => {
    const fn = jest.fn().mockReturnValue(new Promise(res => setTimeout(res, 500)));
    const Component = () => {
      const testLoader = useLoads(fn, { defer: true });
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
        const testLoader = useLoads(fn);
        return <React.Fragment>{testLoader.isPending && 'loading'}</React.Fragment>;
      };

      const { container, getByText } = render(<Component />);

      await waitForElement(() => getByText('loading'));
      expect(fn).toBeCalledTimes(1);
      expect(container).toMatchSnapshot();
    });

    it('renders timeout indicator correctly', async () => {
      const fn = jest.fn().mockReturnValue(new Promise(res => setTimeout(res, 500)));
      const Component = () => {
        const testLoader = useLoads(fn, { timeout: 400 });
        return (
          <React.Fragment>
            {testLoader.isPending && 'loading'}
            {testLoader.isTimeout && 'timeout'}
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
        const testLoader = useLoads(fn);
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
        const testLoader = useLoads(fn);
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
        const testLoader = useLoads(fn);
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
        const testLoader = useLoads(fn, { defer: true });
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

    it('renders loading indicator correctly (delay = 300)', async () => {
      const fn = jest.fn().mockReturnValue(new Promise(res => res()));
      const Component = () => {
        const testLoader = useLoads(fn, { delay: 300, defer: true });
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
      expect(container).toMatchSnapshot();
    });

    it('renders timeout indicator correctly', async () => {
      const fn = jest.fn().mockReturnValue(new Promise(res => setTimeout(res, 500)));
      const Component = () => {
        const testLoader = useLoads(fn, { defer: true, timeout: 400 });
        return (
          <React.Fragment>
            <button onClick={testLoader.load}>load</button>
            {testLoader.isPending && 'loading'}
            {testLoader.isTimeout && 'timeout'}
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
        const testLoader = useLoads(fn, { defer: true });
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
        const testLoader = useLoads(fn, { defer: true });
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
        const testLoader = useLoads(fn, { defer: true });
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
          const testLoader = useLoads(fn, { context: 'foo-success', delay: 0 });
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
          const testLoader = useLoads(fn, { context: 'foo-success', delay: 0 });
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

    describe('on error', () => {
      it('initially renders & caches data correctly', async () => {
        const fn = jest.fn().mockReturnValue(new Promise((res, rej) => setTimeout(() => rej('mockError'), 50)));
        const Component = () => {
          const testLoader = useLoads(fn, { context: 'foo-error', delay: 0 });
          return (
            <React.Fragment>
              {testLoader.isPending && <span>loading</span>}
              {testLoader.isRejected && <span>error</span>}
              <span>{testLoader.error}</span>
            </React.Fragment>
          );
        };

        const { container, getByText } = render(<Component />);

        await waitForElement(() => getByText('loading'));
        await waitForElement(() => getByText('error'));
        await waitForElement(() => getByText('mockError'));
        expect(fn).toBeCalledTimes(1);
        expect(container).toMatchSnapshot();
      });

      it('renders the cached data correctly on subsequent load', async () => {
        const fn = jest.fn().mockReturnValue(new Promise((res, rej) => setTimeout(() => rej('mockError'), 50)));
        const Component = () => {
          const testLoader = useLoads(fn, { context: 'foo-error', delay: 0 });
          return (
            <React.Fragment>
              {testLoader.isPending && <span>loading</span>}
              {testLoader.isRejected && <span>error</span>}
              <span>{testLoader.error}</span>
            </React.Fragment>
          );
        };

        const { container, getByText } = render(<Component />);

        expect(fn).toBeCalledTimes(0);
        await waitForElement(() => getByText('error'));
        await waitForElement(() => getByText('mockError'));
        expect(container).toMatchSnapshot();
      });
    });
  });

  describe('with deferred load', () => {
    it('initially renders & caches data correctly', async () => {
      const fn = jest.fn().mockReturnValue(new Promise(res => setTimeout(() => res('mockData'), 50)));
      const Component = () => {
        const testLoader = useLoads(fn, { defer: true, context: 'bar', delay: 0 });
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
        const testLoader = useLoads(fn, { defer: true, context: 'bar', delay: 0 });
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
