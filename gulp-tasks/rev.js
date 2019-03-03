/**
 *
 * @param {object} path - path
 * @param gulp
 * @param {object} plugins - gulp plugins
 * @returns {Function} - return task
 */

module.exports = function (path, gulp, plugins) {
  return function () {
    return gulp.src(path.rev)
      .pipe(plugins.plumber({
        errorHandler: plugins.notify.onError({
          message: '<%= error.message %>',
          title: 'REV Error!',
        }),
      }))
      .pipe(plugins.rev())
      .pipe(gulp.dest(function (file) {
        return file.base;
      }))
      .pipe(plugins.revDeleteOriginal())
      .pipe(plugins.rev.manifest())
      .pipe(gulp.dest(path.build.pug))
      .on('end', function () {
        const manifest = gulp.src('dist/rev-manifest.json');

        return gulp.src(path.revReplace)
          .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError({
              message: '<%= error.message %>',
              title: 'REV Error!',
            }),
          }))
          .pipe(plugins.revRewrite({ manifest: manifest }))
          .pipe(gulp.dest(function (file) {
            return file.base;
          }))
          .on('end', function () {
            plugins.del('dist/rev-manifest.json');
          });
      });
  };
};