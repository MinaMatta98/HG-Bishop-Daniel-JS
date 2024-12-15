import gsap, { ScrollTrigger } from 'gsap/all';

import type { IDisposableAnimations } from './IDisposableAnimations';
import type { IElementsAnimations } from './IElementsAnimations';
import type { PageElements } from './IPageAnimations';

interface IGsapAnimations extends IDisposableAnimations {
  gsapTargets?: PageElements<readonly string[]>;
  tweens: Partial<gsap.core.Animation | ScrollTrigger>[];
}

export class GsapAnimations implements IGsapAnimations {
  public disposableTargets?: PageElements<readonly string[]>;

  public gsapTargets?: PageElements<readonly string[]>;

  public tweens: Partial<gsap.core.Animation | ScrollTrigger>[] = [];

  constructor(
    gsapTargets?: PageElements<readonly string[]>,
    disposableTargets?: PageElements<readonly string[]>
  ) {
    this.disposableTargets = disposableTargets;
    this.gsapTargets = gsapTargets;
  }

  public newItem(tween: Partial<gsap.core.Animation | ScrollTrigger>) {
    this.tweens.push(tween);
  }

  public newItems(tweens: Partial<gsap.core.Animation>[]) {
    for (const tween of tweens) {
      this.tweens.push(tween);
    }
  }

  public clearAnimation(tween: Partial<gsap.core.Animation>) {
    const index = this.tweens.findIndex((t) => t === tween);
    const tw = this.tweens.splice(index, 1);

    if (tw[0]) {
      if (tw[0] instanceof gsap.core.Timeline) {
        tw[0].clear()!;
      }

      tw[0].kill()!;
    }

    tw.pop();
  }

  public disposePageAnimations() {
    for (const tween of this.tweens) {
      if (tween) {
        tween.kill();
      }
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
    gsapTargets?: PageElements<readonly string[]>,
    disposableTargets?: PageElements<readonly string[]>
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
export interface IGsapComponentAnimations extends IElementsAnimations {
  gsapComponentAnimations: GsapComponentAnimations;
  animateComponent: () => void;
}

export function instanceofIGsapPageAnimations(obj: any): obj is IGsapPageAnimations {
  return obj && typeof obj.gsapAnimations === 'object';
}
