import 'leaflet/dist/leaflet.css';

import $ from 'jquery';
import type { IDisposableAnimations } from 'src/interfaces/IDisposableAnimations';
import type { IGsapPageAnimations } from 'src/interfaces/IGsapPageAnimations';
import { GsapAnimations } from 'src/interfaces/IGsapPageAnimations';
import type { IPageAnimations } from 'src/interfaces/IPageAnimations';
import { PageElements } from 'src/interfaces/IPageAnimations';
import { GlobalPageAnimations } from 'src/interfaces/IPageAnimations';

import { LeafletMapComponent } from '../Components/map';

export class ChurchAnimations
  implements IPageAnimations, IGsapPageAnimations, IDisposableAnimations
{

  disposePageAnimations = () => {
    this._map.disposePageAnimations();
    this.gsapAnimations.disposePageAnimations();
  };

  gsapAnimations: GsapAnimations;

  pageElements: PageElements<['#map']>;

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

  initElements = () => {
    this.namespace = 'churches';

    this.supportAnimations = GlobalPageAnimations;

    this.gsapAnimations = new GsapAnimations();

    this.pageElements = new PageElements(['#map'] as const);

    this.supportAnimations;

    this._map = new LeafletMapComponent(
      this.pageElements.el.map,
      () => '#ffffff',
      '#1098ff',
      {
        zoom: 5.2,
        zoomControl: false,
        maxZoom: 5.2,
        minZoom: 5.2,
        dragging: false,
        scrollWheelZoom: false,
      },
      this.gsapAnimations
    );
  };
}
