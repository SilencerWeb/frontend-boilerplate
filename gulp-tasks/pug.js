/**
 *
 * @param {object} path - path
 * @param gulp
 * @param {object} plugins - gulp plugins
 * @param {object} global - global constiables
 * @param {boolean} dev - flag
 * @param {boolean} inline - flag
 * @returns {Function} - return task
 */

module.exports = function (path, gulp, plugins, global, dev, inline) {
  if (dev) {
    return function () {
      return new Promise(function (resolve, reject) {
        plugins.emitty.scan(global.changedStyleFile).then(function () {
          gulp.src(path.src.pug)
            .pipe(plugins.plumber({
              errorHandler: plugins.notify.onError({
                message: '<%= error.message %>',
                title: 'PUG Error!',
              }),
            }))
            .pipe(plugins.if(global.watch, plugins.emitty.filter(global.emittyChangedFile)))
            .pipe(plugins.pug({ pretty: true }))
            .pipe(gulp.dest(path.build.pug))
            .on('end', resolve)
            .on('error', reject);
        });
      });
    };
  } else {
    return function () {
      return gulp.src(path.src.pug)
        .pipe(plugins.plumber({
          errorHandler: plugins.notify.onError({
            message: '<%= error.message %>',
            title: 'PUG Error!',
          }),
        }))
        .pipe(plugins.pug())
        .pipe(plugins.htmlmin({ collapseWhitespace: true }))
        .pipe(plugins.stripComments())
        .pipe(gulp.dest(path.build.pug))
        .pipe(plugins.if(inline, plugins.inlineSource()))
        .pipe(plugins.if(inline, gulp.dest(path.build.pug)));
    };
  }
};