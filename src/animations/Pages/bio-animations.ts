import type { ITransitionData } from '@barba/core/dist/core/src/src/defs';
import { gsap, ScrollTrigger } from 'gsap/all';
import $ from 'jquery';
import SplitType from 'split-type';
import type { ICssAnimations } from 'src/interfaces/ICssAnimations';
import type { IGsapPageAnimations } from 'src/interfaces/IGsapPageAnimations';
import { GsapAnimations } from 'src/interfaces/IGsapPageAnimations';
import type { IPageAnimations } from 'src/interfaces/IPageAnimations';
import { GlobalPageAnimations } from 'src/interfaces/IPageAnimations';
import type { IResizePageAnimations } from 'src/interfaces/IResizePageAnimations';
import { Mapper } from 'src/utils/mapper';

export class BioAnimations
  implements IPageAnimations, IGsapPageAnimations, ICssAnimations, IResizePageAnimations
{
  private _splitType: SplitType;

  gsapAnimations: GsapAnimations;

  pageElements: Map<string, JQuery<HTMLElement>>;

  supportAnimations = GlobalPageAnimations;

  namespace: string = 'bio';

  onResizeHandler = () => {
    $(window).on('resize', () => {
      if (this._splitType) this._splitType.revert();
      this.animateHeading();
    });
  };

  loadCss = () => {
    $('html').css('overflow-x', 'unset !important');
    $('body').css('background', 'var(--cursor-inner)');
  };

  unloadCss = () => {
    $('html').css('overflow-x', 'unset');
    $('body').css('background', 'unset');
  };

  initElements = () => {
    this.pageElements = new Mapper(['.bio-heading', '.timeline_item']).map();
    this.gsapAnimations = new GsapAnimations();
  };

  private animateHeading = () => {
    const text = new SplitType(this.pageElements.get('.bio-heading'), {
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

      this.gsapAnimations.newItem(timeline);
    });
  };

  private animateTimeline = async (): Promise<void> => {
    $(async () => {
      const timelineItems: JQuery<HTMLElement> = this.pageElements.get('.timeline_item');

      timelineItems.each((index, item) => {
        const tween = gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 50%',
            end: 'top 10%',
            scrub: 2,
            immediateRender: false,
            onEnter: () => {
              ScrollTrigger.refresh();
              if (index > 0) {
                timelineItems[index - 1].style.opacity = '0.3';
              }
            },
            onEnterBack: () => {
              ScrollTrigger.refresh();
              const enterTween = gsap.to(item, { opacity: 1 });
              this.gsapAnimations.newItem(enterTween);
            },
          },
          opacity: 0.3,
        });
        this.gsapAnimations.newItem(tween);
      });
    });
  };

  public afterEnter = async (_data: ITransitionData) => {
    $(() => {
      this.initElements();
      this.loadCss();
      this.supportAnimations.logoAnimations.animateLogo();
      this.animateHeading();
      this.animateTimeline();
      this.onResizeHandler();
      this.supportAnimations.navBarAnimations.animateScrollButton(
        this.pageElements.get('.timeline_item')
      );
      this.supportAnimations.cursorAnimations.cursorWhite();
      this.supportAnimations.footerAnimations.animateFooterBlue();
    });
  };

  afterLeave = async (_data: ITransitionData) => {
    this.unloadCss();
    this.gsapAnimations.disposePageAnimations();
    this.supportAnimations.cursorAnimations.cursorBlue();
  };
}
