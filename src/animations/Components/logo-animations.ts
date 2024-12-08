import { Flip, gsap, ScrollTrigger } from 'gsap/all';
import $ from 'jquery';
import { GsapAnimations } from 'src/interfaces/IGsapPageAnimations';
import { PageElements } from 'src/interfaces/IPageAnimations';

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
  private static pageElements: PageElements<
    readonly ['.ths07-logo', '.section-hero-home', '.logo', '.background-video', '.logo-embed']
  >;

  private static ths07Logo: JQuery<HTMLElement>;

  private static gsapAnimations: GsapAnimations;

  private static _standardBottom = 'bottom bottom-=20px';

  private static _sections: {
    sectionHero: JQuery<HTMLElement>;
  };

  private static _containers: {
    logoContainer: JQuery<HTMLElement>;
    logoVideoContainer: JQuery<HTMLElement>;
  };

  private static _videoTransition: LogoTransition;

  private static _bioTransition: LogoTransition;

  public static disposePageAnimations = () => {
    if (this.gsapAnimations) {
      this.gsapAnimations.disposePageAnimations();
    }
  };

  public static animateLogo = async () => {
    $(async () => {
      !this.pageElements
        ? (this.pageElements = new PageElements([
            '.ths07-logo',
            '.section-hero-home',
            '.logo',
            '.background-video',
            '.logo-embed',
          ] as const))
        : (this.ths07Logo = $('.ths07-logo'));

      this.gsapAnimations = new GsapAnimations();

      const tweens = [
        gsap.set(this.ths07Logo, { translateY: '-15em' }),
        await gsap.to(this.ths07Logo, { translateY: '0', duration: 3 }),
      ];

      this.gsapAnimations.newItems(tweens);
    });
  };

  private static initLogo = () => {
    this.pageElements = new PageElements([
      '.ths07-logo',
      '.section-hero-home',
      '.logo',
      '.background-video',
      '.logo-embed',
    ] as const);

    this.gsapAnimations = new GsapAnimations();

    this._sections = {
      sectionHero: this.pageElements.el.sectionHeroHome,
    };

    this._containers = {
      logoContainer: this.pageElements.el.logoEmbed,
      logoVideoContainer: this.pageElements.el.logo,
    };

    this._videoTransition = {
      scrollSection: this.pageElements.el.backgroundVideo,
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
    const currentState = Flip.getState(this.pageElements.el.ths07Logo);

    const logo = this.pageElements.el.ths07Logo;

    if (removeClass) {
      logo.removeClass('morphed');
    }

    if (!logo.hasClass('morphed') && !removeClass) logo.addClass('morphed');

    targetContainer[0].appendChild(logo[0]);

    const tl = Flip.from(currentState, { duration: 1, ease: 'power3.inOut', scale: true });

    this.gsapAnimations.newItem(tl);
  };

  public static logoAnimation = () => {
    $(() => {
      this.initLogo();

      const { moveLogo } = this;
      // We need to reinitialize the class

      [this._videoTransition!, this._bioTransition!].forEach(
        ({ scrollSection, targetContainer, removeClass }) => {
          const tween = ScrollTrigger.create({
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
          this.gsapAnimations.newItem(tween.animation!);
        }
      );
    });
  };
}
