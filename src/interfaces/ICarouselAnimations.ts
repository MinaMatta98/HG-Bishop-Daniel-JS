import type { IGsapPageAnimations } from './IGsapPageAnimations';
import type { IMouseEventAnimations } from './IMouseEventAnimations';

export interface ICarouselAnimations extends IGsapPageAnimations, IMouseEventAnimations {
  pageElemets: Map<string, JQuery<HTMLElement>>;
  initElements: () => void;
  animateCarousel: () => void;
  nextSlide?: (i: number, el: JQuery<HTMLElement>) => void;
  prevSlide?: (i: number, el: JQuery<HTMLElement>) => void;
  nthSlide?: (n: number) => void;
  animatePins?: (i: number, el: JQuery<HTMLElement>) => void;
  animateFocusedControls?: (el: JQuery<HTMLElement>) => void;
  animateUnfocusedControls?: (el: JQuery<HTMLElement>) => void;
  animateFocusedSlide?: (el: JQuery<HTMLElement>) => void;
  animateUnfocusedSlide?: (el: JQuery<HTMLElement>) => void;
  animateButtons: () => void;
}
