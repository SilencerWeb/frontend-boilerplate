/**
 *
 * @param gulp
 * @param {object} plugins - gulp plugins
 * @returns {Function} - return task
 */

module.exports = function (gulp, plugins) {
  return function () {
    return plugins.del('dist/**');
  };
};