// import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import '../animations.css';

import { Flip, gsap, ScrollTrigger } from 'gsap/all';
import $ from 'jquery';
import Swiper from 'swiper/bundle';

import { Utils } from '../utils/utils';
import { Animations } from './animations';
import { GlobeAnimation } from './globe';
import { NavBarAnimations } from './navbar-animations';
import { References } from './references';

class NewsAnimations {
  private _articles: JQuery<HTMLElement>;

  private _headers: JQuery<HTMLElement>;

  private _articleCount: number;

  private _stickyLinks: JQuery<HTMLElement>;

  private _buttons: JQuery<HTMLElement>;

  private _agendaItems: JQuery<HTMLElement>;

  // Select all elements with the class 'big-article'

  constructor() {
    $(() => {
      this._articles = $('.news-colleciton-item');
      this._articleCount = this._articles.length;
      this._headers = $('.special');
      this._stickyLinks = $('.sticky-top');
      this._buttons = $('.news-btn');
      this._agendaItems = $('.agenda-item > div');
    });
  }

  private scrollToSection = (element: HTMLElement) => {
    const offset = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  };

  animateNewsSection = () => {
    $(() => {
      // Iterate over each article
      this._articles.each((index, article) => {
        // Calculate the font size based on the formula 2rem + 5rem * (index + 1)
        const topPosition = 7 + 6 * (index + 1) + 'rem';

        const bottomPosition = (this._articleCount - 1 - index) * 6 + 8 + 'rem';

        // Apply the calculated font size to each article
        article.style.top = topPosition;
        article.style.marginBottom = bottomPosition;
      });

      // Iterate over each article
      this._headers.each((index, header) => {
        // Apply the calculated font size to each article
        header.innerText = '0' + (index + 1);
      });

      this._stickyLinks.each((index, link) => {
        $(link).on('click', () => {
          this.scrollToSection(this._articles[index]);
        });
      });

      this._buttons.each((_, button) => {
        const { _agendaItems } = this;

        $(button).on('click', function () {
          const targetSlug = $(this).attr('target-slug');

          // Hide all direct children of agenda-item
          _agendaItems.each((_, el) => {
            $(el).css('display', 'none');
          });

          // Show the div with the id that matches the target-slug
          const targetElement = $('#' + targetSlug);

          if (targetElement) {
            targetElement.css('display', 'block');

            targetElement[0].scrollIntoView({ behavior: 'smooth' });

            // Simulate a click on the target element
            setTimeout(() => {
              //targetElement.click();
            }, 500);
            // Adding a slight delay to
            // ensure the element is visible and scrolled into view
          }
        });
      });
    });
  };
}

class scheduleAnimations {
  private _sideBlocks: JQuery<HTMLElement>;
  private _stickyImageContainer: JQuery<HTMLElement>;

  constructor() {}

  init() {
    this._sideBlocks = $(References.homePageClasses.slideBlockClass);
    this._stickyImageContainer = $(References.homePageClasses.stickyImageContainerClass);
  }

  public animateScheduleSection = () => {
    $(() => {
      this.init();
      const { _sideBlocks, _stickyImageContainer } = this;
      const children = _stickyImageContainer.children();

      _sideBlocks.each((index, block) => {
        gsap.from(children[index], {
          scrollTrigger: {
            trigger: block,
            start: 'top 50%',
            end: 'bottom 50%',
            scrub: true,
            onEnter: () => {
              gsap.set(children[index], { display: 'block' });
              gsap.from(children[index], { opacity: 0, duration: 1, translateY: 10 });
              const neighbours = children.slice(0, index).extend(children.slice(index + 1));
              gsap.set(neighbours, { display: 'none' });
            },
            onLeave: () => {
              gsap.set(children[index], { display: 'none' });
            },
            onEnterBack: () => {
              gsap.set(children[index], { display: 'block' });
              gsap.from(children[index], { opacity: 0, duration: 1, translateY: 10 });
              const neighbours = children.slice(0, index).extend(children.slice(index + 1));
              gsap.set(neighbours, { display: 'none' });
            },
          },
          marginBottom: '20em',
        });
      });
    });
  };
}

class OpeningHeroAnimations {
  private _openingHero: JQuery<HTMLElement>;
  private _progressBar: JQuery<HTMLElement>;

  constructor() {
    $(() => {
      this.init();
    });
  }

  init() {
    this._openingHero = $(References.homePageClasses.openingHeroClass);
    this._progressBar = $(References.ancillaryClasses.progressBar);
  }

  animateProgressFade = () => {
    const duration = 0.5;
    $(() => {
      this.init();
      gsap.from(this._progressBar, {
        scrollTrigger: {
          trigger: this._openingHero,
          start: 'top top',
          end: 'bottom top',
          onEnter: () => {
            gsap.to(this._progressBar, { opacity: 0, duration });
          },
          onEnterBack: () => {
            gsap.to(this._progressBar, { opacity: 0, duration });
          },
          onLeave: () => {
            gsap.to(this._progressBar, { opacity: 1, duration });
          },
        },
        opacity: 0,
        duration: 0.5,
      });
    });
  };

  VideoAnimation = async (): Promise<void> => {
    gsap.set(References.logoClasses.topLogoClass, { translateY: '-15em' });
    gsap.set(References.logoClasses.centerLogoClass, { opacity: 0, translateY: 150 });
    gsap.set(References.homePageClasses.heroHeadingClass, { opacity: 0, translateY: 150 });

    gsap.to(References.logoClasses.centerLogoClass, { opacity: 1, duration: 0.5 });
    gsap.to(References.logoClasses.centerLogoClass, { translateY: 0, duration: 4 });
    await gsap.to(References.logoClasses.topLogoClass, { translateY: '0', duration: 3 });

    gsap.to(References.homePageClasses.heroHeadingClass, { opacity: 1, duration: 0.5 });
    await gsap.to(References.homePageClasses.heroHeadingClass, { translateY: 0, duration: 3 });

    gsap.to(References.homePageClasses.heroHeadingClass, { opacity: 0, duration: 1 });
    await gsap.to(References.logoClasses.centerLogoClass, { opacity: 0, duration: 1 });
  };
}

/**
 * @module Keep Private. This is simply a definition of the
 * LogoAnimations class to ensure strong typing.
 */
interface LogoTransition {
  scrollSection: JQuery<HTMLElement>;
  targetContainer: JQuery<HTMLElement>;
  removeClass: boolean;
}

class LogoAnimations {
  private static _logo: JQuery<HTMLElement>;
  private static _backgroundVideo: JQuery<HTMLElement>;
  private static _standardBottom: string;
  private static _sections: {
    sectionHero: JQuery<HTMLElement>;
  };

  private static _containers: {
    logoContainer: JQuery<HTMLElement>;
    logoVideoContainer: JQuery<HTMLElement>;
  };

  private static _videoTransition: LogoTransition;

  private static _bioTransition: LogoTransition;

  private static initLogo = () => {
    this._logo = $('.ths07-brand');
    this._backgroundVideo = $('.background-video');
    this._standardBottom = 'bottom bottom-=20px';
    this._sections = {
      sectionHero: $('.section-hero-home'),
    };
    this._containers = {
      logoContainer: $('.logo-embed'),
      logoVideoContainer: $('.logo'),
    };
    this._videoTransition = {
      scrollSection: this._backgroundVideo,
      targetContainer: this._containers.logoVideoContainer,
      removeClass: true,
    };
    this._bioTransition = {
      scrollSection: this._sections.sectionHero,
      targetContainer: this._containers.logoContainer,
      removeClass: false,
    };
  };

  private static moveLogo = (removeClass: boolean, targetContainer: JQuery<HTMLElement>) => {
    const currentState = Flip.getState(this._logo);
    if (removeClass) {
      this._logo.removeClass('morphed');
    }
    if (!this._logo.hasClass('morphed') && !removeClass) this._logo.addClass('morphed');
    targetContainer[0].appendChild(this._logo[0]);
    Flip.from(currentState, { duration: 1, ease: 'power3.inOut', scale: true });
  };

  public static logoAnimation = () => {
    this.initLogo();
    const { moveLogo } = this;
    // We need to reinitialize the class

    $(() => {
      [this._videoTransition, this._bioTransition].forEach(
        ({ scrollSection, targetContainer, removeClass }) => {
          ScrollTrigger.create({
            trigger: scrollSection,
            start: 'top 60%',
            end: this._standardBottom,
            scrub: 1,
            onEnterBack() {
              moveLogo(removeClass, targetContainer);
            },
            onEnter() {
              moveLogo(removeClass, targetContainer);
            },
          });
        }
      );
    });
  };
}

export class HomePageAnimations {
  private static _globeAnimation = new GlobeAnimation();
  private static _navBarAnimator: NavBarAnimations = new NavBarAnimations();
  private static _scheduleAnimator = new scheduleAnimations();
  private static _newsAnimator = new NewsAnimations();
  private static _openingHeroAnimator = new OpeningHeroAnimations();
  private static _globeTL: GSAPTween;

  private static logoAnimation = () => {
    LogoAnimations.logoAnimation();
  };

  private static hidePageLoader = async (initTime: number): Promise<void> => {
    if ($(References.transitionClasses.pageLoadClass).css('display') !== 'none') {
      const currentTime = new Date().getTime();

      await (currentTime - initTime < 2000
        ? Utils.sleep(2000 - (currentTime - initTime))
        : Promise.resolve());

      await gsap.to(References.transitionClasses.pageLoadClass, {
        display: 'none',
        delay: currentTime - initTime < 2000 ? 2 - (currentTime - initTime) / 1000 : 0,
      });
    }
  };

  private static swiperAnimation = (): void => {
    const photoSwiper = new Swiper(References.swiperClasses.swiperPhotoClass, {
      effect: 'cards',
      grabCursor: true,
      loop: true,
      keyboard: true,
      navigation: {
        nextEl: References.swiperClasses.swiperNextElClass,
        prevEl: References.swiperClasses.swiperPrevElClass,
      },
    });
    const contentSwiper = new Swiper(References.swiperClasses.swiperContentClass, {
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

  private static initScheduleAnimation = () => {
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

  private static gsapGlobeContainerExpand = () => {
    const container = $(References.homePageClasses.globeContainerClass);

    if (this._globeTL) {
      this._globeTL.kill();
      gsap.set(container, { maxWidth: '100vw', borderRadius: '0' });
    }

    this._globeTL = gsap.from(container, {
      scrollTrigger: {
        trigger: container,
        start: 'top 70%',
        end: 'top top',
        scrub: 1,
      },
      maxWidth: 1640,
      borderRadius: '3rem',
    });
  };

  private static initGlobe = () => {
    this._globeAnimation.init();
    this._globeAnimation.animateGlobeBlock();
    this.gsapGlobeContainerExpand();
    window.addEventListener('resize', () => {
      this._globeAnimation.animateGlobeBlock();
      this.gsapGlobeContainerExpand();
    });
  };

  private static animateScheduleCursor = () => {
    $(References.homePageClasses.stickyImageContainerClass).on('mouseenter', () =>
      Animations.cursorWhite()
    );

    $(References.homePageClasses.stickyImageContainerClass).on('mouseleave', () =>
      Animations.cursorBlue()
    );
  };

  public static disposeGlobe = () => {
    this._globeAnimation.dispose();
  };

  public static animateHomePage = async (initTime: number, isFirstLoad: boolean) => {
    $(async () => {
      if (isFirstLoad)
        Animations.displayShow(References.transitionClasses.pageLoadClass, true, 'flex');
      this.initScheduleAnimation();
      this.logoAnimation();
      this.initGlobe();
      this.animateScheduleCursor();
      this._navBarAnimator.animateScrollButton($(References.homePageClasses.openingHeroClass));
      this._scheduleAnimator.animateScheduleSection();
      this._newsAnimator.animateNewsSection();
      this._openingHeroAnimator.animateProgressFade();
      await this.hidePageLoader(initTime);
      this.swiperAnimation();
      this._openingHeroAnimator.VideoAnimation();
    });
  };
}
