module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'Loads',
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react-automata': 'ReactAutomata',
        idx: 'idx',
        '@reactions/component': 'Component'
      }
    }
  }
}
