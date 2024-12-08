import 'lettering.js';
import 'textillate';
import 'textillate/assets/animate.css';
import '../../public/timeline.min.css';
import '../Components/timeline/timeline.min.js';

import type { ITransitionData } from '@barba/core/dist/core/src/src/defs';
import { Flip, gsap, ScrollTrigger } from 'gsap/all';
import $ from 'jquery';
import type { ICarouselAnimations } from 'src/interfaces/ICarouselAnimations';
import type { IDisposableAnimations } from 'src/interfaces/IDisposableAnimations';
import type { IGsapPageAnimations } from 'src/interfaces/IGsapPageAnimations';
import { GsapAnimations } from 'src/interfaces/IGsapPageAnimations';
import type { IMouseEventAnimations } from 'src/interfaces/IMouseEventAnimations';
import type { IPageAnimations } from 'src/interfaces/IPageAnimations';
import { GlobalPageAnimations } from 'src/interfaces/IPageAnimations';
import { PageElements } from 'src/interfaces/IPageAnimations';
import type { IResizePageAnimations } from 'src/interfaces/IResizePageAnimations';

import { LeafletMapComponent } from '../Components/map';

export class ChurchContentAnimations
  implements
    IPageAnimations,
    IResizePageAnimations,
    IDisposableAnimations,
    IGsapPageAnimations,
    IMouseEventAnimations
{
  private _targetState: string;

  private _priestCarousel: PriestCarousel;

  private _map: LeafletMapComponent;

  private _mapTL: gsap.core.Timeline;

  gsapAnimations: GsapAnimations;

  disposePageAnimations = () => {
    this.gsapAnimations.disposePageAnimations();
    this._map.disposePageAnimations();
  };

  onResizeHandler = {
    handler: (self: ChurchContentAnimations) => {
      $(window).on('resize', () => {
        if (self._map) self._map.onResizeHandler.handler(self._map);
      });
    },
    dispose: () => {
      $(window).off('resize');
    },
  };

  pageElements: PageElements<
    readonly [
      '.churches-content',
      '.churches-content-subheading',
      '.church-content-cta',
      '.churches-content-images',
      '.map-pin',
      '.find-us',
      '.loc-invitation',
      '.loc-content',
      '.church-content-hero-section',
      '.map',
      '.timeline',
      '.timeline__content',
    ]
  >;

  supportAnimations: typeof GlobalPageAnimations;

  namespace: string = 'churches-content';

  private LoadTimeline = () => {
    // @ts-ignore
    this.pageElements.el.timeline.timeline({
      forceVerticalMode: 800,
      mode: 'horizontal',
      visibleItems: 4,
    });
  };

  initializeBaseState = () => {
    this.pageElements.el.churchesContent.css('display', 'none');

    this.pageElements.el.churchesContentSubheading.css('opacity', 0);

    this.pageElements.el.churchContentCta.css('opacity', 0);

    this.pageElements.el.churchesContentImages.css('opacity', 0);
  };

  initElements = () => {
    this.supportAnimations = GlobalPageAnimations;

    this.gsapAnimations = new GsapAnimations();

    this._targetState = 'New South Wales';

    this.pageElements = new PageElements([
      '.churches-content',
      '.churches-content-subheading',
      '.church-content-cta',
      '.churches-content-images',
      '.map-pin',
      '.find-us',
      '.loc-invitation',
      '.loc-content',
      '.church-content-hero-section',
      '.map',
      '.timeline',
      '.timeline__content',
    ] as const);

    this._priestCarousel = new PriestCarousel(this.gsapAnimations, this.supportAnimations);

    this._mapTL = gsap.timeline();

    this.gsapAnimations.newItem(this._mapTL);

    this.initializeBaseState();

    const zoom = Math.min(($('.loc-grid').width() / 1366.1) * 4.2, 4.2);

    this._map = new LeafletMapComponent(
      this.pageElements.el.map,
      (feature: any) =>
        feature.properties.STATE_NAME === this._targetState ? '#ffffff90' : '#ffffff25',
      '#ffffff',
      {
        zoomControl: false,
        zoom: zoom,
        minZoom: zoom,
        maxZoom: zoom,
        dragging: false,
        scrollWheelZoom: false,
      },
      this.gsapAnimations,
      (feature: any) => (feature.properties.STATE_NAME === this._targetState ? 'active-layer' : ''),

      this.pageElements.el.mapPin,

      this.pageElements.el.locInvitation
    );
  };

  private animateHeading = (): void => {
    const { churchesContent, churchesContentImages, churchContentCta, churchesContentSubheading } =
      this.pageElements.el;

    const { _mapTL } = this;
    $(async () => {
      churchesContent.css('display', 'unset');
      await (<any>churchesContent).textillate({
        minDisplayTime: 2000,
        autoStart: true,
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
          _mapTL.to(churchesContentSubheading, { opacity: 1, duration: 1 }, 0);
          _mapTL.to(churchContentCta, { opacity: 1, duration: 1 }, 0);
          _mapTL.to(churchContentCta, { opacity: 1, duration: 1 }, 0);
          _mapTL.to(churchesContentImages, { opacity: 1, duration: 1, stagger: 0.3 }, 1);
          _mapTL.from(churchesContentImages, { translateX: '-10em', duration: 1 }, 1);
        },
        type: 'char',
      });
    });
  };

  private animateLocationSection = () => {
    const { locContent } = this.pageElements.el;

    gsap.from(locContent, {
      scrollTrigger: {
        trigger: locContent,
        start: 'top 40%',
        onEnter: () => {
          gsap.fromTo(
            locContent.children(),
            {
              opacity: 0,
              translateY: '2em',
            },
            {
              opacity: 1,
              stagger: 0.5,
              translateY: '0',
              duration: 1,
            }
          );
          if (this._map.getLeaderLines().length > 0)
            for (const line of this._map.getLeaderLines()) line.show('draw', { duration: 2000 });
        },
        onLeaveBack: () => {
          if (this._map.getLeaderLines().length > 0)
            for (const line of this._map.getLeaderLines()) line.hide();
        },
      },
    });

    gsap.set(locContent.children(), { opacity: 0 });
  };

  afterEnter = async (_data: ITransitionData) => {
    $(async () => {
      this.initElements();

      this.onResizeHandler.handler(this);

      this.LoadTimeline();

      await this.supportAnimations.logoAnimations.animateLogo();

      this.animateHeading();

      this.onMouseEnterHandler.handler(this);

      this.onMouseLeaveHandler.handler(this);

      this.animateLocationSection();

      this.supportAnimations.navBarAnimations.animateScrollButton(
        this.pageElements.el.churchContentHeroSection
      );
    });
  };

  //beforeEnter = async (_data: ITransitionData) => {
  //  this.supportAnimations.footerAnimations.animateFooterWhite();
  //};

  beforeLeave = async (_data: ITransitionData) => {
    this.disposePageAnimations();
  };

  afterLeave = async (_data: ITransitionData) => {
    this.supportAnimations.cursorAnimations.cursorBlue();
  };

  onMouseEnterHandler = {
    handler(self: ChurchContentAnimations) {
      const animateChurchImageHover = (): void => {
        const children = self.pageElements.el.churchesContentImages.children();
        children.each((_, e) => {
          $(e).on('mouseover', () => {
            const state = Flip.getState(e);
            children.each((_, child) => {
              $(child).removeClass('secondary');
              $(child).removeClass('tertiary');
            });
            const otherImages = self.pageElements.el.churchesContentImages
              .children()
              .filter((_, el) => el !== e);
            $(otherImages[0]).addClass('secondary');
            $(otherImages[1]).addClass('tertiary');
            Flip.from(state, {
              duration: 1,
              ease: 'power1.inOut',
              absolute: true,
            });
          });
        });
      };

      self.pageElements.el.timeline__content.on('mouseover', () =>
        self.supportAnimations.cursorAnimations.cursorWhite()
      );

      self.pageElements.el.findUs.on('mouseover', () =>
        self.supportAnimations.cursorAnimations.cursorWhite()
      );

      animateChurchImageHover();
    },
    dispose(self: ChurchContentAnimations) {
      const children = self.pageElements.el.churchesContentImages.children();
      children.each((_, e) => {
        $(e).off('mouseover');
      });
      self.pageElements.el.timeline__content.off('mouseover');
      self.pageElements.el.findUs.off('mouseover');
    },
  };

  onMouseLeaveHandler = {
    handler(self: ChurchContentAnimations) {
      self.pageElements.el.timeline__content.on('mouseleave', () =>
        self.supportAnimations.cursorAnimations.cursorBlue()
      );

      self.pageElements.el.findUs.on('mouseleave', () =>
        self.supportAnimations.cursorAnimations.cursorBlue()
      );
    },
    dispose(self: ChurchContentAnimations) {
      self.pageElements.el.timeline__content.on('mouseleave', () =>
        self.supportAnimations.cursorAnimations.cursorBlue()
      );

      self.pageElements.el.findUs.on('mouseleave', () =>
        self.supportAnimations.cursorAnimations.cursorBlue()
      );
    },
  };
}

class PriestCarousel implements ICarouselAnimations {
  private _animationTL: gsap.core.Timeline;

  private _controlsTL: gsap.core.Timeline;

  private _supportingAnimations: typeof GlobalPageAnimations;

  pageElemets: PageElements<
    ['.priest-container', '.priests-carousel', '.controls', '.pause', '.play']
  >;

  gsapAnimations: GsapAnimations;

  initElements = () => {
    this.pageElemets = new PageElements([
      '.priest-container',
      '.priests-carousel',
      '.controls',
      '.pause',
      '.play',
    ] as const);
  };

  constructor(gsapAnimations: GsapAnimations, supportAnimations: typeof GlobalPageAnimations) {
    $(() => {
      this.initElements();
      this._animationTL = gsap.timeline({ repeat: -1, repeatDelay: 0, paused: true });
      this._controlsTL = gsap.timeline({ repeat: -1, repeatDelay: 1, paused: true });
      this.gsapAnimations = gsapAnimations;
      this._supportingAnimations = supportAnimations;
      this.gsapAnimations.newItems([this._animationTL, this._controlsTL]);
      this.pageElemets.el.controls.children().remove();
      this.onMouseEnterHandler.handler(this);
      this.onMouseLeaveHandler.handler(this);
      this.onMouseClickHandler.handler(this);
      this.animateButtons();
      this.animateCarousel();
    });
  }

  animateCarousel = () => {
    const { priestContainer, priestsCarousel, play, pause } = this.pageElemets.el;

    priestContainer.each((i, e) => {
      this.animatePriestContainer(i, $(e));
      this.animatePins(i, $(e));
    });

    ScrollTrigger.create({
      trigger: priestsCarousel,
      start: 'top 50%',
      onEnter: () => {
        //this.resumeCarousel();
        play.trigger('click');
      },
      onEnterBack: () => {
        //this.resumeCarousel();
        play.trigger('click');
      },
      onLeave: () => {
        //this.pauseCarousel();
        pause.trigger('click');
      },
      onLeaveBack: () => {
        //this.pauseCarousel();
        pause.trigger('click');
      },
    });
  };

  nextSlide = (i: number, el: JQuery<HTMLElement>) => {
    const { priestContainer, priestsCarousel } = this.pageElemets.el;
    const width = priestContainer.width();
    const playDuration = 5;

    const tween = this._animationTL.to(
      priestsCarousel,
      {
        translateX: i !== priestContainer.length - 1 ? -width * (i + 1) : 0,
        duration: 1,
        onStart: () => {
          this.animateUnfocusedSlide($(el));
          i !== priestContainer.length - 1
            ? this.animateFocusedSlide($(priestContainer.get(i + 1)))
            : this.animateFocusedSlide($(priestContainer.get(0)));
        },
      },
      playDuration * (i + 1)
    );

    this.gsapAnimations.newItem(tween);
  };

  private animatePriestContainer = (i: number, e: JQuery<HTMLElement>): void => {
    //const { priestContainer } = this.pageElemets.el;

    this._animationTL.addLabel(`slide-${i}`);

    this.nextSlide(i, e);

    $(e).on('click', () => {
      this.animateFocusedSlide($(e));
      this._animationTL.seek(`slide-${i}`, false);
    });
  };

  onMouseEnterHandler = {
    handler(self: PriestCarousel) {
      self.pageElemets.el.priestContainer.on('mouseover', () =>
        self._supportingAnimations.cursorAnimations.cursorWhite()
      );
    },
    dispose(self: PriestCarousel) {
      self.pageElemets.el.priestContainer.off('mouseleave');
    },
  };

  onMouseLeaveHandler = {
    handler(self: PriestCarousel) {
      self.pageElemets.el.priestContainer.on('mouseleave', () =>
        self._supportingAnimations.cursorAnimations.cursorBlue()
      );
    },
    dispose(self: PriestCarousel) {
      self.pageElemets.el.priestContainer.off('mouseleave');
    },
  };

  animateFocusedControls = (e: HTMLElement | JQuery<HTMLElement>): void => {
    this.gsapAnimations.newItem(
      gsap.to(e, { overflow: 'hidden', width: '4rem', borderRadius: '1rem', duration: 1 })
    );
  };

  animateUnfocusedControls = (e: HTMLElement | JQuery<HTMLElement>): void => {
    const firstTween = gsap.set(e, {
      overflow: 'unset',
      width: '1rem',
      borderRadius: '100%',
      duration: 1,
    });

    const secondTween = gsap.set($(e).children(), { width: 0 });

    this.gsapAnimations.newItems([firstTween, secondTween]);
  };

  animateFocusedSlide = (el: JQuery<HTMLElement>) => {
    const siblings = el
      .parent()
      .children()
      .filter((_, e) => e !== el[0]);

    siblings.each((_, e) => {
      this.animateUnfocusedSlide($(e));
    });

    const tween = gsap.to(el, {
      backgroundColor: 'var(--cursor-inner)',
      boxShadow:
        '0 0 0 0 rgba(0,0,0,0), 0 1.8px 5.8px 0 rgba(0,0,0,0.042), 0 3.9px 11.7px 0 rgba(0,0,0,0.05), 0 6.7px 18px 0 rgba(0,0,0,0.054), 0 11.5px 25.3px 0 rgba(0,0,0,0.057), 0 22.6px 35.9px 0 rgba(0,0,0,0.062)',
      opacity: 1,
      duration: 2,
    });
    this.gsapAnimations.newItem(tween);
  };

  animateUnfocusedSlide = (el: JQuery<HTMLElement>) => {
    const tween = gsap.to(el, {
      backgroundColor: 'var(--cursor-center)',
      boxShadow: 'unset',
      opacity: 0.5,
      duration: 1,
    });
    this.gsapAnimations.newItem(tween);
  };

  animatePins = (i: number, el: JQuery<HTMLElement>) => {
    const playDuration = 5;

    const { controls } = this.pageElemets.el;

    this._controlsTL.addLabel(`slide-${i}`);

    this._controlsTL.to(
      $(controls.children()[i]).children(),
      {
        duration: playDuration,
        width: '100%',
        onStart: () => {
          this.animateFocusedControls($(controls.children()[i]));
        },
        onComplete: () => {
          this.animateUnfocusedControls($(controls.children()[i]));
          $(controls.children()[i]).children().width(0);
        },
      },
      playDuration * i
    );

    $(el).on('click', () => {
      controls
        .children()
        .filter((index) => index !== i)
        .each((_, e) => {
          this.animateUnfocusedControls($(e));
        });
      //const children = $(controls.children());
      //this.animateFocusedControls(children[i]);
      //$(children.children()[i]).width(0);
      this._controlsTL.seek(`slide-${i}`, false);
    });
  };

  animateButtons = () => {
    const { priestContainer, controls } = this.pageElemets.el;

    priestContainer.each((i, _) => {
      const pin = document.createElement('div');
      const pinFiller = document.createElement('div');
      $(pinFiller).addClass('slide-pin-filler');
      $(pin).addClass('slide-pin');
      if (i === 0) $(pin).addClass('active');
      $(pin).append(pinFiller);
      controls.append(pin);
    });
  };

  onMouseClickHandler = {
    handler(self: PriestCarousel) {
      const { pause, play } = self.pageElemets.el;

      pause.on('click', () => {
        if (self._animationTL) self._animationTL.pause();
        if (self._controlsTL) self._controlsTL.pause();
        pause.css('display', 'none');
        play.css('display', 'block');
      });

      play.on('click', () => {
        if (self._animationTL) self._animationTL.resume();
        if (self._controlsTL) self._controlsTL.resume();
        play.css('display', 'none');
        pause.css('display', 'block');
      });
    },
    dispose(self: PriestCarousel) {
      const { pause, play } = self.pageElemets.el;
      pause.off('click');
      play.off('click');
    },
  };
}
