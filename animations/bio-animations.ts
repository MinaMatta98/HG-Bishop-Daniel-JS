import gsap from 'gsap/all';
import SplitType from 'split-type';

import { References } from './references';

export class BioAnimations {
  private static splitText = (text: SplitType) => {
    const bioHeading: JQuery<HTMLElement> = $(References.bioClasses.headingClass);
    text = new SplitType(bioHeading, { types: ['words', 'lines'] });

    $(text.lines).each((_, element) => {
      $(element).append('<div class="line-mask"></div>');
      const target = $(element).find('.line-mask');

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
        },
      });

      timeline.from(target, { width: '100%', duration: 1 });
    });
  };

  private static animateHeading = (): void => {
    let splitHeading: SplitType;

    $(() => this.splitText(splitHeading));

    $(window).on('resize', () => {
      if (splitHeading) splitHeading.revert();
      this.splitText(splitHeading);
    });
  };

  private static animateTimeline = async (): Promise<void> => {
    $(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      }).then(() => {
        const timelineItems: JQuery<HTMLElement> = $(References.bioClasses.timelineClass);
        $(timelineItems).each((_, item) => {
          gsap.from(item, {
            scrollTrigger: {
              trigger: item,
              start: 'top 50%',
              end: 'top 20%',
              scrub: 1,
            },
            opacity: 0.3,
          });
        });
      });
    });
  };

  private static animateBioLogo = (): void => {
    gsap.set(References.logoClasses.topLogoClass, { translateY: '-15em' });
    gsap.to(References.logoClasses.topLogoClass, { translateY: '0', duration: 3 });
  };

  public static animateBio = async () => {
    this.animateBioLogo();
    this.animateHeading();
    await this.animateTimeline();
  };
}
