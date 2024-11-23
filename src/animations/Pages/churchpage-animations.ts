import 'leaflet/dist/leaflet.css';

import $ from 'jquery';

import { LogoAnimations } from '../Components/logo-animations';
import { LeafletMapComponent } from '../Components/map';
import type { NavBarAnimations } from '../UI/navbar-animations';

export class ChurchAnimations {
  private _map: LeafletMapComponent;

  private init = () => {
    $(() => {
      this._map = new LeafletMapComponent($('#map'), () => '#ffffff', '#1098ff', {
        zoom: 5.2,
        zoomControl: false,
        maxZoom: 5.2,
        minZoom: 5.2,
        dragging: false,
        scrollWheelZoom: false,
      });
    });
  };

  private animateMinistryLogo = async (): Promise<void> => {
    await LogoAnimations.animateLogo();
  };

    this._map.animateMap();
  };
}
  public animateChurchPage = async (navbarAnimator: NavBarAnimations) => {
    navbarAnimator.animateScrollButton($('#map'));
    this.init();
    await this.animateMinistryLogo();
