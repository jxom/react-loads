import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Box, Button, Image, Set, Spinner } from 'fannypack';

import { storiesOf } from '@storybook/react';

import { Loads, useLoads } from '../index';

storiesOf('useLoads (Hook)', module)
  .add('load on mount', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const { response, error, load, isRejected, isPending, isResolved } = useLoads(getRandomDog);
      return (
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
      );
    }
    return <Component />;
  })
  .add('with deferred load', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const { response, error, load, isIdle, isRejected, isPending, isResolved } = useLoads(getRandomDog, {
        defer: true
      });
      return (
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
      );
    }
    return <Component />;
  })
  .add('custom delay', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const { response, error, load, isIdle, isRejected, isPending, isResolved } = useLoads(getRandomDog, {
        defer: true,
        delay: 1000
      });
      return (
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
      );
    }
    return <Component />;
  })
  .add('no delay', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const { response, error, load, isIdle, isRejected, isPending, isResolved } = useLoads(getRandomDog, {
        defer: true,
        delay: 0
      });
      return (
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
      );
    }
    return <Component />;
  })
  .add('with error', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/sssss/random'), []);
      const { response, error, load, isIdle, isRejected, isPending, isResolved } = useLoads(getRandomDog, {
        defer: true,
        delay: 1000
      });
      return (
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
      );
    }
    return <Component />;
  })
  .add('with timeout', () => {
    function Component() {
      const fn = React.useCallback(() => new Promise(res => setTimeout(() => res('this is data'), 2000)), []);
      const { response, load, isIdle, isTimeout, isPending, isResolved } = useLoads(fn, {
        defer: true,
        timeout: 1000
      });
      return (
        <Box>
          {isIdle && <Button onClick={load}>Load dog</Button>}
          {(isPending || isTimeout) && <Spinner size="large" />}
          {isTimeout && 'taking a while'}
          {isResolved && <Box>{response}</Box>}
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
      const { response, error, load, isIdle, isRejected, isPending, isResolved } = useLoads(getRandomDogByBreed, {
        defer: true
      });
      return (
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
      );
    }
    return <Component />;
  })
  .add('with state components', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const { response, error, load, Idle, Rejected, Pending, Resolved } = useLoads(getRandomDog, { defer: true });
      return (
        <Box>
          <Idle>
            <Button onClick={load}>Load dog</Button>
          </Idle>
          <Pending>
            <Spinner size="large" />
          </Pending>
          <Resolved>
            <Box>
              <Box>{response && <Image src={response.data.message} width="300px" alt="Dog" />}</Box>
              <Button onClick={load}>Load another</Button>
            </Box>
          </Resolved>
          <Rejected>{error && <Alert type="danger">{error.message}</Alert>}</Rejected>
        </Box>
      );
    }
    return <Component />;
  })
  .add('with dependant useLoads', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const getRandomDogLoader = useLoads(getRandomDog, { defer: true });

      const saveDog = React.useCallback(
        async () => new Promise(res => res(`Saved. Image: ${getRandomDogLoader.response.data.message}`)),
        [getRandomDogLoader.response]
      );
      const saveDogLoader = useLoads(saveDog, { defer: true });

      return (
        <Box>
          <getRandomDogLoader.Idle>
            <Button onClick={getRandomDogLoader.load}>Load dog</Button>
          </getRandomDogLoader.Idle>
          <getRandomDogLoader.Pending>
            <Spinner size="large" />
          </getRandomDogLoader.Pending>
          <getRandomDogLoader.Resolved>
            <Box>
              <Box>
                {getRandomDogLoader.response && (
                  <Image src={getRandomDogLoader.response.data.message} width="300px" alt="Dog" />
                )}
              </Box>
              <Set>
                <Button onClick={getRandomDogLoader.load}>Load another</Button>
                <saveDogLoader.Idle>
                  <Button isPending={saveDogLoader.isPending} onClick={saveDogLoader.load}>
                    Save dog
                  </Button>
                </saveDogLoader.Idle>
              </Set>
              <saveDogLoader.Resolved>
                <Box>{saveDogLoader.response}</Box>
              </saveDogLoader.Resolved>
            </Box>
          </getRandomDogLoader.Resolved>
          <getRandomDogLoader.Rejected>
            {getRandomDogLoader.error && <Alert type="danger">{getRandomDogLoader.error.message}</Alert>}
          </getRandomDogLoader.Rejected>
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
      const { response, error, isRejected, isPending, isResolved } = useLoads(getRandomDogByBreed);

      return (
        <Box>
          {isPending && <Spinner size="large" />}
          {isResolved && (
            <Box>
              <Box>
                <Image src={response.data.message} width="300px" alt="Dog" />
              </Box>
              <Set>
                <Button onClick={() => setBreed('beagle')}>Set to beagle</Button>
                <Button onClick={() => setBreed('dingo')}>Set to dingo</Button>
              </Set>
            </Box>
          )}
          {isRejected && <Alert type="danger">{error.message}</Alert>}
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
      const { response, load, update, isPending, isResolved } = useLoads(getRandomDog, {
        update: getRandomDoberman
      });
      return (
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
      const {
        response,
        load,
        update: [loadDoberman, loadPoodle],
        isPending,
        isResolved
      } = useLoads(getRandomDog, {
        update: [getRandomDoberman, getRandomPoodle]
      });
      return (
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
  .add('with state components', () => {
    class DogApp extends React.Component {
      getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');

      render = () => {
        return (
          <Loads defer load={this.getRandomDog}>
            <Loads.Idle>{({ load }) => <Button onClick={load}>Load dog</Button>}</Loads.Idle>
            <Loads.Pending>
              <Spinner size="large" />
            </Loads.Pending>
            <Loads.Resolved>
              {({ response, load }) => (
                <Box>
                  <Box>{response && <Image src={response.data.message} width="300px" alt="Dog" />}</Box>
                  <Button onClick={load}>Load another</Button>
                </Box>
              )}
            </Loads.Resolved>
            <Loads.Rejected>
              {({ error }) => <Alert type="danger">{error ? error.message : 'error'}</Alert>}
            </Loads.Rejected>
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
                    <getRandomDogLoader.Idle>
                      <Button onClick={getRandomDogLoader.load}>Load dog</Button>
                    </getRandomDogLoader.Idle>
                    <getRandomDogLoader.Pending>
                      <Spinner size="large" />
                    </getRandomDogLoader.Pending>
                    <getRandomDogLoader.Resolved>
                      <Box>
                        <Box>
                          {getRandomDogLoader.response && (
                            <Image src={getRandomDogLoader.response.data.message} width="300px" alt="Dog" />
                          )}
                        </Box>
                        <Set>
                          <Button onClick={getRandomDogLoader.load}>Load another</Button>
                          <saveDogLoader.Idle>
                            <Button isPending={saveDogLoader.isPending} onClick={saveDogLoader.load}>
                              Save dog
                            </Button>
                          </saveDogLoader.Idle>
                        </Set>
                        <saveDogLoader.Resolved>
                          <Box>{saveDogLoader.response}</Box>
                        </saveDogLoader.Resolved>
                      </Box>
                    </getRandomDogLoader.Resolved>
                    <getRandomDogLoader.Rejected>
                      {getRandomDogLoader.error && <Alert type="danger">{getRandomDogLoader.error.message}</Alert>}
                    </getRandomDogLoader.Rejected>
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
