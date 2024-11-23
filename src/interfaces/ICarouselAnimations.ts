import type { IGsapPageAnimations } from './IGsapPageAnimations';
import type { IMouseEventAnimations } from './IMouseEventAnimations';

interface ICarouselAnimations extends IGsapPageAnimations, IMouseEventAnimations {
  animateCarousel: () => void;
  nextSlide?: () => void;
  prevSlide?: () => void;
  nthSlide?: (n: number) => void;
}
