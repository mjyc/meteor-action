Package.describe({
  name: 'meteor-action',
  version: '0.0.1',
  summary: 'Meteor package for action, an interface for preemptable tasks',
  git: 'https://github.com/mjyc/meteor-action',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.6');
  api.use('ecmascript');
  api.mainModule('action.js');
});
