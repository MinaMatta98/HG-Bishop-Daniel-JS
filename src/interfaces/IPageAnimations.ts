import type { ISchemaPage, ITransitionData } from '@barba/core/dist/core/src/src/defs';
import { ScrollTrigger } from 'gsap/all';
import $ from 'jquery';
import { FooterAnimations } from 'src/animations/Components/footerAnimations';
import { LogoAnimations } from 'src/animations/Components/logo-animations';
import { ProgressBarAnimations } from 'src/animations/Components/progressbar';
import { TransitionAnimations } from 'src/animations/Components/transition';
import { CursorAnimations } from 'src/animations/UI/cursor-animations';
import { NavBarAnimations } from 'src/animations/UI/navbar-animations';
import { TOCAnimations } from 'src/animations/UI/toc';

import type { ICMSPageAnimations } from './ICMSPageAnimations';
import type { ICollectionAnimations } from './ICollectionAnimations';
import type { ICssAnimations } from './ICssAnimations';
import type { IDisposableAnimations } from './IDisposableAnimations';
import type { IElementsAnimations } from './IElementsAnimations';
import type { IGsapPageAnimations } from './IGsapPageAnimations';
import type { IMouseEventAnimations } from './IMouseEventAnimations';
import type { IResizePageAnimations } from './IResizePageAnimations';
/**
 * Interface for default page animations. These are animations that
 * do not really change from page to page and can therefore be standardized.
 */
export class GenericAnimations implements IGenericAnimations {
  globalPageAnimations: typeof GlobalPageAnimations;

  constructor(globalPageAnimations: typeof GlobalPageAnimations) {
    this.globalPageAnimations = globalPageAnimations;
  }

  private handleLinks = () => {
    const links = $('a[href]');
    const cbk = (e: JQuery.ClickEvent<HTMLElement>) => {
      const target = e.currentTarget as HTMLAnchorElement;

      if (target.href === window.location.href) {
        e.preventDefault();
        e.stopPropagation();
      }

      links.each((_, link) => {
        $(link).on('click', cbk);
      });
    };
  };

  enter = async <C extends ICssAnimations, M extends ICMSPageAnimations>(obj: {
    data: ITransitionData;
    cssTransClass?: C;
    cmsTransClass?: M;
  }) => {
    this.handleLinks();

    this.globalPageAnimations.tocAnimations.onResizeHandler.handler();

    this.globalPageAnimations.cursorAnimations.onResizeHandler();

    obj.cssTransClass?.loadCss();

    if (obj.cmsTransClass) {
      obj.cmsTransClass?.genericCMSAnimations.removeCss();
      obj.cmsTransClass?.genericCMSAnimations.replaceSpans();
      obj.cmsTransClass?.genericCMSAnimations.replaceLinks();
    }
  };

  before = async (obj: { data: ITransitionData }) => {
    obj.data.next.container.style.display = 'none';

    this.globalPageAnimations.navBarAnimations.disableNavLinks();

    this.globalPageAnimations.logoAnimations.disposePageAnimations();

    $(window).scrollTop(0);

    await this.globalPageAnimations.transitionAnimations.handleTransitionAnimation(true);
  };

  async leave<
    T extends IMouseEventAnimations,
    R extends IResizePageAnimations,
    G extends IGsapPageAnimations,
    D extends IDisposableAnimations,
    C extends ICssAnimations,
  >(obj: {
    data: ITransitionData;
    mouseEventTransClass?: T;
    resizeTransClass?: R;
    gsapTransClass?: G;
    disposableTransClass?: D;
    cssTransClass?: C;
  }) {
    this.globalPageAnimations.navBarAnimations.underlineNav(obj.data.current.namespace, false);

    this.globalPageAnimations.tocAnimations.disposePageAnimations();

    if (obj.mouseEventTransClass) {
      obj.mouseEventTransClass.onMouseLeaveHandler?.dispose(obj.mouseEventTransClass);
      obj.mouseEventTransClass.onMouseMoveHandler?.dispose(obj.mouseEventTransClass);
      obj.mouseEventTransClass.onMouseClickHandler?.dispose(obj.mouseEventTransClass);
      obj.mouseEventTransClass.onMouseEnterHandler?.dispose(obj.mouseEventTransClass);
      if (obj.mouseEventTransClass.onScrollEventHandler) {
        ScrollTrigger.killAll();
        obj.mouseEventTransClass.onScrollEventHandler?.dispose(obj.mouseEventTransClass);
      }
    }

    obj.resizeTransClass?.onResizeHandler?.dispose(obj.resizeTransClass);

    obj.gsapTransClass?.gsapAnimations.disposePageAnimations();

    obj.disposableTransClass?.disposePageAnimations();

    obj.cssTransClass?.unloadCss();
  }

  after = async <CL extends ICollectionAnimations>(obj: {
    data: ITransitionData;
    collectionTransClass?: CL;
  }) => {
    this.globalPageAnimations.tocAnimations.animateComponent();

    await obj.collectionTransClass?.animateFillers();

    switch (obj.data.next.namespace.toString()) {
      case 'sermons-content':
        obj.data.next.container.style.display = 'flex';
        break;
      default:
        obj.data.next.container.style.display = 'block';
    }

    this.globalPageAnimations.navBarAnimations.enableNavLinks();

    this.globalPageAnimations.progressBarAnimations.showProgress();

    await this.globalPageAnimations.transitionAnimations.handleTransitionAnimation(false);

    await this.globalPageAnimations.navBarAnimations.underlineNav(obj.data.next.namespace, true);

    this.globalPageAnimations.navBarAnimations.onResizeHandler();

    this.globalPageAnimations.cursorAnimations.cursorHover();
  };
}

export class GlobalPageAnimations {
  public static footerAnimations = FooterAnimations;
  public static logoAnimations = LogoAnimations;
  public static cursorAnimations = CursorAnimations;
  public static transitionAnimations = TransitionAnimations;
  public static progressBarAnimations = ProgressBarAnimations;
  public static navBarAnimations = new NavBarAnimations();
  public static tocAnimations = new TOCAnimations();
  public static genericAnimations = new GenericAnimations(this);
}

export interface IGenericTransitions {
  before: (obj: { data: ITransitionData }) => Promise<void>;

  enter: (obj: { data: ITransitionData }) => Promise<void>;

  leave: (obj: { data: ITransitionData }) => Promise<void>;

  after: (obj: { data: ITransitionData }) => Promise<void>;
}

interface IGenericAnimations extends IGenericTransitions {
  globalPageAnimations: GlobalPageAnimations;
}

export interface IComplexTransitions {
  once?: (data: ITransitionData, ...args: any[]) => Promise<void>;

  afterEnter?: (data: ITransitionData, ...args: any[]) => Promise<void>;

  afterLeave?: (data: ITransitionData) => Promise<void>;

  beforeEnter?: (data: ITransitionData) => Promise<void>;

  beforeLeave?: (data: ITransitionData) => Promise<void>;
}

/**
 * This is the interface for the page animations.
 */
export interface IPageAnimations extends IElementsAnimations, IComplexTransitions {
  supportAnimations: typeof GlobalPageAnimations;

  namespace: ISchemaPage['namespace'];
}

// Utility type to convert kebab-case, hash-prefixed, and dot-separated strings to camelCase
export type CamelCase<S extends string> = S extends `#${infer R}`
  ? `${CamelCase<R>}`
  : S extends `.${infer R}`
    ? `${CamelCase<R>}` // This ensures the dot remains, but the rest is camel-cased
    : S extends `${infer P}.${infer R}`
      ? `${P}${Capitalize<CamelCase<R>>}`
      : S extends `${infer P}-${infer R}`
        ? `${P}${Capitalize<CamelCase<R>>}`
        : S;

// Define the properties type based on the keys
export type ElementObjectProperties<T extends readonly string[]> = {
  [K in T[number] as CamelCase<K>]: JQuery<HTMLElement>;
};

// PageElements class to create an object with keys as properties
// and values as jQuery elements with TS type checking
export class PageElements<T extends readonly string[]> {
  public el: ElementObjectProperties<T>;

  public keys: T;

  constructor(keys: T) {
    this.el = {} as ElementObjectProperties<T>;

    this.keys = keys;

    for (const key of keys) {
      const camelCaseKey = this.toCamelCase(key);
      this.el[camelCaseKey] = $(key);
    }
  }

  // Extend method returns a new instance with combined keys
  extend<U extends string[]>(u: U): PageElements<readonly [...T, ...U]> {
    const filteredArr = this.keys.filter((key) => {
      for (const newKey of u) {
        if (key === newKey) {
          return false; // Exclude if the key already exists
        }
      }
      return true; // Include if no match is found
    });

    const keys = (<unknown>[...filteredArr, ...u]) as readonly [...T, ...U];

    return new PageElements<readonly [...T, ...U]>(keys);
  }

  public refresh<U extends T[number][]>(keys: U) {
    for (const key of keys) {
      const camelCaseKey = this.toCamelCase(key) as keyof ElementObjectProperties<T>; // Ensure the key is valid

      // Assign the correct type for `el[camelCaseKey]`
      this.el[camelCaseKey] = $(key) as ElementObjectProperties<T>[typeof camelCaseKey];
    }
  }

  // Generic method to convert kebab-case, hash-prefixed, and dot-separated strings to camelCase
  private toCamelCase<K extends string>(key: K): CamelCase<K> {
    // Check for leading dot and remove it for camelCase conversion
    const hasLeadingDot = key.startsWith('.');

    const hasLeadingHash = key.startsWith('#');

    const cleanKey = hasLeadingDot || hasLeadingHash ? key.slice(1) : key;

    const camelCasedKey = cleanKey
      .split(/[-.#]/)
      .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
      .join('');

    // Handle case where there was a leading dot in the key
    return hasLeadingDot ? (`${camelCasedKey}` as CamelCase<K>) : (camelCasedKey as CamelCase<K>);
  }
}
