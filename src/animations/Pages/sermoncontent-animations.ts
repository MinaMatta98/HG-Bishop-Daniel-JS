import { LogoAnimations } from '../Components/logo-animations';
import type { NavBarAnimations } from '../UI/navbar-animations';

export class SermonContentAnimations {
  private _heroSection: JQuery<HTMLElement>;

  private animateMinistryLogo = async (): Promise<void> => {
    await LogoAnimations.animateLogo();
  };

  public animateSermonContent = async (navbarAnimator: NavBarAnimations) => {
    navbarAnimator.animateScrollButton(this._heroSection);
  };
}
