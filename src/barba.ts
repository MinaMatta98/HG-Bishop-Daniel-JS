import barba from '@barba/core';
import { Flip, gsap, ScrollToPlugin, ScrollTrigger } from 'gsap/all';

import { Animations } from './animations/animations';
import { Utils } from './utils/utils';

export class barbaInit {
  private isFirstLoad: boolean = true;

  private animations: Animations;

  /**
   *
   */
  constructor() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Flip);
    this.animations = new Animations();
  }

  public init = () => {
    let { animations, isFirstLoad } = this;
    barba.init({
      transitions: [
        {
          sync: true,
          name: 'default',
          async once(data) {
            await animations.once(data, isFirstLoad);
            Utils.manualLoadRedirector(isFirstLoad);
            isFirstLoad = false;
          },
          async before(data) {
            await animations.before({ data });
          },
          async leave(data) {
            await animations.leave({ data });
          },
          async enter(data) {
            await animations.enter({ data });
          },
          async after(data) {
            await animations.after({ data });
          },
          async beforeEnter(data) {
            await animations.beforeEnter(data);
          },
          async beforeLeave(data) {
            await animations.beforeLeave(data);
          },
          async afterEnter(data) {
            await animations.afterEnter(data);
          },
          async afterLeave(data) {
            await animations.afterLeave(data);
          },
        },
      ],
    });
    barba.hooks.after(async (data) => {
      Utils.scriptReloader(data);
    });
  };
}
