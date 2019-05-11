const loadSvgSprite = () => {
  if (typeof svgPaths !== 'undefined') {
    svgPaths.forEach((path) => {
      fetch(path)
        .then((response) => {
          return response.text().then((sprite) => {
            document.querySelector('.svg-sprite').innerHTML += sprite;
          });
        });
    });
  }
};