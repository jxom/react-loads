import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Box, Button, Image, Set, Spinner } from 'fannypack';

import { storiesOf } from '@storybook/react';

import { Loads, useLoads } from '../index';

storiesOf('useLoads (Hook)', module)
  .add('basic', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogLoader = useLoads(getRandomDog, { context: 'basic' });

      return (
        <Box>
          {randomDogLoader.isPending && <Spinner size="large" />}
          {randomDogLoader.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogLoader.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogLoader.load} isLoading={randomDogLoader.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogLoader.isRejected && <Alert type="danger">{randomDogLoader.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with deferred load', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogLoader = useLoads(getRandomDog, {
        context: 'deferredLoad',
        defer: true
      });
      return (
        <Box>
          {randomDogLoader.isIdle && <Button onClick={randomDogLoader.load}>Load dog</Button>}
          {randomDogLoader.isPending && <Spinner size="large" />}
          {randomDogLoader.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogLoader.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogLoader.load} isLoading={randomDogLoader.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogLoader.isRejected && <Alert type="danger">{randomDogLoader.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('suspense', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogLoader = useLoads(getRandomDog, { context: 'suspense', suspense: true });
      return (
        <Box>
          {randomDogLoader.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogLoader.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogLoader.load} isLoading={randomDogLoader.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogLoader.isRejected && <Alert type="danger">{randomDogLoader.error.message}</Alert>}
        </Box>
      );
    }
    return (
      <React.Suspense fallback={<Spinner />}>
        <Component />
      </React.Suspense>
    );
  })
  .add('custom delay', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogLoader = useLoads(getRandomDog, {
        context: 'customDelay',
        defer: true,
        delay: 1000
      });
      return (
        <Box>
          {randomDogLoader.isIdle && <Button onClick={randomDogLoader.load}>Load dog</Button>}
          {randomDogLoader.isPending && <Spinner size="large" />}
          {randomDogLoader.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogLoader.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogLoader.load} isLoading={randomDogLoader.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogLoader.isRejected && <Alert type="danger">{randomDogLoader.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('no delay', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogLoader = useLoads(getRandomDog, {
        context: 'delay',
        defer: true,
        delay: 0
      });
      return (
        <Box>
          {randomDogLoader.isIdle && <Button onClick={randomDogLoader.load}>Load dog</Button>}
          {randomDogLoader.isPending && <Spinner size="large" />}
          {randomDogLoader.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogLoader.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogLoader.load} isLoading={randomDogLoader.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogLoader.isRejected && <Alert type="danger">{randomDogLoader.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with error', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/sssss/random'), []);
      const randomDogLoader = useLoads(getRandomDog, {
        context: 'error',
        defer: true,
        delay: 1000
      });
      return (
        <Box>
          {randomDogLoader.isIdle && <Button onClick={randomDogLoader.load}>Load dog</Button>}
          {randomDogLoader.isPending && <Spinner size="large" />}
          {randomDogLoader.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogLoader.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogLoader.load} isLoading={randomDogLoader.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogLoader.isRejected && <Alert type="danger">{randomDogLoader.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with timeout', () => {
    function Component() {
      const fn = React.useCallback(() => new Promise(res => setTimeout(() => res('this is data'), 2000)), []);
      const randomDogLoader = useLoads(fn, {
        context: 'timeout',
        defer: true,
        timeout: 1000
      });
      return (
        <Box>
          {randomDogLoader.isIdle && <Button onClick={randomDogLoader.load}>Load dog</Button>}
          {(randomDogLoader.isPending || randomDogLoader.isPendingSlow) && <Spinner size="large" />}
          {randomDogLoader.isPendingSlow && 'taking a while'}
          {randomDogLoader.isResolved && <Box>{randomDogLoader.response}</Box>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with function arguments', () => {
    function Component() {
      const getRandomDogByBreed = React.useCallback(
        breed => axios.get(`https://dog.ceo/api/breed/${breed}/images/random`),
        []
      );
      const randomDogLoader = useLoads(getRandomDogByBreed, {
        context: 'functionArguments',
        defer: true
      });
      return (
        <Box>
          {randomDogLoader.isIdle && <Button onClick={() => randomDogLoader.load('beagle')}>Load beagle</Button>}
          {randomDogLoader.isPending && <Spinner size="large" />}
          {randomDogLoader.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogLoader.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={() => randomDogLoader.load('beagle')} isLoading={randomDogLoader.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogLoader.isRejected && <Alert type="danger">{randomDogLoader.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with dependant useLoads', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const getRandomDogLoader = useLoads(getRandomDog, { context: 'dependant', defer: true });

      const saveDog = React.useCallback(
        async () => new Promise(res => res(`Saved. Image: ${getRandomDogLoader.response.data.message}`)),
        [getRandomDogLoader.response]
      );
      const saveDogLoader = useLoads(saveDog, { defer: true });

      return (
        <Box>
          {getRandomDogLoader.isIdle && <Button onClick={getRandomDogLoader.load}>Load dog</Button>}
          {getRandomDogLoader.isPending && <Spinner size="large" />}
          {getRandomDogLoader.isResolved && (
            <Box>
              <Box>
                {getRandomDogLoader.response && (
                  <Image src={getRandomDogLoader.response.data.message} width="300px" alt="Dog" />
                )}
              </Box>
              <Set>
                <Button onClick={getRandomDogLoader.load} isLoading={getRandomDogLoader.isReloading}>
                  Load another
                </Button>
                {saveDogLoader.isIdle && (
                  <Button isPending={saveDogLoader.isPending} onClick={saveDogLoader.load}>
                    Save dog
                  </Button>
                )}
              </Set>
              {saveDogLoader.isResolved && <Box>{saveDogLoader.response}</Box>}
            </Box>
          )}
          {getRandomDogLoader.isRejected && <Alert type="danger">{getRandomDogLoader.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with inputs', () => {
    function Component() {
      const [breed, setBreed] = useState('dingo');

      const getRandomDogByBreed = React.useCallback(
        () => axios.get(`https://dog.ceo/api/breed/${breed}/images/random`),
        [breed]
      );
      const randomDogLoader = useLoads(getRandomDogByBreed, { context: 'inputs' });

      return (
        <Box>
          {randomDogLoader.isPending && <Spinner size="large" />}
          {randomDogLoader.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogLoader.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Set>
                <Button
                  onClick={() => setBreed('beagle')}
                  isLoading={breed === 'beagle' && randomDogLoader.isReloading}
                >
                  Set to beagle
                </Button>
                <Button onClick={() => setBreed('dingo')} isLoading={breed === 'dingo' && randomDogLoader.isReloading}>
                  Set to dingo
                </Button>
              </Set>
            </Box>
          )}
          {randomDogLoader.isRejected && <Alert type="danger">{randomDogLoader.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with update fn', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const getRandomDoberman = React.useCallback(
        () => axios.get('https://dog.ceo/api/breed/doberman/images/random'),
        []
      );
      const randomDogLoader = useLoads(getRandomDog, {
        context: 'updateFn',
        update: getRandomDoberman
      });
      return (
        <Box>
          {randomDogLoader.isPending && <Spinner size="large" />}
          {randomDogLoader.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogLoader.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogLoader.load}>Load another random dog</Button>
              <Button onClick={randomDogLoader.update}>Load doberman</Button>
            </Box>
          )}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with update fns', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const getRandomDoberman = React.useCallback(
        () => axios.get('https://dog.ceo/api/breed/doberman/images/random'),
        []
      );
      const getRandomPoodle = React.useCallback(() => axios.get('https://dog.ceo/api/breed/poodle/images/random'), []);

      const randomDogLoader = useLoads(getRandomDog, {
        context: 'updateFns',
        update: [getRandomDoberman, getRandomPoodle]
      });
      const [loadDoberman, loadPoodle] = randomDogLoader.update;

      return (
        <Box>
          {randomDogLoader.isPending && <Spinner size="large" />}
          {randomDogLoader.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogLoader.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogLoader.load}>Load another random dog</Button>
              <Button onClick={loadDoberman}>Load doberman</Button>
              <Button onClick={loadPoodle}>Load poodle</Button>
            </Box>
          )}
        </Box>
      );
    }
    return <Component />;
  });

storiesOf('<Loads> (Render Props)', module)
  .add('load on mount', () => {
    class DogApp extends React.Component {
      getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');

      render = () => {
        return (
          <Loads load={this.getRandomDog}>
            {({ response, error, load, isRejected, isPending, isResolved }) => (
              <Box>
                {isPending && <Spinner size="large" />}
                {isResolved && (
                  <Box>
                    <Box>
                      <Image src={response.data.message} width="300px" alt="Dog" />
                    </Box>
                    <Button onClick={load}>Load another</Button>
                  </Box>
                )}
                {isRejected && <Alert type="danger">{error.message}</Alert>}
              </Box>
            )}
          </Loads>
        );
      };
    }
    return <DogApp />;
  })
  .add('with deferred load', () => {
    class DogApp extends React.Component {
      getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');

      render = () => {
        return (
          <Loads defer load={this.getRandomDog}>
            {({ response, error, load, isIdle, isRejected, isPending, isResolved }) => (
              <Box>
                {isIdle && <Button onClick={load}>Load dog</Button>}
                {isPending && <Spinner size="large" />}
                {isResolved && (
                  <Box>
                    <Box>
                      <Image src={response.data.message} width="300px" alt="Dog" />
                    </Box>
                    <Button onClick={load}>Load another</Button>
                  </Box>
                )}
                {isRejected && <Alert type="danger">{error.message}</Alert>}
              </Box>
            )}
          </Loads>
        );
      };
    }
    return <DogApp />;
  })
  .add('custom delay', () => {
    class DogApp extends React.Component {
      getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');

      render = () => {
        return (
          <Loads defer delay={1000} load={this.getRandomDog}>
            {({ response, error, load, isIdle, isRejected, isPending, isResolved }) => (
              <Box>
                {isIdle && <Button onClick={load}>Load dog</Button>}
                {isPending && <Spinner size="large" />}
                {isResolved && (
                  <Box>
                    <Box>
                      <Image src={response.data.message} width="300px" alt="Dog" />
                    </Box>
                    <Button onClick={load}>Load another</Button>
                  </Box>
                )}
                {isRejected && <Alert type="danger">{error.message}</Alert>}
              </Box>
            )}
          </Loads>
        );
      };
    }
    return <DogApp />;
  })
  .add('no delay', () => {
    class DogApp extends React.Component {
      getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');

      render = () => {
        return (
          <Loads defer delay={0} load={this.getRandomDog}>
            {({ response, error, load, isIdle, isRejected, isPending, isResolved }) => (
              <Box>
                {isIdle && <Button onClick={load}>Load dog</Button>}
                {isPending && <Spinner size="large" />}
                {isResolved && (
                  <Box>
                    <Box>
                      <Image src={response.data.message} width="300px" alt="Dog" />
                    </Box>
                    <Button onClick={load}>Load another</Button>
                  </Box>
                )}
                {isRejected && <Alert type="danger">{error.message}</Alert>}
              </Box>
            )}
          </Loads>
        );
      };
    }
    return <DogApp />;
  })
  .add('with error', () => {
    class DogApp extends React.Component {
      getRandomDog = () => axios.get('https://dog.ceo/api/breeds/sss/random');

      render = () => {
        return (
          <Loads defer load={this.getRandomDog}>
            {({ response, error, load, isIdle, isRejected, isPending, isResolved }) => (
              <Box>
                {isIdle && <Button onClick={load}>Load dog</Button>}
                {isPending && <Spinner size="large" />}
                {isResolved && (
                  <Box>
                    <Box>
                      <Image src={response.data.message} width="300px" alt="Dog" />
                    </Box>
                    <Button onClick={load}>Load another</Button>
                  </Box>
                )}
                {isRejected && <Alert type="danger">{error.message}</Alert>}
              </Box>
            )}
          </Loads>
        );
      };
    }
    return <DogApp />;
  })
  .add('with timeout', () => {
    class DogApp extends React.Component {
      getRandomDog = () => new Promise(res => setTimeout(() => res('this is data'), 2000));

      render = () => {
        return (
          <Loads defer timeout={1000} load={this.getRandomDog}>
            {({ response, error, load, isIdle, isTimeout, isPending, isResolved }) => (
              <Box>
                {isIdle && <Button onClick={load}>Load dog</Button>}
                {(isPending || isTimeout) && <Spinner size="large" />}
                {isTimeout && 'taking a while'}
                {isResolved && <Box>{response}</Box>}
              </Box>
            )}
          </Loads>
        );
      };
    }
    return <DogApp />;
  })
  .add('with function arguments', () => {
    class DogApp extends React.Component {
      getRandomDog = breed => axios.get(`https://dog.ceo/api/breed/${breed}/images/random`);

      render = () => {
        return (
          <Loads defer load={this.getRandomDog}>
            {({ response, error, load, isIdle, isRejected, isPending, isResolved }) => (
              <Box>
                {isIdle && <Button onClick={() => load('beagle')}>Load beagle</Button>}
                {isPending && <Spinner size="large" />}
                {isResolved && (
                  <Box>
                    <Box>
                      <Image src={response.data.message} width="300px" alt="Dog" />
                    </Box>
                    <Button onClick={() => load('beagle')}>Load another</Button>
                  </Box>
                )}
                {isRejected && <Alert type="danger">{error.message}</Alert>}
              </Box>
            )}
          </Loads>
        );
      };
    }
    return <DogApp />;
  })
  .add('with dependant useLoads', () => {
    class DogApp extends React.Component {
      getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');

      saveDog = async () => new Promise(res => res('Saved.'));

      render = () => {
        return (
          <Loads defer load={this.getRandomDog}>
            {getRandomDogLoader => (
              <Loads defer load={this.saveDog}>
                {saveDogLoader => (
                  <Box>
                    {getRandomDogLoader.isIdle && <Button onClick={getRandomDogLoader.load}>Load dog</Button>}
                    {getRandomDogLoader.isPending && <Spinner size="large" />}
                    {getRandomDogLoader.isResolved && (
                      <Box>
                        <Box>
                          {getRandomDogLoader.response && (
                            <Image src={getRandomDogLoader.response.data.message} width="300px" alt="Dog" />
                          )}
                        </Box>
                        <Set>
                          <Button onClick={getRandomDogLoader.load} isLoading={getRandomDogLoader.isReloading}>
                            Load another
                          </Button>
                          {saveDogLoader.isIdle && (
                            <Button isPending={saveDogLoader.isPending} onClick={saveDogLoader.load}>
                              Save dog
                            </Button>
                          )}
                        </Set>
                        {saveDogLoader.isResolved && <Box>{saveDogLoader.response}</Box>}
                      </Box>
                    )}
                    {getRandomDogLoader.isRejected && <Alert type="danger">{getRandomDogLoader.error.message}</Alert>}
                  </Box>
                )}
              </Loads>
            )}
          </Loads>
        );
      };
    }
    return <DogApp />;
  })
  .add('with update fn', () => {
    class DogApp extends React.Component {
      getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');

      getRandomDoberman = () => axios.get('https://dog.ceo/api/breed/doberman/images/random');

      render = () => {
        return (
          <Loads load={this.getRandomDog} update={this.getRandomDoberman}>
            {({ response, load, update, isPending, isResolved }) => (
              <Box>
                {isPending && <Spinner size="large" />}
                {isResolved && (
                  <Box>
                    <Box>
                      <Image src={response.data.message} width="300px" alt="Dog" />
                    </Box>
                    <Button onClick={load}>Load another random dog</Button>
                    <Button onClick={update}>Load doberman</Button>
                  </Box>
                )}
              </Box>
            )}
          </Loads>
        );
      };
    }
    return <DogApp />;
  })
  .add('with update fns', () => {
    class DogApp extends React.Component {
      getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');

      getRandomDoberman = () => axios.get('https://dog.ceo/api/breed/doberman/images/random');

      getRandomPoodle = () => axios.get('https://dog.ceo/api/breed/poodle/images/random');

      render = () => {
        return (
          <Loads load={this.getRandomDog} update={[this.getRandomDoberman, this.loadPoodle]}>
            {({ response, load, update: [loadDoberman, loadPoodle], isPending, isResolved }) => (
              <Box>
                {isPending && <Spinner size="large" />}
                {isResolved && (
                  <Box>
                    <Box>
                      <Image src={response.data.message} width="300px" alt="Dog" />
                    </Box>
                    <Button onClick={load}>Load another random dog</Button>
                    <Button onClick={loadDoberman}>Load doberman</Button>
                    <Button onClick={loadPoodle}>Load poodle</Button>
                  </Box>
                )}
              </Box>
            )}
          </Loads>
        );
      };
    }
    return <DogApp />;
  });
