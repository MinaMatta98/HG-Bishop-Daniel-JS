import { gsap, ScrollTrigger } from 'gsap/all';
import $ from 'jquery';
import SplitType from 'split-type';

import { References } from '../references';
import { NavBarAnimations } from '../UI/navbar-animations';

export class BioAnimations {
  private static _navBarAnimator = new NavBarAnimations();

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

  private static loadCss = () => {
    $('html').css('overflow-x', 'unset !important');
    $('body').css('background', 'var(--cursor-inner)');
  };

  public static unloadCss = () => {
    $('html').css('overflow-x', 'unset');
    $('body').css('background', 'unset');
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
      const timelineItems: JQuery<HTMLElement> = $(References.bioClasses.timelineClass);
      $(timelineItems).each((index, item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 50%',
            end: 'top 10%',
            scrub: 2,
            immediateRender: false,
            onEnter: () => {
              ScrollTrigger.refresh();
              if (index > 0) {
                timelineItems[index - 1].style.opacity = '0.3';
              }
            },
            onEnterBack: () => {
              ScrollTrigger.refresh();
              gsap.to(item, { opacity: 1 });
            },
          },
          opacity: 0.3,
        });
      });
    });
  };

  private static animateBioLogo = (): void => {
    gsap.set(References.logoClasses.topLogoClass, { translateY: '-15em' });
    gsap.to(References.logoClasses.topLogoClass, { translateY: '0', duration: 3 });
  };

  public static animateBio = async () => {
    this.loadCss();
    this.animateBioLogo();
    this.animateHeading();
    this._navBarAnimator.animateScrollButton($(References.bioClasses.bioHeroClass));
    await this.animateTimeline();
  };
}
