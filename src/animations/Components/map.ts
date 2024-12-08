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
  zoom: number;
  minZoom: number;
  maxZoom: number;
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
  private _mapPin?: JQuery<HTMLElement>;
  private _leaderLineTarget?: JQuery<HTMLElement>;
  private _fill: (feature: any) => string;
  private _className?: (feature: any) => string;
  private _color: string;
  private _zoomControlOptions: ZoomControlOptions;

  constructor(
    mapElement: JQuery<HTMLElement>,
    fill: (feature: any) => string,
    color: string,
    zoomControlOptions: ZoomControlOptions,
    gsapAnimations: GsapAnimations,
    className?: (feature: any) => string,
    mapPin?: JQuery<HTMLElement>,
    leaderLineTarget?: JQuery<HTMLElement>
  ) {
    $(() => {
      this._mapElement = mapElement;
      this._fill = fill;
      this._className = className;
      this._color = color;
      this._zoomControlOptions = zoomControlOptions;
      this.gsapComponentAnimations = new GsapComponentAnimations(gsapAnimations);
      this._leaderLines = [];
      this._mapPin = mapPin;
      this._leaderLineTarget = leaderLineTarget;
      this.animateComponent();
      this.animateLeaderLines();
      console.log(this);
    });
  }

  gsapComponentAnimations: GsapComponentAnimations;

  animateComponent = () => {
    this._map = leaflet
      .map(
        this._mapElement[0],
        this._zoomControlOptions
        //zoomControl: false, maxZoom: 5.2, minZoom: 5.2
      )
      .setView([-28.2744, 133.7751], 5.2);

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

    if (this._mapPin) {
      const marker = new leaflet.DivIcon({
        html: this._mapPin[0],
      });

      leaflet.marker([-33.762282, 150.8274209], { icon: marker }).addTo(this._map);
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
    this.onMouseLeaveHandler.dispose();
  };

  private animateLeaderLines = (): void => {
    if (this._leaderLineTarget)
      for (const lineEnd of this._leaderLineTarget) {
        const line = new LeaderLine(this._mapPin[0], lineEnd, {
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
          self._map.setMinZoom(self._zoomControlOptions.minZoom);
          self._map.setMaxZoom(self._zoomControlOptions.maxZoom);
          self._map.setZoom(self._zoomControlOptions.zoom);
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
    handler(self: LeafletMapComponent, e: any, _feature: any) {
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
    },
    dispose(self: LeafletMapComponent) {
      self.gsapComponentAnimations.clearAnimation(self._shadowAnimation);
    },
  };

  onMouseLeaveHandler = {
    handler(self: LeafletMapComponent, e: any, feature: any) {
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
    },
    dispose() {},
  };

  public animateMap = (): void => {
    this.gsapComponentAnimations.newItem(gsap.to(this._mapElement, { opacity: 1, duration: 2 }));
  };
}
