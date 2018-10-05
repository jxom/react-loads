import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import axios from 'axios';
import Loads, { createInstance } from '../index';

storiesOf('Loads', module)
  .add('default usage', () => {
    const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
    return (
      <Loads fn={getRandomDog}>
        {({ isIdle, isLoading, isSuccess, isError, load, response, error }) => (
          <Fragment>
            {isIdle && <button onClick={load}>Load random dog</button>}
            {isLoading && <div>Loading...</div>}
            {isSuccess && (
              <div>
                <img src={response.data.message} alt="Dog" />
              </div>
            )}
            {isError && <div>An error occurred! {error.message}</div>}
            {(isSuccess || isError) && <button onClick={load}>Load another dog</button>}
          </Fragment>
        )}
      </Loads>
    );
  })
  .add('load on mount', () => {
    const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
    return (
      <Loads loadOnMount fn={getRandomDog}>
        {({ isIdle, isLoading, isSuccess, isError, load, response, error }) => (
          <Fragment>
            {isIdle && <button onClick={load}>Load random dog</button>}
            {isLoading && <div>Loading...</div>}
            {isSuccess && (
              <div>
                <img src={response.data.message} alt="Dog" />
              </div>
            )}
            {isError && <div>An error occurred! {error.message}</div>}
            {(isSuccess || isError) && <button onClick={load}>Load another dog</button>}
          </Fragment>
        )}
      </Loads>
    );
  })
  .add('with delay to initiate loading state', () => {
    const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
    return (
      <Loads delay={1500} fn={getRandomDog}>
        {({ isIdle, isLoading, isSuccess, isError, load, response, error }) => (
          <Fragment>
            {isIdle && <button onClick={load}>Load random dog</button>}
            {isLoading && <div>Loading...</div>}
            {isSuccess && (
              <div>
                <img src={response.data.message} alt="Dog" />
              </div>
            )}
            {isError && <div>An error occurred! {error.message}</div>}
            {(isSuccess || isError) && <button onClick={load}>Load another dog</button>}
          </Fragment>
        )}
      </Loads>
    );
  })
  .add('with no delay to initiate loading state', () => {
    const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
    return (
      <Loads delay={0} fn={getRandomDog}>
        {({ isIdle, isLoading, isSuccess, isError, load, response, error }) => (
          <Fragment>
            {isIdle && <button onClick={load}>Load random dog</button>}
            {isLoading && <div>Loading...</div>}
            {isSuccess && (
              <div>
                <img src={response.data.message} alt="Dog" />
              </div>
            )}
            {isError && <div>An error occurred! {error.message}</div>}
            {(isSuccess || isError) && <button onClick={load}>Load another dog</button>}
          </Fragment>
        )}
      </Loads>
    );
  })
  .add('with error', () => {
    const getRandomDog = async () => {
      throw new Error('Woof woof - there was an error.');
    };
    return (
      <Loads fn={getRandomDog}>
        {({ isIdle, isLoading, isSuccess, isError, load, response, error }) => (
          <Fragment>
            {isIdle && <button onClick={load}>Load random dog</button>}
            {isLoading && <div>Loading...</div>}
            {isSuccess && (
              <div>
                <img src={response.data.message} alt="Dog" />
              </div>
            )}
            {isError && <div>An error occurred! {error.message}</div>}
            {(isSuccess || isError) && <button onClick={load}>Load another dog</button>}
          </Fragment>
        )}
      </Loads>
    );
  })
  .add('with timeout', () => {
    const getRandomDog = () =>
      new Promise(resolve => setTimeout(() => resolve(axios.get('https://dog.ceo/api/breeds/image/random')), 3000));
    return (
      <Loads timeout={1500} fn={getRandomDog}>
        {({ isIdle, isLoading, isTimeout, isSuccess, isError, load, response, error }) => (
          <Fragment>
            {isIdle && <button onClick={load}>Load random dog</button>}
            {isLoading && <div>Loading...</div>}
            {isTimeout && <div>Taking a while...</div>}
            {isSuccess && (
              <div>
                <img src={response.data.message} alt="Dog" />
              </div>
            )}
            {isError && <div>An error occurred! {error.message}</div>}
            {(isSuccess || isError) && <button onClick={load}>Load another dog</button>}
          </Fragment>
        )}
      </Loads>
    );
  })
  .add('with function arguments', () => {
    const getRandomDogByBreed = breed => axios.get(`https://dog.ceo/api/breed/${breed}/images/random`);
    return (
      <Loads fn={getRandomDogByBreed}>
        {({ isIdle, isLoading, isSuccess, isError, load, response, state, error }) => (
          <Fragment>
            {isIdle && <button onClick={() => load('beagle')}>Load random dog</button>}
            {isLoading && <div>Loading...</div>}
            {isSuccess && (
              <div>
                <img src={response.data.message} alt="Dog" />
              </div>
            )}
            {isError && <div>An error occurred! {error.message}</div>}
          </Fragment>
        )}
      </Loads>
    );
  })
  .add('with nested <Loads>', () => {
    const getRandomDog = () => axios.get(`https://dog.ceo/api/breeds/image/random`);
    const saveDog = randomDogResponse => new Promise(resolve => setTimeout(() => resolve(randomDogResponse), 1000));
    return (
      <Loads fn={getRandomDog}>
        {({
          isIdle: isRandomDogIdle,
          isLoading: isRandomDogLoading,
          isError: isRandomDogError,
          isSuccess: isRandomDogSuccess,
          load: loadRandomDog,
          response: randomDogResponse,
          error: randomDogError
        }) => (
          <Loads fn={saveDog}>
            {({
              isLoading: isSaveDogLoading,
              isSuccess: isSaveDogSuccess,
              isIdle: isSaveDogIdle,
              load: saveDog,
              state: saveDogState
            }) => (
              <Fragment>
                {isRandomDogIdle && <button onClick={loadRandomDog}>Load random dog</button>}
                {isRandomDogLoading && <div>loading...</div>}
                {isRandomDogSuccess && (
                  <Fragment>
                    <img src={randomDogResponse.data.message} alt="Dog" />
                    <div>
                      {isSaveDogLoading && <div>saving...</div>}
                      {isSaveDogSuccess && <div>saved dog!</div>}
                      {(isSaveDogSuccess || isSaveDogIdle) && (
                        <button onClick={() => saveDog(randomDogResponse)}>Save dog</button>
                      )}
                    </div>
                  </Fragment>
                )}
                {isRandomDogError && <div>Error! {randomDogError}</div>}
              </Fragment>
            )}
          </Loads>
        )}
      </Loads>
    );
  })
  .add('with state components (as node)', () => {
    const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
    return (
      <Loads fn={getRandomDog}>
        {({ load, response }) => (
          <Fragment>
            <Loads.Idle>
              <button onClick={load}>Load random dog</button>
            </Loads.Idle>
            <Loads.Loading>
              <div>loading...</div>
            </Loads.Loading>
            <Loads.Success>
              <div>
                {response && <img src={response.data.message} alt="Dog" />}
                <div>
                  <button onClick={load}>Load another dog</button>
                </div>
              </div>
            </Loads.Success>
          </Fragment>
        )}
      </Loads>
    );
  })
  .add('with state components (as function)', () => {
    const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
    return (
      <Loads fn={getRandomDog}>
        <Loads.Idle>{({ load }) => <button onClick={load}>Load random dog</button>}</Loads.Idle>
        <Loads.Loading>loading...</Loads.Loading>
        <Loads.Success>
          {(response, { load }) => (
            <Fragment>
              {response && <img src={response.data.message} alt="Dog" />}
              <div>
                <button onClick={load}>Load another dog</button>
              </div>
            </Fragment>
          )}
        </Loads.Success>
      </Loads>
    );
  })
  .add('with multiple instances of <Loads> and state components', () => {
    const GetRandomDog = createInstance({
      fn: () => axios.get(`https://dog.ceo/api/breeds/image/random`)
    });
    const SaveDog = createInstance({
      fn: randomDogResponse => new Promise(resolve => setTimeout(() => resolve(randomDogResponse), 1000))
    });
    return (
      <GetRandomDog>
        <SaveDog>
          <GetRandomDog.Loading>Loading...</GetRandomDog.Loading>
          <GetRandomDog.Success>
            {({ response }) => (
              <Fragment>
                {response && <img src={response.data.message} alt="Dog" />}
                <div>
                  <SaveDog.Idle>{({ load }) => <button onClick={() => load(response)}>Save dog</button>}</SaveDog.Idle>
                  <SaveDog.Loading>Saving...</SaveDog.Loading>
                  <SaveDog.Success>Saved dog!</SaveDog.Success>
                </div>
              </Fragment>
            )}
          </GetRandomDog.Success>
          <GetRandomDog.Error>{({ error }) => <span>Error! {error}</span>}</GetRandomDog.Error>
          <GetRandomDog.Idle or={[GetRandomDog.Success, GetRandomDog.Error]}>
            {({ load }) => (
              <div>
                <button onClick={load}>Load random dog</button>
              </div>
            )}
          </GetRandomDog.Idle>
        </SaveDog>
      </GetRandomDog>
    );
  });
