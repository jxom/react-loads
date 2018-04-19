// @flow

import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import axios from 'axios';
import Loads, { IfState, IfIdle, IfLoading, IfSuccess, IfTimeout, IfError } from '../index';

storiesOf('Loads', module)
  .add('default usage', () => {
    const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
    return (
      <Loads fn={getRandomDog}>
        {({ load, response, state, error }) => (
          <div>
            <p>Current state: {state}</p>
            <IfIdle>
              <button onClick={load}>Load random dog</button>
            </IfIdle>
            <IfLoading>loading...</IfLoading>
            <IfSuccess>
              {response && <img src={response.data.message} alt="Dog" />}
              <div>
                <button onClick={load}>Load another dog</button>
              </div>
            </IfSuccess>
            <IfError>Error! {error}</IfError>
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
            <IfIdle>
              <button onClick={load}>Load random dog</button>
            </IfIdle>
            <IfLoading>loading...</IfLoading>
            <IfSuccess>
              {response && <img src={response.data.message} alt="Dog" />}
              <div>
                <button onClick={load}>Load another dog</button>
              </div>
            </IfSuccess>
            <IfError>Error! {error}</IfError>
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
            <IfIdle>
              <button onClick={load}>Load random dog</button>
            </IfIdle>
            <IfLoading>loading...</IfLoading>
            <IfSuccess>
              {response && <img src={response.data.message} alt="Dog" />}
              <div>
                <button onClick={load}>Load another dog</button>
              </div>
            </IfSuccess>
            <IfError>Error! {error}</IfError>
          </Fragment>
        )}
      </Loads>
    );
  })
  .add('with no delay to initiate loading state', () => {
    const getRandomDog = () => axios.get('https://dog.ceo/api/breeds/image/random');
    return (
      <Loads delay={0} fn={getRandomDog}>
        {({ load, response, state, error }) => (
          <Fragment>
            <p>Current state: {state}</p>
            <IfIdle>
              <button onClick={load}>Load random dog</button>
            </IfIdle>
            <IfLoading>loading...</IfLoading>
            <IfSuccess>
              {response && <img src={response.data.message} alt="Dog" />}
              <div>
                <button onClick={load}>Load another dog</button>
              </div>
            </IfSuccess>
            <IfError>Error! {error}</IfError>
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
            <IfIdle>
              <button onClick={load}>Load random dog</button>
            </IfIdle>
            <IfLoading>loading...</IfLoading>
            <IfSuccess>
              {response && <img src={response.data.message} alt="Dog" />}
              <div>
                <button onClick={load}>Load another dog</button>
              </div>
            </IfSuccess>
            <IfError>Error! {error && error.message}</IfError>
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
            <IfIdle>
              <button onClick={load}>Load random dog</button>
            </IfIdle>
            <IfLoading>loading...</IfLoading>
            <IfTimeout>taking a while...</IfTimeout>
            <IfSuccess>
              {response && <img src={response.data.message} alt="Dog" />}
              <div>
                <button onClick={load}>Load another dog</button>
              </div>
            </IfSuccess>
            <IfError>Error! {error && error.message}</IfError>
          </Fragment>
        )}
      </Loads>
    );
  })
  .add('with function arguments', () => {
    const getRandomDogByBreed = breed => axios.get(`https://dog.ceo/api/breed/${breed}/images/random`);
    return (
      <Loads fn={getRandomDogByBreed}>
        {({ load, response, state, error }) => (
          <div>
            <p>Current state: {state}</p>
            <IfIdle>
              <button onClick={() => load('beagle')}>Load random beagle</button>
            </IfIdle>
            <IfLoading>loading...</IfLoading>
            <IfSuccess>
              {response && <img src={response.data.message} alt="Dog" />}
              <div>
                <button onClick={() => load('beagle')}>Load another beagle</button>
              </div>
            </IfSuccess>
            <IfError>Error! {error}</IfError>
          </div>
        )}
      </Loads>
    );
  })
  .add('with nested <Loads>', () => {
    const getRandomDog = () => axios.get(`https://dog.ceo/api/breeds/image/random`);
    const saveDog = randomDogResponse => new Promise(resolve => setTimeout(() => resolve(randomDogResponse), 1000));
    return (
      <Loads channel="randomDog" fn={getRandomDog}>
        {({ load: loadRandomDog, response: randomDogResponse, error: randomDogError }) => (
          <Loads channel="saveDog" fn={saveDog}>
            {({ load: saveDog, state: saveDogState }) => (
              <div>
                <IfIdle channel="randomDog">
                  <button onClick={loadRandomDog}>Load random dog</button>
                </IfIdle>
                <IfLoading channel="randomDog">loading...</IfLoading>
                <IfSuccess channel="randomDog">
                  {randomDogResponse && <img src={randomDogResponse.data.message} alt="Dog" />}
                  <div>
                    <IfLoading channel="saveDog">saving...</IfLoading>
                    <IfSuccess channel="saveDog">saved dog!</IfSuccess>
                    <IfState is={['idle', 'success']} channel="saveDog">
                      <button onClick={() => saveDog(randomDogResponse)}>Save dog</button>
                    </IfState>
                  </div>
                </IfSuccess>
                <IfError channel="randomDog">Error! {randomDogError}</IfError>
              </div>
            )}
          </Loads>
        )}
      </Loads>
    );
  });
