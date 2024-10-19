import 'lettering.js';
import 'textillate';
import 'textillate/assets/animate.css';
import 'leaflet/dist/leaflet.css';
import '../../public/timeline.min.css';
import '../Components/timeline/timeline.min.js';

import { Flip, gsap, ScrollTrigger } from 'gsap/all';
import $ from 'jquery';
import LeaderLine from 'leader-line-new';
import leaflet from 'leaflet';

import * as geoJson from '../../public/state-GeoJson/australian-states.json';
import { LogoAnimations } from '../Components/logo-animations';
import { CursorAnimations } from '../UI/cursor-animations';
import type { NavBarAnimations } from '../UI/navbar-animations';

export class ChurchContentAnimations {
  private _heading: JQuery<HTMLElement>;

  private _subHeading: JQuery<HTMLElement>;

  private _ctaButton: JQuery<HTMLElement>;

  private _churchImages: JQuery<HTMLElement>;

  private _locationSection: JQuery<HTMLElement>;

  private _locInvitation: JQuery<HTMLElement>;

  private _locContent: JQuery<HTMLElement>;

  private _heroSection: JQuery<HTMLElement>;

  private _mapContainer: JQuery<HTMLElement>;

  private _mapPin: JQuery<HTMLElement>;

  private _leaderLine: LeaderLine;

  private _map: leaflet.Map;

  private _targetState: string;

  private _mapTL: gsap.core.Timeline;

  private _priestCarousel: PriestCarousel;

  private init = (): void => {
    $(() => {
      this._targetState = 'New South Wales';
      this._heading = $('.churches-content');
      this._subHeading = $('.churches-content-subheading');
      this._ctaButton = $('.church-content-cta');
      this._churchImages = $('.churches-content-images');
      this._mapPin = $('.map-pin');
      this._locationSection = $('.find-us');
      this._locInvitation = $('.loc-invitation');
      this._locContent = $('.loc-content');
      this._heroSection = $('.church-content-hero-section');
      this._mapContainer = $('.map');
      this._priestCarousel = new PriestCarousel();
      this._mapTL = gsap.timeline();
      this.LoadTimeline();
      this._heading.css('display', 'none');
      this._subHeading.css('opacity', 0);
      this._ctaButton.css('opacity', 0);
      this._churchImages.css('opacity', 0);
    });
  };

  private animateMinistryLogo = async (): Promise<void> => {
    await LogoAnimations.animateLogo();
  };

  public disposeChurchContentPage = (): void => {
    this._mapTL.kill();
    this._mapTL.clear(true);
    this._leaderLine.remove();
    this._leaderLine = null;
    this._priestCarousel.disposeAnimations();
  };

  private animateHeading = (): void => {
    const { _heading, _subHeading, _ctaButton, _churchImages, _mapTL } = this;
    $(async () => {
      _heading.css('display', 'unset');
      await (<any>_heading).textillate({
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
          _mapTL.to(_subHeading, { opacity: 1, duration: 1 }, 0);
          _mapTL.to(_ctaButton, { opacity: 1, duration: 1 }, 0);
          _mapTL.to(_ctaButton, { opacity: 1, duration: 1 }, 0);
          _mapTL.to(_churchImages, { opacity: 1, duration: 1, stagger: 0.3 }, 1);
          _mapTL.from(_churchImages, { translateX: '-10em', duration: 1 }, 1);
        },
        type: 'char',
      });
    });
  };

  private animateBlueCursor = (): void => {
    $(() => {
      this._locationSection.on('mouseover', () => {
        CursorAnimations.cursorWhite();
      });

      this._locationSection.on('mouseleave', () => {
        CursorAnimations.cursorBlue();
      });
    });
  };

  private style = (feature: any) => {
    return {
      fillColor: feature.properties.STATE_NAME === this._targetState ? '#ffffff90' : '#ffffff25',
      weight: 1,
      opacity: 1,
      color: '#ffffff',
      dashArray: '0',
      fillOpacity: 1,
      className: feature.properties.STATE_NAME === this._targetState ? 'active-layer' : '',
    };
  };

  private initializeMap = (): void => {
    $(() => {
      this._map = leaflet
        .map(this._mapContainer[0], {
          zoomControl: false,
          zoom: 4.4,
          minZoom: 4.4,
          maxZoom: 4.4,
          dragging: false,
          scrollWheelZoom: false,
        })
        .setView([-28.2744, 133.7751], 4.4);

      leaflet
        .geoJson(
          // @ts-ignore
          geoJson,
          {
            style: this.style,
          }
        )
        .addTo(this._map);

      const marker = new leaflet.DivIcon({
        html: this._mapPin[0],
      });

      leaflet.marker([-33.762282, 150.8274209], { icon: marker }).addTo(this._map);
    });
  };

  //
  // https://github.com/NUKnightLab/TimelineJS3/blob/master/API.md
  private LoadTimeline = () => {
    // @ts-ignore
    $('.timeline').timeline({
      forceVerticalMode: 800,
      mode: 'horizontal',
      visibleItems: 4,
    });
  };

  private animateLeaderLine = (): void => {
    $(() => {
      this._leaderLine = new LeaderLine(this._mapPin[0], this._locInvitation[0], {
        color: '#ffffff',
        size: 2,
        dash: { animation: true, len: 10 },
        path: 'arc',
        startPlug: 'crosshair',
      });
      this._leaderLine.hide();
      $(window).on('resize', () => {
        if (this._leaderLine) this._leaderLine.position();
      });
    });
  };

  private animateLocationSection = () => {
    gsap.from(this._locContent, {
      scrollTrigger: {
        trigger: this._locContent,
        start: 'top 40%',
        onEnter: () => {
          gsap.fromTo(
            this._locContent.children(),
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
          if (this._leaderLine) this._leaderLine.show('draw', { duration: 2000 });
        },
        onLeaveBack: () => {
          if (this._leaderLine) this._leaderLine.hide();
        },
      },
    });

    gsap.set(this._locContent.children(), { opacity: 0 });
  };

  private animateChurchImageHover = (): void => {
    const children = this._churchImages.children();
    children.each((_, e) => {
      $(e).on('mouseover', () => {
        const state = Flip.getState(e);
        children.each((_, child) => {
          $(child).removeClass('secondary');
          $(child).removeClass('tertiary');
        });
        const otherImages = this._churchImages.children().filter((_, el) => el !== e);
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

  public animateChurchContent = async (navbarAnimator: NavBarAnimations) => {
    this.init();
    this.initializeMap();
    await this.animateMinistryLogo();
    this.animateLeaderLine();
    this.animateHeading();
    this.animateChurchImageHover();
    this.animateBlueCursor();
    this.animateLocationSection();
    navbarAnimator.animateScrollButton(this._heroSection);
  };
}

class PriestCarousel {
  private _priestContainer: JQuery<HTMLElement>;

  private _carouselContainer: JQuery<HTMLElement>;

  private _controls: JQuery<HTMLElement>;

  private _pauseButton: JQuery<HTMLButtonElement>;

  private _playButton: JQuery<HTMLElement>;

  private _animationTL: gsap.core.Timeline;

  private _controlsTL: gsap.core.Timeline;

  constructor() {
    this._priestContainer = $('.priest-container');
    this._carouselContainer = $('.priests-carousel');
    this._controls = $('.controls');
    this._pauseButton = $('.pause');
    this._playButton = $('.play');
    this._animationTL = gsap.timeline({ repeat: -1, repeatDelay: 0, paused: true });
    this._controlsTL = gsap.timeline({ repeat: -1, repeatDelay: 1, paused: true });
    this._controls.children().remove();
    this.initializePins();
    this.animateBlueCursor();
    this.initializeButtons();
    this.animateCarousel();
  }

  private animateBlueCursor = (): void => {
    this._priestContainer.on('mouseover', () => {
      CursorAnimations.cursorWhite();
    });

    this._priestContainer.on('mouseleave', () => {
      CursorAnimations.cursorBlue();
    });
  };

  private pauseCarousel = (): void => {
    this._animationTL.pause();
    this._controlsTL.pause();
  };

  public disposeAnimations = (): void => {
    this._animationTL.kill();
    this._controlsTL.kill();
  };

  private resumeCarousel = (): void => {
    this._animationTL.resume();
    this._controlsTL.resume();
  };

  private focusTransition = (e: HTMLElement | JQuery<HTMLElement>): void => {
    gsap.to(e, {
      backgroundColor: 'var(--cursor-inner)',
      boxShadow:
        '0 0 0 0 rgba(0,0,0,0), 0 1.8px 5.8px 0 rgba(0,0,0,0.042), 0 3.9px 11.7px 0 rgba(0,0,0,0.05), 0 6.7px 18px 0 rgba(0,0,0,0.054), 0 11.5px 25.3px 0 rgba(0,0,0,0.057), 0 22.6px 35.9px 0 rgba(0,0,0,0.062)',
      opacity: 1,
      duration: 2,
    });
  };

  private unfocusTransition = (e: HTMLElement | JQuery<HTMLElement>): void => {
    gsap.to(e, {
      backgroundColor: 'var(--cursor-center)',
      boxShadow: 'unset',
      opacity: 0.5,
      duration: 1,
    });
  };

  private activeTransition = (e: HTMLElement | JQuery<HTMLElement>): void => {
    gsap.to(e, { overflow: 'hidden', width: '4rem', borderRadius: '1rem', duration: 1 });
  };

  private inactiveTransition = (e: HTMLElement | JQuery<HTMLElement>): void => {
    gsap.set(e, { overflow: 'unset', width: '1rem', borderRadius: '100%', duration: 1 });
    gsap.set($(e).children(), { width: 0 });
  };

  private animatePriestContainer = (i: number, playDuration: number, e: HTMLElement): void => {
    const width = this._priestContainer.width();
    this._animationTL.addLabel(`slide-${i}`);
    this._animationTL.to(
      this._carouselContainer,
      {
        translateX: i !== this._priestContainer.length - 1 ? -width * (i + 1) : 0,
        duration: 1,
        onStart: () => {
          this.unfocusTransition($(e));
          i !== this._priestContainer.length - 1
            ? this.focusTransition($(this._priestContainer[i + 1]))
            : this.focusTransition($(this._priestContainer[0]));
        },
      },
      playDuration * (i + 1)
    );

    $(e).on('click', () => {
      this.unfocusTransition($(this._priestContainer));
      this.focusTransition($(e));
      this._animationTL.seek(`slide-${i}`, false);
    });
  };

  private animateCarouselControls = (i: number, playDuration: number, e: HTMLElement): void => {
    this._controlsTL.addLabel(`slide-${i}`);
    this._controlsTL.to(
      $(this._controls.children()[i]).children(),
      {
        duration: playDuration,
        width: '100%',
        onStart: () => {
          this.activeTransition($(this._controls.children()[i]));
        },
        onComplete: () => {
          this.inactiveTransition($(this._controls.children()[i]));
          $(this._controls.children()[i]).children().width(0);
        },
      },
      playDuration * i
    );

    $(e).on('click', () => {
      const children = $(this._controls.children());
      this.inactiveTransition(children);
      children.children().width(0);
      this._controlsTL.seek(`slide-${i}`, false);
    });
  };

  private animateCarousel = (): void => {
    const playDuration = 5;

    this._priestContainer.each((i, e) => {
      this.animatePriestContainer(i, playDuration, e);
      this.animateCarouselControls(i, playDuration, e);
    });

    ScrollTrigger.create({
      trigger: this._carouselContainer,
      start: 'top 50%',
      onEnter: () => {
        //this.resumeCarousel();
	this._playButton.trigger('click');
      },
      onEnterBack: () => {
        //this.resumeCarousel();
	this._playButton.trigger('click');
      },
      onLeave: () => {
        //this.pauseCarousel();
	this._pauseButton.trigger('click');
      },
      onLeaveBack: () => {
        //this.pauseCarousel();
	this._pauseButton.trigger('click');
      },
    });
  };

  private initializeButtons = (): void => {
    this._pauseButton.on('click', () => {
      if (this._animationTL) this._animationTL.pause();
      if (this._controlsTL) this._controlsTL.pause();
      this._pauseButton.css('display', 'none');
      this._playButton.css('display', 'block');
    });

    this._playButton.on('click', () => {
      if (this._animationTL) this._animationTL.resume();
      if (this._controlsTL) this._controlsTL.resume();
      this._playButton.css('display', 'none');
      this._pauseButton.css('display', 'unset');
    });
  };

  private initializePins = (): void => {
    this._priestContainer.each((i, _) => {
      const pin = document.createElement('div');
      const pinFiller = document.createElement('div');
      $(pinFiller).addClass('slide-pin-filler');
      $(pin).addClass('slide-pin');
      if (i === 0) {
        $(pin).addClass('active');
      }
      $(pin).append(pinFiller);
      this._controls.append(pin);
    });
  };
}
