// import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import '../../public/animations.css';

import type { ITransitionData } from '@barba/core/dist/core/src/src/defs';
import { Flip, gsap, ScrollToPlugin, ScrollTrigger } from 'gsap/all';
import $ from 'jquery';
import type { IDisposableAnimations } from 'src/interfaces/IDisposableAnimations';
import type {
  IGsapComponentAnimations,
  IGsapPageAnimations,
} from 'src/interfaces/IGsapPageAnimations';
import { GsapComponentAnimations } from 'src/interfaces/IGsapPageAnimations';
import { GsapAnimations } from 'src/interfaces/IGsapPageAnimations';
import type { IMouseEventAnimations } from 'src/interfaces/IMouseEventAnimations';
import type { IPageAnimations } from 'src/interfaces/IPageAnimations';
import { GlobalPageAnimations } from 'src/interfaces/IPageAnimations';
import type { IResizePageAnimations } from 'src/interfaces/IResizePageAnimations';
import { Mapper } from 'src/utils/mapper';
import Swiper from 'swiper/bundle';

import { Utils } from '../../utils/utils';
import { Animations } from '../animations';
import { GlobeAnimation } from '../Components/globe';

class NewsAnimations implements IGsapComponentAnimations {
  pageElements: Map<string, JQuery<HTMLElement>>;

  private _articleCount: number;

  constructor(gsapAnimations: GsapAnimations) {
    this.gsapComponentAnimations = new GsapComponentAnimations(gsapAnimations);

    this.pageElements = new Mapper([
      '.news-colleciton-item',
      '.special',
      '.sticky-top',
      '.news-btn',
      '.agenda-item > div',
    ]).map();

    this._articleCount = this.pageElements.get('.news-colleciton-item').length;
  }

  gsapComponentAnimations: GsapComponentAnimations;

  animateComponent = () => {
    // Iterate over each article
    this.pageElements.get('.news-colleciton-item').each((index, article) => {
      // Calculate the font size based on the formula 2rem + 5rem * (index + 1)
      const topPosition = 7 + 6 * (index + 1) + 'rem';

      const bottomPosition = (this._articleCount - 1 - index) * 6 + 8 + 'rem';

      // Apply the calculated font size to each article
      article.style.top = topPosition;
      article.style.marginBottom = bottomPosition;
    });

    // Iterate over each article
    this.pageElements.get('.special').each((index, header) => {
      // Apply the calculated font size to each article
      header.innerText = '0' + (index + 1);
    });

    this.pageElements.get('.sticky-top').each((index, link) => {
      $(link).on('click', () => {
        this.scrollToSection(this.pageElements.get('.news-colleciton-item').get(index));
      });
    });

    this.pageElements.get('.news-btn').each((_, button) => {
      const { pageElements } = this;

      $(button).on('click', function () {
        const targetSlug = $(this).attr('target-slug');

        // Hide all direct children of agenda-item
        pageElements.get('.agenda-item > div').each((_, el) => {
          $(el).css('display', 'none');
        });

        const targetElement = $('#' + targetSlug);
        if (targetElement) {
          targetElement.css('display', 'block');
          targetElement[0].scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  };

  private scrollToSection = (element: HTMLElement) => {
    const offset = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  };
}

export class HomePageAnimations
  implements
    IPageAnimations,
    IGsapPageAnimations,
    IResizePageAnimations,
    IMouseEventAnimations,
    IDisposableAnimations
{
  private _globeAnimation: GlobeAnimation;

  private _globeTL: GSAPTween;

  private _scheduleAnimator: ScheduleAnimations;

  private _newsAnimator: NewsAnimations;

  private _openingHeroAnimator: OpeningHeroAnimations;

  gsapAnimations: GsapAnimations;

  pageElements: Map<string, JQuery<HTMLElement>>;

  supportAnimations: typeof GlobalPageAnimations;

  namespace: string;

  disposePageAnimations = () => {
    this._globeAnimation.dispose();
    this._globeAnimation.destroyGlobeBlockAnimation();
    this.gsapAnimations.disposePageAnimations();
  };

  private swiperAnimation = (): void => {
    const photoSwiper = new Swiper(this.pageElements.get('.swiper.is-photos')[0], {
      effect: 'cards',
      grabCursor: true,
      loop: true,
      keyboard: true,
      navigation: {
        nextEl: '.arrow.is-right',
        prevEl: '.arrow.is-left',
      },
    });
    const contentSwiper = new Swiper(this.pageElements.get('.swiper.is-content')[0], {
      speed: 0,
      loop: true,
      followFinger: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
    });
    photoSwiper.controller.control = contentSwiper;
    contentSwiper.controller.control = photoSwiper;
  };

  private hidePageLoader = async (initTime: number): Promise<void> => {
    const pageload = this.pageElements.get('.pageload');
    if (pageload.css('display') !== 'none') {
      const currentTime = new Date().getTime();

      await (currentTime - initTime < 2000
        ? Utils.sleep(2000 - (currentTime - initTime))
        : Promise.resolve());

      const tween = gsap.to(pageload, {
        display: 'none',
        delay: currentTime - initTime < 2000 ? 2 - (currentTime - initTime) / 1000 : 0,
      });

      this.gsapAnimations.newItem(tween);

      await tween;
    }
  };

  private gsapGlobeContainerExpand = () => {
    if (this._globeTL) {
      this.gsapAnimations.clearAnimation(this._globeTL);
      gsap.set(this.pageElements.get('.globe-container'), { maxWidth: '100vw', borderRadius: '0' });
    }

    this._globeTL = gsap.from(this.pageElements.get('.globe-container'), {
      scrollTrigger: {
        trigger: this.pageElements.get('.globe-container'),
        start: 'top 70%',
        end: 'top top',
        scrub: 1,
      },
      maxWidth: 1640,
      borderRadius: '3rem',
    });

    this.gsapAnimations.newItem(this._globeTL);
  };

  private initGlobe = () => {
    this._globeAnimation.init();
    this._globeAnimation.animateGlobeBlock();
    this.gsapGlobeContainerExpand();
  };

  onResizeHandler = () => {
    $(window).on('resize', () => {
      this._globeAnimation.animateGlobeBlock();
      this.gsapGlobeContainerExpand();
    });
  };

  onMouseEnterHandler = () => {
    this.pageElements
      .get('.sticky-image-container')
      .on('mouseenter', () => Animations.cursorWhite());
  };

  onMouseLeaveHandler = () => {
    this.pageElements
      .get('.sticky-image-container')
      .on('mouseenter', () => Animations.cursorBlue());
  };

  initElements = () => {
    this.namespace = 'home';
    this.supportAnimations = GlobalPageAnimations;
    this.gsapAnimations = new GsapAnimations();
    this._globeAnimation = new GlobeAnimation(true);
    this._scheduleAnimator = new ScheduleAnimations(this.gsapAnimations);
    this._newsAnimator = new NewsAnimations(this.gsapAnimations);
    this._openingHeroAnimator = new OpeningHeroAnimations(this.gsapAnimations);
    this.pageElements = new Mapper([
      '.pageload',
      '.globe-container',
      '.sticky-image-container',
      '.opening-hero',
      '.swiper.is-photos',
      '.swiper.is-content',
      '.arrow.is-right',
      '.arrow.is-left',
      '.cursor',
    ]).map();
  };

  once = async (_data: ITransitionData, isFirstLoad: boolean) => {
    const startTime = new Date().getTime();
    this.initElements();
    document.onreadystatechange = async () => {
      if (document.readyState === 'complete') {
        gsap.set(this.pageElements.get('.cursor'), { display: 'flex' });
        this.supportAnimations.progressBarAnimations.showProgress();
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Flip);
        ScrollTrigger.normalizeScroll(true);
        this.supportAnimations.navBarAnimations.initNavLinks();
        await this.afterEnter(_data, isFirstLoad, startTime);
        this.supportAnimations.cursorAnimations.cursorHover();
        this.supportAnimations.tocAnimations.tocAnimation();
      }
    };
    Utils.manualLoadRedirector(isFirstLoad);
  };

  afterEnter = async (_data: ITransitionData, isFirstLoad: boolean, initTime: number) => {
    $(async () => {
      if (isFirstLoad) {
        const pageLoadTween = gsap.set(this.pageElements.get('.pageload'), { display: 'flex' });
        this.gsapAnimations.newItem(pageLoadTween);
      }

      this.initElements();
      this.supportAnimations.logoAnimations.logoAnimation();
      this.supportAnimations.navBarAnimations.initNavLinks();
      this.initGlobe();
      this.onMouseEnterHandler();
      this.onMouseLeaveHandler();
      this.onResizeHandler();
      this.supportAnimations.navBarAnimations.animateScrollButton(
        this.pageElements.get('.opening-hero')
      );
      this._scheduleAnimator.animateScheduleContainer();
      this._scheduleAnimator.animateComponent();
      this._newsAnimator.animateComponent();
      this._openingHeroAnimator.animateProgressFade();
      await this.hidePageLoader(initTime);
      this.swiperAnimation();
      this._openingHeroAnimator.animateComponent();
    });
  };

  afterLeave = async (_data: ITransitionData) => {
    this.disposePageAnimations();
    this._globeTL = null;
  };

  beforeEnter = async (_data: ITransitionData) => {};
}

class ScheduleAnimations implements IGsapComponentAnimations {
  pageElements: Map<string, JQuery<HTMLElement>>;

  gsapComponentAnimations: GsapComponentAnimations;

  constructor(gsapAnimations: GsapAnimations) {
    this.gsapComponentAnimations = new GsapComponentAnimations(gsapAnimations);
    this.pageElements = new Mapper(['.slide-block', '.sticky-image-container']).map();
  }

  animateScheduleContainer = () => {
    const blocks: JQuery<HTMLElement> = this.pageElements.get('.slide-block');

    $(blocks).each((_, block) => {
      const tween = gsap.from(block, {
        scrollTrigger: {
          trigger: block,
          start: 'top 60%',
          end: 'top 30%',
          scrub: 1,
        },
        translateY: 100,
        opacity: 0,
      });
      this.gsapComponentAnimations.newItem(tween);
    });
  };

  public animateComponent = () => {
    const sideBlocks = this.pageElements.get('.slide-block');
    const stickyImageContainer = this.pageElements.get('.sticky-image-container');
    const children = stickyImageContainer.children();

    sideBlocks.each((index, block) => {
      const parentTween = gsap.from(children[index], {
        scrollTrigger: {
          trigger: block,
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: true,
          onEnter: () => {
            const childTween = gsap.set(children[index], { display: 'block' });
            const childTweenSec = gsap.from(children[index], {
              opacity: 0,
              duration: 1,
              translateY: 10,
            });
            const neighbours = children.slice(0, index).extend(children.slice(index + 1));
            const childTweenLast = gsap.set(neighbours, { display: 'none' });
            this.gsapComponentAnimations.newItems([childTween, childTweenSec, , childTweenLast]);
          },
          onLeave: () => {
            this.gsapComponentAnimations.newItem(gsap.set(children[index], { display: 'none' }));
          },
          onEnterBack: () => {
            const childTween = gsap.set(children[index], { display: 'block' });
            const childTweenSec = gsap.from(children[index], {
              opacity: 0,
              duration: 1,
              translateY: 10,
            });
            const neighbours = children.slice(0, index).extend(children.slice(index + 1));
            const childTweenLast = gsap.set(neighbours, { display: 'none' });
            this.gsapComponentAnimations.newItems([childTween, childTweenSec, childTweenLast]);
          },
        },
        marginBottom: '20em',
      });
      this.gsapComponentAnimations.newItem(parentTween);
    });
  };
}

class OpeningHeroAnimations implements IGsapComponentAnimations {
  pageElements: Map<string, JQuery<HTMLElement>>;

  gsapComponentAnimations: GsapComponentAnimations;

  constructor(gsapAnimations: GsapAnimations) {
    this.gsapComponentAnimations = new GsapComponentAnimations(gsapAnimations);
    this.pageElements = new Mapper([
      '.opening-hero',
      '.progress',
      '.ths07-logo',
      '.video-image',
      '.hero-heading',
    ]).map();
  }

  animateProgressFade = () => {
    const duration = 0.5;
    const progress = this.pageElements.get('.progress');
    const tween = gsap.from(progress, {
      scrollTrigger: {
        trigger: this.pageElements.get('.opening-hero'),
        start: 'top top',
        end: 'bottom top',
        onEnter: () => {
          this.gsapComponentAnimations.newItem(gsap.to(progress, { opacity: 0, duration }));
        },
        onEnterBack: () => {
          this.gsapComponentAnimations.newItem(gsap.to(progress, { opacity: 0, duration }));
        },
        onLeave: () => {
          this.gsapComponentAnimations.newItem(gsap.to(progress, { opacity: 1, duration }));
        },
      },
      opacity: 0,
      duration: 0.5,
    });
    this.gsapComponentAnimations.newItem(tween);
  };

  animateComponent = async () => {
    const heading = this.pageElements.get('.hero-heading');
    const videoImage = this.pageElements.get('.video-image');
    const logo = this.pageElements.get('.ths07-logo');

    gsap.set(logo, { translateY: '-15em' });
    gsap.set(videoImage, { opacity: 0, translateY: 150 });
    gsap.set(heading, { opacity: 0, translateY: 150 });

    gsap.to(videoImage, { opacity: 1, duration: 0.5 });
    gsap.to(videoImage, { translateY: 0, duration: 4 });
    await gsap.to(logo, { translateY: '0', duration: 3 });

    gsap.to(heading, { opacity: 1, duration: 0.5 });
    await gsap.to(heading, { translateY: 0, duration: 3 });

    gsap.to(heading, { opacity: 0, duration: 1 });
    await gsap.to(videoImage, { opacity: 0, duration: 1 });
  };
}
