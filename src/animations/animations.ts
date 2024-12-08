import type { ISchemaPage, ITransitionData } from '@barba/core/dist/core/src/src/defs';
import { instanceofICssAnimations } from 'src/interfaces/ICssAnimations';
import { instanceofIDisposableAnimations } from 'src/interfaces/IDisposableAnimations';
import { instanceofIGsapPageAnimations } from 'src/interfaces/IGsapPageAnimations';
import { instanceofIMouseEventAnimations } from 'src/interfaces/IMouseEventAnimations';
import {
  GlobalPageAnimations,
  type IComplexTransitions,
  type IGenericTransitions,
  type IPageAnimations,
} from 'src/interfaces/IPageAnimations';
import { instanceofIResizePageAnimations } from 'src/interfaces/IResizePageAnimations';

//import { FooterAnimations } from './Components/footerAnimations';
import { BioAnimations } from './Pages/bio-animations';
import { ChurchContentAnimations } from './Pages/churchcontent-animations';
import { ChurchAnimations } from './Pages/churchpage-animations';
import { HomePageAnimations } from './Pages/homepage-animations';
import { MinistryContentAnimations } from './Pages/ministrycontent-animations';
import { MinistryPageAnimations } from './Pages/ministrypage-animations';
import { ScheduleAnimations } from './Pages/schedule-animations';
import { SermonPageAnimations } from './Pages/sermon-animations';
import { SermonContentAnimations } from './Pages/sermoncontent-animations';
import type { Player } from './UI/Widgets/player';

export class Animations implements IGenericTransitions, IComplexTransitions {
  private static _animators: IPageAnimations[] = [
    new HomePageAnimations(),
    new BioAnimations(),
    new MinistryPageAnimations(),
    new SermonPageAnimations(),
    new ChurchAnimations(),
    new ChurchContentAnimations(),
    new SermonContentAnimations(),
    new MinistryContentAnimations(),
    new ScheduleAnimations(),
  ];

  public globalPageAnimations = GlobalPageAnimations;

  public static player: Player;

  private handlers: Record<
    keyof IGenericTransitions,
    (data: ITransitionData, animator: IPageAnimations) => Promise<void>
  > = {
    leave: async (data, animator) =>
      await this.globalPageAnimations.genericAnimations.leave({
        data,
        cssTransClass: instanceofICssAnimations(animator) ? animator : null,
        mouseEventTransClass: instanceofIMouseEventAnimations(animator) ? animator : null,
        resizeTransClass: instanceofIResizePageAnimations(animator) ? animator : null,
        gsapTransClass: instanceofIGsapPageAnimations(animator) ? animator : null,
        disposableTransClass: instanceofIDisposableAnimations(animator) ? animator : null,
      }),
    enter: async (data, animator) =>
      await this.globalPageAnimations.genericAnimations.enter({
        data,
        cssTransClass: instanceofICssAnimations(animator) ? animator : null,
      }),
    after: async (data) =>
      await this.globalPageAnimations.genericAnimations.after({
        data,
      }),
    before: async (data) =>
      await this.globalPageAnimations.genericAnimations.before({
        data,
      }),
  };

  enter = async (obj: { data: ITransitionData }) => {
    await this.handleTransitionAnimation({ generic: 'enter' }, obj.data.next.namespace, obj.data);
  };

  before = async (obj: { data: ITransitionData }) => {
    await this.handleTransitionAnimation({ generic: 'before' }, obj.data.next.namespace, obj.data);
  };

  leave = async (obj: { data: ITransitionData }) => {
    await this.handleTransitionAnimation(
      { generic: 'leave' },
      obj.data.current.namespace,
      obj.data
    );
  };

  after = async (obj: { data: ITransitionData }) => {
    await this.handleTransitionAnimation({ generic: 'after' }, obj.data.next.namespace, obj.data);
  };

  once = async (data: ITransitionData, isFirstLoad: boolean) => {
    await this.handleTransitionAnimation(
      { complex: 'once' },
      data.next.namespace,
      data,
      isFirstLoad
    );
  };

  afterEnter = async (data: ITransitionData) => {
    await this.handleTransitionAnimation({ complex: 'afterEnter' }, data.next.namespace, data);
  };

  afterLeave = async (data: ITransitionData) => {
    await this.handleTransitionAnimation({ complex: 'afterLeave' }, data.current.namespace, data);
  };

  beforeEnter = async (data: ITransitionData) => {
    await this.handleTransitionAnimation({ complex: 'beforeEnter' }, data.next.namespace, data);
  };

  beforeLeave = async (data: ITransitionData) => {
    await this.handleTransitionAnimation({ complex: 'beforeLeave' }, data.current.namespace, data);
  };

  private async handleTransitionAnimation<
    T extends keyof IComplexTransitions,
    U extends keyof IGenericTransitions,
  >(
    fnObj: {
      complex?: T;
      generic?: U;
    },
    namespace: ISchemaPage['namespace'],
    data: ITransitionData,
    ...any: any[]
  ): Promise<void> {
    const animator = Animations._animators.find((animator) => animator.namespace === namespace);

    if (fnObj.generic && this.handlers[fnObj.generic]) {
      await this.handlers[fnObj.generic](data, animator);
    }

    if (fnObj.complex && animator[fnObj.complex]) {
      await animator[fnObj.complex](data, ...any);
    }
  }

  public static initPlayer = (player: Player) => {
    if (!Animations.player) {
      Animations.player = player;
    } else {
      Animations.player.initializeContainers();
      Animations.player.initUI();
      Animations.player.updateUI();
      Animations.player.playList.initUI();
      Animations.player.playList.updateUI();
      Animations.player.playList.initalizeRender();
    }
  };
}
