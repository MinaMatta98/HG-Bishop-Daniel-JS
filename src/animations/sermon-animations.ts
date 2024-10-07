import 'lettering.js';
import 'textillate';
import 'textillate/assets/animate.css';

import { gsap } from 'gsap/all';
import $ from 'jquery';

import { Animations } from './animations';
import { LogoAnimations } from './logo-animations';
import { NavBarAnimations } from './navbar-animations';

export class SermonPageAnimations {
  private _sermonsHeading: JQuery<HTMLHeadingElement>;
  private _sermonScene: JQuery<HTMLElement>;
  private _sermonBlock: JQuery<HTMLDivElement>;
  private _pages: JQuery<HTMLElement>;
  private _circle: JQuery<HTMLElement>;
  private _itemSection: JQuery<HTMLElement>;
  private _scrollTL: gsap.core.Tween;
  constructor() {}

  private animateItemSection = (): void => {
    this._circle = $('.section-glow');
    this._itemSection = $('.item-section');
    gsap.set(this._circle, { display: 'none' });

    this._itemSection.on('mouseenter', () => {
      Animations.cursorWhite();
      if (this._circle !== undefined) gsap.set(this._circle, { display: 'block' });
    });

    this._itemSection.on('mouseleave', () => {
      if (this._circle !== undefined) gsap.set(this._circle, { display: 'none' });
    });

    const onMouseMove = (e: MouseEvent) => {
      if (this._circle === undefined) return;
      const centerX = e.pageX - this._circle.width();
      const centerY = e.pageY - this._itemSection.position().top - this._circle[0].offsetHeight / 2;
      this._circle.css('left', centerX + 'px');
      this._circle.css('top', centerY + 'px');
    };

    document.addEventListener('mousemove', onMouseMove);
  };

  private animateNavbarButton = (navbarAnimator: NavBarAnimations): void => {
    navbarAnimator.animateScrollButton($('.sermon-container'));
  };

  private animateHeading = async (): Promise<void> => {
    $(async () => {
      let { _sermonScene, _sermonsHeading, _sermonBlock } = this;
      _sermonsHeading.css('display', 'unset');
      await (<any>_sermonsHeading).textillate({
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
          _sermonBlock = $('.sermon-title-block');

          await gsap.to(_sermonsHeading, { opacity: 0, duration: 1 });
          gsap.set(_sermonBlock, {
            width: '0%',
            translateY: '-15em',
            left: '0',
            transform: 'translate(0, -50%)',
            textAlign: 'unset',
            position: 'relative',
          });

          _sermonsHeading.text('');

          //gsap.to(_sermonBlock, { translateY: '0', duration: 3 });
          gsap.to(_sermonsHeading, { opacity: 1, duration: 1 });
          gsap.to(_sermonScene, { opacity: 1, duration: 1 });
          //await animateHero();
        },
        type: 'char',
      });
    });
  };

  private scroll = (index: number) => {
    if (this._scrollTL !== undefined) this._scrollTL.kill();
    this._scrollTL = gsap.to(window, {
      scrollTo: { y: $(this._pages[index]).position().top },
      duration: 1,
      ease: 'power2.inOut',
    });
  };

  private animatePagePiling = () => {
    $(() => {
      this._pages = $('.piling');
      this._pages.each((index, page) => {
        gsap.to(page, {
          scrollTrigger: {
            trigger: page,
            start: 'top top',
            //end: 'bottom bottom',
            //snap: 1,
            markers: true,
            onEnter: async () => {
              if (this._pages[index + 1] !== undefined) {
                this.scroll(index + 1);
              }
            },
            onEnterBack: () => {
              this.scroll(index);
            },
          },
        });
      });
    });
  };

  public animateSermonPage = async (navbarAnimator: NavBarAnimations): Promise<void> => {
    this._sermonsHeading = $('.sermon-heading');
    this._sermonScene = $('.sermon-scene');
    this.animateNavbarButton(navbarAnimator);
    this._sermonsHeading.css('display', 'none');
    this._sermonScene.css('opacity', '0');
    this.animatePagePiling();
    await LogoAnimations.animateLogo();
    this.animateItemSection();
    this.animateHeading();
  };
}
