var Metalsmith = require('metalsmith'),
    layouts    = require('metalsmith-layouts'),
    permalinks = require('metalsmith-permalinks'),
    markdown   = require('metalsmith-markdown'),
    assets     = require('metalsmith-assets'),
    ignore     = require('metalsmith-ignore'),
    msIf       = require('metalsmith-if'),
    serve      = require('metalsmith-serve'),
    watch      = require('metalsmith-watch');

var devBuild = ((process.env.NODE_ENV || '').trim().toLowerCase() === 'dev');
console.log("devBuild is " + devBuild);

var site = Metalsmith(__dirname)
  .metadata({
      devBuild: devBuild
  })
  .source('./src')
  .destination('./build')
  .clean(false)
  .use(markdown())
  .use(permalinks())
  .use(assets({
    source: './node_modules/bulma/css',
    destination: './assets/css'
  }))
  .use(ignore([
    'lib/**'
  ]))
  .use(layouts({
    engine: 'handlebars'
  }))
  .use(msIf(
    // enabled only when devBuild is true
    devBuild,
    serve({
      host: '0.0.0.0',
      port: 8080
  })))
  .use(msIf(
    // enabled only when devBuild is true
    devBuild,
    watch({
      paths: {
        '${source}/**/*': "**/*",
        './layouts/**/*': "**/*",
        './index.js': "**/*"
      },
      livereload: devBuild
  })))
  .build(function(err, files) {
    if (err) {
      throw err;
    }
  });

