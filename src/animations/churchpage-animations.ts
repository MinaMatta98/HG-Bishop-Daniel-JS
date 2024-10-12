import 'leaflet/dist/leaflet.css';

import { gsap } from 'gsap';
import $ from 'jquery';
import leaflet from 'leaflet';

import * as geoJson from './GeoJson-Data/australian-states.json';
import { LogoAnimations } from './logo-animations';
import type { NavBarAnimations } from './navbar-animations';

export class ChurchAnimations {
  private _map: L.Map;
  private _mapElement: JQuery<HTMLElement>;
  private static _shadow = 'drop-shadow(2px 7px 15px rgba(0, 0, 0, 0.4))';
  private _shadowAnimation: gsap.core.Tween;

  constructor() {}

  private getColor = (_d: number) => {
    return '#ffffff';
  };

  private style = (feature: any) => {
    return {
      fillColor: this.getColor(feature.properties.density),
      weight: 2,
      opacity: 1,
      color: '#1098ff',
      dashArray: '0',
      fillOpacity: 0.7,
    };
  };

  private highlightFeature = (e: any, feature: any) => {
    const layer = e.target;

    layer.setStyle({
      weight: 5,
      fillColor: '#1098ff',
      dashArray: '0',
      fillOpacity: 0.7,
    });

    layer.bringToFront();

    this._shadowAnimation = gsap.to(layer._path, { filter: ChurchAnimations._shadow });

    //layer._path.style.filter = ChurchAnimations._shadow;

    console.log(feature.properties.STATE_NAME);
  };

  private resetHighlight = (e: any) => {
    const layer = e.target;

    layer.setStyle({
      fillColor: '#ffffff',
      weight: 2,
      opacity: 1,
      color: '#1098ff',
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

  private init = () => {
    $(() => {
      this._mapElement = $('#map');
      gsap.set(this._mapElement, { opacity: 0 });

      this._map = leaflet
        .map(this._mapElement[0], { zoomControl: false, maxZoom: 5.2, minZoom: 5.2 })
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
                mouseout: resetHighlight,
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
    });
  };

  private animateMinistryLogo = async (): Promise<void> => {
    await LogoAnimations.animateLogo();
  };

  private animateMap = (): void => {
    gsap.to(this._mapElement, { opacity: 1, duration: 2 });
  };

  public animateChurchPage = async (navbarAnimator: NavBarAnimations) => {
    navbarAnimator.animateScrollButton($('#map'));
    this.init();
    await this.animateMinistryLogo();
    this.animateMap();
  };
}
