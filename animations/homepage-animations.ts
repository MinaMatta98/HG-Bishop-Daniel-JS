// import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'src/animations.css';

import { Flip, gsap, ScrollTrigger } from 'gsap/all';
import $ from 'jquery';
import { References } from 'src/animations/references';
import Swiper from 'swiper';

import { Utils } from '$utils/utils';

import { Animations } from './animations';
import { GlobeAnimation } from './globe';
import { NavBarAnimations } from './navbar-animations';

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
  private static _globeTL: GSAPTween;

  private static logoAnimation = () => {
    LogoAnimations.logoAnimation();
  };

  private static VideoAnimation = async (): Promise<void> => {
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
    if (isFirstLoad)
      Animations.displayShow(References.transitionClasses.pageLoadClass, true, 'flex');
    this.initScheduleAnimation();
    this.logoAnimation();
    this.swiperAnimation();
    this.initGlobe();
    this.animateScheduleCursor();
    this._navBarAnimator.scrollButtonInit($(References.homePageClasses.openingHeroClass));
    await this.hidePageLoader(initTime);
    this.VideoAnimation();
  };
}
