const {Lint, Jasmine} = require('pui-react-tools');
Lint.install();
Jasmine.install({
  appGlobs: ['spec/app/*.js'],
  browserSpecRunnerOptions: {sourcemappedStacktrace: true}
});
