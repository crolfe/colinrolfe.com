var Metalsmith = require('metalsmith'),
    layouts    = require('metalsmith-layouts'),
    permalinks = require('metalsmith-permalinks'),
    markdown   = require('metalsmith-markdown'),
    assets     = require('metalsmith-assets'),
    ignore     = require('metalsmith-ignore'),
    serve      = require('metalsmith-serve'),
    watch      = require('metalsmith-watch');

var devBuild = ((process.env.NODE_ENV || '').trim().toLowerCase() === 'dev');
console.log("devBuild is " + devBuild);

Metalsmith(__dirname)
  .metadata({
        title: "My Static Site & Blog",
        description: "It's about saying »Hello« to the World.",
        generator: "Metalsmith",
        url: "http://www.metalsmith.io/",
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
  .use(serve({
    host: '0.0.0.0',
    port: 8080
  }))
  .use(watch({
    paths: {
      '${source}/**/*': "**/*",
      './layouts/**/*': "**/*",
      './index.js': "**/*"
    },
    livereload: true
  }))
  .build(function(err, files) {
    if (err) {
      throw err;
    }
  });

