module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false, // 允许不依赖 babel.config.js
  },
  root: true,
  extends: '@react-native',
};
