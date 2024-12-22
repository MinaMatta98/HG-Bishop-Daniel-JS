import 'leaflet/dist/leaflet.css';

import $ from 'jquery';
import type { ICMSPageAnimations } from 'src/interfaces/ICMSPageAnimations';
import { GenericCMSPageAnimations } from 'src/interfaces/ICMSPageAnimations';
import { GenericCollectionAnimations } from 'src/interfaces/ICollectionAnimations';
import type { IDisposableAnimations } from 'src/interfaces/IDisposableAnimations';
import type { IGsapPageAnimations } from 'src/interfaces/IGsapPageAnimations';
import { GsapAnimations } from 'src/interfaces/IGsapPageAnimations';
import type { IMouseEventAnimations } from 'src/interfaces/IMouseEventAnimations';
import { type ElementObjectProperties, PageElements } from 'src/interfaces/IPageAnimations';
import { GlobalPageAnimations } from 'src/interfaces/IPageAnimations';
import type { IResizePageAnimations } from 'src/interfaces/IResizePageAnimations';

import { LeafletMapComponent } from '../Components/map';

export class ChurchAnimations
  extends GenericCollectionAnimations
  implements
    IGsapPageAnimations,
    IDisposableAnimations,
    IMouseEventAnimations,
    IResizePageAnimations,
    ICMSPageAnimations
{
  EL = ['.item', '.filler', '.item-grid', '#map', '.map-pin'] as const;

  genericCMSAnimations = new GenericCMSPageAnimations();

  mapPinCoordinates<K extends keyof ElementObjectProperties<typeof this.pageElements.keys>>(
    key: K
  ): { pin: JQuery<HTMLElement>; lat: number; long: number }[] {
    const pins = this.pageElements.el[key];

    return pins
      .map((_, pin) => {
        try {
          const mapPin = $(pin);
          return {
            pin: mapPin,
            lat: parseInt(mapPin.attr('Latitude')),
            long: parseInt(mapPin.attr('Longitude')),
            div: mapPin.parent('div'),
          };
        } catch (e) {
          console.error(e);
        }
      })
      .toArray();
  }

  initializeBaseState?: () => void;

  onResizeHandler = {
    handler: (self: ChurchAnimations) => {
      if (self._map) self._map.onResizeHandler.handler(self._map);
    },
    dispose: () => {
      $(window).off('resize');
    },
  };

  disposePageAnimations = () => {
    this._map.disposePageAnimations();
    this.gsapAnimations.disposePageAnimations();
  };

  gsapAnimations: GsapAnimations;

  pageElements: PageElements<typeof this.EL>;

  supportAnimations = GlobalPageAnimations;

  namespace: string = 'churches';

  private _map: LeafletMapComponent;

  afterEnter = async () => {
    $(async () => {
      this.initElements();

      this.supportAnimations.navBarAnimations.animateScrollButton(this.pageElements.el.map);

      await this.supportAnimations.logoAnimations.animateLogo();

      this._map.animateMap();
    });
  };

  afterLeave = async () => {
    this.disposePageAnimations();
  };

  onMouseEnterHandler = {
    handler: (self: ChurchAnimations) => {
      self.pageElements.el.item.each((_, e) => {
        $(e).on('mouseenter', () => self.supportAnimations.cursorAnimations.cursorWhite());
        $(e).on('mouseleave', () => self.supportAnimations.cursorAnimations.cursorBlue());
      });
    },
    dispose: (self: ChurchAnimations) => {
      self.pageElements.el.item.each((_, e) => {
        $(e).off('mouseenter');
      });
    },
  };

  initElements = () => {
    this.namespace = 'churches';

    this.genericCMSAnimations = new GenericCMSPageAnimations();

    this.supportAnimations = GlobalPageAnimations;

    this.gsapAnimations = new GsapAnimations();

    this.pageElements = new PageElements(this.EL);

    this.onMouseEnterHandler.handler(this);

    const zoom = () =>
      Math.max(Math.min((this.pageElements.el.map.width() / 1360.0) * 5.0, 5.0), 3.7);

    this._map = new LeafletMapComponent(
      this.pageElements.el.map,
      () => '#ffffff',
      '#1098ff',
      {
        zoom,
        zoomControl: false,
        maxZoom: zoom,
        minZoom: zoom,
        dragging: false,
        scrollWheelZoom: false,
      },
      this.gsapAnimations,
      this.mapPinCoordinates('mapPin')
    );

    this.onResizeHandler.handler(this);
  };
}
