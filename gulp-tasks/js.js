/**
 *
 * @param {object} path - path
 * @param gulp
 * @param {object} plugins - gulp plugins
 * @param {boolean} isDev - flag
 * @returns {Function} - return task
 */

module.exports = function (path, gulp, plugins, isDev) {
  return function () {
    return gulp.src(path.src.js)
      .pipe(plugins.plumber({
        errorHandler: plugins.notify.onError({
          message: '<%= error.message %>',
          title: 'JS Error!',
        }),
      }))
      .pipe(plugins.if(isDev, plugins.sourcemaps.init()))
      .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
      .pipe(plugins.include())
      .pipe(plugins.if(isDev, plugins.sourcemaps.write('../maps')))
      .pipe(plugins.if(!isDev, plugins.uglify()))
      .pipe(plugins.stripComments())
      .pipe(gulp.dest(path.build.js));
  };
};