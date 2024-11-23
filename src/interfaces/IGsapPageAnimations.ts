import type { IDisposableAnimations } from './IDisposableAnimations';

interface IGsapAnimations extends IDisposableAnimations {
  gsapTargets: Map<string, JQuery<HTMLElement>>;
  tweens: gsap.core.Tween[];
}

export class GsapAnimations implements IGsapAnimations {
  public disposableTargets: Map<string, JQuery<HTMLElement>>;
  public gsapTargets: Map<string, JQuery<HTMLElement>>;
  public tweens: gsap.core.Tween[] = [];

  constructor(
    gsapTargets: Map<string, JQuery<HTMLElement>>,
    disposableTargets: Map<string, JQuery<HTMLElement>>
  ) {
    this.disposableTargets = disposableTargets;
    this.gsapTargets = gsapTargets;
  }

  public newTween(tween: gsap.core.Tween) {
    this.tweens.push(tween);
  }

  public clearAnimation(tween: gsap.core.Tween) {
    const index = this.tweens.findIndex((t) => t === tween);
    const tw = this.tweens.splice(index, 1);
    tw[0].kill();
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

export interface IGsapPageAnimations {
  gsapAnimations: GsapAnimations;
}
