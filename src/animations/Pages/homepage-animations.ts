// import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import '../../public/animations.css';

import type { ITransitionData } from '@barba/core/dist/core/src/src/defs';
import { getGPUTier, type TierResult } from 'detect-gpu';
import { gsap, ScrollTrigger } from 'gsap/all';
import $ from 'jquery';
import { barbaInit } from 'src/barba';
import type { IDisposableAnimations } from 'src/interfaces/IDisposableAnimations';
import type {
  IGsapComponentAnimations,
  IGsapPageAnimations,
} from 'src/interfaces/IGsapPageAnimations';
import { GsapComponentAnimations } from 'src/interfaces/IGsapPageAnimations';
import { GsapAnimations } from 'src/interfaces/IGsapPageAnimations';
import type { IMouseEventAnimations } from 'src/interfaces/IMouseEventAnimations';
import type { IPageAnimations } from 'src/interfaces/IPageAnimations';
import { PageElements } from 'src/interfaces/IPageAnimations';
import { GlobalPageAnimations } from 'src/interfaces/IPageAnimations';
import type { IResizePageAnimations } from 'src/interfaces/IResizePageAnimations';
import Swiper from 'swiper/bundle';

import { GlobeAnimation } from '../Components/globe';
import { LeafletMapComponent } from '../Components/map';

class NewsAnimations implements IGsapComponentAnimations {
  EL = [
    '.news-colleciton-item',
    '.special',
    '.sticky-top',
    '.news-btn',
    '.agenda-item > div',
  ] as const;

  pageElements: PageElements<typeof this.EL>;

  private _articleCount: number;

  constructor(gsapAnimations: GsapAnimations) {
    this.gsapComponentAnimations = new GsapComponentAnimations(gsapAnimations);
  }

  initElements = () => {
    this.pageElements = new PageElements(this.EL);
    this._articleCount = this.pageElements.el.newsCollecitonItem.length;
  };

  gsapComponentAnimations: GsapComponentAnimations;

  animateComponent = () => {
    this.initElements();
    // Iterate over each article
    this.pageElements.el.newsCollecitonItem.each((index, article) => {
      // Calculate the font size based on the formula 2rem + 5rem * (index + 1)
      const topPosition = 7 + 6 * (index + 1) + 'rem';

      const bottomPosition = (this._articleCount - 1 - index) * 6 + 8 + 'rem';

      // Apply the calculated font size to each article
      article.style.top = topPosition;
      article.style.marginBottom = bottomPosition;
    });

    // Iterate over each article
    this.pageElements.el.special.each((index, header) => {
      // Apply the calculated font size to each article
      header.innerText = '0' + (index + 1);
    });

    this.pageElements.el.stickyTop.each((index, link) => {
      $(link).on('click', () => {
        this.scrollToSection(this.pageElements.el.newsCollecitonItem.get(index));
      });
    });

    this.pageElements.el.newsBtn.each((_, button) => {
      const { pageElements } = this;

      $(button).on('click', function () {
        const targetSlug = $(this).attr('target-slug');

        // Hide all direct children of agenda-item
        pageElements.el['agendaItem > div'].each((_, el) => {
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
  EL = [
    '.pageload',
    '#webGL',
    '.globe-container',
    '.sticky-image-container',
    '.opening-hero',
    '.swiper.is-photos',
    '.swiper.is-content',
    '.arrow.is-right',
    '.arrow.is-left',
    '.cursor',
  ] as const;

  private _globeAnimation: GlobeAnimation | LeafletMapComponent;

  private _globeTL: GSAPTween;

  private _scheduleAnimator: ScheduleAnimations;

  private _newsAnimator: NewsAnimations;

  private _openingHeroAnimator: OpeningHeroAnimations;

  gsapAnimations: GsapAnimations;

  private _gpuTier: TierResult;

  pageElements: PageElements<typeof this.EL>;

  supportAnimations = GlobalPageAnimations;

  namespace: string = 'home';

  disposePageAnimations = () => {
    this._globeAnimation.disposePageAnimations();
    this.gsapAnimations.disposePageAnimations();
  };

  detectGPUSupported = async (): Promise<boolean> => {
    const gpuTier = await getGPUTier();
    return gpuTier.tier > 2;
  };

  private swiperAnimation = (): void => {
    const photoSwiper = new Swiper(this.pageElements.el.swiperIsPhotos[0], {
      effect: 'cards',
      grabCursor: true,
      loop: true,
      keyboard: true,
      navigation: {
        nextEl: '.arrow.is-right',
        prevEl: '.arrow.is-left',
      },
    });

    const contentSwiper = new Swiper(this.pageElements.el.swiperIsContent[0], {
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
    const { pageload } = this.pageElements.el;
    if (pageload.css('display') !== 'none') {
      const currentTime = new Date().getTime();

      await (currentTime - initTime < 2000
        ? barbaInit.sleep(2000 - (currentTime - initTime))
        : Promise.resolve());

      const tween = await gsap.to(pageload, {
        display: 'none',
        delay: currentTime - initTime < 2000 ? 2 - (currentTime - initTime) / 1000 : 0,
      });

      this.gsapAnimations.newItem(tween);

      pageload.remove();
    }
  };

  private gsapGlobeContainerExpand = () => {
    if (this._globeTL) {
      this.gsapAnimations.clearAnimation(this._globeTL);
      this.gsapAnimations.newItem(
        gsap.set(this.pageElements.el.globeContainer, { maxWidth: '100vw', borderRadius: '0' })
      );
    }

    this._globeTL = gsap.from(this.pageElements.el.globeContainer, {
      scrollTrigger: {
        trigger: this.pageElements.el.globeContainer,
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
    if (this._globeAnimation instanceof GlobeAnimation) this._globeAnimation.animateComponent();

    this.gsapGlobeContainerExpand();

    if (this._globeAnimation instanceof GlobeAnimation) this._globeAnimation.animateGlobeBlock();
  };

  onResizeHandler = {
    handler: () => {
      $(window).on('resize', () => {
        this.gsapGlobeContainerExpand();
        const width = $(window).width();

        if (
          (width >= 480 && this._globeAnimation instanceof LeafletMapComponent) ||
          (width < 480 && this._globeAnimation instanceof GlobeAnimation)
        ) {
          this.dynamicPageAssignment();
        }

        if (this._globeAnimation instanceof GlobeAnimation)
          this._globeAnimation.animateGlobeBlock();
      });
    },
    dispose: () => {
      $(window).off('resize');
    },
  };

  onMouseEnterHandler = {
    handler: (self: HomePageAnimations) => {
      self.pageElements.el.stickyImageContainer.on('mouseenter', () =>
        self.supportAnimations.cursorAnimations.cursorWhite()
      );
    },
    dispose: (self: HomePageAnimations) => {
      self.pageElements.el.stickyImageContainer.off('mouseenter');
    },
  };

  onMouseLeaveHandler = {
    handler: (self: HomePageAnimations) => {
      self.pageElements.el.stickyImageContainer.on('mouseenter', () =>
        self.supportAnimations.cursorAnimations.cursorBlue()
      );
    },
    dispose: (self: HomePageAnimations) => {
      self.pageElements.el.stickyImageContainer.off('mouseenter');
    },
  };

  partialInit = async () => {
    this.supportAnimations = GlobalPageAnimations;

    this.gsapAnimations = new GsapAnimations();

    this._scheduleAnimator = new ScheduleAnimations(this.gsapAnimations);

    this._newsAnimator = new NewsAnimations(this.gsapAnimations);

    this._openingHeroAnimator = new OpeningHeroAnimations(this.gsapAnimations);

    this._gpuTier = await getGPUTier();

    this.pageElements = new PageElements([
      '.pageload',
      '#webGL',
      '.globe-container',
      '.sticky-image-container',
      '.opening-hero',
      '.swiper.is-photos',
      '.swiper.is-content',
      '.arrow.is-right',
      '.arrow.is-left',
      '.cursor',
    ] as const);
  };

  initElements = async () => {
    await this.partialInit();

    this.dynamicPageAssignment();
  };

  private dynamicPageAssignment = () => {
    const zoom = () =>
      Math.max(Math.min((this.pageElements.el.webGL.width() / 1360.0) * 5.0, 5.0), 3.7);

    this.pageElements.el.webGL.empty();

    if (this._globeAnimation?.['off']) this._globeAnimation['off']();

    if (this._globeAnimation?.['destructor']) this._globeAnimation['destructor']();
    console.log(this._gpuTier.tier);

    if ($(window).width() >= 480 && this._gpuTier.tier >= 2) {
      this._globeAnimation = new GlobeAnimation(true, this.gsapAnimations);
      this.initGlobe();
    } else {
      this._globeAnimation = new LeafletMapComponent(
        this.pageElements.el.webGL,
        () => '#ffffff50',
        '#ffffff',
        {
          zoom,
          zoomControl: false,
          maxZoom: zoom,
          minZoom: zoom,
          dragging: false,
          scrollWheelZoom: false,
        },
        this.gsapAnimations
      );
    }
  };

  once = async (_data: ITransitionData, isFirstLoad: boolean) => {
    $(async () => {
      await this.partialInit();

      if (isFirstLoad) {
        const pageLoadTween = gsap.set(this.pageElements.el.pageload, { display: 'flex' });
        this.gsapAnimations.newItem(pageLoadTween);
        isFirstLoad = false;
      }

      //$(document).on('readystatechange', async () => {
      const startTime = new Date().getTime();
      //if (document.readyState === 'complete') {
      ScrollTrigger.normalizeScroll(true);

      gsap.set(this.pageElements.el.cursor, { display: 'flex' });

      this.supportAnimations.progressBarAnimations.showProgress();

      this.supportAnimations.navBarAnimations.initNavLinks();

      await this.afterEnter(_data, startTime);

      this.supportAnimations.cursorAnimations.cursorHover();

      this.supportAnimations.tocAnimations.animateComponent();
    });
  };

  afterEnter = async (_data: ITransitionData, initTime: number) => {
    $(async () => {
      await this.initElements();

      this.supportAnimations.logoAnimations.logoAnimation();

      this.supportAnimations.navBarAnimations.initNavLinks();

      this.onMouseEnterHandler.handler(this);

      this.onMouseLeaveHandler.handler(this);

      this.onResizeHandler.handler();

      this.supportAnimations.navBarAnimations.animateScrollButton(this.pageElements.el.openingHero);

      this.supportAnimations.footerAnimations.animateFooterWhite();

      this._scheduleAnimator.animateScheduleContainer();

      this._scheduleAnimator.animateComponent();

      this._newsAnimator.animateComponent();

      this._openingHeroAnimator.animateProgressFade();

      await this.hidePageLoader(initTime);

      this.swiperAnimation();

      await this._openingHeroAnimator.animateComponent();
    });
  };
}

class ScheduleAnimations implements IGsapComponentAnimations {
  EL = ['.slide-block', '.sticky-image-container'] as const;

  pageElements: PageElements<typeof this.EL>;

  gsapComponentAnimations: GsapComponentAnimations;

  constructor(gsapAnimations: GsapAnimations) {
    this.gsapComponentAnimations = new GsapComponentAnimations(gsapAnimations);
    this.initElements();
  }

  initElements = () => {
    this.pageElements = new PageElements(['.slide-block', '.sticky-image-container'] as const);
  };

  animateScheduleContainer = () => {
    const blocks: JQuery<HTMLElement> = this.pageElements.el.slideBlock;

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
    this.initElements();

    const { stickyImageContainer, slideBlock } = this.pageElements.el;

    const children = stickyImageContainer.children();

    slideBlock.each((index, block) => {
      const parentTween = gsap.from(children[index], {
        scrollTrigger: {
          trigger: block,
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: true,
          onEnter: () => {
            console.log('onEnter');
            const childTween = gsap.set(children[index], { display: 'flex' });
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
            console.log('onLeave');
            this.gsapComponentAnimations.newItem(gsap.set(children[index], { display: 'none' }));
          },
          onEnterBack: () => {
            console.log('onEnterBack');
            const childTween = gsap.set(children[index], {
              display: 'flex',
              flexDirection: index == 1 ? 'vertical' : null,
              alignItems: index == 1 ? 'center' : null,
            });
            const childTweenSec = gsap.from(children[index], {
              opacity: 0,
              duration: 1,
              translateY: 10,
            });
            const neighbours = children.slice(0, index).extend(children.slice(index + 1));
            const childTweenLast = gsap.set(neighbours, { display: 'none' });
            this.gsapComponentAnimations.newItems([childTween, childTweenSec, childTweenLast]);
          },
          onLeaveBack: () => {
            console.log('onLeaveBack');
          },
        },
        marginBottom: '20em',
      });
      this.gsapComponentAnimations.newItem(parentTween);
    });
  };
}

class OpeningHeroAnimations implements IGsapComponentAnimations {
  EL = ['.opening-hero', '.progress', '.ths07-logo', '.video-image', '.hero-heading'] as const;

  pageElements: PageElements<typeof this.EL>;

  gsapComponentAnimations: GsapComponentAnimations;

  constructor(gsapAnimations: GsapAnimations) {
    this.gsapComponentAnimations = new GsapComponentAnimations(gsapAnimations);
    this.initElements();
  }

  initElements = () => {
    this.pageElements = new PageElements(this.EL);
  };

  animateProgressFade = () => {
    const duration = 0.5;

    const { progress } = this.pageElements.el;

    const tween = gsap.from(progress, {
      scrollTrigger: {
        trigger: this.pageElements.el.openingHero,
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
    const { videoImage, ths07Logo, heroHeading } = this.pageElements.el;

    const targets = [
      gsap.set(ths07Logo, { translateY: '-15em' }),
      gsap.set(videoImage, { opacity: 0, translateY: 150 }),
      gsap.set(heroHeading, { opacity: 0, translateY: 150 }),

      gsap.to(videoImage, { opacity: 1, duration: 0.5 }),
      gsap.to(videoImage, { translateY: 0, duration: 4 }),
      await gsap.to(ths07Logo, { translateY: '0', duration: 3 }),

      gsap.to(heroHeading, { opacity: 1, duration: 0.5 }),
      await gsap.to(heroHeading, { translateY: 0, duration: 3 }),

      gsap.to(heroHeading, { opacity: 0, duration: 1 }),
      await gsap.to(videoImage, { opacity: 0, duration: 1 }),
    ];
    this.gsapComponentAnimations.newItems(targets);
  };
}
