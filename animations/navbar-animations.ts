import type { ISchemaPage } from '@barba/core/dist/core/src/src/defs';
import { gsap, ScrollTrigger } from 'gsap/all';
import $ from 'jquery';

import { References } from './references';

export class NavBarAnimations {
  private _links: JQuery<HTMLElement>;
  private _disabledClass: string;

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

  scrollButtonInit = () => {
    const scrollButton = $(References.navBarClasses.scrollButton);
    const openingHero = $(References.homePageClasses.openingHeroClass);
    gsap.set(scrollButton, { opacity: 0 });

    scrollButton.on('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    ScrollTrigger.create({
      trigger: openingHero,
      start: 'bottom 50%',
      onEnter() {
        gsap.to(scrollButton, { opacity: 1, duration: 1 });
      },
      onLeaveBack() {
        gsap.to(scrollButton, { opacity: 0, duration: 1 });
      },
    });
  };
}
