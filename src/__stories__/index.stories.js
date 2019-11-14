import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Box, Button, Group, Image, Input, Set, Spinner } from 'fannypack';

import { storiesOf } from '@storybook/react';

import { Loads, useLoads } from '../index';
import * as api from './api';

storiesOf('useLoads (Hook)', module)
  .add('basic', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useLoads('basic', getRandomDog);

      return (
        <Box>
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogRecord.load} isLoading={randomDogRecord.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with deferred load', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useLoads('deferredLoad', getRandomDog, {
        defer: true
      });

      return (
        <Box>
          {randomDogRecord.isIdle && <Button onClick={randomDogRecord.load}>Load dog</Button>}
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogRecord.load} isLoading={randomDogRecord.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('suspense', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useLoads('suspense', getRandomDog, { suspense: true });
      return (
        <Box>
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogRecord.load} isLoading={randomDogRecord.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
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
      const randomDogRecord = useLoads('customDelay', getRandomDog, {
        defer: true,
        delay: 1000
      });
      return (
        <Box>
          {randomDogRecord.isIdle && <Button onClick={randomDogRecord.load}>Load dog</Button>}
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogRecord.load} isLoading={randomDogRecord.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('no delay', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useLoads('delay', getRandomDog, {
        defer: true,
        delay: 0
      });
      return (
        <Box>
          {randomDogRecord.isIdle && <Button onClick={randomDogRecord.load}>Load dog</Button>}
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogRecord.load} isLoading={randomDogRecord.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with error', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/sssss/random'), []);
      const randomDogRecord = useLoads('error', getRandomDog, {
        defer: true,
        delay: 1000
      });
      return (
        <Box>
          {randomDogRecord.isIdle && <Button onClick={randomDogRecord.load}>Load dog</Button>}
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogRecord.load} isLoading={randomDogRecord.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with timeout', () => {
    function Component() {
      const fn = React.useCallback(() => new Promise(res => setTimeout(() => res('this is data'), 2000)), []);
      const randomDogRecord = useLoads('timeout', fn, {
        defer: true,
        timeout: 1000
      });
      return (
        <Box>
          {randomDogRecord.isIdle && <Button onClick={randomDogRecord.load}>Load dog</Button>}
          {(randomDogRecord.isPending || randomDogRecord.isPendingSlow) && <Spinner size="large" />}
          {randomDogRecord.isPendingSlow && 'taking a while'}
          {randomDogRecord.isResolved && <Box>{randomDogRecord.response}</Box>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with dependant useLoads', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const getRandomDogRecord = useLoads('dependant', getRandomDog, { defer: true });

      const saveDog = React.useCallback(
        async () => new Promise(res => res(`Saved. Image: ${getRandomDogRecord.response.data.message}`)),
        [getRandomDogRecord.response]
      );
      const saveDogLoader = useLoads('save', saveDog, { defer: true });

      return (
        <Box>
          {getRandomDogRecord.isIdle && <Button onClick={getRandomDogRecord.load}>Load dog</Button>}
          {getRandomDogRecord.isPending && <Spinner size="large" />}
          {getRandomDogRecord.isResolved && (
            <Box>
              <Box>
                {getRandomDogRecord.response && (
                  <Image src={getRandomDogRecord.response.data.message} width="300px" alt="Dog" />
                )}
              </Box>
              <Set>
                <Button onClick={getRandomDogRecord.load} isLoading={getRandomDogRecord.isReloading}>
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
          {getRandomDogRecord.isRejected && <Alert type="danger">{getRandomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with dependant useLoads 2', () => {
    function Component() {
      const [movieId] = React.useState(1);

      const getMovie = React.useCallback(async movieId => {
        const movie = await api.getMovie(movieId);
        return movie;
      }, []);
      const movieLoader = useLoads('movie', getMovie, { variables: [movieId] });
      const movie = movieLoader.response;

      const getReviews = React.useCallback(async movieId => {
        const reviews = await api.getReviewsByMovieId(movieId);
        return reviews;
      }, []);
      // TODO: Recommendation to use variables over explicit injection?
      const reviewsLoader = useLoads('reviews', getReviews, { variables: () => [movie.id] });
      const reviews = reviewsLoader.response;

      return (
        <Box>
          {movieLoader.isPending && <Spinner />}
          {movieLoader.isResolved && (
            <Box>
              <Box>Title: {movie.title}</Box>
              {reviewsLoader.isResolved && reviews.map(review => review.comment)}
            </Box>
          )}
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
      const randomDogRecord = useLoads('inputs', getRandomDogByBreed);

      return (
        <Box>
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Set>
                <Button
                  onClick={() => setBreed('beagle')}
                  isLoading={breed === 'beagle' && randomDogRecord.isReloading}
                >
                  Set to beagle
                </Button>
                <Button onClick={() => setBreed('dingo')} isLoading={breed === 'dingo' && randomDogRecord.isReloading}>
                  Set to dingo
                </Button>
              </Set>
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
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
      const randomDogRecord = useLoads('updateFn', getRandomDog, {
        update: getRandomDoberman
      });
      return (
        <Box>
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogRecord.load}>Load another random dog</Button>
              <Button onClick={randomDogRecord.update}>Load doberman</Button>
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

      const randomDogRecord = useLoads('updateFns', getRandomDog, {
        update: [getRandomDoberman, getRandomPoodle]
      });
      const [loadDoberman, loadPoodle] = randomDogRecord.update;

      return (
        <Box>
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogRecord.load}>Load another random dog</Button>
              <Button onClick={loadDoberman}>Load doberman</Button>
              <Button onClick={loadPoodle}>Load poodle</Button>
            </Box>
          )}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with optimistic updates', () => {
    function Component() {
      const [movieId] = React.useState(4);
      const [ratingValue, setRatingValue] = React.useState();

      const getMovie = React.useCallback(() => api.getMovie(movieId), [movieId]);
      const movieRecord = useLoads('movie', getMovie);
      const movie = movieRecord.response || {};

      const updateMovie = React.useCallback(
        () => meta => {
          meta.setResponse(movie => ({ ...movie, imdbRating: ratingValue }), 'movie');
          return api.updateMovie(movieId, { imdbRating: ratingValue });
        },
        [movieId, ratingValue]
      );
      const updateMovieRecord = useLoads('movie', updateMovie, {
        enableBackgroundStates: true,
        defer: true,
        injectMeta: true
      });

      return (
        <Box>
          {movieRecord.isPending && <Spinner size="large" />}
          {movieRecord.isResolved && (
            <Box>
              <Box fontSize="400" fontWeight="semibold">
                {movie.title}
              </Box>
              <Box>Rating: {movie.imdbRating}</Box>
              <Group>
                <Input
                  onChange={e => setRatingValue(e.target.value)}
                  placeholder="Enter new rating"
                  value={ratingValue}
                />
                <Button onClick={updateMovieRecord.load} isLoading={updateMovieRecord.isPending}>
                  Update
                </Button>
              </Group>
            </Box>
          )}
          {movieRecord.isRejected && <Alert type="danger">{movieRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with function variables', () => {
    function Component() {
      const [breed, setBreed] = React.useState('beagle');

      const getRandomDogByBreed = React.useCallback(
        breed => axios.get(`https://dog.ceo/api/breed/${breed}/images/random`),
        []
      );
      const randomDogRecord = useLoads('functionVariables', getRandomDogByBreed, {
        variables: [breed]
      });
      return (
        <Box>
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={randomDogRecord.load} isLoading={randomDogRecord.isReloading}>
                Load another
              </Button>
              <Box>
                <Button onClick={() => setBreed('doberman')}>Set to doberman</Button>
              </Box>
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with function variables (deferred)', () => {
    function Component() {
      const getRandomDogByBreed = React.useCallback(
        breed => axios.get(`https://dog.ceo/api/breed/${breed}/images/random`),
        []
      );
      const randomDogRecord = useLoads('functionVariablesDeferred', getRandomDogByBreed, {
        defer: true
      });
      return (
        <Box>
          {randomDogRecord.isIdle && <Button onClick={() => randomDogRecord.load('beagle')}>Load beagle</Button>}
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
              </Box>
              <Button onClick={() => randomDogRecord.load('beagle')} isLoading={randomDogRecord.isReloading}>
                Load another
              </Button>
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
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
            {getRandomDogRecord => (
              <Loads defer load={this.saveDog}>
                {saveDogLoader => (
                  <Box>
                    {getRandomDogRecord.isIdle && <Button onClick={getRandomDogRecord.load}>Load dog</Button>}
                    {getRandomDogRecord.isPending && <Spinner size="large" />}
                    {getRandomDogRecord.isResolved && (
                      <Box>
                        <Box>
                          {getRandomDogRecord.response && (
                            <Image src={getRandomDogRecord.response.data.message} width="300px" alt="Dog" />
                          )}
                        </Box>
                        <Set>
                          <Button onClick={getRandomDogRecord.load} isLoading={getRandomDogRecord.isReloading}>
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
                    {getRandomDogRecord.isRejected && <Alert type="danger">{getRandomDogRecord.error.message}</Alert>}
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
