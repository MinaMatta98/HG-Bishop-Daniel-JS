import { gsap } from 'gsap/all';
import $ from 'jquery';

import { Animations } from '../animations';
import { LogoAnimations } from '../Components/logo-animations';
import { CursorAnimations } from '../UI/cursor-animations';
import type { NavBarAnimations } from '../UI/navbar-animations';
import { Player } from '../UI/Widgets/player';

export class SermonContentAnimations {
  private _heroSection: JQuery<HTMLElement>;

  private _playList: JQuery<HTMLElement>;

  private _sermonsItems: JQuery<HTMLElement>;

  private _carousel: SermonCarousel;

  private _player: Player;

  private animateSermonsLogo = async (): Promise<void> => {
    await LogoAnimations.animateLogo();
  };

  private init = (): void => {
    this._heroSection = $('.sermon-content-hero-section');
    this._playList = $('.playlist-wrapper');
    this._sermonsItems = $('.sermons-items');
    this._carousel = new SermonCarousel();
    Animations.player ? (this._player = Animations.player) : (this._player = new Player());
    Animations.initPlayer(this._player);
  };

  private playListHover = (): void => {
    [this._playList, this._sermonsItems].forEach((item) => {
      item.on('mouseenter', () => {
        CursorAnimations.cursorWhite();
      });

      this._playList.on('mouseleave', () => {
        CursorAnimations.cursorBlue();
      });
    });
  };

  public animateSermonContent = async (navbarAnimator: NavBarAnimations) => {
    this.init();
    this.playListHover();
    await this.animateSermonsLogo();
    navbarAnimator.animateScrollButton(this._heroSection);
  };
}

class SermonCarousel {
  private _themeContainer: JQuery<HTMLElement>;

  // It is assumed that this is in sync with the themes
  private _themeCovers: JQuery<HTMLElement>;

  //private _playerControls: JQuery<HTMLElement>;

  private _sermonsBanner: JQuery<HTMLElement>;

  private _indicators: JQuery<HTMLElement>;

  private _animationTL: gsap.core.Timeline;

  private _indicatorTL: gsap.core.Timeline;

  private _fillterTL: gsap.core.Timeline;

  private _nextButton: JQuery<HTMLElement>;

  private _prevButton: JQuery<HTMLElement>;

  private _currentIndex: number;

  private _tweens: gsap.core.Tween[];

  constructor() {
    $(() => {
      this._themeContainer = $('.theme-background');
      this._themeCovers = $('.t-cov');
      //this._playerControls = $('.player-controls');
      this._sermonsBanner = $('.sermons-banner');
      this._indicators = $('.indicator');
      this._currentIndex = 0;
      const buttons = $('.arrow-circle');
      this._nextButton = $(buttons[1]);
      this._prevButton = $(buttons[0]);
      this._animationTL = gsap.timeline({ repeat: -1, repeatDelay: 4 });
      this._indicatorTL = gsap.timeline({ repeat: -1, repeatDelay: 4.5 });
      this._fillterTL = gsap.timeline({ repeat: -1 });
      this._tweens = [];
      this.ChangeBanner();
      this.initializeButtons();
      this.initializeCarousel();
    });
  }

  private ChangeBanner = (): void => {
    this._sermonsBanner.text(
      `Browse Sermons for ${$($(this._themeContainer[this._currentIndex]).children()[0]).text()}`
    );
  };

  private seek = () => {
    this._animationTL.seek(`${this._currentIndex}`);
    this._indicatorTL.seek(`${this._currentIndex}`);
    this._fillterTL.seek(`${this._currentIndex}`);
    this.ChangeBanner();
  };

  private incrementIndex = (): void => {
    this._currentIndex < this._themeCovers.length - 1
      ? this._currentIndex++
      : (this._currentIndex = 0);
  };

  private decrementIndex = (): void => {
    this._currentIndex > 0
      ? this._currentIndex--
      : (this._currentIndex = this._themeCovers.length - 1);
  };

  private initializeButtons = (): void => {
    this._nextButton.on('click', () => {
      this.incrementIndex();
      this._tweens.forEach((tween) => tween.kill());
      this.seek();
    });

    this._prevButton.on('click', () => {
      this.decrementIndex();
      this._tweens.forEach((tween) => tween.kill());
      this.seek();
    });
  };

  private initializeCarousel = (): void => {
    const duration = 5;
    this._themeContainer.each((index, cover) => {
      this._animationTL.addLabel(`${index}`, index * duration);
      this._animationTL.to(
        cover,
        {
          display: 'block',
          duration: 1,
          onStart: () => {
            this._themeCovers.each((_, el) => {
              if (el != cover) $(el).css('display', 'none');
            });
          },
        },
        index * duration
      );
    });

    this._indicators.each((index, indicator) => {
      // Start Condition
      const filler = $(indicator).find('.inner-filler');
      filler.css('width', 0);

      this._indicatorTL.addLabel(`${index}`, index * duration);
      this._indicatorTL.to(
        indicator,
        {
          width: 20,
          borderRadius: `5px`,
          duration: 0.5,
          onStart: () => {
            this._indicators
              .filter((_, el) => el !== indicator)
              .each((_, el) => {
                const tween = gsap.to($(el), { width: 5, duration: 0.5 });
                this._tweens.push(tween);
              });
          },
          onComplete: () => {
            const tween = gsap.to($(indicator), { width: 5, delay: 4.5 });
            this._tweens.push(tween);
          },
        },
        index * duration
      );

      this._fillterTL.addLabel(`${index}`, index * duration);
      this._fillterTL.to(
        filler, {
          width: 20,
          duration,
          ease: 'none',
          onStart: () => {
            this._themeCovers[this._currentIndex].style.display = 'block';
            this.ChangeBanner();
            this._indicators
              .filter((_, el) => el !== indicator)
              .each((_, el) => {
                $(el).find('.inner-filler').css('width', 0);
              });
          },
          onComplete: () => {
            filler.css('width', 0);
            this.ChangeBanner();
            this.incrementIndex();
          },
        },
        index * duration
      );
    });
  };
}
