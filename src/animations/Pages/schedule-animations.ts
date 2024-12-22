import type { ITransitionData } from '@barba/core/dist/core/src/src/defs';
import $ from 'jquery';
import type { IPageAnimations } from 'src/interfaces/IPageAnimations';
import { GlobalPageAnimations, PageElements } from 'src/interfaces/IPageAnimations';

export class ScheduleAnimations implements IPageAnimations {
  EL = ['#calendar'] as const;
  supportAnimations = GlobalPageAnimations;

  namespace: string = 'schedule';

  afterEnter = async (_data: ITransitionData) => {
    $(async () => {
      this.initElements();
      this.supportAnimations.navBarAnimations.animateScrollButton(this.pageElements.el.calendar);
      await this.supportAnimations.logoAnimations.animateLogo();
    });
  };

  afterLeave?: (data: ITransitionData) => Promise<void>;

  beforeEnter?: (data: ITransitionData) => Promise<void>;

  beforeLeave?: (data: ITransitionData) => Promise<void>;

  pageElements: PageElements<typeof this.EL>;

  initElements = () => {
    this.namespace = 'schedule';
    this.pageElements = new PageElements(this.EL);
  };
}
