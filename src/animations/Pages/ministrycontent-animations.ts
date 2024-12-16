import 'textillate/assets/animate.css';
import 'leaflet/dist/leaflet.css';

import type { ITransitionData } from '@barba/core/dist/core/src/src/defs';
import gsap from 'gsap/all';
import $ from 'jquery';
import type { IDisposableAnimations } from 'src/interfaces/IDisposableAnimations';
import type { IGsapPageAnimations } from 'src/interfaces/IGsapPageAnimations';
import { GsapAnimations } from 'src/interfaces/IGsapPageAnimations';
import type { IMouseEventAnimations } from 'src/interfaces/IMouseEventAnimations';
import type { IPageAnimations } from 'src/interfaces/IPageAnimations';
import { PageElements } from 'src/interfaces/IPageAnimations';
import { GlobalPageAnimations } from 'src/interfaces/IPageAnimations';

import { LeafletMapComponent } from '../Components/map';

export class MinistryContentAnimations
  implements IPageAnimations, IMouseEventAnimations, IGsapPageAnimations, IDisposableAnimations
{
  private _heroPersonContainers: JQuery<HTMLElement>;

  private _heroPersonTextContainers: JQuery<HTMLElement>;

  private _heroPersonImages: JQuery<HTMLElement>;

  private _heroTextLessContainers: JQuery<HTMLElement>;

  private _ministryContainer: JQuery<HTMLElement>;

  private _ministryContentSection: JQuery<HTMLElement>;

  private _map: LeafletMapComponent;

  private _targetState: string;

  gsapAnimations: GsapAnimations;

  pageElements: PageElements<['.map', '.map-pin', '.loc-invitation', '.ministry-content-hero']>;

  supportAnimations = GlobalPageAnimations;

  namespace: string = 'ministry-content';

  initElements = () => {
    this._targetState = 'New South Wales';

    this.gsapAnimations = new GsapAnimations();

    this._heroPersonContainers = $($('.hero__person').slice(3));

    this._heroPersonTextContainers = this._heroPersonContainers.find('.hero__person-txt-more');

    this._heroPersonImages = this._heroPersonContainers.find('.hero__person-img');

    this._heroTextLessContainers = this._heroPersonContainers.find('.hero__person-txt-less');

    this._ministryContainer = $('.ministry-container').first();

    this._ministryContentSection = $('.ministry-content-section').first();

    this.pageElements = new PageElements([
      '.map',
      '.map-pin',
      '.loc-invitation',
      '.ministry-content-hero',
    ] as const);
  };

  initializeBaseState = () => {
    const tweens = [
      gsap.set(this._heroPersonContainers.first(), { width: '58%' }),
      gsap.set(this._heroPersonTextContainers.first(), { opacity: 1 }),
      gsap.set(this._heroPersonImages.first(), { height: '115%' }),
      gsap.set(this._heroPersonContainers.not(':first'), { width: '21%' }),
      gsap.set(this._heroPersonTextContainers.not(':first'), { opacity: 0 }),
      gsap.set(this._heroPersonImages.not(':first'), { height: '100%' }),
    ];
    this.gsapAnimations.newItems(tweens);
  };

  disposePageAnimations = () => {
    this.gsapAnimations.disposePageAnimations();
  };

  onMouseLeaveHandler = {
    handler: (self: MinistryContentAnimations) => {
      self._ministryContainer.on('mouseleave', () => {
        self.supportAnimations.cursorAnimations.cursorBlue();
      });
    },
    dispose(self: MinistryContentAnimations) {
      self._ministryContainer.off('mouseleave');
    },
  };

  onMouseEnterHandler = {
    handler: (self: MinistryContentAnimations) => {
      self._heroPersonContainers.each((index, element) => {
        $(element).on('mouseenter', () => {
          const otherContainers = self._heroPersonContainers.not(element);
          const otherTextContainers = self._heroPersonTextContainers.filter((i) => i !== index);
          const otherImages = self._heroPersonImages.filter((i) => i !== index);
          const otherTextLessContainers = self._heroTextLessContainers.filter((i) => i !== index);

          const tweens = [
            gsap.to(element, { width: '58%' }),
            gsap.to(otherContainers, { width: '21%' }),
            gsap.to(self._heroPersonTextContainers[index], { opacity: 1 }),
            gsap.to(otherTextContainers, { opacity: 0 }),

            gsap.to(self._heroPersonImages[index], { height: '115%' }),
            gsap.to(otherImages, { height: '100%' }),
            gsap.to(self._heroTextLessContainers[index], { opacity: 0 }),
            gsap.to(otherTextLessContainers, { opacity: 1 }),
          ];

          self.gsapAnimations.newItems(tweens);
        });

        self._ministryContainer.on('mouseenter', () => {
          self.supportAnimations.cursorAnimations.cursorWhite();
        });
      });
    },
    dispose(self: MinistryContentAnimations) {
      self._heroPersonContainers.each((_, element) => {
        $(element).off('mouseenter');
      });
      self._ministryContainer.off('mouseenter');
    },
  };

  onScrollEventHander = () => {
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

    const tween = gsap.to(this._ministryContentSection, {
      scrollTrigger: {
        trigger: this._ministryContentSection,
        start: 'top 50%',
        onEnter: async () => {
          title.css('display', 'flex');
          animateTitle();
        },
      },
    });

    this.gsapAnimations.newItem(tween);
  };

  private animateLocationSection = () => {
    const targetBlocks = this.pageElements.el.locInvitation;

    const tween = gsap.from(targetBlocks, {
      scrollTrigger: {
        trigger: targetBlocks,
        start: 'top 40%',
        onEnter: () => {
          const tween = gsap.fromTo(
            targetBlocks.children(),
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
          this.gsapAnimations.newItem(tween);
          if (this._map.getLeaderLines().length > 0)
            for (const line of this._map.getLeaderLines()) line.show('draw', { duration: 2000 });
        },
        onLeaveBack: () => {
          if (this._map.getLeaderLines().length > 0)
            for (const line of this._map.getLeaderLines()) line.hide();
        },
      },
    });

    const secondTween = gsap.set(targetBlocks.children(), { opacity: 0 });
    this.gsapAnimations.newItems([tween, secondTween]);
  };

  afterEnter = async (_data: ITransitionData) => {
    this.initElements();

    this.initializeBaseState();

    this.supportAnimations.logoAnimations.animateLogo();

    const zoom = () =>
      Math.max(Math.min((this.pageElements.el.map.width() / 1360.0) * 5.0, 5.0), 3.7);

    this._map = new LeafletMapComponent(
      this.pageElements.el.map,
      (feature: any) =>
        feature.properties.STATE_NAME === this._targetState ? '#ffffff90' : '#ffffff25',
      '#ffffff',
      {
        zoomControl: false,
        zoom,
        minZoom: zoom,
        maxZoom: zoom,
        dragging: false,
        scrollWheelZoom: false,
      },
      this.gsapAnimations,
      [{ pin: this.pageElements.el.mapPin, lat: -33.8688, long: 151.2093 }],
      (feature: any) => (feature.properties.STATE_NAME === this._targetState ? 'active-layer' : ''),
      this.pageElements.el.locInvitation
    );

    this.animateLocationSection();

    this.onMouseEnterHandler.handler(this);

    this.onMouseLeaveHandler.handler(this);

    this.onScrollEventHander();

    this.supportAnimations.navBarAnimations.animateScrollButton(
      this.pageElements.el.ministryContentHero
    );
  };

  afterLeave = async (_data: ITransitionData) => {
    this.disposePageAnimations();
  };
}
