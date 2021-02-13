module.exports = {
  env: {
    browser: false,
    commonjs: true,
    node: true,
    mocha: true
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 10
  },
  rules: {
    'consistent-return': 0,
    'no-shadow': 0,
    'func-names': 0,
    'no-console': 0,
    'comma-dangle': 0
  },
};
