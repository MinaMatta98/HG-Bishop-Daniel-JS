import { gsap, ScrollTrigger } from 'gsap/all';

import { References } from './references';

export class ScrollSection {
  public static initAnimation = () => {
    const wrapper: JQuery<HTMLElement> = $(References.homePageClasses.scheduleWrapper);
    const blocks: JQuery<HTMLElement> = $(References.homePageClasses.slideBlockClass);

    blocks.each((index, element) => {
      console.log((index + 1) * 80 + 'vh');
      switch (index) {
        case 0:
          gsap.from(element, {
            scrollTrigger: {
              trigger: element,
              start: 'top top',
              end: 'bottom +=50%',
              markers: true,
              scrub: true,
            },
            height: '80vh',
            ease: 'linear',
          });
        case 1:
          gsap.from(element, {
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              end: 'top 45%',
              markers: true,
              scrub: true,
            },
            height: '80vh',
            ease: 'linear',
          });
        default:
          gsap.set(element, { height: '80vh' });
      }
      //     switch (index) {
      //       case 0:
      //});
      //case 1:
      //  gsap.from(element, {
      //    scrollTrigger: {
      //      trigger: wrapper,
      //      start: 'top top',
      //      markers: true,
      //    },
      //  });
      //
      //case 2:
      //}
    });
  };
}
