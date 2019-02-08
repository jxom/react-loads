import React from 'react';
import { addDecorator, configure } from '@storybook/react';
import { setConfig } from 'react-hot-loader';
import { Box, ThemeProvider } from 'fannypack';
import store from 'store';
import { setCacheProvider } from '../src/index';

// automatically import all files ending in *.stories.js
const req = require.context('../src/__stories__', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

setCacheProvider({ get: key => store.get(key), set: (key, val) => store.set(key, val) });

addDecorator(storyFn => (
  <ThemeProvider>
    <Box padding="major-2">
      {storyFn()}
    </Box>
  </ThemeProvider>
));

setConfig({ pureSFC: true });
configure(loadStories, module);
