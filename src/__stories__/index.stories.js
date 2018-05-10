// @flow

import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import axios from 'axios';
import Loads from '../index';

storiesOf('Loads', module)
  .add('default usage', () => {
    const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
    return (
      <Loads fn={getRandomDog}>
        {({ isIdle, isLoading, isSuccess, load, response, state, error }) => (
          <div>
            <p>Current state: {state}</p>
            {isIdle && <button onClick={load}>Load random dog</button>}
            {isLoading && <div>loading...</div>}
            {isSuccess && (
              <div>
                {response && <img src={response.data.message} alt="Dog" />}
                <div>
                  <button onClick={load}>Load another dog</button>
                </div>
              </div>
            )}
          </div>
        )}
      </Loads>
    );
  })
  .add('load on mount', () => {
    const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
    return (
      <Loads loadOnMount fn={getRandomDog}>
        {({ isIdle, isLoading, isSuccess, load, response, state, error }) => (
          <div>
            <p>Current state: {state}</p>
            {isIdle && <button onClick={load}>Load random dog</button>}
            {isLoading && <div>loading...</div>}
            {isSuccess && (
              <div>
                {response && <img src={response.data.message} alt="Dog" />}
                <div>
                  <button onClick={load}>Load another dog</button>
                </div>
              </div>
            )}
          </div>
        )}
      </Loads>
    );
  })
  .add('with delay to initiate loading state', () => {
    const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
    return (
      <Loads delay={1500} fn={getRandomDog}>
        {({ isIdle, isLoading, isSuccess, load, response, state, error }) => (
          <Fragment>
            <p>Current state: {state}</p>
            {isIdle && <button onClick={load}>Load random dog</button>}
            {isLoading && <div>loading...</div>}
            {isSuccess && (
              <div>
                {response && <img src={response.data.message} alt="Dog" />}
                <div>
                  <button onClick={load}>Load another dog</button>
                </div>
              </div>
            )}
          </Fragment>
        )}
      </Loads>
    );
  })
  .add('with no delay to initiate loading state', () => {
    const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
    return (
      <Loads delay={0} fn={getRandomDog}>
        {({ isIdle, isLoading, isSuccess, load, response, state, error }) => (
          <Fragment>
            <p>Current state: {state}</p>
            {isIdle && <button onClick={load}>Load random dog</button>}
            {isLoading && <div>loading...</div>}
            {isSuccess && (
              <div>
                {response && <img src={response.data.message} alt="Dog" />}
                <div>
                  <button onClick={load}>Load another dog</button>
                </div>
              </div>
            )}
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
        {({ isIdle, isLoading, isSuccess, isError, load, response, state, error }) => (
          <Fragment>
            <p>Current state: {state}</p>
            {isIdle && <button onClick={load}>Load random dog</button>}
            {isLoading && <div>loading...</div>}
            {isSuccess && (
              <div>
                {response && <img src={response.data.message} alt="Dog" />}
                <div>
                  <button onClick={load}>Load another dog</button>
                </div>
              </div>
            )}
            {isError && <div>Error! {error}</div>}
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
        {({ isIdle, isLoading, isSuccess, isTimeout, load, response, state, error }) => (
          <Fragment>
            <p>Current state: {state}</p>
            {isIdle && <button onClick={load}>Load random dog</button>}
            {isLoading && <div>loading...</div>}
            {isTimeout && <div>taking a while...</div>}
            {isSuccess && (
              <div>
                {response && <img src={response.data.message} alt="Dog" />}
                <div>
                  <button onClick={load}>Load another dog</button>
                </div>
              </div>
            )}
          </Fragment>
        )}
      </Loads>
    );
  })
  .add('with function arguments', () => {
    const getRandomDogByBreed = breed => axios.get(`https://dog.ceo/api/breed/${breed}/images/random`);
    return (
      <Loads fn={getRandomDogByBreed}>
        {({ isIdle, isLoading, isSuccess, load, response, state, error }) => (
          <div>
            <p>Current state: {state}</p>
            {isIdle && <button onClick={() => load('beagle')}>Load random beagle</button>}
            {isLoading && <div>loading...</div>}
            {isSuccess && (
              <div>
                {response && <img src={response.data.message} alt="Dog" />}
                <div>
                  <button onClick={() => load('beagle')}>Load another beagle</button>
                </div>
              </div>
            )}
          </div>
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
              <div>
                {isRandomDogIdle && <button onClick={loadRandomDog}>Load random dog</button>}
                {isRandomDogLoading && <div>loading...</div>}
                {isRandomDogSuccess && (
                  <div>
                    {randomDogResponse && <img src={randomDogResponse.data.message} alt="Dog" />}
                    <div>
                      {isSaveDogLoading && <div>saving...</div>}
                      {isSaveDogSuccess && <div>saved dog!</div>}
                      {(isSaveDogSuccess || isSaveDogIdle) && (
                        <button onClick={() => saveDog(randomDogResponse)}>Save dog</button>
                      )}
                    </div>
                  </div>
                )}
                {isRandomDogError && <div>Error! {randomDogError}</div>}
              </div>
            )}
          </Loads>
        )}
      </Loads>
    );
  });
