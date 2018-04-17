import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

export default {
  input: `${__dirname}/src/index.js`,
  output: {
    name: 'Loads',
    file: `${__dirname}/lib/index.js`,
    format: 'umd',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    }
  },
  external: ['react', 'react-dom', 'babel-polyfill'],
  plugins: [
    babel({
      presets: [['env', { modules: false }], 'react'],
      plugins: ['external-helpers', 'transform-class-properties', 'transform-object-rest-spread']
    }),
    uglify({}, minify)
  ]
};
