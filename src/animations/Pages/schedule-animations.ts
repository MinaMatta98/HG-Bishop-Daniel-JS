import type { ITransitionData } from '@barba/core/dist/core/src/src/defs';
import $ from 'jquery';
import type { IPageAnimations } from 'src/interfaces/IPageAnimations';
import { GlobalPageAnimations, PageElements } from 'src/interfaces/IPageAnimations';

export class ScheduleAnimations implements IPageAnimations {
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

  pageElements: PageElements<readonly ['#calendar']>;

  initElements = () => {
    this.namespace = 'schedule';
    this.pageElements = new PageElements(['#calendar'] as const);
  };
}
