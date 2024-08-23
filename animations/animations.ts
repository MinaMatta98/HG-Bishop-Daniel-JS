import type { ISchemaPage } from '@barba/core/dist/core/src/src/defs';
import { Flip, gsap, ScrollTrigger } from 'gsap/all';
import $ from 'jquery';

import { BioAnimations } from './bio-animations';
import { CarouselAnimations } from './carousel';
import { CursorAnimations } from './cursor-animations';
import { FooterAnimations } from './footerAnimations';
import { GlobeAnimation } from './globe';
import { NavBarAnimations } from './navbar-animations';
import { References } from './references';
import { ScrollSection } from './scrollSection';

interface LogoTransition {
  scrollSection: JQuery<HTMLElement>;
  targetContainer: JQuery<HTMLElement>;
  removeClass: boolean;
}

export class Animations {
  private static _cursorAnimator = CursorAnimations;
  private static _navBarAnimator: NavBarAnimations = new NavBarAnimations();
  private static _carousel = new CarouselAnimations();
  private static _scrollAnimator = ScrollSection;
  private static _bioAnimator = BioAnimations;
  private static _footerAnimator = FooterAnimations;

  public static initGlobe = () => {
    this._globeAnimation.init();
    this._globeAnimation.animateGlobeBlock();
  };

  public static disposeGlobe = () => {
    this._globeAnimation.dispose();
  };

  public static initScrollSection = () => {
    this._scrollAnimator.initAnimation();
  };

  public static cursorWhite = (): void => {
    this._cursorAnimator.cursorWhite();
  };

  public static cursorBlue = (): void => {
    this._cursorAnimator.cursorBlue();
  };

  public static underlineNav = async (
    identifier: ISchemaPage['namespace'],
    underline: boolean
  ): Promise<void> => {
    await this._navBarAnimator.underlineNav(identifier, underline);
  };

  public static setOpaque = (identifier: gsap.TweenTarget): void => {
    gsap.set(identifier, { opacity: '1' });
  };

  public static logoAnimation = () => {
    const logo = $('.ths07-brand');
    const backgroundVideo = $('.background-video');
    const standardBottom = 'bottom bottom-=20px';

    const sections = {
      sectionHero: $('.section-hero-home'),
      newsSection: $('.news-section'),
      sermonsSection: $('.sermons-section'),
      feedbackSection: $('.feedback-section'),
      churchesSection: $('.spline-section'),
      timelineSection: $('.timeline-section'),
    };

    const containers = {
      logoContainer: $('.logo-embed'),
      //newslogoContainer: $('.news-logo-embed'),
      //sermonslogoContainer: $('.sermons-logo-embed'),
      //feedbacklogoContainer: $('.feedback-logo-embed'),
      logoVideoContainer: $('.logo'),
      //churcheslogoContainer: $('.churches-logo-embed'),
      //timelinelogoContainer: $('.timeline-logo-embed'),
    };

    const moveLogo = (removeClass: boolean, targetContainer: JQuery<HTMLElement>) => {
      const currentState = Flip.getState(logo);
      if (removeClass) {
        logo.removeClass('morphed');
      }
      if (!logo.hasClass('morphed') && !removeClass) logo.addClass('morphed');
      targetContainer[0].appendChild(logo[0]);
      Flip.from(currentState, { duration: 1, ease: 'power3.inOut', scale: true });
    };

    const videoTransition: LogoTransition = {
      scrollSection: backgroundVideo,
      targetContainer: containers.logoVideoContainer,
      removeClass: true,
    };

    const bioTransition: LogoTransition = {
      scrollSection: sections.sectionHero,
      targetContainer: containers.logoContainer,
      removeClass: false,
    };

    //const newsTransition: LogoTransition = {
    //  scrollSection: sections.newsSection,
    //  targetContainer: containers.newslogoContainer,
    //  removeClass: false,
    //};
    //
    //const sermonsTransition: LogoTransition = {
    //  scrollSection: sections.sermonsSection,
    //  targetContainer: containers.sermonslogoContainer,
    //  removeClass: false,
    //};
    //
    //const feedbackTransition: LogoTransition = {
    //  scrollSection: sections.feedbackSection,
    //  targetContainer: containers.feedbacklogoContainer,
    //  removeClass: false,
    //};
    //
    //const churchesTransition: LogoTransition = {
    //  scrollSection: sections.churchesSection,
    //  targetContainer: containers.churcheslogoContainer,
    //  removeClass: false,
    //};
    //
    //const timelineTransition: LogoTransition = {
    //  scrollSection: sections.timelineSection,
    //  targetContainer: containers.timelinelogoContainer,
    //  removeClass: false,
    //};

    [
      videoTransition,
      bioTransition,
      //newsTransition,
      //sermonsTransition,
      //feedbackTransition,
      //churchesTransition,
      //timelineTransition,
    ].forEach(({ scrollSection, targetContainer, removeClass }) => {
      ScrollTrigger.create({
        trigger: scrollSection,
        start: 'top 60%',
        end: standardBottom,
        scrub: 1,
        onEnterBack() {
          moveLogo(removeClass, targetContainer);
        },
        onEnter() {
          moveLogo(removeClass, targetContainer);
        },
      });
    });
  };

  public static handleMinistrySlider = (): void => {
    gsap.fromTo(
      References.ministryPageClasses.ministrySliderClass,
      { left: '-100%' },
      { left: '0', duration: 1.5 }
    );
    const ministryCards = $(References.ministryPageClasses.highlightCardClass);
    const tl = gsap.timeline();
    ministryCards.each((index, card) => {
      gsap.set(card, { left: '100%' });
      tl.to(card, { left: '0', duration: 0.2, delay: 1.5 + 0.2 * (index + 1) });
    });
  };

  public static cardStackingAnimation = () => {
    const cardSection = $('.div-block-34');
    const cardSectionHeading = $('.div-block-35');

    ScrollTrigger.create({
      trigger: cardSection,
      start: 'bottom bottom',
      onEnter() {
        gsap.to(cardSectionHeading, { duration: 0.5, opacity: '0' });
      },
      onLeaveBack() {
        gsap.to(cardSectionHeading, { duration: 0.5, opacity: '1' });
      },
    });
  };

  public static showVideo = (): void => {
    gsap.to(References.homePageClasses.videoID, { marginLeft: 'auto', duration: 1 });
  };

  public static initNavLinks = (): void => {
    this._navBarAnimator.initNavLinks();
  };

  public static disableNavLinks = (): void => {
    this._navBarAnimator.disableNavLinks();
  };

  public static enableNavLinks = (): void => {
    this._navBarAnimator.enableNavLinks();
  };

  public static animateScrollButton = (): void => {
    this._navBarAnimator.scrollButtonInit();
  };

  public static displayShow(
    identifier: gsap.TweenTarget,
    view: true,
    display: gsap.TweenValue
  ): void;
  public static displayShow(identifier: gsap.TweenTarget, view: false): void;
  public static displayShow(
    identifier: gsap.TweenTarget,
    view: boolean,
    display?: gsap.TweenValue
  ) {
    gsap.to(identifier, { display: view ? display! : 'none' });
  }

  public static handleTransitionAnimation = async (inView: boolean): Promise<void> => {
    const loadTl = gsap.timeline();

    if (inView) {
      Animations.displayShow(References.transitionClasses.transitionClass, true, 'flex');
      for (const div of References.transitionClasses.transitionDivs) {
        gsap.set(div, { marginTop: '100vh' });
      }
    }

    for (const div of References.transitionClasses.transitionDivs) {
      loadTl.to(div, { marginTop: inView ? '0vh' : '100vh', duration: 0.25 });
    }

    if (!inView) this.displayShow(References.transitionClasses.transitionClass, false);
  };

  public static VideoAnimation = async (): Promise<void> => {
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

  public static gsapSliderInit = () => {
    this._carousel.initCarousel();
    this._carousel.initializeWrappers();
    this._carousel.initializeButtons();
  };

  public static gsapGlobeContainerExpand = () => {
    const container = $(References.homePageClasses.globeContainerClass);

    gsap.from(container, {
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

  public static animateBioHeading = () => {
    this._bioAnimator.animateHeading();
  };

  public static animateBioTimeline = () => {
    this._bioAnimator.animateTimeline();
  };

  public static footerAnimateBlue = () => {
    this._footerAnimator.animateFooterBlue();
  };

  public static footerAnimateWhite = () => {
    this._footerAnimator.animateFooterWhite();
  };

  public static animateBioLogo = () => {
    this._bioAnimator.animateBioLogo();
  };
}
