import type { ITransitionData } from '@barba/core/dist/core/src/src/defs';
import { gsap, ScrollTrigger } from 'gsap/all';
import $ from 'jquery';
import SplitType from 'split-type';
import type { ICssAnimations } from 'src/interfaces/ICssAnimations';
import type { IGsapPageAnimations } from 'src/interfaces/IGsapPageAnimations';
import { GsapAnimations } from 'src/interfaces/IGsapPageAnimations';
import type { IMouseEventAnimations } from 'src/interfaces/IMouseEventAnimations';
import type { IPageAnimations } from 'src/interfaces/IPageAnimations';
import { PageElements } from 'src/interfaces/IPageAnimations';
import { GlobalPageAnimations } from 'src/interfaces/IPageAnimations';
import type { IResizePageAnimations } from 'src/interfaces/IResizePageAnimations';

export class BioAnimations
  implements
    IPageAnimations,
    IGsapPageAnimations,
    ICssAnimations,
    IResizePageAnimations,
    IMouseEventAnimations
{
  private _splitType: SplitType;

  gsapAnimations: GsapAnimations;

  pageElements: PageElements<readonly ['.bio-heading', '.timeline_item', '.timeline-hero-section']>;

  supportAnimations = GlobalPageAnimations;

  namespace: string = 'bio';

  onResizeHandler = {
    handler(self: BioAnimations) {
      $(window).on('resize', () => {
        if (self._splitType) this._splitType.revert();
        self.onScrollEventHandler.handler(self);
      });
    },
    dispose() {
      $(window).off('resize');
    },
  };

  loadCss = () => {
    $('html').css('overflow-x', 'unset !important');
  };

  unloadCss = () => {
    $('html').css('overflow-x', 'unset');
  };

  initElements = () => {
    this.pageElements = new PageElements([
      '.bio-heading',
      '.timeline_item',
      '.timeline-hero-section',
    ] as const);

    this.gsapAnimations = new GsapAnimations();
  };

  onScrollEventHandler = {
    handler: (self: BioAnimations) => {
      const animateTimeline = () => {
        const timelineItems: JQuery<HTMLElement> = self.pageElements.el.timeline_item;

        timelineItems.each((index, item) => {
          const tween = gsap.from(item, {
            scrollTrigger: {
              trigger: item,
              start: 'top 50%',
              end: 'top 10%',
              scrub: 2,
              immediateRender: false,
              onEnter: () => {
                try {
                  ScrollTrigger.refresh();
                } catch (e) {}
                if (index > 0) $(timelineItems).get(index - 1).style.opacity = '0.3';
              },
              onEnterBack: () => {
                try {
                  ScrollTrigger.refresh();
                } catch (e) {}
                const enterTween = gsap.to(item, { opacity: 1 });
                self.gsapAnimations.newItem(enterTween);
              },
            },
            opacity: 0.3,
          });
          self.gsapAnimations.newItem(tween);
        });
      };

      const animateHeading = () => {
        const text = new SplitType(self.pageElements.el.bioHeading, {
          types: ['words', 'lines'],
        });

        $(text.lines).each((_, element) => {
          $(element).append('<div class="line-mask"></div>');

          const target = $(element).find('.line-mask');

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: element,
              start: 'top center',
              end: 'bottom center',
              scrub: 1,
            },
          });

          timeline.from(target, { width: '100%', duration: 1 });

          self.gsapAnimations.newItem(timeline);
        });
      };

      animateHeading();

      animateTimeline();
    },
    dispose: () => {},
  };

  public afterEnter = async (_data: ITransitionData) => {
    $(async () => {
      this.initElements();

      this.loadCss();

      this.supportAnimations.logoAnimations.animateLogo();

      this.onScrollEventHandler.handler(this);

      this.onResizeHandler.handler(this);

      this.supportAnimations.navBarAnimations.animateScrollButton(
        this.pageElements.el.timelineHeroSection
      );

      this.supportAnimations.cursorAnimations.cursorWhite();

      this.supportAnimations.footerAnimations.animateFooterBlue();
    });
  };

  afterLeave = async (_data: ITransitionData) => {
    this.unloadCss();

    this.supportAnimations.cursorAnimations.cursorBlue();

    this.supportAnimations.footerAnimations.animateFooterWhite();
  };
}
