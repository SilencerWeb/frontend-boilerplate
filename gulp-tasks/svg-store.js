/**
 *
 * @param {object} path - path
 * @param gulp
 * @param {object} plugins - gulp plugins
 * @returns {Function} - return task
 */

module.exports = function (path, gulp, plugins) {
  return function () {
    let svgSpritesName = ['sprite'];

    if (global.svgFileName !== undefined) {
      svgSpritesName = [global.svgFileName];
    }

    const svgStoreMerge = plugins.merge();

    svgSpritesName.forEach(function (item) {
      svgStoreMerge.add(gulp.src('./src/svg/**/' + item + '_*.svg')
        .pipe(plugins.svgmin(function (file) {
          const prefix = plugins.gpath.basename(file.relative, plugins.gpath.extname(file.relative));
          return {
            plugins: [{
              cleanupIDs: {
                prefix: prefix + '-',
                minify: true,
              },
            }],
          };
        })) // Optimize svg-files
        .pipe(plugins.cheerio({
          run: function ($) {
            $('[fill]').removeAttr('fill');
            $('[style]').removeAttr('style');
            $('[class]').removeAttr('class');
          },
          parserOptions: { xmlMode: true },
        }))
        .pipe(plugins.replace('&gt;', '>'))
        .pipe(plugins.svgstore({ inlineSvg: true }))
        .pipe(plugins.rename({
          basename: item,
          suffix: '_icons',
          extname: '.svg',
        }))
        .pipe(gulp.dest(path.build.images)))
        .on('end', function () {
          plugins.del(['src/unnecessary-svg']);
        });
    });

    return svgStoreMerge;
  };
};