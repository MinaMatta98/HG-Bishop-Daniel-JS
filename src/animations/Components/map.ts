import 'leaflet/dist/leaflet.css';

import gsap from 'gsap/all';
import LeaderLine from 'leader-line-new';
import leaflet from 'leaflet';
import type { IDisposableAnimations } from 'src/interfaces/IDisposableAnimations';
import type { GsapAnimations, IGsapComponentAnimations } from 'src/interfaces/IGsapPageAnimations';
import { GsapComponentAnimations } from 'src/interfaces/IGsapPageAnimations';
import type { IMouseEventAnimations } from 'src/interfaces/IMouseEventAnimations';
import type { PageElements } from 'src/interfaces/IPageAnimations';
import { GlobalPageAnimations } from 'src/interfaces/IPageAnimations';
import type { IResizePageAnimations } from 'src/interfaces/IResizePageAnimations';

import * as geoJson from '../../public/state-GeoJson/australian-states.json';

interface Style {
  fillColor: string;
  weight: 2;
  opacity: number;
  color: string;
  dashArray: '0';
  fillOpacity: number;
  [key: string]: any;
}

interface ZoomControlOptions {
  zoomControl: boolean;
  zoom: () => number;
  minZoom: () => number;
  maxZoom: () => number;
  dragging: boolean;
  scrollWheelZoom: boolean;
}

export class LeafletMapComponent
  implements
    IGsapComponentAnimations,
    IResizePageAnimations,
    IMouseEventAnimations,
    IDisposableAnimations
{
  private _map: leaflet.Map;
  private _mapElement: JQuery<HTMLElement>;
  private static _shadow = 'drop-shadow(2px 7px 15px rgba(0, 0, 0, 0.4))';
  private _shadowAnimation: gsap.core.Tween;
  private _leaderLines?: LeaderLine[];
  private _mapPins?: {
    pin: JQuery<HTMLElement>;
    lat: number;
    long: number;
    div?: JQuery<HTMLElement>;
  }[];
  private _leaderLineTarget?: JQuery<HTMLElement>;
  private _fill: (feature: any) => string;
  private _className?: (feature: any) => string;
  private _color: string;
  private _zoomControlOptions: ZoomControlOptions;
  private _markers: { marker: JQuery<HTMLElement>; div: JQuery<HTMLElement> }[] = [];

  constructor(
    mapElement: JQuery<HTMLElement>,
    fill: (feature: any) => string,
    color: string,
    zoomControlOptions: ZoomControlOptions,
    gsapAnimations: GsapAnimations,
    mapPins?: { pin: JQuery<HTMLElement>; lat: number; long: number; div?: JQuery<HTMLElement> }[],
    className?: (feature: any) => string,
    leaderLineTarget?: JQuery<HTMLElement>
  ) {
    console.log('called ctor');
    this._mapElement = mapElement;
    this._fill = fill;
    this._className = className;
    this._color = color;
    this._zoomControlOptions = zoomControlOptions;
    this.gsapComponentAnimations = new GsapComponentAnimations(gsapAnimations);
    this._leaderLines = [];
    this._mapPins = mapPins;
    console.log(this._mapPins);
    this._leaderLineTarget = leaderLineTarget;
    this.animateComponent();
    this.initializeBaseState();
    this.animateLeaderLines();
  }

  gsapComponentAnimations: GsapComponentAnimations;

  public off() {
    this._map.remove();
    this.disposePageAnimations();
  }

  animateComponent = () => {
    const { _zoomControlOptions } = this;

    const { zoomControl, dragging, scrollWheelZoom, zoom, maxZoom, minZoom } = _zoomControlOptions;

    this._map = leaflet
      .map(this._mapElement[0], {
        dragging,
        scrollWheelZoom,
        zoomControl,
        maxZoom: maxZoom(),
        minZoom: minZoom(),
        zoom: zoom(),
      })
      .setView([-28.2744, 133.7751]);

    const { onMouseEnterHandler, onMouseLeaveHandler } = this;

    const self = this;

    const Json = leaflet
      .geoJson(
        // @ts-ignore
        geoJson,
        {
          style: this.style,
          onEachFeature(feature, layer) {
            layer.on({
              mouseover: (e: any) => onMouseEnterHandler.handler(self, e, feature),
              mouseout: (e: any) => onMouseLeaveHandler.handler(self, e, feature),
            });
          },
        }
      )
      .addTo(this._map);

    this._map.createPane('labels');

    this._map.getPane('labels').style.zIndex = '650';

    Json.eachLayer((layer) => {
      // @ts-ignore
      layer.bindPopup(layer.feature.properties.STATE_NAME);
    });

    if (this._mapPins) {
      for (const { div, lat, long, pin } of this._mapPins) {
        const marker = new leaflet.DivIcon({
          html: div ? div[0] : pin[0],
        });

        const newMarker = leaflet.marker([lat, long], { icon: marker }).addTo(this._map);

        if (div) {
          this._markers.push({
            marker: $(newMarker.getElement()).find('.map-pin'),
            div,
          });
        }
      }
    }

    this.onMouseEnterHandler.handler(this);
    this.onMouseLeaveHandler.handler(this);
  };

  initializeBaseState = () => {
    if (this._mapPins)
      for (const { div, pin } of this._mapPins) {
        if (div) {
          this.hide(div, pin);
        }
      }
  };

  supportAnimations = GlobalPageAnimations;

  pageElements: PageElements<readonly string[]>;

  initElements = () => {};

  public disposePageAnimations = () => {
    if (this._leaderLines) {
      for (const line of this._leaderLines) {
        line.hide();
        line.remove();
      }
      this._leaderLines = [];
    }
    this.onResizeHandler.dispose();
    this.onMouseEnterHandler.dispose(this);
    this.onMouseLeaveHandler.dispose(this);
  };

  private animateLeaderLines = (): void => {
    if (this._leaderLineTarget)
      for (const lineEnd of this._leaderLineTarget) {
        const line = new LeaderLine(this._mapPins[0].pin[0], lineEnd, {
          color: '#ffffff',
          size: 2,
          dash: { animation: true, len: 10 },
          path: 'arc',
          startPlug: 'crosshair',
        });
        line.hide();
        this._leaderLines.push(line);
      }
    this.onResizeHandler.handler(this);
  };

  onResizeHandler = {
    handler(self: LeafletMapComponent) {
      $(window).on('resize', () => {
        try {
          for (const line of self._leaderLines) if (line) line.position();
          self._map.invalidateSize();
          self._map.setMinZoom(self._zoomControlOptions.minZoom());
          self._map.setMaxZoom(self._zoomControlOptions.maxZoom());
          self._map.setZoom(self._zoomControlOptions.zoom());
        } catch (e) {
          console.warn(e);
        }
      });
    },
    dispose() {
      $(window).off('resize');
    },
  };

  public getLeaderLines = () => {
    return this._leaderLines;
  };

  private style = (feature: any): Style => {
    const object: Style = {
      fillColor: this._fill(feature),
      weight: 2,
      opacity: 1,
      color: this._color,
      dashArray: '0',
      fillOpacity: 1,
    };

    if (this._className) object.className = this._className(feature);

    return object;
  };

  onMouseEnterHandler = {
    handler(self: LeafletMapComponent, e?: any, _feature?: any) {
      if (e) {
        const layer = e.target;

        layer.setStyle({
          weight: 5,
          fillColor: self._color,
          dashArray: '0',
          fillOpacity: 0.7,
        });

        layer.bringToFront();

        self._shadowAnimation = gsap.to(layer._path, { filter: LeafletMapComponent._shadow });

        self.gsapComponentAnimations.newItem(self._shadowAnimation);
      } else {
        for (const { div } of self._markers) {
          const pin = div.find('.map-pin');
          $(div).on('mouseenter', () => {
            div.css({ height: '30em', width: '25em', padding: '1em', overflow: 'visible' });
            div
              .children()
              .filter((_, elem) => elem !== pin[0])
              .each((_, e) => {
                $(e).css({ display: 'block' });
              });
          });
        }
      }
    },
    dispose(self: LeafletMapComponent) {
      self.gsapComponentAnimations.clearAnimation(self._shadowAnimation);
      for (const { marker } of self._markers) {
        $(marker).off('mousover');
      }
    },
  };

  private hide = (div: JQuery<HTMLElement>, pin: JQuery<HTMLElement>) => {
    div.css({ height: 0, width: 0, padding: 0, overflow: 'visible' });
    div
      .children()
      .filter((_, elem) => elem !== pin[0])
      .each((_, e) => {
        $(e).css({ display: 'none' });
      });
  };

  onMouseLeaveHandler = {
    handler(self: LeafletMapComponent, e?: any, feature?: any) {
      if (e) {
        const layer = e.target;

        layer.setStyle({
          fillColor: self._fill(feature),
          weight: 2,
          opacity: 1,
          color: self._color,
          dashArray: '0',
          fillOpacity: 0.7,
        });

        self.onMouseEnterHandler.dispose(self);

        layer._path.style.filter = 'none';

        layer.bringToFront();
      } else {
        for (const { div } of self._markers) {
          const pin = div.find('.map-pin');
          $(div).on('mouseleave', () => {
            self.hide(div, pin);
          });
        }
      }
    },
    dispose(self: LeafletMapComponent) {
      for (const { marker } of self._markers) {
        $(marker).off('mouseleave');
      }
    },
  };

  public animateMap = (): void => {
    this.gsapComponentAnimations.newItem(gsap.to(this._mapElement, { opacity: 1, duration: 2 }));
  };
}
