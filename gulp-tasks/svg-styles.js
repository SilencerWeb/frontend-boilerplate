/**
 *
 * @param {object} path - path
 * @param gulp
 * @param {object} plugins - gulp plugins
 * @returns {Function} - return task
 */

module.exports = function (path, gulp, plugins) {
  return function () {
    const config = {
      dest: '.',
      mode: {
        css: {
          dest: '.',
          prefix: '\&_%s',
          dimensions: '%s',
          sprite: path.svg.unnecessary,
          render: {
            sass: {
              template: path.svg.template,
              dest: path.svg.templateDest,
            },
          },
        },
      },
    };

    return gulp.src(path.svg.svgFiles)
      .pipe(plugins.plumber({
        errorHandler: plugins.notify.onError({
          message: '<%= error.message %>',
          title: 'SVG SASS Error!',
        }),
      }))
      .pipe(plugins.svgSprite(config))
      .pipe(plugins.replace('&amp;', '&'))
      .pipe(gulp.dest('./src'));
  };
};