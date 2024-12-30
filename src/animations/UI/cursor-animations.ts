import gsap from 'gsap';
import * as Rx from 'rxjs';

export class CursorAnimations {
  private static _pins: string[] = ['.cursor-pin-1', '.cursor-pin-1.pin-2', '.cursor-pin-1.pin-3'];

  private static _whitePinBg: string[] = [
    'white',
    'rgba(255,255,255,0.6)',
    'rgba(255,255,255,0.4)',
  ];

  private static _bluePingBg: string[] = [
    'var(--cursor-inner)',
    'var(--cursor-center)',
    'var(--cursor-outer)',
  ];

  public static hideCursor = () => {
    $('.cursor').css({ display: 'none' });
  };

  public static showCursor = () => {
    $('.cursor').css({ display: 'flex' });
  };

  public static onResizeHandler = () => {
    $(window).width() < 768 ? this.hideCursor() : this.showCursor();

    const rx = Rx.fromEvent(window, 'resize').pipe(Rx.debounceTime(300));

    rx.subscribe(() => {
      $(window).width() < 768 ? this.hideCursor() : this.showCursor();
    });
  };

  public static cursorWhite = () => {
    this._pins.map((pin, index) => gsap.to(pin, { background: this._whitePinBg[index] }));
  };

  public static cursorBlue = () => {
    this._pins.map((pin, index) => gsap.to(pin, { background: this._bluePingBg[index] }));
  };

  public static cursorHover = () => {
    $('a').on('mouseenter', () => {
      $('.cursor').trigger('click');
    });
    $('a').on('mouseleave', () => {
      $('.cursor').trigger('click');
    });
  };
}
