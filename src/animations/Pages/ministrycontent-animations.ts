import 'textillate/assets/animate.css';
import 'leaflet/dist/leaflet.css';

import gsap from 'gsap/all';
import $ from 'jquery';

import { LeafletMapComponent } from '../Components/map';
import { CursorAnimations } from '../UI/cursor-animations';
import type { NavBarAnimations } from '../UI/navbar-animations';

export class MinistryContentAnimations {
  private _heroPersonContainers: JQuery<HTMLElement>;
  private _heroPersonTextContainers: JQuery<HTMLElement>;
  private _heroPersonImages: JQuery<HTMLElement>;
  private _heroTextLessContainers: JQuery<HTMLElement>;
  private _ministryContentHeroContainer: JQuery<HTMLElement>;
  private _ministryContainer: JQuery<HTMLElement>;
  private _ministryContentSection: JQuery<HTMLElement>;
  private _map: LeafletMapComponent;
  private _mapContainer: JQuery<HTMLElement>;
  private _targetState: string = 'New South Wales';
  private _mapPin: JQuery<HTMLElement>;
  private _targetBlocks: JQuery<HTMLElement>;

  private init(): void {
    this._mapContainer = $('.map');
    this._mapPin = $('.map-pin');
    this._targetBlocks = $('.loc-invitation');
    console.log(this._targetBlocks);
    this._ministryContentHeroContainer = $('.ministry-content-hero');
    this._heroPersonContainers = $($('.hero__person').slice(3));
    this._heroPersonTextContainers = this._heroPersonContainers.find('.hero__person-txt-more');
    this._heroPersonImages = this._heroPersonContainers.find('.hero__person-img');
    this._heroTextLessContainers = this._heroPersonContainers.find('.hero__person-txt-less');
    this._ministryContainer = $('.ministry-container').first();
    this._ministryContentSection = $('.ministry-content-section').first();
    this._map = new LeafletMapComponent(
      this._mapContainer,
      (feature: any) =>
        feature.properties.STATE_NAME === this._targetState ? '#ffffff90' : '#ffffff25',
      '#ffffff',
      {
        zoomControl: false,
        zoom: 3.8,
        minZoom: 3.8,
        maxZoom: 3.8,
        dragging: false,
        scrollWheelZoom: false,
      },
      (feature: any) => (feature.properties.STATE_NAME === this._targetState ? 'active-layer' : ''),
      this._mapPin,
      this._targetBlocks
    );
    this.animateLocationSection();
  }

  public disposePage = () => {
    this._map.disposeLeaderLines();
  };

  private animateLocationSection = () => {
    gsap.from(this._targetBlocks, {
      scrollTrigger: {
        trigger: this._targetBlocks,
        start: 'top 40%',
        onEnter: () => {
          gsap.fromTo(
            this._targetBlocks.children(),
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

    gsap.set(this._targetBlocks.children(), { opacity: 0 });
  };

  private initialStateAnimations = () => {
    gsap.set(this._heroPersonContainers.first(), { width: '58%' });
    gsap.set(this._heroPersonTextContainers.first(), { opacity: 1 });
    gsap.set(this._heroPersonImages.first(), { height: '115%' });
    gsap.set(this._heroPersonContainers.not(':first'), { width: '21%' });
    gsap.set(this._heroPersonTextContainers.not(':first'), { opacity: 0 });
    gsap.set(this._heroPersonImages.not(':first'), { height: '100%' });
  };

  private initHoverStateAnimations = () => {
    this._heroPersonContainers.each((index, element) => {
      $(element).on('mouseenter', () => {
        const otherContainers = this._heroPersonContainers.not(element);
        const otherTextContainers = this._heroPersonTextContainers.filter((i) => i !== index);
        const otherImages = this._heroPersonImages.filter((i) => i !== index);
        const otherTextLessContainers = this._heroTextLessContainers.filter((i) => i !== index);

        gsap.to(element, { width: '58%' });
        gsap.to(otherContainers, { width: '21%' });

        gsap.to(this._heroPersonTextContainers[index], { opacity: 1 });
        gsap.to(otherTextContainers, { opacity: 0 });

        gsap.to(this._heroPersonImages[index], { height: '115%' });
        gsap.to(otherImages, { height: '100%' });

        gsap.to(this._heroTextLessContainers[index], { opacity: 0 });
        gsap.to(otherTextLessContainers, { opacity: 1 });
      });
    });

    this._ministryContainer.on('mouseenter', () => {
      CursorAnimations.cursorWhite();
    });

    this._ministryContainer.on('mouseleave', () => {
      CursorAnimations.cursorBlue();
    });
  };

  private initOnScrollAnimations = () => {
    const title = this._ministryContentSection.find('.heading-large');
    title.css('display', 'none');
    const animateTitle = async () =>
      await (<any>title).textillate({
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
        type: 'char',
      });

    gsap.to(this._ministryContentSection, {
      scrollTrigger: {
        trigger: this._ministryContentSection,
        start: 'top 50%',
        onEnter: async () => {
          title.css('display', 'flex');
          animateTitle();
        },
      },
    });
  };

  public animateMinistryContent = async (navbarAnimator: NavBarAnimations) => {
    $(() => {
      this.init();
      this.initialStateAnimations();
      this.initHoverStateAnimations();
      this.initOnScrollAnimations();
      navbarAnimator.animateScrollButton(this._ministryContentHeroContainer);
    });
  };
}
