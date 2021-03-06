import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Box, Button, Group, Heading, Image, Input, Set, Spinner } from 'fannypack';

import { storiesOf } from '@storybook/react';

import { cache, useCache, useGetStates, useLoads, useDeferredLoads } from '../index';
import * as api from './api';

storiesOf('useLoads', module)
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
  .add('basic (deferred)', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useDeferredLoads('basic', getRandomDog);

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
      const randomDogRecord = useDeferredLoads('functionVariables', getRandomDogByBreed);

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
      const randomDogRecord = useDeferredLoads(getRandomDog, {
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
      const randomDogRecord = useDeferredLoads(getRandomDog, {
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
      const randomDogRecord = useDeferredLoads(getRandomDog, {
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
      const randomDogRecord = useDeferredLoads(fn, {
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
    function Component({ movieId }) {
      const getMovie = React.useCallback(async movieId => {
        const movie = await api.getMovie(movieId);
        return movie;
      }, []);
      const movieRecord = useLoads('movie', getMovie, { variables: [movieId] });
      const movie = movieRecord.response;

      const getReviews = React.useCallback(async movieId => {
        const reviews = await api.getReviewsByMovieId(movieId);
        return reviews;
      }, []);
      const reviewsRecord = useLoads('reviews', getReviews, { variables: () => [movie.id] });
      const reviews = reviewsRecord.response;

      return (
        <Box>
          {movieRecord.isPending && <Spinner />}
          {movieRecord.isResolved && (
            <Box>
              <Box>Title: {movie.title}</Box>
              {reviewsRecord.isResolved && reviews.map(review => review.comment)}
            </Box>
          )}
        </Box>
      );
    }
    return <Component movieId={1} />;
  })
  .add('with dependant useLoads (deferred)', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useLoads('dependant', getRandomDog, { defer: true });

      const saveDog = React.useCallback(async imageSrc => new Promise(res => res(`Saved. Image: ${imageSrc}`)), []);
      const saveDogRecord = useDeferredLoads(saveDog, {
        variables: () => [randomDogRecord.response.data.message]
      });

      return (
        <Box>
          {randomDogRecord.isIdle && <Button onClick={randomDogRecord.load}>Load dog</Button>}
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved && (
            <Box>
              <Box>
                {randomDogRecord.response && (
                  <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
                )}
              </Box>
              <Set>
                <Button onClick={randomDogRecord.load} isLoading={randomDogRecord.isReloading}>
                  Load another
                </Button>
                {saveDogRecord.isIdle && (
                  <Button isPending={saveDogRecord.isPending} onClick={saveDogRecord.load}>
                    Save dog
                  </Button>
                )}
              </Set>
              {saveDogRecord.isResolved && <Box>{saveDogRecord.response}</Box>}
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
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
    function Component({ movieId }) {
      const [ratingValue, setRatingValue] = React.useState();

      const getMovie = React.useCallback(() => api.getMovie(movieId), [movieId]);
      const movieRecord = useLoads('movie', getMovie);
      const movie = movieRecord.response || {};

      const updateMovie = React.useCallback(
        () => meta => {
          meta.setResponse(movie => ({ ...movie, imdbRating: ratingValue }));
          return api.updateMovie(movieId, { imdbRating: ratingValue });
        },
        [movieId, ratingValue]
      );
      const updateMovieRecord = useDeferredLoads('movie', updateMovie);

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
    return <Component movieId={4} />;
  })
  .add('with onResolve', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const onResolve = React.useCallback(record => console.log('success', record), []);
      const randomDogRecord = useLoads('basic', getRandomDog, { onResolve });

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
  .add('with onReject', () => {
    function Component() {
      const getSomething = React.useCallback(async () => {
        return new Promise((res, rej) => setTimeout(() => rej(new Error('This is an error.')), 1000));
      }, []);
      const onReject = React.useCallback(error => console.log('error', error), []);
      const somethingRecord = useLoads('rejectHook', getSomething, { onReject });

      return (
        <Box>
          {somethingRecord.isPending && <Spinner size="large" />}
          {somethingRecord.isRejected && <Alert type="danger">{somethingRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with revalidateTime', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useLoads('revalidateTime', getRandomDog, {
        revalidateTime: 5000,
        loadPolicy: 'cache-first'
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
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with cacheTime', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useLoads('cacheTime', getRandomDog, {
        cacheTime: 5000
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
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with dedupingInterval', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useLoads('dedupingInterval', getRandomDog, {
        dedupingInterval: 2000
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
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with debounce', () => {
    function Component() {
      const [value, setValue] = React.useState('poodle');

      const getRandomDog = React.useCallback(
        ({ value }) => axios.get(`https://dog.ceo/api/breed/${value}/images/random`),
        []
      );
      const randomDogRecord = useLoads('debounce', getRandomDog, {
        debounce: 1000,
        variables: [{ value }]
      });

      return (
        <Box>
          <input placeholder="Search for a dog..." onChange={e => setValue(e.target.value)} value={value} />
          {randomDogRecord.isPending && <Spinner size="large" />}
          {randomDogRecord.isResolved &&
            randomDogRecord.response && (
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
  .add('with pollingInterval', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useLoads('pollingInterval', getRandomDog, {
        pollingInterval: 2000
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
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  })
  .add('with rejectRetryInterval', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/sssss/random'), []);
      const randomDogRecord = useDeferredLoads(getRandomDog, {
        rejectRetryInterval: 5000
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
  .add('with rejectRetryInterval (function)', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/sssss/random'), []);
      const randomDogRecord = useDeferredLoads(getRandomDog, {
        rejectRetryInterval: count => count * 5000
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
  .add('with load-only loadPolicy', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useLoads('loadOnly', getRandomDog, { loadPolicy: 'load-only' });

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
  .add('with cache-and-load loadPolicy', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useLoads('cacheAndLoad', getRandomDog, { loadPolicy: 'cache-and-load' });

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
  .add('with cache-first loadPolicy', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useLoads('cacheFirst', getRandomDog, { loadPolicy: 'cache-first' });

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
  .add('with key-only cacheStrategy', () => {
    function Component() {
      const [breed, setBreed] = React.useState('beagle');

      const getRandomDogByBreed = React.useCallback(
        breed => axios.get(`https://dog.ceo/api/breed/${breed}/images/random`),
        []
      );
      const randomDogRecord = useLoads('functionVariables', getRandomDogByBreed, {
        cacheStrategy: 'key-only',
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
  .add('with initialResponse', () => {
    function Component() {
      const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
      const randomDogRecord = useLoads('basic', getRandomDog, {
        initialResponse: { data: { message: 'https://images.dog.ceo/breeds/schnauzer-miniature/n02097047_2002.jpg' } }
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
            </Box>
          )}
          {randomDogRecord.isRejected && <Alert type="danger">{randomDogRecord.error.message}</Alert>}
        </Box>
      );
    }
    return <Component />;
  });

storiesOf('useCache', module).add('cache', () => {
  function Component() {
    const getRandomDog = React.useCallback(() => axios.get('https://dog.ceo/api/breeds/image/random'), []);
    const randomDogRecord = useDeferredLoads('basic', getRandomDog);

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

  function Cache() {
    const randomDogRecord = useCache('basic');
    if (randomDogRecord && randomDogRecord.response) {
      return (
        <Box marginTop="major-2">
          <Heading fontSize="300">Cached:</Heading>
          <Image src={randomDogRecord.response.data.message} width="300px" alt="Dog" />
        </Box>
      );
    }
    return null;
  }

  return (
    <Box>
      <Component />
      <Cache />
    </Box>
  );
});

storiesOf('useGetStates', module).add('basic', () => {
  function Component() {
    const getSomething = React.useCallback(async () => {
      return new Promise(res => setTimeout(() => res('This is something.'), 1000));
    }, []);
    const somethingRecord = useLoads('something', getSomething);

    const getAnother = React.useCallback(async () => {
      return new Promise(res => setTimeout(() => res('This is another.'), 5000));
    }, []);
    const anotherRecord = useLoads('another', getAnother, { timeout: 3000 });

    const states = useGetStates(somethingRecord, anotherRecord);

    return (
      <Box>
        {states.isPending && 'Pending...'}
        {states.isPendingSlow && ' Taking a while...'}
        {states.isResolved && `Both records have resolved. ${somethingRecord.response} ${anotherRecord.response}`}
      </Box>
    );
  }
  return <Component />;
});

storiesOf('cache', module).add('cache.clear', () => {
  function Component() {
    return (
      <Box>
        <Button onClick={() => cache.records.clear()}>Clear cache</Button>
      </Box>
    );
  }

  return <Component />;
});
