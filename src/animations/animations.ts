import type { ISchemaPage } from '@barba/core/dist/core/src/src/defs';
import { gsap } from 'gsap/all';

import { FooterAnimations } from './Components/footerAnimations';
import { BioAnimations } from './Pages/bio-animations';
import { ChurchContentAnimations } from './Pages/churchcontent-animations';
import { ChurchAnimations } from './Pages/churchpage-animations';
import { HomePageAnimations } from './Pages/homepage-animations';
import { MinistryContentAnimations } from './Pages/ministrycontent-animations';
import { MinistryPageAnimations } from './Pages/ministrypage-animations';
import { SermonPageAnimations } from './Pages/sermon-animations';
import { SermonContentAnimations } from './Pages/sermoncontent-animations';
import { References } from './references';
import { CursorAnimations } from './UI/cursor-animations';
import { NavBarAnimations } from './UI/navbar-animations';
import { TOCAnimations } from './UI/toc';
import type { Player } from './UI/Widgets/player';

export class DisposeAnimations {
  private static _homePageAnimator: typeof HomePageAnimations;

  private _ministryPageAnimator: MinistryPageAnimations;

  private _sermonContentAnimator: SermonContentAnimations;

  private _ministryContentAnimator: MinistryContentAnimations;

  private _churchContentPageAnimations: ChurchContentAnimations;

  private static _bioAnimator: typeof BioAnimations;

  constructor(
    homePageAnimator: typeof HomePageAnimations,
    ministryPageAnimator: MinistryPageAnimations,
    sermonContentAnimator: SermonContentAnimations,
    churchPageAnimator: ChurchContentAnimations,
    ministryContentAnimator: MinistryContentAnimations,
    bioAnimator: typeof BioAnimations
  ) {
    DisposeAnimations._homePageAnimator = homePageAnimator;
    DisposeAnimations._bioAnimator = bioAnimator;
    this._ministryPageAnimator = ministryPageAnimator;
    this._sermonContentAnimator = sermonContentAnimator;
    this._churchContentPageAnimations = churchPageAnimator;
    this._ministryContentAnimator = ministryContentAnimator;
  }

  public static disposeHomepageGlobe = () => {
    this._homePageAnimator.disposeGlobe();
  };

  public static disposeHomepageAnimations = () => {
    this._homePageAnimator.gsapGlobeContainerDestroy();
  };

  public disposeMinistrypageGlobe = () => {
    this._ministryPageAnimator.disposeGlobe();
  };

  public disposeChurchLeaderLine = () => {
    this._churchContentPageAnimations.disposeChurchContentPage();
  };

  public disposeMinistryContentPage = () => {
    this._ministryContentAnimator.disposePage();
  };

  public static disposeBioPage = () => {
    this._bioAnimator.unloadCss();
  };
}

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

  private static _ministryContentAnimator = new MinistryContentAnimations();

  private static _scheduleAnimator = new ScheduleAnimations();

  public static player: Player;

  public static disposeAnimations = new DisposeAnimations(
    this._homePageAnimator,
    this._ministryPageAnimator,
    this._sermonContentAnimator,
    this._churcheContentAnimator,
    this._ministryContentAnimator,
    this._bioAnimator
  );

  public static initMinistryPage = () => {
    this._ministryPageAnimator.animateMinistryPage(this._navBarAnimator);
  };

  public static initSermonPage = () => {
    this._sermonPageAnimator.animateSermonPage(this._navBarAnimator);
  };

  public static initChurchContentPage = () => {
    this._churcheContentAnimator.animateChurchContent(this._navBarAnimator);
  };

  public static initMinistryContentPage = () => {
    this._ministryContentAnimator.animateMinistryContent(this._navBarAnimator);
  };

  public static initSermonsContentPage = () => {
    this._sermonContentAnimator.animateSermonContent(this._navBarAnimator);
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

  public static initPlayer = (player: Player) => {
    if (!Animations.player) {
      Animations.player = player;
    } else {
      Animations.player.initializeContainers();
      Animations.player.initUI();
      Animations.player.updateUI();
      Animations.player.playList.initUI();
      Animations.player.playList.updateUI();
      Animations.player.playList.initalizeRender();
    }
  };
}
