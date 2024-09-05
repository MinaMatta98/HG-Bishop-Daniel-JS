import type { ISchemaPage } from '@barba/core/dist/core/src/src/defs';
import { gsap } from 'gsap/all';
import $ from 'jquery';

import { BioAnimations } from './bio-animations';
import { CursorAnimations } from './cursor-animations';
import { FooterAnimations } from './footerAnimations';
import { HomePageAnimations } from './homepage-animations';
import { NavBarAnimations } from './navbar-animations';
import { References } from './references';
import { TOCAnimations } from './toc';

export class Animations {
  private static _cursorAnimator = CursorAnimations;
  private static _navBarAnimator = new NavBarAnimations();
  private static _bioAnimator = BioAnimations;
  private static _footerAnimator = FooterAnimations;
  private static _tocAnimator = new TOCAnimations();
  private static _homePageAnimator = HomePageAnimations;

  public static disposeGlobe = () => {
    this._homePageAnimator.disposeGlobe();
  };

  public static initHomePage = async (initTime: number, isFirstLoad: boolean) => {
    await this._homePageAnimator.animateHomePage(initTime, isFirstLoad);
  };

  public static cursorWhite = (): void => {
    this._cursorAnimator.cursorWhite();
  };

  public static cursorBlue = (): void => {
    this._cursorAnimator.cursorBlue();
  };

  public static cursorHover = (): void => {
    this._cursorAnimator.cursorHover();
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

  public static initNavLinks = (): void => {
    this._navBarAnimator.initNavLinks();
  };

  public static disableNavLinks = (): void => {
    this._navBarAnimator.disableNavLinks();
  };

  public static enableNavLinks = (): void => {
    this._navBarAnimator.enableNavLinks();
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
    gsap.set(identifier, { display: view ? display! : 'none' });
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

  public static animateBio = async () => {
    await this._bioAnimator.animateBio();
  };

  public static footerAnimateBlue = () => {
    this._footerAnimator.animateFooterBlue();
  };

  public static footerAnimateWhite = () => {
    this._footerAnimator.animateFooterWhite();
  };

  public static animateToc = async () => {
    this._tocAnimator.tocAnimation();
  };
}
