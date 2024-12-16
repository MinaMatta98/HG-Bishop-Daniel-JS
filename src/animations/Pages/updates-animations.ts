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

  private _el = ['.section-glow', '.item-section', '.webgl'] as const;

  //onMouseEnterHandler = {
  //  handler(self: UpdatePageAnimations) {
  //    const { itemSection, sectionGlow, webgl } = self.pageElements.el;
  //
  //    const tween = gsap.set(sectionGlow, { display: 'none' });
  //
  //    self.gsapAnimations.newItem(tween);
  //
  //    webgl.on('mouseenter', () => {
  //      self.supportAnimations.cursorAnimations.cursorWhite();
  //    });
  //
  //    itemSection.on('mouseenter', () => {
  //      self.supportAnimations.cursorAnimations.cursorWhite();
  //      self.gsapAnimations.newItem(gsap.set(sectionGlow, { display: 'block' }));
  //    });
  //  },
  //  dispose(self: UpdatePageAnimations) {
  //    self.pageElements.el.webgl.off('mouseenter');
  //    self.pageElements.el.itemSection.off('mouseenter');
  //  },
  //};

  //onMouseMoveHandler = {
  //  handler(self: UpdatePageAnimations) {
  //    const { itemSection, sectionGlow } = self.pageElements.el;
  //
  //    const onMouseMove = (e: MouseEvent) => {
  //      // Calculate the center coordinates of the circle
  //      const centerX = e.pageX - sectionGlow.width();
  //      const centerY = e.pageY - itemSection.position().top - sectionGlow[0].offsetHeight / 2;
  //
  //      // Update the position of the sectionGlow based on the center coordinates
  //      sectionGlow.css('left', centerX + 'px');
  //      sectionGlow.css('top', centerY + 'px');
  //    };
  //
  //    document.addEventListener('mousemove', onMouseMove);
  //  },
  //  dispose(_self: UpdatePageAnimations) {
  //    $(document).off('mousemove');
  //  },
  //};

  //onMouseLeaveHandler = {
  //  handler(self: UpdatePageAnimations) {
  //    const circle = self.pageElements.el.sectionGlow;
  //
  //    self.pageElements.el.itemSection.on('mouseleave', () =>
  //      gsap.set(circle, { display: 'none' })
  //    );
  //  },
  //  dispose(self: UpdatePageAnimations) {
  //    self.pageElements.el.itemSection.off('mouseleave');
  //  },
  //};

  pageElements: PageElements<typeof this._el>;

  supportAnimations = GlobalPageAnimations;

  namespace: string = 'updates';

  private _globeAnimation: GlobeAnimation;

  initElements = () => {
    this.namespace = 'ministry';
    this.gsapAnimations = new GsapAnimations();
    this.pageElements = new PageElements(this._el);
    this._globeAnimation = new GlobeAnimation(false, this.gsapAnimations);
  };

  initializeBaseState = async () => {
    this._globeAnimation.animateComponent();
  };

  afterEnter = async (_data: ITransitionData) => {
    $(async () => {
      this.initElements();
      this.supportAnimations.navBarAnimations.animateScrollButton(this.pageElements.el.webgl!);
      this.supportAnimations.logoAnimations.animateLogo();
      await this.initializeBaseState();
      //this.onMouseEnterHandler.handler(this);
      //this.onMouseLeaveHandler.handler(this);
      //this.onMouseMoveHandler.handler(this);
    });
  };
}
