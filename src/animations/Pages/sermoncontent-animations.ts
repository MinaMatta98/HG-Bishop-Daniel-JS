import type { ITransitionData } from '@barba/core/dist/core/src/src/defs';
import gsap from 'gsap/all';
import $ from 'jquery';
import type { ICMSPageAnimations } from 'src/interfaces/ICMSPageAnimations';
import { GenericCMSPageAnimations } from 'src/interfaces/ICMSPageAnimations';
import type { IDisposableAnimations } from 'src/interfaces/IDisposableAnimations';
import type { IGsapPageAnimations } from 'src/interfaces/IGsapPageAnimations';
import { GsapAnimations } from 'src/interfaces/IGsapPageAnimations';
import type { IMouseEventAnimations } from 'src/interfaces/IMouseEventAnimations';
import { GlobalPageAnimations } from 'src/interfaces/IPageAnimations';
import { PageElements } from 'src/interfaces/IPageAnimations';
import Swiper from 'swiper/bundle';

import { PDFViewer } from '../UI/Widgets/pdf';

export class SermonContentAnimations
  implements IMouseEventAnimations, IGsapPageAnimations, ICMSPageAnimations, IDisposableAnimations
{
  disposePageAnimations = () => {
    this._pdf?.disposePageAnimations();
  };

  genericCMSAnimations = new GenericCMSPageAnimations();

  EL = ['.sermons-content-hero', '.sermons-items', '.item-section', '.section-glow'] as const;

  gsapAnimations: GsapAnimations;

  _pdf?: PDFViewer;

  supportAnimations = GlobalPageAnimations;

  namespace: string = 'sermons-content';

  afterEnter = async (_data: ITransitionData) => {
    $(async () => {
      this.initElements();

      this.initializeSwiper();

      this.onMouseEnterHandler.handler(this);

      this.onMouseLeaveHandler.handler(this);

      this.onMouseMoveHandler.handler(this);

      await this.supportAnimations.logoAnimations.animateLogo();

      this.supportAnimations.navBarAnimations.animateScrollButton(
        this.pageElements.el.sermonsContentHero
      );
    });
  };

  beforeEnter = async (_data: ITransitionData) => {
    this.supportAnimations.footerAnimations.animateFooterWhite();
  };

  pageElements: PageElements<typeof this.EL>;

  initElements = () => {
    this.gsapAnimations = new GsapAnimations();

    //this._carousel = new SermonsCarousel();

    this.pageElements = new PageElements(this.EL);

    if ($('.pdf').length > 0) this._pdf = new PDFViewer(this.gsapAnimations);
    if (this._pdf !== undefined) this._pdf.animateComponent();
  };

  onMouseEnterHandler = {
    handler(self: SermonContentAnimations) {
      const { sectionGlow, itemSection } = self.pageElements.el;

      itemSection.on('mouseover', () => {
        if (sectionGlow !== undefined)
          self.gsapAnimations.newItem(gsap.set(sectionGlow, { display: 'none' }));
        self.supportAnimations.cursorAnimations.cursorWhite();
      });
    },
    dispose(self: SermonContentAnimations) {
      self.pageElements.el.itemSection.off('mouseover');
    },
  };

  private initializeSwiper = () => {
    this.pageElements.el.itemSection.each((_, slider) => {
      const swiper = new Swiper($(slider).find('.swiper')[0], {
        direction: 'horizontal',
        breakpoints: {
          480: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          992: {
            slidesPerView: 4,
          },
        },
        spaceBetween: '20px',
        resistanceRatio: 0,
        loop: true,
        autoplay: true,
        speed: 3000,
        keyboard: true,
        mousewheel: {
          forceToAxis: true,
        },
        freeMode: true,
        slideToClickedSlide: true,
        followFinger: false,
        pagination: {
          el: $(slider).find('.swiper-bullet-wrapper')[0],
          bulletActiveClass: 'is-active',
          bulletClass: 'swiper-bullet',
          bulletElement: 'button',
          clickable: true,
        },
        navigation: {
          nextEl: $(slider).parent().find('.is-right')[0],
          prevEl: $(slider).parent().find('.is-left')[0],
          disabledClass: 'is-disabled',
        },
        scrollbar: {
          el: $(slider).find('.swiper-drag-wrapper')[0],
          draggable: true,
          dragClass: 'swiper-drag',
          snapOnRelease: true,
        },
      });
    });
  };

  onMouseLeaveHandler = {
    handler(self: SermonContentAnimations) {
      const { sectionGlow, itemSection } = self.pageElements.el;

      itemSection.each((_, item) => {
        $(item).on('mouseleave', () => {
          if (sectionGlow !== undefined)
            self.gsapAnimations.newItem(gsap.set(sectionGlow, { display: 'none' }));
          self.supportAnimations.cursorAnimations.cursorBlue();
        });
      });
    },
    dispose(self: SermonContentAnimations) {
      self.pageElements.el.itemSection.off('mouseleave');
    },
  };

  onMouseMoveHandler = {
    handler(self: SermonContentAnimations) {
      const { sectionGlow, itemSection } = self.pageElements.el;
      const onMouseMove = (e: MouseEvent) => {
        if (sectionGlow === undefined) return;
        const centerX = e.pageX - sectionGlow.width();
        const centerY = e.pageY - itemSection.position().top - sectionGlow[0].offsetHeight / 2;
        sectionGlow.css('left', centerX + 'px');
        sectionGlow.css('top', centerY + 'px');
      };

      document.addEventListener('mousemove', onMouseMove);
    },
    dispose(_self: SermonContentAnimations) {
      $(document).off('mousemove');
    },
  };
}

//class SermonsCarousel implements ICarouselAnimations, IDisposableAnimations {
//  EL = [
//    '.theme-background',
//    '.t-cov',
//    '.player-controls',
//    '.sermons-banner',
//    '.indicator',
//    '.arrow-circle',
//  ] as const;
//
//  disposePageAnimations = () => {
//    this.gsapAnimations.disposePageAnimations();
//  };
//
//  private _duration: number;
//
//  private _currentIndex: number;
//
//  private _animationTL: gsap.core.Timeline;
//
//  private _indicatorTL: gsap.core.Timeline;
//
//  private _fillterTL: gsap.core.Timeline;
//
//  gsapAnimations: GsapAnimations;
//
//  pageElements: PageElements<typeof this.EL>;
//
//  constructor() {
//    this.gsapAnimations = new GsapAnimations();
//
//    this.initElements();
//
//    this.animateCarousel();
//  }
//
//  initElements = () => {
//    this._currentIndex = 0;
//    this._duration = 5;
//    this._animationTL = gsap.timeline({ repeat: -1, repeatDelay: 4 });
//    this._indicatorTL = gsap.timeline({ repeat: -1, repeatDelay: 4.5 });
//    this._fillterTL = gsap.timeline({ repeat: -1 });
//    this.gsapAnimations.newItems([this._animationTL, this._indicatorTL, this._fillterTL]);
//  };
//
//  private ChangeBanner = (): void => {
//    this.pageElements.el.sermonsBanner.text(
//      `Browse Sermons for ${$(
//        $(this.pageElements.el.themeBackground[this._currentIndex]).children()[0]
//      ).text()}`
//    );
//  };
//
//  animateCarousel = () => {
//    this.ChangeBanner();
//    this.animateButtons();
//    //this.animatePins();
//    this.animateFocusedSlide();
//  };
//
//  nthSlide = (_n: number) => {
//    this._animationTL.seek(`${this._currentIndex}`);
//    this._indicatorTL.seek(`${this._currentIndex}`);
//    this._fillterTL.seek(`${this._currentIndex}`);
//    this.ChangeBanner();
//  };
//
//  //animatePins = () => {
//  //  this.pageElements.el.indicator.each((index, indicator) => {
//  //    // Start Condition
//  //    const filler = $(indicator).find('.inner-filler');
//  //
//  //    filler.css('width', 0);
//  //
//  //    this._indicatorTL.addLabel(`${index}`, index * this._duration);
//  //
//  //    this._indicatorTL.to(
//  //      indicator,
//  //      {
//  //        width: 20,
//  //        borderRadius: `5px`,
//  //        duration: 0.5,
//  //        onStart: () => {
//  //          this.pageElements.el.indicator
//  //            .filter((_, el) => el !== indicator)
//  //            .each((_, el) => {
//  //              const tween = gsap.to($(el), { width: 5, duration: 0.5 });
//  //              this.gsapAnimations.newItem(tween);
//  //            });
//  //        },
//  //        onComplete: () => {
//  //          const tween = gsap.to($(indicator), { width: 5, delay: 4.5 });
//  //          this.gsapAnimations.newItem(tween);
//  //        },
//  //      },
//  //      index * this._duration
//  //    );
//  //
//  //    this._fillterTL.addLabel(`${index}`, index * this._duration);
//  //
//  //    this._fillterTL.to(
//  //      filler,
//  //      {
//  //        width: 20,
//  //        duration: this._duration,
//  //        ease: 'none',
//  //        onStart: () => {
//  //          this.pageElements.el.tCov[this._currentIndex].style.display = 'block';
//  //
//  //          this.ChangeBanner();
//  //
//  //          this.pageElements.el.indicator
//  //            .filter((_, el) => el !== indicator)
//  //            .each((_, el) => {
//  //              $(el).find('.inner-filler').css('width', 0);
//  //            });
//  //        },
//  //        onComplete: () => {
//  //          filler.css('width', 0);
//  //
//  //          this.ChangeBanner();
//  //
//  //          this._currentIndex < this.pageElements.el.tCov.length - 1
//  //            ? this._currentIndex++
//  //            : (this._currentIndex = 0);
//  //        },
//  //      },
//  //      index * this._duration
//  //    );
//  //  });
//  //};
//
//  animateFocusedSlide = () => {
//    this.pageElements.el.tCov.each((index, cover) => {
//      this._animationTL.addLabel(`${index}`, index * this._duration);
//      this._animationTL.to(
//        cover,
//        {
//          display: 'block',
//          duration: 1,
//          onStart: () => {
//            this.pageElements.el.tCov.each((_, el) => {
//              if (el != cover) $(el).css('display', 'none');
//            });
//          },
//        },
//        index * this._duration
//      );
//    });
//  };
//
//  animateButtons = () => {
//    $(this.pageElements.el.arrowCircle[0]).on('click', () => {
//      this._currentIndex < this.pageElements.el.tCov.length - 1
//        ? this._currentIndex++
//        : (this._currentIndex = 0);
//      this.gsapAnimations.disposePageAnimations();
//      this.nthSlide(this._currentIndex);
//    });
//
//    $(this.pageElements.el.arrowCircle[1]).on('click', () => {
//      this._currentIndex > 0
//        ? this._currentIndex--
//        : (this._currentIndex = this.pageElements.el.tCov.length - 1);
//      this.gsapAnimations.disposePageAnimations();
//      this.nthSlide(this._currentIndex);
//    });
//  };
//}
