import $ from 'jquery';

const NAVBAR_HEIGHT = 56;

$(document).ready(() => {
  const changeSection = document.querySelector('.main-content');
  const main = document.querySelector('.mdl-layout__content');

  main.onscroll = function scrollSpy() {
    const scrollPosition = changeSection.getBoundingClientRect().top;
    if (scrollPosition < (0 + NAVBAR_HEIGHT)) {
      $('.mdl-layout__header').removeClass('mdl-layout__header--transparent');
    } else {
      $('.mdl-layout__header').addClass('mdl-layout__header--transparent');
    }
  };
});
