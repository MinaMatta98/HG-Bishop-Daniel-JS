import type { ISchemaPage } from '@barba/core/dist/core/src/src/defs';
import { gsap } from 'gsap/all';
import $ from 'jquery';

import { References } from './references';

export class NavBarAnimations {
  private _links: JQuery<HTMLElement>;
  private _disabledClass: string;
  // This is needed to maintain the gsap Animation state
  // for the scroll button.
  protected static currentTL: GSAPTween;

  constructor() {
    $(() => (this._links = $(References.navBarClasses.navLinksClass)));
    this._disabledClass = 'disabled';
  }

  underlineNav = async (identifier: ISchemaPage['namespace'], underline: boolean) => {
    const width = underline ? '105%' : '0%';
    await gsap.to(`.underline-${identifier}`, { width: width, duration: 1 });
  };

  initNavLinks = () => {
    $(() => {
      $(this._links).each((_, e) => {
        const image = $(e).find('.capture-block');
        $(e).on('click', (e) => {
          if ($(this).hasClass(this._disabledClass)) e.preventDefault();
        });
        $(e).on('mouseenter', () =>
          gsap.fromTo(image, { opacity: 0 }, { display: 'block', opacity: 1, duration: 0.5 })
        );
        $(e).on('mouseleave', () => gsap.to(image, { display: 'none', opacity: 0, duration: 0.5 }));
      });
    });
  };

  disableNavLinks = () => {
    $(this._links).each((_, e) => {
      $(e).addClass(this._disabledClass);
    });
  };

  enableNavLinks = () => {
    $(this._links).each((_, e) => {
      $(e).removeClass(this._disabledClass);
    });
  };

  animateScrollButton = (topContainer: JQuery<HTMLElement>) => {
    if (NavBarAnimations.currentTL) NavBarAnimations.currentTL.kill();

    const scrollButton = $(References.navBarClasses.scrollButton);
    gsap.set(scrollButton, { opacity: 0 });

    scrollButton.on('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    NavBarAnimations.currentTL = gsap.to(scrollButton, {
      scrollTrigger: {
        trigger: topContainer,
        start: 'bottom 50%',
        scrub: 1,
      },
      opacity: 1,
    });
  };
}
