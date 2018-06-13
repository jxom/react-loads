import React from 'react'
import { configure, addDecorator } from '@storybook/react';
import { LoadsProvider } from '../src'

// automatically import all files ending in *.stories.js
const req = require.context('../src/__stories__', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

addDecorator(story => <LoadsProvider>{story()}</LoadsProvider>)

configure(loadStories, module);
