import type { ITransitionData } from '@barba/core/dist/core/src/src/defs';
import { gsap } from 'gsap/all';
import $ from 'jquery';
import type { ICarouselAnimations } from 'src/interfaces/ICarouselAnimations';
import type { IDisposableAnimations } from 'src/interfaces/IDisposableAnimations';
import type { IGsapPageAnimations } from 'src/interfaces/IGsapPageAnimations';
import { GsapAnimations } from 'src/interfaces/IGsapPageAnimations';
import type { IMouseEventAnimations } from 'src/interfaces/IMouseEventAnimations';
import type { IPageAnimations } from 'src/interfaces/IPageAnimations';
import { GlobalPageAnimations } from 'src/interfaces/IPageAnimations';
import { PageElements } from 'src/interfaces/IPageAnimations';

import { Animations } from '../animations';
import { Player } from '../UI/Widgets/player';

export class SermonContentAnimations
  implements IPageAnimations, IMouseEventAnimations, IGsapPageAnimations, IDisposableAnimations
{
  EL = ['.sermon-content-hero-section', '.playlist-wrapper', '.sermons-items'] as const;

  private _carousel: SermonsCarousel;

  private _player: Player;

  gsapAnimations: GsapAnimations;

  supportAnimations = GlobalPageAnimations;

  namespace: string = 'sermons-content';

  afterEnter = async (_data: ITransitionData) => {
    $(async () => {
      this.initElements();

      this.onMouseEnterHandler.handler(this);

      this.onMouseLeaveHandler.handler(this);

      await this.supportAnimations.logoAnimations.animateLogo();

      this.supportAnimations.navBarAnimations.animateScrollButton(
        this.pageElements.el.sermonContentHeroSection
      );
    });
  };

  afterLeave = async (_data: ITransitionData) => {
    this.disposePageAnimations();
  };

  beforeEnter = async (_data: ITransitionData) => {
    this.supportAnimations.footerAnimations.animateFooterWhite();
  };

  pageElements: PageElements<typeof this.EL>;

  initElements = () => {
    this.namespace = 'sermon-content';

    this.gsapAnimations = new GsapAnimations();

    this._carousel = new SermonsCarousel();

    this.pageElements = new PageElements(this.EL);

    Animations.player ? (this._player = Animations.player) : (this._player = new Player());

    Animations.initPlayer(this._player);
  };

  disposePageAnimations = () => {
    this.gsapAnimations.disposePageAnimations();
    this._carousel.disposePageAnimations();
  };

  onMouseEnterHandler = {
    handler(self: SermonContentAnimations) {
      [self.pageElements.el.playlistWrapper, self.pageElements.el.sermonsItems].forEach((item) => {
        item.on('mouseenter', () => {
          self.supportAnimations.cursorAnimations.cursorWhite();
        });
      });
    },
    dispose(self: SermonContentAnimations) {
      self.pageElements.el.playlistWrapper.off('mouseenter');
      self.pageElements.el.sermonsItems.off('mouseenter');
    },
  };

  onMouseLeaveHandler = {
    handler(self: SermonContentAnimations) {
      self.pageElements.el.playlistWrapper.on('mouseleave', () => {
        self.supportAnimations.cursorAnimations.cursorBlue();
      });
    },
    dispose(self: SermonContentAnimations) {
      self.pageElements.el.playlistWrapper.off('mouseleave');
    },
  };
}

class SermonsCarousel implements ICarouselAnimations, IDisposableAnimations {
  EL = [
    '.theme-background',
    '.t-cov',
    '.player-controls',
    '.sermons-banner',
    '.indicator',
    '.arrow-circle',
  ] as const;

  disposePageAnimations = () => {
    this.gsapAnimations.disposePageAnimations();
  };

  private _duration: number;

  private _currentIndex: number;

  private _animationTL: gsap.core.Timeline;

  private _indicatorTL: gsap.core.Timeline;

  private _fillterTL: gsap.core.Timeline;

  gsapAnimations: GsapAnimations;

  pageElements: PageElements<typeof this.EL>;

  constructor() {
    this.gsapAnimations = new GsapAnimations();

    this.initElements();

    this.animateCarousel();
  }

  initElements = () => {
    this._currentIndex = 0;
    this._duration = 5;
    this._animationTL = gsap.timeline({ repeat: -1, repeatDelay: 4 });
    this._indicatorTL = gsap.timeline({ repeat: -1, repeatDelay: 4.5 });
    this._fillterTL = gsap.timeline({ repeat: -1 });
    this.gsapAnimations.newItems([this._animationTL, this._indicatorTL, this._fillterTL]);
  };

  private ChangeBanner = (): void => {
    this.pageElements.el.sermonsBanner.text(
      `Browse Sermons for ${$(
        $(this.pageElements.el.themeBackground[this._currentIndex]).children()[0]
      ).text()}`
    );
  };

  animateCarousel = () => {
    this.ChangeBanner();
    this.animateButtons();
    this.animatePins();
    this.animateFocusedSlide();
  };

  nthSlide = (_n: number) => {
    this._animationTL.seek(`${this._currentIndex}`);
    this._indicatorTL.seek(`${this._currentIndex}`);
    this._fillterTL.seek(`${this._currentIndex}`);
    this.ChangeBanner();
  };

  animatePins = () => {
    this.pageElements.el.indicator.each((index, indicator) => {
      // Start Condition
      const filler = $(indicator).find('.inner-filler');

      filler.css('width', 0);

      this._indicatorTL.addLabel(`${index}`, index * this._duration);

      this._indicatorTL.to(
        indicator,
        {
          width: 20,
          borderRadius: `5px`,
          duration: 0.5,
          onStart: () => {
            this.pageElements.el.indicator
              .filter((_, el) => el !== indicator)
              .each((_, el) => {
                const tween = gsap.to($(el), { width: 5, duration: 0.5 });
                this.gsapAnimations.newItem(tween);
              });
          },
          onComplete: () => {
            const tween = gsap.to($(indicator), { width: 5, delay: 4.5 });
            this.gsapAnimations.newItem(tween);
          },
        },
        index * this._duration
      );

      this._fillterTL.addLabel(`${index}`, index * this._duration);

      this._fillterTL.to(
        filler,
        {
          width: 20,
          duration: this._duration,
          ease: 'none',
          onStart: () => {
            this.pageElements.el.tCov[this._currentIndex].style.display = 'block';

            this.ChangeBanner();

            this.pageElements.el.indicator
              .filter((_, el) => el !== indicator)
              .each((_, el) => {
                $(el).find('.inner-filler').css('width', 0);
              });
          },
          onComplete: () => {
            filler.css('width', 0);

            this.ChangeBanner();

            this._currentIndex < this.pageElements.el.tCov.length - 1
              ? this._currentIndex++
              : (this._currentIndex = 0);
          },
        },
        index * this._duration
      );
    });
  };

  animateFocusedSlide = () => {
    this.pageElements.el.tCov.each((index, cover) => {
      this._animationTL.addLabel(`${index}`, index * this._duration);
      this._animationTL.to(
        cover,
        {
          display: 'block',
          duration: 1,
          onStart: () => {
            this.pageElements.el.tCov.each((_, el) => {
              if (el != cover) $(el).css('display', 'none');
            });
          },
        },
        index * this._duration
      );
    });
  };

  animateButtons = () => {
    $(this.pageElements.el.arrowCircle[0]).on('click', () => {
      this._currentIndex < this.pageElements.el.tCov.length - 1
        ? this._currentIndex++
        : (this._currentIndex = 0);
      this.gsapAnimations.disposePageAnimations();
      this.nthSlide(this._currentIndex);
    });

    $(this.pageElements.el.arrowCircle[1]).on('click', () => {
      this._currentIndex > 0
        ? this._currentIndex--
        : (this._currentIndex = this.pageElements.el.tCov.length - 1);
      this.gsapAnimations.disposePageAnimations();
      this.nthSlide(this._currentIndex);
    });
  };
}
