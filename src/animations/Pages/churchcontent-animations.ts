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
import type { IResizePageAnimations } from 'src/interfaces/IResizePageAnimations';

import { Mapper } from '$utils/mapper';

import { LeafletMapComponent } from '../Components/map';
import { CursorAnimations } from '../UI/cursor-animations';

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
    this.disposePageAnimations();
    this._map.disposeLeaderLines();
  };

  onResizeHandler = () => {
    $(window).on('resize', () => {
      const zoom = Math.min(($('.loc-grid').width() / 1366.1) * 4.2, 4.2);
      if (this._map)
        this._map.resize({
          zoomControl: false,
          zoom: zoom,
          minZoom: zoom,
          maxZoom: zoom,
          dragging: false,
          scrollWheelZoom: false,
        });
    });
  };

  pageElements: Map<string, JQuery<HTMLElement>>;

  supportAnimations: typeof GlobalPageAnimations;

  namespace: string;

  private LoadTimeline = () => {
    // @ts-ignore
    this.pageElements.get('.timeline').timeline({
      forceVerticalMode: 800,
      mode: 'horizontal',
      visibleItems: 4,
    });
  };

  initElements = () => {
    this.supportAnimations = GlobalPageAnimations;

    this.gsapAnimations = new GsapAnimations();

    this._targetState = 'New South Wales';

    this.namespace = 'church-content';

    this.pageElements = new Mapper([
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
    ]).map();

    this._priestCarousel = new PriestCarousel(this.gsapAnimations);

    this._mapTL = gsap.timeline();

    this.gsapAnimations.newItem(this._mapTL);

    this.pageElements.get('.churches-content').css('display', 'none');

    this.pageElements.get('.churches-content-subheading').css('opacity', 0);

    this.pageElements.get('.church-content-cta').css('opacity', 0);

    this.pageElements.get('.churches-content-images').css('opacity', 0);

    const zoom = Math.min(($('.loc-grid').width() / 1366.1) * 4.2, 4.2);

    this._map = new LeafletMapComponent(
      this.pageElements.get('.map'),
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
      (feature: any) => (feature.properties.STATE_NAME === this._targetState ? 'active-layer' : ''),

      this.pageElements.get('.map-pin'),

      this.pageElements.get('.loc-invitation')
    );
  };

  private animateHeading = (): void => {
    const heading = this.pageElements.get('.churches-content');
    const subHeading = this.pageElements.get('.churches-content-subheading');
    const ctaButton = this.pageElements.get('.church-content-cta');
    const churchImages = this.pageElements.get('.churches-content-images');
    const { _mapTL } = this;
    $(async () => {
      heading.css('display', 'unset');
      await (<any>heading).textillate({
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
          _mapTL.to(subHeading, { opacity: 1, duration: 1 }, 0);
          _mapTL.to(ctaButton, { opacity: 1, duration: 1 }, 0);
          _mapTL.to(ctaButton, { opacity: 1, duration: 1 }, 0);
          _mapTL.to(churchImages, { opacity: 1, duration: 1, stagger: 0.3 }, 1);
          _mapTL.from(churchImages, { translateX: '-10em', duration: 1 }, 1);
        },
        type: 'char',
      });
    });
  };

  private animateLocationSection = () => {
    const locContent = this.pageElements.get('.loc-content');
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

      this.onResizeHandler();

      this.LoadTimeline();

      await this.supportAnimations.logoAnimations.animateLogo();

      this.animateHeading();

      this.onMouseEnterHandler();

      this.onMouseLeaveHandler();

      this.animateLocationSection();

      this.supportAnimations.navBarAnimations.animateScrollButton(
        this.pageElements.get('.church-content-hero-section')
      );
    });
  };

  beforeEnter = async (_data: ITransitionData) => {
    this.supportAnimations.footerAnimations.animateFooterWhite();
  };

  afterLeave = async (_data: ITransitionData) => {
    this.disposePageAnimations();
  };

  onMouseEnterHandler = () => {
    const animateChurchImageHover = (): void => {
      const children = this.pageElements.get('.churches-content-images').children();
      children.each((_, e) => {
        $(e).on('mouseover', () => {
          const state = Flip.getState(e);
          children.each((_, child) => {
            $(child).removeClass('secondary');
            $(child).removeClass('tertiary');
          });
          const otherImages = this.pageElements
            .get('.churches-content-images')
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

    this.pageElements
      .get('.timeline__content')
      .on('mouseover', () => CursorAnimations.cursorWhite());

    this.pageElements.get('.find-us').on('mouseover', () => CursorAnimations.cursorWhite());

    animateChurchImageHover();
  };

  onMouseLeaveHandler = () => {
    this.pageElements
      .get('.timeline__content')
      .on('mouseleave', () => CursorAnimations.cursorBlue());

    this.pageElements.get('.find-us').on('mouseleave', () => CursorAnimations.cursorBlue());
  };
}

class PriestCarousel implements ICarouselAnimations {
  private _animationTL: gsap.core.Timeline;

  private _controlsTL: gsap.core.Timeline;

  pageElemets: Map<string, JQuery<HTMLElement>>;

  gsapAnimations: GsapAnimations;

  initElements = () => {
    this.pageElemets = new Mapper([
      '.priest-container',
      '.priests-carousel',
      '.controls',
      '.pause',
      '.play',
    ]).map();
  };

  constructor(gsapAnimations: GsapAnimations) {
    $(() => {
      this.initElements();
      this._animationTL = gsap.timeline({ repeat: -1, repeatDelay: 0, paused: true });
      this._controlsTL = gsap.timeline({ repeat: -1, repeatDelay: 1, paused: true });
      this.gsapAnimations = gsapAnimations;
      this.gsapAnimations.newItems([this._animationTL, this._controlsTL]);
      this.pageElemets.get('.controls').children().remove();
      this.onMouseEnterHandler();
      this.onMouseLeaveHandler();
      this.onMouseClickHandler();
      this.animateButtons();
      this.animateCarousel();
    });
  }

  animateCarousel = () => {
    const priestContainer = this.pageElemets.get('.priest-container');
    const carouselContainer = this.pageElemets.get('.priests-carousel');
    const playButton = this.pageElemets.get('.play');
    const pauseButton = this.pageElemets.get('.pause');

    priestContainer.each((i, e) => {
      this.animatePriestContainer(i, $(e));
      this.animatePins(i, $(e));
    });

    ScrollTrigger.create({
      trigger: carouselContainer,
      start: 'top 50%',
      onEnter: () => {
        //this.resumeCarousel();
        playButton.trigger('click');
      },
      onEnterBack: () => {
        //this.resumeCarousel();
        playButton.trigger('click');
      },
      onLeave: () => {
        //this.pauseCarousel();
        pauseButton.trigger('click');
      },
      onLeaveBack: () => {
        //this.pauseCarousel();
        pauseButton.trigger('click');
      },
    });
  };

  nextSlide = (i: number, el: JQuery<HTMLElement>) => {
    const priestContainer = this.pageElemets.get('.priest-container');
    const carouselContainer = this.pageElemets.get('.priests-carousel');
    const width = priestContainer.width();
    const playDuration = 5;

    const tween = this._animationTL.to(
      carouselContainer,
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
    const priestContainer = this.pageElemets.get('.priest-container');

    this._animationTL.addLabel(`slide-${i}`);

    this.nextSlide(i, e);

    $(e).on('click', () => {
      this.animateFocusedSlide($(priestContainer));
      this.animateFocusedSlide($(e));
      this._animationTL.seek(`slide-${i}`, false);
    });
  };

  onMouseEnterHandler = () => {
    this.pageElemets.get('.priest-container').on('mouseover', () => CursorAnimations.cursorWhite());
  };

  onMouseLeaveHandler = () => {
    this.pageElemets.get('.priest-container').on('mouseleave', () => CursorAnimations.cursorBlue());
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
    const controls = this.pageElemets.get('.controls');

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
      const children = $(controls.children());
      this.animateFocusedControls(children);
      children.children().width(0);
      this._controlsTL.seek(`slide-${i}`, false);
    });
  };

  animateButtons = () => {
    const priestContainer = this.pageElemets.get('.priest-container');
    const controls = this.pageElemets.get('.controls');

    priestContainer.each((i, _) => {
      const pin = document.createElement('div');
      const pinFiller = document.createElement('div');
      $(pinFiller).addClass('slide-pin-filler');
      $(pin).addClass('slide-pin');
      if (i === 0) {
        $(pin).addClass('active');
      }
      $(pin).append(pinFiller);
      controls.append(pin);
    });
  };

  onMouseClickHandler = () => {
    const pauseButton = this.pageElemets.get('.pause');
    const playButton = this.pageElemets.get('.play');

    pauseButton.on('click', () => {
      if (this._animationTL) this._animationTL.pause();
      if (this._controlsTL) this._controlsTL.pause();
      pauseButton.css('display', 'none');
      playButton.css('display', 'block');
    });

    playButton.on('click', () => {
      if (this._animationTL) this._animationTL.resume();
      if (this._controlsTL) this._controlsTL.resume();
      playButton.css('display', 'none');
      pauseButton.css('display', 'unset');
    });
  };
}
