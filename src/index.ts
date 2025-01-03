import $ from 'jquery';

import { barbaInit } from './barba';

export const DOMAIN = window.location.origin;

const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      if ($('.main-wrapper').length) {
        const barba = new barbaInit();
        barba.init();
        observer.disconnect();
        break;
      }
    }
  }
});

observer.observe($(document.documentElement)[0], { childList: true, subtree: true });
