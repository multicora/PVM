'use strict';

// var gulp = require('gulp');

// var backendRules = {
//   "block-scoped-var": 2,
//   "guard-for-in": 2,
//   "no-alert": 2,
//   "no-array-constructor": 2,
//   "no-caller": 2,
//   "no-catch-shadow": 2,
//   "no-labels": 2,
//   "no-eval": 2,
//   "no-extend-native": 2,
//   "no-extra-bind": 2,
//   "no-implied-eval": 2,
//   "no-iterator": 2,
//   "no-label-var": 2,
//   "no-labels": 2,
//   "no-lone-blocks": 2,
//   "no-loop-func": 2,
//   "no-multi-spaces": 2,
//   "no-multi-str": 2,
//   "no-native-reassign": 2,
//   "no-new": 2,
//   "no-new-func": 2,
//   "no-new-object": 2,
//   "no-new-wrappers": 2,
//   "no-octal-escape": 2,
//   "no-process-exit": 2,
//   "no-proto": 2,
//   "no-return-assign": 2,
//   "no-script-url": 2,
//   "no-sequences": 2,
//   "no-shadow-restricted-names": 2,
//   "no-spaced-func": 2,
//   "no-trailing-spaces": 2,
//   "no-undef": 2,
//   "no-undef-init": 2,
//   "no-unused-expressions": [2, {"allowTernary": true}],
//   "no-unused-vars": 2,
//   "no-use-before-define": [2, { "functions": false, "variables": true }],
//   "no-with": 2,
//   "camelcase": 2,
//   "comma-spacing": 2,
//   "consistent-return": 2,
//   "curly": [2, "all"],
//   "dot-notation": [2, { "allowKeywords": true }],
//   "eol-last": 2,
//   "no-extra-parens": [2, "functions"],
//   "eqeqeq": 2,
//   "key-spacing": [2, { "beforeColon": false, "afterColon": true }],
//   "new-cap": 2,
//   "new-parens": 2,
//   "quotes": [2, "single"],
//   "semi": 2,
//   "semi-spacing": [2, {"before": false, "after": true}],
//   "space-infix-ops": 2,
//   "keyword-spacing": 2,
//   "space-unary-ops": [2, { "words": true, "nonwords": false }],
//   "strict": 2,
//   "radix": 2,
//   "yoda": [2, "never"]
// };

module.exports = function() {
  var config = {
    autoprefixer: {
      browsers: ['> 1%', 'last 4 versions', 'Firefox >= 20', 'iOS >=7'],
      cascade: false
    },
    scssOrder: ['**/app.scss'],
    jsOrder: ['**/app.js', '**/appConfig.js']
  };

  config.path = {};
  config.path.dev = 'dev';
  config.path.be = 'backend';
  config.path.dest = 'backend/public';
  config.path.pug = config.path.dev + '/**/*.pug';
  config.path.css = config.path.dev + '/**/*.scss';
  config.path.js = config.path.dev + '/**/!(*spec).js';
  config.path.assets = config.path.dev + '/files/**/*';
  config.path.ogvjs = 'bower_components/ogvjs-1.5.2/';

  return config;
};
