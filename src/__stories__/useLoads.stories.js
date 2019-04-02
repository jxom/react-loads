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
  })
  .add('with optimistic response', () => {
    function Component() {
      const getRandomDog = ({ setResponse }) => {
        // Update response in the current context
        setResponse({
          data: { message: 'https://images.dog.ceo/breeds/doberman/n02107142_17147.jpg' }
        });

        // Update response in the 'foo' context
        setResponse(
          {
            data: { message: 'https://images.dog.ceo/breeds/doberman/n02107142_17147.jpg' }
          },
          { context: 'foo' }
        );

        return axios.get('https://dog.ceo/api/breeds/image/random');
      };
      const { response, error, load, isRejected, isPending, isResolved } = useLoads(getRandomDog);

      const getRandomDoberman = () => {
        return axios.get('https://dog.ceo/api/breed/doberman/images/random');
      };
      const { response: dobermanResponse, isResolved: isDobermanResolved } = useLoads(getRandomDoberman, {
        context: 'foo'
      });

      return (
        <Box>
          {isPending && <Spinner size="large" />}
          {isResolved &&
            isDobermanResolved && (
              <Box>
                <Box>
                  <Image src={response.data.message} width="300px" alt="Dog" />
                  <Image src={dobermanResponse.data.message} width="300px" alt="Dog" />
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
  .add('with optimistic response 2', () => {
    function Component() {
      async function createDog(dog, { setResponse }) {
        setResponse(dog, { context: 'dog' });
        // ... - create the dog
      }
      const createDogLoader = useLoads(createDog, { context: 'dog2', defer: true });

      async function getDog() {
        // ... - get the dog
      }
      const getDogLoader = useLoads(getDog, { context: 'dog' });

      return (
        <React.Fragment>
          <button onClick={() => createDogLoader.load({ name: 'Teddy', breed: 'Groodle' })}>Create</button>
          {getDogLoader.response && <div>{getDogLoader.response.name}</div>}
        </React.Fragment>
      );
    }
    return <Component />;
  })
  .add('with update fn', () => {
    function Component() {
      const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
      const getRandomDoberman = () => axios.get('https://dog.ceo/api/breed/doberman/images/random');
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
      const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
      const getRandomDoberman = () => axios.get('https://dog.ceo/api/breed/doberman/images/random');
      const getRandomPoodle = () => axios.get('https://dog.ceo/api/breed/poodle/images/random');
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
