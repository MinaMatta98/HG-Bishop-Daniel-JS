import gsap from 'gsap/all';
import { Animations } from 'src/animations/animations';
import { GlobalPageAnimations } from 'src/interfaces/IPageAnimations';

import { Player } from './player';

export class PortablePlayer {
  private _player: Player;

  private _widgetContainer: JQuery<HTMLElement>;

  private _playlistWrapper: JQuery<HTMLElement>;

  private _animationTL: gsap.core.Timeline;

  private supportAnimations = GlobalPageAnimations;

  constructor() {
    $(() => {
      Animations.player ? (this._player = Animations.player) : (this._player = new Player());
      Animations.initPlayer(this._player);
      this._animationTL = gsap.timeline();
      this._widgetContainer = $('.widget-wrapper');
      this._playlistWrapper = $('.playlist-wrapper');
      this.toggleFullPlayerButton();
      this.toggleMiniPlayerButton();
      this.initWidgetDisplay();
      this._player.updateElapsedTime();
    });
  }

  private initWidgetDisplay = () => {
    gsap.set(this._playlistWrapper, { width: 0, height: 0, duration: 1 });
    gsap.set(this._playlistWrapper, { opacity: 0, duration: 0.5 });
    gsap.set(this._playlistWrapper, { display: 'none' });
    gsap.set(this._playlistWrapper, { overflow: 'hidden' });
  };

  private toggleFullPlayerButton = () => {
    this._widgetContainer.on('mouseenter', () => {
      this._animationTL.clear();
      this._playlistWrapper.css('display', 'flex');
      this._animationTL.to(this._playlistWrapper, { opacity: 1, duration: 0.5, display: 'flex' });
      this._animationTL.to(
        this._playlistWrapper,
        { width: '50vw', height: '50vh', duration: 1 },
        '=0'
      );
      this.supportAnimations.cursorAnimations.cursorWhite();
    });
  };

  private toggleMiniPlayerButton = () => {
    this._widgetContainer.on('mouseleave', async () => {
      this._animationTL.clear();
      this._animationTL.to(this._playlistWrapper, { width: 0, height: 0, duration: 1 }, '0');
      await this._animationTL.to(this._playlistWrapper, { opacity: 0, duration: 0.5 }, '0');
      this._playlistWrapper.css('display', 'none');
      this.supportAnimations.cursorAnimations.cursorBlue();
    });
  };
}
