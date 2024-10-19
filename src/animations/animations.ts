import type { ISchemaPage } from '@barba/core/dist/core/src/src/defs';
import { gsap } from 'gsap/all';

import { BioAnimations } from './Pages/bio-animations';
import { ChurchContentAnimations } from './Pages/churchcontent-animations';
import { ChurchAnimations } from './Pages/churchpage-animations';
import { CursorAnimations } from './UI/cursor-animations';
import { FooterAnimations } from './Components/footerAnimations';
import { HomePageAnimations } from './Pages/homepage-animations';
import { MinistryPageAnimations } from './Pages/ministrypage-animations';
import { NavBarAnimations } from './UI/navbar-animations';
import { References } from './references';
import { SermonPageAnimations } from './Pages/sermon-animations';
import { TOCAnimations } from './UI/toc';
import { SermonContentAnimations } from './Pages/sermoncontent-animations';

export class Animations {
  private static _cursorAnimator = CursorAnimations;
  private static _navBarAnimator = new NavBarAnimations();
  private static _bioAnimator = BioAnimations;
  private static _footerAnimator = FooterAnimations;
  private static _tocAnimator = new TOCAnimations();
  private static _homePageAnimator = HomePageAnimations;
  private static _ministryPageAnimator = new MinistryPageAnimations();
  private static _sermonPageAnimator = new SermonPageAnimations();
  private static _churchesPageAnimator = new ChurchAnimations();
  private static _churcheContentAnimator = new ChurchContentAnimations();
  private static _sermonContentAnimator = new SermonContentAnimations();

  public static disposeHomepageGlobe = () => {
    this._homePageAnimator.disposeGlobe();
  };

  public static disposeHomepageAnimations = () => {
    this._homePageAnimator.gsapGlobeContainerDestroy();
  };

  public static disposeMinistrypageGlobe = () => {
    this._ministryPageAnimator.disposeGlobe();
  };

  public static initMinistryPage = () => {
    this._ministryPageAnimator.animateMinistryPage(this._navBarAnimator);
  };

  public static initSermonPage = () => {
    this._sermonPageAnimator.animateSermonPage(this._navBarAnimator);
  };

  public static initChurchContentPage = () => {
    this._churcheContentAnimator.animateChurchContent(this._navBarAnimator);
  };

  public static initChurchesPage = () => {
    this._churchesPageAnimator.animateChurchPage(this._navBarAnimator);
  };

  public static showProgress = () => {
    this.displayShow(References.ancillaryClasses.progressBar, true, 'block');
    this.setOpaque(References.ancillaryClasses.progressBar);
  };

  public static initHomePage = async (initTime: number, isFirstLoad: boolean) => {
    await this._homePageAnimator.animateHomePage(initTime, isFirstLoad, this._navBarAnimator);
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
      await loadTl.to(div, { marginTop: inView ? '0vh' : '100vh', duration: 0.25 });
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

  public static animateToc = () => {
    this._tocAnimator.tocAnimation();
  };
}
