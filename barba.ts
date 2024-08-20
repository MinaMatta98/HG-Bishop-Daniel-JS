import barba from '@barba/core';

import { Animations } from './animations/animations';
import { References } from './animations/references';
import { Utils } from './utils/utils';

export const barbaInit = () => {
  let startTime: number;
  let isFirstLoad: boolean = true;

  barba.init({
    transitions: [
      {
        sync: true,
        name: 'default',
        async once(data) {
          if (data.next.namespace === 'home') {
            Animations.displayShow(References.transitionClasses.pageLoadClass, true, 'flex');
            startTime = new Date().getTime();
            await Utils.InitPage(startTime);
            Animations.initGlobe();
            Animations.initScrollSection();
          }
          Utils.manualLoadRedirector(isFirstLoad);
          Utils.initStats();
        },
        async leave(data) {
          data.next.container.style.display = 'none';
          Animations.disableNavLinks();
          await Animations.handleTransitionAnimation(true);
          Animations.underlineNav(data.current.namespace, false);
        },
        async enter(_data) {
          Utils.linkHandler();
        },
        async after(data) {
          data.next.namespace !== 'ministry'
            ? (data.next.container.style.display = 'block')
            : (data.next.container.style.display = 'flex');
          Animations.enableNavLinks();
          await Animations.handleTransitionAnimation(false);
          await Animations.underlineNav(data.next.namespace, true);
          isFirstLoad = false;
        },
      },
    ],
    views: [
      {
        namespace: 'home',
        async afterEnter() {
          if (!isFirstLoad) await Utils.swiperHandler(startTime);

          $(() => {
            Animations.logoAnimation();
            Animations.initNavLinks();
            Animations.animateScrollButton();
          });
        },
      },
      {
        namespace: 'bio',
        async afterLeave() {
          Animations.cursorBlue();
        },
        async afterEnter() {
          Animations.cursorWhite();
        },
      },
      {
        namespace: 'ministry',
        async afterLeave() {
          Animations.cursorBlue();
        },
        async afterEnter() {
          await Utils.globeScriptHandler();
          Animations.cursorWhite();
          Animations.handleMinistrySlider();
          Animations.setOpaque(References.ministryPageClasses.globeAttributeSelector);
        },
      },
    ],
  });
  barba.hooks.after(async (data) => {
    Utils.scriptReloader(data);
  });
};
