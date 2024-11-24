import gsap from 'gsap/all';

import type { IDisposableAnimations } from './IDisposableAnimations';

interface IGsapAnimations extends IDisposableAnimations {
  gsapTargets?: Map<string, JQuery<HTMLElement>>;
  tweens: gsap.core.Animation[];
}

export class GsapAnimations implements IGsapAnimations {
  public disposableTargets?: Map<string, JQuery<HTMLElement>>;
  public gsapTargets?: Map<string, JQuery<HTMLElement>>;
  public tweens: gsap.core.Animation[] = [];

  constructor(
    gsapTargets?: Map<string, JQuery<HTMLElement>>,
    disposableTargets?: Map<string, JQuery<HTMLElement>>
  ) {
    this.disposableTargets = disposableTargets;
    this.gsapTargets = gsapTargets;
  }

  public newItem(tween: gsap.core.Animation) {
    this.tweens.push(tween);
  }

  public newItems(tweens: gsap.core.Animation[]) {
    for (const tween of tweens) {
      this.tweens.push(tween);
    }
  }

  public clearAnimation(tween: gsap.core.Animation) {
    const index = this.tweens.findIndex((t) => t === tween);
    const tw = this.tweens.splice(index, 1);

    if (tw[0]) {
      if (tw[0] instanceof gsap.core.Timeline) {
        tw[0].clear();
      }

      tw[0].kill();
    }

    tw.pop();
  }

  public disposePageAnimations() {
    for (const tween of this.tweens) {
      tween.kill();
    }
    this.tweens.length = 0;
    this.tweens = [];
  }
}

export class GsapComponentAnimations extends GsapAnimations {
  public gsapPageAnimations: GsapAnimations;
  /**
   *
   */
  constructor(
    gsapPageAnimations: GsapAnimations,
    gsapTargets?: Map<string, JQuery<HTMLElement>>,
    disposableTargets?: Map<string, JQuery<HTMLElement>>
  ) {
    super(gsapTargets, disposableTargets);
    this.gsapPageAnimations = gsapPageAnimations;
  }
}

/**
 * Main Page animations class
 */
export interface IGsapPageAnimations {
  gsapAnimations: GsapAnimations;
}

/**
 * Supporting component animations class. This is used so that IGsapPageAnimations can be shared amongst page components.
 */
export interface IGsapComponentAnimations {
  pageElements: Map<string, JQuery<HTMLElement>>;
  gsapComponentAnimations: GsapComponentAnimations;
  animateComponent: () => void;
}
