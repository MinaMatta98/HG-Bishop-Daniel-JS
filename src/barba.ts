import barba from '@barba/core';
import type { ITransitionData } from '@barba/core/dist/core/src/src/defs';
import { restartWebflow } from '@finsweet/ts-utils';
import { Flip, gsap, ScrollToPlugin, ScrollTrigger } from 'gsap/all';

import { Animations } from './animations/animations';
import { DOMAIN } from './index';
import { Stats } from './utils/sentry';

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
    const { animations, isFirstLoad, manualLoadRedirector } = this;

    barba.init({
      transitions: [
        {
          sync: true,
          name: 'default',
          async once(data) {
            await animations.once(data, isFirstLoad);
            manualLoadRedirector();
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
      await this.scriptReloader(data);
    });
  };

  public static sleep = async (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  public scriptReloader = async (data: ITransitionData): Promise<void> => {
    const js = data.next.container.querySelectorAll('script');
    js ? js.forEach((item) => eval(item.innerHTML)) : null;
    await restartWebflow();
    //window.dispatchEvent(new Event('resize'));
  };

  public initStats = () => {
    Stats.init();
  };

  public manualLoadRedirector = (): void => {
    // Timeout interval ensures no hanging on chrome browser engine
    if (this.isFirstLoad && window.location.href !== DOMAIN) {
      setTimeout(() => {
        console.warn('Redirecting due to illegal access');
        window.location.replace(DOMAIN);
      }, 10);
    }
  };
}
