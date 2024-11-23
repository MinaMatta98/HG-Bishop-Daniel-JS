import 'leaflet/dist/leaflet.css';

import $ from 'jquery';
import type { IPageAnimations } from 'src/interfaces/IPageAnimations';
import { GlobalPageAnimations } from 'src/interfaces/IPageAnimations';
import { Mapper } from 'src/utils/mapper';

import { LeafletMapComponent } from '../Components/map';

export class ChurchAnimations implements IPageAnimations {
  pageElements: Map<string, JQuery<HTMLElement>>;

  supportAnimations: typeof GlobalPageAnimations;

  namespace: string;

  private _map: LeafletMapComponent;

  constructor(globalPageAnimations: typeof GlobalPageAnimations) {
    this.supportAnimations = globalPageAnimations;
  }

  afterEnter = async () => {
    this.initElements();

    this.supportAnimations.navBarAnimations.animateScrollButton(this.pageElements.get('#map'));

    await this.supportAnimations.logoAnimations.animateLogo();

    this._map.animateMap();
  };

  initElements = () => {
    $(() => {
      this.namespace = 'churches';
      this.supportAnimations = GlobalPageAnimations;
      this.pageElements = new Mapper(['#map']).map();
      this.supportAnimations;
      this._map = new LeafletMapComponent(
        this.pageElements.get('#map'),
        () => '#ffffff',
        '#1098ff',
        {
          zoom: 5.2,
          zoomControl: false,
          maxZoom: 5.2,
          minZoom: 5.2,
          dragging: false,
          scrollWheelZoom: false,
        }
      );
    });
  };
}
