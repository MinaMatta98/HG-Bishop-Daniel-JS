import barba from '@barba/core';

import { Animations, DisposeAnimations } from './animations/animations';
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
            startTime = new Date().getTime();
            await Utils.InitWebsite(startTime, isFirstLoad);
          }
          Utils.manualLoadRedirector(isFirstLoad);
          //Utils.initStats();
        },
        async leave(data) {
          data.next.container.style.display = 'none';
          Animations.disableNavLinks();
          await Animations.handleTransitionAnimation(true);
          Animations.underlineNav(data.current.namespace, false);
          //gsap.globalTimeline.clear();
        },
        async enter(_data) {
          Utils.linkHandler();
        },
        async after(data) {
          Animations.animateToc();

          switch (data.next.namespace.toString()) {
            case 'sermons-content':
              data.next.container.style.display = 'flex';
              break;
            default:
              data.next.container.style.display = 'block';
          }

          Animations.enableNavLinks();
          Animations.showProgress();
          await Animations.handleTransitionAnimation(false);
          await Animations.underlineNav(data.next.namespace, true);
          Animations.cursorHover();
          isFirstLoad = false;
        },
      },
      {
        sync: true,
        name: 'specific',
        from: { namespace: ['bio'] },
        to: { namespace: 'home' },
        async after(data) {
          data.next.container.style.display = 'block';
          Animations.animateToc();
          Animations.footerAnimateWhite();
          Animations.showProgress();
          await Animations.handleTransitionAnimation(false);
          await Animations.underlineNav(data.next.namespace, true);
        },
        async leave(data) {
          data.next.container.style.display = 'none';
          await Animations.handleTransitionAnimation(true);
          Animations.underlineNav(data.current.namespace, false);
        },
      },
    ],
    views: [
      {
        namespace: 'home',
        async afterEnter() {
          $(async () => {
            await Animations.initHomePage(startTime, isFirstLoad);
            Animations.initNavLinks();
          });
        },
        beforeLeave() {
          DisposeAnimations.disposeHomepageGlobe();
          DisposeAnimations.disposeHomepageAnimations();
        },
      },
      {
        namespace: 'bio',
        async afterLeave() {
          Animations.cursorBlue();
        },
        async afterEnter() {
          await Animations.animateBio();
          Animations.cursorWhite();
          Animations.footerAnimateBlue();
        },
      },
      {
        namespace: 'sermons',
        async afterLeave() {
          Animations.cursorBlue();
        },
        async afterEnter() {
          Animations.initSermonPage();
          Animations.cursorBlue();
          Animations.footerAnimateBlue();
        },
      },
      {
        namespace: 'ministry',
        async afterLeave() {
          Animations.cursorBlue();
          Animations.disposeAnimations.disposeMinistrypageGlobe();
        },
        async afterEnter() {
          Animations.initMinistryPage();
        },
      },
      {
        namespace: 'churches',
        async afterEnter() {
          Animations.initChurchesPage();
        },
      },
      {
        namespace: 'churches-content',
        async beforeEnter() {
          Animations.footerAnimateWhite();
        },
        async afterEnter() {
          Animations.initChurchContentPage();
        },
        async beforeLeave() {
          Animations.disposeAnimations.disposeChurchLeaderLine();
        },
      },
      {
        namespace: 'sermons-content',
        async beforeEnter() {
          Animations.footerAnimateWhite();
        },
        async afterEnter() {
          Animations.initSermonsContentPage();
        },
        async beforeLeave() {},
      },
    ],
  });
  barba.hooks.after(async (data) => {
    Utils.scriptReloader(data);
  });
};
