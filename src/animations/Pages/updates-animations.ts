import type { ITransitionData } from '@barba/core/dist/core/src/src/defs';
import $ from 'jquery';
import type { IDisposableAnimations } from 'src/interfaces/IDisposableAnimations';
import type { IGsapPageAnimations } from 'src/interfaces/IGsapPageAnimations';
import { GsapAnimations } from 'src/interfaces/IGsapPageAnimations';
import type { IPageAnimations } from 'src/interfaces/IPageAnimations';
import { PageElements } from 'src/interfaces/IPageAnimations';
import { GlobalPageAnimations } from 'src/interfaces/IPageAnimations';

import { GlobeAnimation } from '../Components/globe';

export class UpdatePageAnimations
  implements IPageAnimations, IGsapPageAnimations, IDisposableAnimations
{
  disposePageAnimations = () => {
    this.gsapAnimations.disposePageAnimations();
    this._globeAnimation.disposePageAnimations();
  };

  gsapAnimations: GsapAnimations;

  EL = ['.item-section'] as const;

  pageElements: PageElements<typeof this.EL>;

  supportAnimations = GlobalPageAnimations;

  namespace: string = 'updates';

  private _globeAnimation: GlobeAnimation;

  initElements = () => {
    this.gsapAnimations = new GsapAnimations();
    this.pageElements = new PageElements(this.EL);
    this._globeAnimation = new GlobeAnimation(false, this.gsapAnimations);
  };

  initializeBaseState = async () => {
    this._globeAnimation.animateComponent();
  };

  afterEnter = async (_data: ITransitionData) => {
    $(async () => {
      this.initElements();
      this.supportAnimations.navBarAnimations.animateScrollButton(this.pageElements.el.itemSection);
      this.supportAnimations.logoAnimations.animateLogo();
      await this.initializeBaseState();
    });
  };
}
