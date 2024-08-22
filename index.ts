import $ from 'jquery';

import { barbaInit } from './barba';

for (let index = 0; index < 10; index++) {
  console.log(index);
}

const containerSelector = '.main-wrapper';

export const DOMAIN = 'https://hg-bishop-daniels-website.webflow.io/';

const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      if ($(containerSelector).length) {
        barbaInit();
        observer.disconnect();
        break;
      }
    }
  }
});

observer.observe($(document.documentElement)[0], { childList: true, subtree: true });
