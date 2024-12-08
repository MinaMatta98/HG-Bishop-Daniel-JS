import type { ITransitionData } from '@barba/core/dist/core/src/src/defs';
import { tsParticles } from '@tsparticles/engine';
import { gsap } from 'gsap/all';
import $ from 'jquery';
import type { IDisposableAnimations } from 'src/interfaces/IDisposableAnimations';
import type { IGsapPageAnimations } from 'src/interfaces/IGsapPageAnimations';
import { GsapAnimations } from 'src/interfaces/IGsapPageAnimations';
import type { IMouseEventAnimations } from 'src/interfaces/IMouseEventAnimations';
import type { IPageAnimations } from 'src/interfaces/IPageAnimations';
import { PageElements } from 'src/interfaces/IPageAnimations';
import { GlobalPageAnimations } from 'src/interfaces/IPageAnimations';
import { loadFull } from 'tsparticles';

import * as animation from '../animation.json';
import { GlobeAnimation } from '../Components/globe';

export class MinistryPageAnimations
  implements IPageAnimations, IMouseEventAnimations, IGsapPageAnimations, IDisposableAnimations
{
  disposePageAnimations = () => {
    this.gsapAnimations.disposePageAnimations();
    this._globeAnimation.disposePageAnimations();
  };

  gsapAnimations: GsapAnimations;

  onMouseEnterHandler = {
    handler(self: MinistryPageAnimations) {
      const { itemSection, sectionGlow } = self.pageElements.el;

      const tween = gsap.set(sectionGlow, { display: 'none' });

      self.gsapAnimations.newItem(tween);

      itemSection.on('mouseenter', () => {
        self.supportAnimations.cursorAnimations.cursorWhite();
        self.gsapAnimations.newItem(gsap.set(sectionGlow, { display: 'block' }));
      });
    },
    dispose(self: MinistryPageAnimations) {
      self.pageElements.el.itemSection.off('mouseenter');
    },
  };

  onMouseMoveHandler = {
    handler(self: MinistryPageAnimations) {
      const { itemSection, sectionGlow } = self.pageElements.el;

      const onMouseMove = (e: MouseEvent) => {
        // Calculate the center coordinates of the circle
        const centerX = e.pageX - sectionGlow.width();
        const centerY = e.pageY - itemSection.position().top - sectionGlow[0].offsetHeight / 2;

        // Update the position of the sectionGlow based on the center coordinates
        sectionGlow.css('left', centerX + 'px');
        sectionGlow.css('top', centerY + 'px');
      };

      document.addEventListener('mousemove', onMouseMove);
    },
    dispose(_self: MinistryPageAnimations) {
      console.log('dispose');
      $(document).off('mousemove');
    },
  };

  onMouseLeaveHandler = {
    handler(self: MinistryPageAnimations) {
      const circle = self.pageElements.el.sectionGlow;

      self.pageElements.el.itemSection.on('mouseleave', () =>
        gsap.set(circle, { display: 'none' })
      );
    },
    dispose(self: MinistryPageAnimations) {
      self.pageElements.el.itemSection.off('mouseleave');
    },
  };

  pageElements: PageElements<['.section-glow', '.item-section', '.webgl']>;

  supportAnimations = GlobalPageAnimations;

  namespace: string = 'ministry';

  private _globeAnimation: GlobeAnimation;

  initElements = () => {
    this.namespace = 'ministry';
    this.gsapAnimations = new GsapAnimations();
    this.pageElements = new PageElements(['.section-glow', '.item-section', '.webgl'] as const);
    this._globeAnimation = new GlobeAnimation(false, this.gsapAnimations);
  };

  initializeBaseState = async () => {
    this._globeAnimation.animateComponent();

    await loadFull(tsParticles);
    tsParticles.load({
      id: 'item-container',
      // @ts-ignore
      options: animation,
      // url: "http://foo.bar/particles.js // this can be used as an alternative to options property
    });
  };

  afterEnter = async (_data: ITransitionData) => {
    $(async () => {
      this.initElements();
      this.supportAnimations.navBarAnimations.animateScrollButton(this.pageElements.el.webgl!);
      this.supportAnimations.logoAnimations.animateLogo();
      await this.initializeBaseState();
      this.onMouseEnterHandler.handler(this);
      this.onMouseLeaveHandler.handler(this);
      this.onMouseMoveHandler.handler(this);
      this.supportAnimations.footerAnimations.animateFooterBlue();
      this.supportAnimations.cursorAnimations.cursorWhite();
    });
  };

  beforeEnter = async (_data: ITransitionData) => {
    this.supportAnimations.footerAnimations.animateFooterBlue();
  };

  afterLeave = async () => {
    this.supportAnimations.cursorAnimations.cursorBlue();
    this.supportAnimations.footerAnimations.animateFooterWhite();
    this.disposePageAnimations();
  };
}
