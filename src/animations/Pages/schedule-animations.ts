import $ from 'jquery';

import { LogoAnimations } from '../Components/logo-animations';
import { NavBarAnimations } from '../UI/navbar-animations';

export class ScheduleAnimations {
  private _calendarEl: JQuery<HTMLElement>;

  private initializeElements = () => {
    this._calendarEl = $('#calendar');
  };

  public animateSchedulePage = async (navbarAnimator: NavBarAnimations) => {
    $(async () => {
      this.initializeElements();
      navbarAnimator.animateScrollButton(this._calendarEl);
      //this.initSchedule();
      await LogoAnimations.animateLogo();
    });
  };
}
