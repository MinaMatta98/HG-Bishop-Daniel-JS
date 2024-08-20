import { gsap, ScrollTrigger } from 'gsap/all';

import { References } from './references';

export class ScrollSection {
  public static initAnimation = () => {
    const blocks: JQuery<HTMLElement> = $(References.homePageClasses.slideBlockClass);
    const wrapper: JQuery<HTMLElement> = $(References.homePageClasses.scheduleWrapper);
    console.log('scroll');

    blocks.each((index, element) => {
      switch (index) {
        case 0:
          gsap.from(element, {
            scrollTrigger: {
              trigger: wrapper,
              start: 'top top',
              markers: true,
            },
          });
        case 1:

        case 2:
      }
    });
  };
}
