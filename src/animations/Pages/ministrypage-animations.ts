import { tsParticles } from '@tsparticles/engine';
import { gsap } from 'gsap/all';
import $ from 'jquery';
import { loadFull } from 'tsparticles';

//import UniversalTilt from 'universal-tilt.js';
import * as animation from '../animation.json';
import { Animations } from '../animations';
import { GlobeAnimation } from '../Components/globe';
import { LogoAnimations } from '../Components/logo-animations';
import type { NavBarAnimations } from '../UI/navbar-animations';

export class MinistryPageAnimations {
  private _globeAnimation: GlobeAnimation;

  constructor() {}

  public init = (): void => {
    this._globeAnimation = new GlobeAnimation(false);
    this._globeAnimation.init();
  };

  public disposeGlobe = (): void => {
    this._globeAnimation.dispose();
  };

  private animateMinistryLogo = (): void => {
    LogoAnimations.animateLogo();
  };

  private animateItemSection = (): void => {
    const circle = $('.section-glow');
    const itemSection = $('.item-section');
    gsap.set(circle, { display: 'none' });

    itemSection.on('mouseenter', () => {
      Animations.cursorWhite();
      gsap.set(circle, { display: 'block' });
    });
    itemSection.on('mouseleave', () => gsap.set(circle, { display: 'none' }));

    const onMouseMove = (e: MouseEvent) => {
      // Calculate the center coordinates of the circle
      const centerX = e.pageX - circle.width();
      const centerY = e.pageY - itemSection.position().top - circle[0].offsetHeight / 2;

      // Update the position of the circle based on the center coordinates
      circle.css('left', centerX + 'px');
      circle.css('top', centerY + 'px');
    };

    document.addEventListener('mousemove', onMouseMove);
  };

  private tiltContainer = () => {
    //UniversalTilt.init({
    //  elements: $('.item-section'),
    //  settings: {
    //    shine: true,
    //    'shine-opacity': 0.5,
    //    'shine-save': true,
    //  },
    //  callbacks: {
    //    // callbacks...
    //  },
    //});
  };

  private animateContainer = (): void => {
    $(async () => {
      await loadFull(tsParticles);
      tsParticles.load({
        id: 'item-container',
        // @ts-ignore
        options: animation,
        // url: "http://foo.bar/particles.js // this can be used as an alternative to options property
      });
    });
  };

  private animateNavbarButton = (navbarAnimator: NavBarAnimations): void => {
    navbarAnimator.animateScrollButton($('.webgl'));
  };

  public animateMinistryPage = async (navbarAnimator: NavBarAnimations): Promise<void> => {
    $(() => {
      this.animateNavbarButton(navbarAnimator);
      this.animateMinistryLogo();
      this.init();
      this.animateItemSection();
      this.tiltContainer();
      this.animateContainer();
      Animations.footerAnimateBlue();
      Animations.cursorWhite();
    });
  };
}
