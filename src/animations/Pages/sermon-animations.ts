import 'lettering.js';
import 'textillate';
import 'textillate/assets/animate.css';

import type { ITransitionData } from '@barba/core/dist/core/src/src/defs';
import { gsap } from 'gsap/all';
import $ from 'jquery';
import type { IGsapPageAnimations } from 'src/interfaces/IGsapPageAnimations';
import { GsapAnimations } from 'src/interfaces/IGsapPageAnimations';
import type { IMouseEventAnimations } from 'src/interfaces/IMouseEventAnimations';
import type { IPageAnimations } from 'src/interfaces/IPageAnimations';
import { PageElements } from 'src/interfaces/IPageAnimations';
import { GlobalPageAnimations } from 'src/interfaces/IPageAnimations';

import { PortablePlayer } from '../UI/Widgets/portable-player';

export class SermonPageAnimations
  implements IPageAnimations, IMouseEventAnimations, IGsapPageAnimations
{
  private _scrollTL: gsap.core.Tween;

  private _playerWidget: PortablePlayer;

  gsapAnimations: GsapAnimations;

  supportAnimations = GlobalPageAnimations;

  namespace: string = 'sermons';

  afterEnter = async (_data: ITransitionData) => {
    $(async () => {
      this.initElements();
      this.supportAnimations.navBarAnimations.animateScrollButton(
        this.pageElements.el.sermonContainer
      );
      this.pageElements.el.sermonHeading.css('display', 'none');
      this.pageElements.el.sermonScene.css('opacity', '0');
      this.onScrollEventHandler.handler(this);
      await this.supportAnimations.logoAnimations.animateLogo();
      const { onMouseEnterHandler, onMouseLeaveHandler, onMouseMoveHandler } = this;
      onMouseMoveHandler.handler(this);
      onMouseEnterHandler.handler(this);
      onMouseLeaveHandler.handler(this);
      this.animateHeading();
      this.animateItemSection();
    });
  };

  private animateHeading = async (): Promise<void> => {
    $(async () => {
      const { sermonScene, sermonHeading, sermonTitleBlock } = this.pageElements.el;
      const { gsapAnimations } = this;
      sermonHeading.css('display', 'unset');
      await (<any>sermonHeading).textillate({
        loop: false,
        minDisplayTime: 2000,
        initialDelay: 0,
        autoStart: true,
        inEffects: [],
        outEffects: ['hinge'],
        in: {
          effect: 'flipInY',
          delayScale: 1.5,
          delay: 25,
          sync: false,
          shuffle: false,
          reverse: false,
          callback: function () {},
        },

        out: {
          effect: 'hinge',
          delayScale: 1.5,
          delay: 50,
          sync: false,
          shuffle: false,
          reverse: false,
          callback: function () {},
        },
        callback: async function () {
          //sermonBlock = $('.sermon-title-block');

          const tween = await gsap.to(sermonHeading, { opacity: 0, duration: 1 });

          const secondTween = gsap.set(sermonTitleBlock, {
            width: '0%',
            translateY: '-15em',
            left: '0',
            transform: 'translate(0, -50%)',
            textAlign: 'unset',
            position: 'relative',
          });

          sermonHeading.text('');

          const thirdTween = gsap.to(sermonHeading, { opacity: 1, duration: 1 });

          const fourthTween = gsap.to(sermonScene, { opacity: 1, duration: 1 });

          gsapAnimations.newItems([tween, secondTween, thirdTween, fourthTween]);
        },
        type: 'char',
      });
    });
  };

  afterLeave?: (data: ITransitionData) => Promise<void>;

  beforeEnter?: (data: ITransitionData) => Promise<void>;

  beforeLeave?: (data: ITransitionData) => Promise<void>;

  pageElements: PageElements<
    [
      '.section-glow',
      '.item-section',
      '.sermon-container',
      '.sermon-scene',
      '.piling',
      '.sermon-heading',
      '.sermon-title-block',
      '.filler',
    ]
  >;

  initializeBaseState = () => {
    const { sectionGlow } = this.pageElements.el;
    this.gsapAnimations.newItem(gsap.set(sectionGlow, { display: 'none' }));
  };

  initElements = () => {
    this.namespace = 'sermons';
    this.pageElements = new PageElements([
      '.section-glow',
      '.item-section',
      '.sermon-container',
      '.sermon-scene',
      '.piling',
      '.sermon-heading',
      '.sermon-title-block',
      '.filler',
    ] as const);
    this.gsapAnimations = new GsapAnimations();
    this._playerWidget = new PortablePlayer();
  };

  onMouseEnterHandler = {
    handler(self: SermonPageAnimations) {
      const { itemSection, sectionGlow } = self.pageElements.el;

      itemSection.on('mouseenter', () => {
        if (sectionGlow !== undefined)
          self.gsapAnimations.newItem(gsap.set(sectionGlow, { display: 'block' }));
      });
    },
    dispose(self: SermonPageAnimations) {
      self.pageElements.el.itemSection.off('mouseenter');
    },
  };

  animateItemSection = () => {
    this.pageElements.el.filler.each((index, item) => {
      console.log(index, item);

      //if (index !== 0 && index !== 2) {
      //  $(item).css('display', 'none');
      //}
    });
  };

  onMouseLeaveHandler = {
    handler(self: SermonPageAnimations) {
      const { sectionGlow, itemSection } = self.pageElements.el;

      itemSection.on('mouseleave', () => {
        if (sectionGlow !== undefined)
          self.gsapAnimations.newItem(gsap.set(sectionGlow, { display: 'none' }));
      });
    },
    dispose(self: SermonPageAnimations) {
      self.pageElements.el.itemSection.off('mouseleave');
    },
  };

  onMouseMoveHandler = {
    handler(self: SermonPageAnimations) {
      const { sectionGlow, itemSection } = self.pageElements.el;
      const onMouseMove = (e: MouseEvent) => {
        if (sectionGlow === undefined) return;
        const centerX = e.pageX - sectionGlow.width();
        const centerY = e.pageY - itemSection.position().top - sectionGlow[0].offsetHeight / 2;
        sectionGlow.css('left', centerX + 'px');
        sectionGlow.css('top', centerY + 'px');
      };

      document.addEventListener('mousemove', onMouseMove);
    },
    dispose(_self: SermonPageAnimations) {
      $(document).off('mousemove');
    },
  };

  onScrollEventHandler = {
    handler(self: SermonPageAnimations) {
      const scroll = (index: number) => {
        if (self._scrollTL) self._scrollTL.kill();
        self._scrollTL = gsap.to(window, {
          scrollTo: { y: $(self.pageElements.el.piling[index]).position().top },
          duration: 1,
          ease: 'power2.inOut',
        });
        self.gsapAnimations.newItem(self._scrollTL);
      };

      self.pageElements.el.piling.each((index, page) => {
        const scrollTween = gsap.to(page, {
          scrollTrigger: {
            trigger: page,
            start: 'top top',
            //end: 'bottom bottom',
            //snap: 1,
            onEnter: async () => {
              if (self.pageElements.el.piling[index + 1] !== undefined) {
                scroll(index + 1);
              }
            },
            onEnterBack: () => {
              scroll(index);
            },
          },
        });
        self.gsapAnimations.newItem(scrollTween);
      });
    },
    dispose() {},
  };
}
