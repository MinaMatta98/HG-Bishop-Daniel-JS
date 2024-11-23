import { Flip, gsap, ScrollTrigger } from 'gsap/all';
import $ from 'jquery';

/**
 * @module Keep Private. This is simply a definition of the
 * LogoAnimations class to ensure strong typing.
 */
interface LogoTransition {
  scrollSection: JQuery<HTMLElement>;
  targetContainer: JQuery<HTMLElement>;
  removeClass: boolean;
}

export class LogoAnimations {
  private static _logo: JQuery<HTMLElement>;
  private static _backgroundVideo: JQuery<HTMLElement>;
  private static _standardBottom: string;
  private static _sections: {
    sectionHero: JQuery<HTMLElement>;
  };

  private static _containers: {
    logoContainer: JQuery<HTMLElement>;
    logoVideoContainer: JQuery<HTMLElement>;
  };

  private static _videoTransition: LogoTransition;

  private static _bioTransition: LogoTransition;

  public static animateLogo = async () => {
    gsap.set('.ths07-logo', { translateY: '-15em' });
    await gsap.to('.ths07-logo', { translateY: '0', duration: 3 });
  };

  private static initLogo = () => {
    this._logo = $('.ths07-brand');
    this._backgroundVideo = $('.background-video');
    this._standardBottom = 'bottom bottom-=20px';
    this._sections = {
      sectionHero: $('.section-hero-home'),
    };
    this._containers = {
      logoContainer: $('.logo-embed'),
      logoVideoContainer: $('.logo'),
    };
    this._videoTransition = {
      scrollSection: this._backgroundVideo,
      targetContainer: this._containers.logoVideoContainer,
      removeClass: true,
    };
    this._bioTransition = {
      scrollSection: this._sections.sectionHero,
      targetContainer: this._containers.logoContainer,
      removeClass: false,
    };
  };

  private static moveLogo = (removeClass: boolean, targetContainer: JQuery<HTMLElement>) => {
    const currentState = Flip.getState(this._logo);
    if (removeClass) {
      this._logo.removeClass('morphed');
    }
    if (!this._logo.hasClass('morphed') && !removeClass) this._logo.addClass('morphed');
    targetContainer[0].appendChild(this._logo[0]);
    Flip.from(currentState, { duration: 1, ease: 'power3.inOut', scale: true });
  };

  public static logoAnimation = () => {
    this.initLogo();
    const { moveLogo } = this;
    // We need to reinitialize the class

    $(() => {
      [this._videoTransition, this._bioTransition].forEach(
        ({ scrollSection, targetContainer, removeClass }) => {
          ScrollTrigger.create({
            trigger: scrollSection,
            start: 'top 60%',
            end: this._standardBottom,
            scrub: 1,
            onEnterBack() {
              moveLogo(removeClass, targetContainer);
            },
            onEnter() {
              moveLogo(removeClass, targetContainer);
            },
          });
        }
      );
    });
  };
}
