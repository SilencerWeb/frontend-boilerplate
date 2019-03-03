/**
 *
 * @param gulp
 * @param {object} plugins - gulp plugins
 * @param {string} src - source path
 * @param {string} dest - destination path
 * @returns {Function} - return task
 */

module.exports = function (gulp, plugins, src, dest) {
  return function () {
    return gulp.src(src)
      .pipe(plugins.plumber({
        errorHandler: plugins.notify.onError({
          message: '<%= error.message %>',
          title: 'TRANSFER Error!',
        }),
      }))
      .pipe(gulp.dest(dest));
  };
};