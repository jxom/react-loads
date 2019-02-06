import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Box, Button, Image, Set, Spinner } from 'fannypack';

import { storiesOf } from '@storybook/react';

import { useLoads } from '../index';

storiesOf('Loads', module)
  .add('load on mount', () => {
    function Component() {
      const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
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
      const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
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
      const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
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
      const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
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
      const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/bla');
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
      const fn = () => new Promise(res => setTimeout(() => res('this is data'), 2000));
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
      const getRandomDogByBreed = breed => axios.get(`https://dog.ceo/api/breed/${breed}/images/random`);
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
  .add('with cache', () => {
    function Component() {
      const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
      const { response, error, load, isIdle, isRejected, isPending, isResolved } = useLoads(getRandomDog, {
        context: 'foo',
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
  .add('with cache & load on mount', () => {
    function Component() {
      const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
      const { response, error, load, isRejected, isPending, isResolved } = useLoads(getRandomDog, {
        context: 'foo'
      });
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
  .add('with state components', () => {
    function Component() {
      const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
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
      const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
      const getRandomDogLoader = useLoads(getRandomDog, { defer: true });

      const saveDog = async () => new Promise(res => res(`Saved. Image: ${getRandomDogLoader.response.data.message}`));
      const saveDogLoader = useLoads(saveDog);

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

      const getRandomDogByBreed = () => axios.get(`https://dog.ceo/api/breed/${breed}/images/random`);
      const { response, error, isRejected, isPending, isResolved } = useLoads(getRandomDogByBreed, {}, [breed]);

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
  });
