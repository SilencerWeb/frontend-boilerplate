const gulp = require('gulp'),
  plugins = require('gulp-load-plugins')(),
  browserSync = require('browser-sync');

plugins.emitty = require('emitty').setup('src', 'pug');
plugins.path = require('path');
plugins.merge = require('merge-stream');
plugins.del = require('del');
plugins.gpath = require('path');
plugins.pngquant = require('imagemin-pngquant');

global.svgFileName = undefined;

const serverConfig = { // Config for browser-sync
  server: {
    baseDir: './dist',
    serveStaticOptions: {
      extensions: ['html'],
    },
  },
  ui: false,
  host: 'localhost',
  port: 3000,
  open: false,
  notify: false,
  ReloadOnRestart: true,
  ghostMode: {
    clicks: false,
    forms: false,
    scroll: false,
  },
};

const path = {
  svg: {
    svgFiles: './src/svg/**/*.svg',
    unnecessary: 'unnecessary-svg/svg-sprite.svg',
    template: './src/sass/templates/_template_svg.sass',
    templateDest: 'sass/parts/_sprite.sass',
  },
  build: {
    pug: 'dist',
    sass: 'dist/css',
    js: 'dist/js',
    fonts: 'dist/fonts',
    images: 'dist/images',
    videos: 'dist/videos',
    server: 'dist/server',
  },
  src: {
    pug: 'src/*.pug',
    sass: [
      'src/sass/*.sass',
      'src/sass/*.scss',
    ],
    js: './src/js/*.js',
    fonts: 'src/fonts/**/*.*',
    images: {
      png: 'src/images/**/*.png',
      jpg: 'src/images/**/*.jpg',
      gif: 'src/images/**/*.gif',
      svg: 'src/images/**/*.svg',
    },
    videos: 'src/videos/**/*',
    server: 'src/server/**/*',
  },
  watch: {
    svgFiles: './src/svg/**/*.svg',
    pug: 'src/**/*.pug',
    sass: [
      'src/sass/**/*.sass',
      'src/sass/**/*.scss',
    ],
    js: 'src/js/**/*.js',
    fonts: 'src/fonts/**/*.*',
    images: 'src/images/**/*.*',
    videos: 'src/videos/**/*',
    server: 'src/server/**/*',
  },
  rev: [
    'dist/css/**/*.css',
    'dist/js/**/*.js',
    'dist/images/**/*',
  ],
  revReplace: [
    'dist/**/*.html',
    'dist/css/**/*.css',
  ],
};

gulp.task('webserver', function () {
  browserSync(serverConfig);
});

gulp.task('reload', function (callback) {
  browserSync.reload();
  callback();
});

gulp.task('clean-dist', function () {
  return plugins.del('dist');
});

gulp.task('clean-cache', function (done) {
  return plugins.cache.clearAll(done);
});

gulp.task('pug:dev', require('./gulp-tasks/pug')(path, gulp, plugins, global, true, false));
gulp.task('pug:prod', require('./gulp-tasks/pug')(path, gulp, plugins, global, false, false));
gulp.task('pug:prod:inline', require('./gulp-tasks/pug')(path, gulp, plugins, global, false, true));

gulp.task('sass:dev', require('./gulp-tasks/sass')(path, gulp, plugins, true));
gulp.task('sass:prod', require('./gulp-tasks/sass')(path, gulp, plugins, false));

gulp.task('js:dev', require('./gulp-tasks/js')(path, gulp, plugins, true));
gulp.task('js:prod', require('./gulp-tasks/js')(path, gulp, plugins, false));

gulp.task('images:dev', require('./gulp-tasks/images')(path, gulp, plugins, true));
gulp.task('images:prod', require('./gulp-tasks/images')(path, gulp, plugins, false));

gulp.task('svg-styles', require('./gulp-tasks/svg-styles')(path, gulp, plugins));
gulp.task('svg-store', require('./gulp-tasks/svg-store')(path, gulp, plugins, svgFileName));

gulp.task('fonts', require('./gulp-tasks/transfer')(gulp, plugins, path.src.fonts, path.build.fonts));
gulp.task('videos', require('./gulp-tasks/transfer')(gulp, plugins, path.src.videos, path.build.videos));
gulp.task('server', require('./gulp-tasks/transfer')(gulp, plugins, path.src.server, path.build.server));

gulp.task('rev', require('./gulp-tasks/rev')(path, gulp, plugins));

gulp.task('watch', function () {
  global.watch = true;

  gulp.watch(path.watch.pug, gulp.series('pug:dev', 'reload'));
  // .on('all', function (event, filePath) {
  //   global.emittyChangedFile = filePath;
  // });

  gulp.watch(path.watch.sass, gulp.series('sass:dev', 'reload'));
  gulp.watch(path.watch.js, gulp.series('js:dev', 'reload'));
  gulp.watch(path.watch.images, gulp.series('images:dev', 'reload'));
  gulp.watch(path.watch.fonts, gulp.series('fonts', 'reload'));
  gulp.watch(path.watch.videos, gulp.series('videos', 'reload'));
  gulp.watch(path.watch.server, gulp.series('server', 'reload'));

  gulp.watch(path.watch.svgFiles, gulp.series('svg-styles', 'svg-store', 'sass:dev', 'reload'))
    .on('all', function (event, filePath) {
      console.log(filePath);
      const regexp = /.*[\/\\]([^_]+)/;
      const match = regexp.exec(filePath);
      global.svgFileName = match[1];
    });
});

gulp.task('build:dev', gulp.series(
  'clean-dist',
  'svg-styles',
  'svg-store',
  'sass:dev',
  'js:dev',
  'pug:dev',
  gulp.parallel(
    'fonts',
    'videos',
    'server',
    'images:dev',
  ),
));

gulp.task('build:prod', gulp.series(
  'clean-dist',
  'svg-styles',
  'svg-store',
  'sass:prod',
  'js:prod',
  'pug:prod',
  gulp.parallel(
    'fonts',
    'videos',
    'server',
    'images:prod',
  ),
));

gulp.task('build:prod:inline', gulp.series(
  'clean-dist',
  'svg-styles',
  'svg-store',
  'sass:prod',
  'js:prod',
  'pug:prod:inline',
  gulp.parallel(
    'fonts',
    'videos',
    'server',
    'images:prod',
  ),
));

gulp.task('build:prod:rev', gulp.series(
  'clean-dist',
  'svg-styles',
  'svg-store',
  'sass:prod',
  'js:prod',
  'pug:prod',
  gulp.parallel(
    'fonts',
    'videos',
    'server',
    'images:prod',
  ),
  'rev',
));

gulp.task('build:prod:inline:rev', gulp.series(
  'clean-dist',
  'svg-styles',
  'svg-store',
  'sass:prod',
  'js:prod',
  'pug:prod:inline',
  gulp.parallel(
    'fonts',
    'videos',
    'server',
    'images:prod',
  ),
  'rev',
));

gulp.task('dev', gulp.series(
  'build:dev',
  gulp.parallel('watch', 'webserver'),
));

gulp.task('build', gulp.series(
  'build:prod',
));

gulp.task('build:inline', gulp.series(
  'build:prod:inline',
));

gulp.task('build:rev', gulp.series(
  'build:prod:rev',
));

gulp.task('build:inline:rev', gulp.series(
  'build:prod:inline:rev',
));

gulp.task('build:rev:inline', gulp.series(
  'build:prod:inline:rev',
));

gulp.task('default', gulp.series(
  'dev',
));