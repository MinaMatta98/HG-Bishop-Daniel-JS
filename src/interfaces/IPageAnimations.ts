import type { ISchemaPage, ITransitionData } from '@barba/core/dist/core/src/src/defs';
import { FooterAnimations } from 'src/animations/Components/footerAnimations';
import { LogoAnimations } from 'src/animations/Components/logo-animations';
import { ProgressBarAnimations } from 'src/animations/Components/progressbar';
import { TransitionAnimations } from 'src/animations/Components/transition';
import { CursorAnimations } from 'src/animations/UI/cursor-animations';
import { NavBarAnimations } from 'src/animations/UI/navbar-animations';
import { TOCAnimations } from 'src/animations/UI/toc';
import { Utils } from 'src/utils/utils';

/**
 * Interface for default page animations. These are animations that
 * do not really change from page to page and can therefore be standardized.
 */
export class GenericAnimations implements IGenericAnimations {
  globalPageAnimations: typeof GlobalPageAnimations;

  constructor(globalPageAnimations: typeof GlobalPageAnimations) {
    this.globalPageAnimations = globalPageAnimations;
  }

  enter = async (_data: ITransitionData) => {
    Utils.linkHandler();
  };

  leave = async (data: ITransitionData) => {
    data.next.container.style.display = 'none';
    this.globalPageAnimations.navBarAnimations.disableNavLinks();
    await this.globalPageAnimations.transitionAnimations.handleTransitionAnimation(true);
    this.globalPageAnimations.navBarAnimations.underlineNav(data.current.namespace, false);
  };

  after = async (data: ITransitionData) => {
    this.globalPageAnimations.tocAnimations.tocAnimation();

    switch (data.next.namespace.toString()) {
      case 'sermons-content':
        data.next.container.style.display = 'flex';
        break;
      default:
        data.next.container.style.display = 'block';
    }

    this.globalPageAnimations.navBarAnimations.enableNavLinks();
    this.globalPageAnimations.progressBarAnimations.showProgress();
    this.globalPageAnimations.transitionAnimations.handleTransitionAnimation(false);
    await this.globalPageAnimations.navBarAnimations.underlineNav(data.next.namespace, true);
    this.globalPageAnimations.cursorAnimations.cursorHover();
  };
}

export class GlobalPageAnimations {
  public static namespace: ISchemaPage['namespace'];
  public static footerAnimations: typeof FooterAnimations;
  public static logoAnimations: typeof LogoAnimations;
  public static cursorAnimations: typeof CursorAnimations;
  public static navBarAnimations: NavBarAnimations;
  public static transitionAnimations: typeof TransitionAnimations;
  public static tocAnimations: TOCAnimations;
  public static progressBarAnimations: typeof ProgressBarAnimations;
  public static genericAnimations: GenericAnimations;

  constructor() {
    GlobalPageAnimations.footerAnimations = FooterAnimations;
    GlobalPageAnimations.logoAnimations = LogoAnimations;
    GlobalPageAnimations.cursorAnimations = CursorAnimations;
    GlobalPageAnimations.navBarAnimations = new NavBarAnimations();
    GlobalPageAnimations.transitionAnimations = TransitionAnimations;
    GlobalPageAnimations.tocAnimations = new TOCAnimations();
    GlobalPageAnimations.progressBarAnimations = ProgressBarAnimations;
    /** Property insertion despite static status of props is to ensure initialization prior to usage */
    GlobalPageAnimations.genericAnimations = new GenericAnimations(GlobalPageAnimations);
  }
}

interface IGenericAnimations {
  globalPageAnimations: GlobalPageAnimations;

  enter: (data: ITransitionData) => Promise<void>;

  leave: (data: ITransitionData) => Promise<void>;

  after: (data: ITransitionData) => Promise<void>;
}

/**
 * This is the interface for the page animations.
 */
export interface IPageAnimations {
  pageElements: Map<string, JQuery<HTMLElement>>;

  supportAnimations: typeof GlobalPageAnimations;

  namespace: ISchemaPage['namespace'];

  initElements: () => void;

  once?: (data: ITransitionData) => Promise<void>;

  afterEnter?: (data: ITransitionData) => Promise<void>;

  afterLeave?: (data: ITransitionData) => Promise<void>;
}
