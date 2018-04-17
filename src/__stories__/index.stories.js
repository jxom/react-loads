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
  });
