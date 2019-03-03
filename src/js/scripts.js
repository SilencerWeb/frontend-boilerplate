const onDOMReady = (callback) => {
  document.readyState === 'interactive' || document.readyState === 'complete' ? callback() : document.addEventListener('DOMContentLoaded', callback);
};

const addEventListeners = (elements, event, callback) => {
  document.querySelectorAll(elements).forEach((element) => {
    element.addEventListener(event, callback);
  });
};

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


onDOMReady(() => {
  loadSvgSprite();
});