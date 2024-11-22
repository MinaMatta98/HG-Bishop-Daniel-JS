import 'leaflet/dist/leaflet.css';

import gsap from 'gsap/all';
import LeaderLine from 'leader-line-new';
import leaflet from 'leaflet';

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

export class LeafletMapComponent {
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
      this._leaderLines = [];
      this._mapPin = mapPin;
      this._leaderLineTarget = leaderLineTarget;
      this.init();
      this.animateLeaderLines();
    });
  }

  public disposeLeaderLines = () => {
    if (this._leaderLines) {
      for (const line of this._leaderLines) {
        line.remove();
      }
      this._leaderLines = [];
    }
  };

  private animateLeaderLines = (): void => {
    $(() => {
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
        $(window).on('resize', () => {
          if (line) line.position();
        });
      }
    });
  };

  public getLeaderLines = () => {
    return this._leaderLines;
  };

  //private getColor = (_d: number) => {
  //  return '#ffffff';
  //};

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

  private highlightFeature = (e: any, feature: any) => {
    const layer = e.target;

    layer.setStyle({
      weight: 5,
      fillColor: this._color,
      dashArray: '0',
      fillOpacity: 0.7,
    });

    layer.bringToFront();

    this._shadowAnimation = gsap.to(layer._path, { filter: LeafletMapComponent._shadow });

    //layer._path.style.filter = ChurchAnimations._shadow;

    console.log(feature.properties.STATE_NAME);
  };

  private resetHighlight = (e: any, feature: any) => {
    const layer = e.target;

    layer.setStyle({
      fillColor: this._fill(feature),
      weight: 2,
      opacity: 1,
      color: this._color,
      dashArray: '0',
      fillOpacity: 0.7,
    });

    if (this._shadowAnimation) {
      this._shadowAnimation.kill();
    }

    layer._path.style.filter = 'none';
    layer.bringToFront();
    //this._geoJson.resetStyle(e.target);
  };

  public resize = (zoomControlOptions: ZoomControlOptions) => {
    this._map.setMinZoom(zoomControlOptions.minZoom);
    this._map.setMaxZoom(zoomControlOptions.maxZoom);
    this._map.setZoom(zoomControlOptions.zoom);
  };

  public init = () => {
    //gsap.set(this._mapElement, { opacity: 0 });

    this._map = leaflet
      .map(
        this._mapElement[0],
        this._zoomControlOptions
        //zoomControl: false, maxZoom: 5.2, minZoom: 5.2
      )
      .setView([-28.2744, 133.7751], 5.2);

    const { highlightFeature, resetHighlight } = this;

    const Json = leaflet
      .geoJson(
        // @ts-ignore
        geoJson,
        {
          style: this.style,
          onEachFeature(feature, layer) {
            layer.on({
              mouseover: (e: any) => highlightFeature(e, feature),
              mouseout: (e: any) => resetHighlight(e, feature),
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

  public animateMap = (): void => {
    gsap.to(this._mapElement, { opacity: 1, duration: 2 });
  };
}
