
import React from 'react'
import { configure, addDecorator } from '@storybook/react';
import { LoadsProvider } from '../src'

const req = require.context('../src/__stories__', true, /.stories.js$/);
// automatically import all files ending in *.stories.js
function loadStories() {
  addDecorator(story => <LoadsProvider>{story()}</LoadsProvider>)
  req.keys().forEach((filename) => req(filename));
}

addDecorator(story => <LoadsProvider>{story()}</LoadsProvider>)

configure(loadStories, module);
