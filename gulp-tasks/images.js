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
    const png = gulp.src(path.src.images.png)
      .pipe(plugins.imagemin({
        use: [plugins.pngquant()],
      }))
      .pipe(gulp.dest(path.build.images));

    const jpg = gulp.src(path.src.images.jpg)
      .pipe(
        plugins.imagemin({
          progressive: true,
        }))
      .pipe(gulp.dest(path.build.images));

    const gif = gulp.src(path.src.images.gif)
      .pipe(plugins.imagemin({
        interlaced: true,
        optimizationLevel: 3,
      }))
      .pipe(gulp.dest(path.build.images));

    const svg = gulp.src(path.src.images.svg)
      .pipe(plugins.svgmin())
      .pipe(gulp.dest(path.build.images));

    return plugins.merge(png, jpg, gif, svg);
  };
};