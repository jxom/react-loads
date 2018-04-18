// @flow

import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import axios from 'axios';
import Loads, { Action } from '../index';

storiesOf('Loads', module)
  .add('default usage', () => {
    const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
    return (
      <Loads fn={getRandomDog}>
        {({ load, response, state, error }) => (
          <div>
            <p>Current state: {state}</p>
            <Action show="idle">
              <button onClick={load}>Load random dog</button>
            </Action>
            <Action show="loading">loading...</Action>
            <Action show="success">
              {response && <img src={response.data.message} alt="Dog" />}
              <div>
                <button onClick={load}>Load another dog</button>
              </div>
            </Action>
            <Action show="error">Error! {error}</Action>
          </div>
        )}
      </Loads>
    );
  })
  .add('load on mount', () => {
    const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
    return (
      <Loads loadOnMount fn={getRandomDog}>
        {({ load, response, state, error }) => (
          <div>
            <p>Current state: {state}</p>
            <Action show="idle">
              <button onClick={load}>Load random dog</button>
            </Action>
            <Action show="loading">loading...</Action>
            <Action show="success">
              {response && <img src={response.data.message} alt="Dog" />}
              <div>
                <button onClick={load}>Load another dog</button>
              </div>
            </Action>
            <Action show="error">Error! {error}</Action>
          </div>
        )}
      </Loads>
    );
  })
  .add('with delay to initiate loading state', () => {
    const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
    return (
      <Loads delay={1500} fn={getRandomDog}>
        {({ load, response, state, error }) => (
          <Fragment>
            <p>Current state: {state}</p>
            <Action show="idle">
              <button onClick={load}>Load random dog</button>
            </Action>
            <Action show="loading">loading...</Action>
            <Action show="success">
              {response && <img src={response.data.message} alt="Dog" />}
              <div>
                <button onClick={load}>Load another dog</button>
              </div>
            </Action>
            <Action show="error">Error! {error}</Action>
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
        {({ load, response, state, error }) => (
          <Fragment>
            <p>Current state: {state}</p>
            <Action show="idle">
              <button onClick={load}>Load random dog</button>
            </Action>
            <Action show="loading">loading...</Action>
            <Action show="success">
              {response && <img src={response.data.message} alt="Dog" />}
              <div>
                <button onClick={load}>Load another dog</button>
              </div>
            </Action>
            <Action show="error">Error! {error && error.message}</Action>
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
        {({ load, response, state, error }) => (
          <Fragment>
            <p>Current state: {state}</p>
            <Action show="idle">
              <button onClick={load}>Load random dog</button>
            </Action>
            <Action show="loading">loading...</Action>
            <Action show="timeout">taking a while...</Action>
            <Action show="success">
              {response && <img src={response.data.message} alt="Dog" />}
              <div>
                <button onClick={load}>Load another dog</button>
              </div>
            </Action>
            <Action show="error">Error! {error && error.message}</Action>
          </Fragment>
        )}
      </Loads>
    );
  })
  .add('with function arguments', () => {
    const getRandomDogByBreed = breed => axios.get(`http://dog.ceo/api/breed/${breed}/images/random`);
    return (
      <Loads fn={getRandomDogByBreed}>
        {({ load, response, state, error }) => (
          <div>
            <p>Current state: {state}</p>
            <Action show="idle">
              <button onClick={() => load('beagle')}>Load random beagle</button>
            </Action>
            <Action show="loading">loading...</Action>
            <Action show="success">
              {response && <img src={response.data.message} alt="Dog" />}
              <div>
                <button onClick={() => load('beagle')}>Load another beagle</button>
              </div>
            </Action>
            <Action show="error">Error! {error}</Action>
          </div>
        )}
      </Loads>
    );
  })
  .add('with nested <Loads>', () => {
    const getRandomDog = () => axios.get(`https://dog.ceo/api/breeds/image/random`);
    const saveDog = randomDogResponse => new Promise(resolve => setTimeout(() => resolve(randomDogResponse), 1000));
    return (
      <Loads name="randomDog" fn={getRandomDog}>
        {({ Action: RandomDogAction, load: loadRandomDog, response: randomDogResponse, error: randomDogError }) => (
          <Loads name="saveDog" fn={saveDog}>
            {({ Action: SaveDogAction, load: saveDog }) => (
              <div>
                <RandomDogAction show="idle">
                  <button onClick={loadRandomDog}>Load random dog</button>
                </RandomDogAction>
                <RandomDogAction show="loading">loading...</RandomDogAction>
                <RandomDogAction show="success">
                  {randomDogResponse && <img src={randomDogResponse.data.message} alt="Dog" />}
                  <div>
                    <SaveDogAction show="idle">
                      <button onClick={() => saveDog(randomDogResponse)}>Save dog</button>
                    </SaveDogAction>
                    <SaveDogAction show="loading">saving...</SaveDogAction>
                    <SaveDogAction show="success">saved dog!</SaveDogAction>
                  </div>
                </RandomDogAction>
                <RandomDogAction show="error">Error! {randomDogError}</RandomDogAction>
              </div>
            )}
          </Loads>
        )}
      </Loads>
    );
  });
