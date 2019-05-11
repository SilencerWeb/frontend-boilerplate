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
    const main = gulp.src(path.src.js.main)
      .pipe(plugins.plumber({
        errorHandler: plugins.notify.onError({
          message: '<%= error.message %>',
          title: 'JS Error!',
        }),
      }))
      .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
      .pipe(plugins.concat('bundle.js'))
      .pipe(plugins.stripComments())
      .pipe(plugins.if(!isDev, plugins.uglify()))
      .pipe(gulp.dest(path.build.js));

    const vendor = gulp.src(path.src.js.vendor)
      .pipe(plugins.plumber({
        errorHandler: plugins.notify.onError({
          message: '<%= error.message %>',
          title: 'JS Error!',
        }),
      }))
      .pipe(plugins.concat('vendor.js'))
      .pipe(gulp.dest(path.build.js));

    return plugins.merge(main, vendor);
  };
};