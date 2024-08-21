import { gsap } from 'gsap/all';

import { References } from './references';

export class ScrollSection {
  public static initAnimation = () => {
    //const wrapper: JQuery<HTMLElement> = $(References.homePageClasses.scheduleWrapper);
    const blocks: JQuery<HTMLElement> = $(References.homePageClasses.slideBlockClass);

    $(blocks).each((_, block) => {
      gsap.from(block, {
        scrollTrigger: {
          trigger: block,
          start: 'top 60%',
          end: 'top 30%',
          scrub: 1,
        },
        translateY: 100,
        opacity: 0,
      });
    });
  };
}
