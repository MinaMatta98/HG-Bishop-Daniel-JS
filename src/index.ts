import $ from 'jquery';

import { barbaInit } from './barba';

const containerSelector = '.main-wrapper';

export const DOMAIN = 'https://hg-bishop-daniels-website.webflow.io/';

const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      if ($(containerSelector).length) {
        const barba = new barbaInit();
        barba.init();
        observer.disconnect();
        break;
      }
    }
  }
});

observer.observe($(document.documentElement)[0], { childList: true, subtree: true });
