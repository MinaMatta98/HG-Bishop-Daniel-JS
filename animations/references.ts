class SwiperReferences {
  public static swiperPhotoClass = '.swiper.is-photos';
  public static swiperContentClass = '.swiper.is-content';
  public static swiperNextElClass = '.arrow.is-right';
  public static swiperPrevElClass = '.arrow.is-left';
}

class CursorReferences {
  public static _pins: string[] = ['.cursor-pin-1', '.cursor-pin-1.pin-2', '.cursor-pin-1.pin-3'];
  public static _whitePinBg: string[] = ['white', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.4)'];
  public static _bluePingBg: string[] = [
    'var(--cursor-inner)',
    'var(--cursor-center)',
    'var(--cursor-outer)',
  ];
}

class LogoReferences {
  public static centerLogoClass: string = '.center-logo';
  public static topLogoClass: string = '.ths07-logo';
}

class TransitionReferences {
  public static transitionDivs: string[] = [
    '.first-transition',
    '.second-transition',
    '.third-transition',
    '.fourth-transition',
    '.fifth-transition',
  ];
  public static transitionClass: string = '.transition';
  public static pageLoadClass: string = '.pageload';
}

class BioReferences {
	public static headingClass: string = '.bio-heading';
	public static timelineClass: string = '.timeline_item';
}

class HomePageReferences {
  public static videoID: string = '#b965e91e-9ebd-466c-d50e-3a2d768d8b8c-video';
  public static heroHeadingClass: string = '.hero-heading';
  public static openingHeroClass: string = '.opening-hero';
  public static gsapSliderContainer: string = '.slider-vertical-carousel';
  public static gsapButtons: string = '.button-div';
  // public static gsapBackward: string = '.button-div.button_back';
  public static gsapDescriptor: string = '.slider-descriptor-wrapper';
  public static gsapSliderImg: string = '.calendar-img';
  public static gsapProgressContainer: string = '.sideline-progress';
  public static gsapSliderDescriptor: string = '.slider-descriptor';
  public static gsapHeadingDescriptor: string = '.slider-image-heading';
  public static gsapSloganDescriptor: string = '.slider-image-slogan';
  public static gsapSliderImgContainer: string = '.slider-images-wrapper';
  public static gsapSliderTextDiv: string = '.slider-text-div';
  public static globeDiv: string = '#webGL';
  public static ministryWrapper: string = '.ministry-wrapper';
  public static scheduleWrapper: string = '.schedule-wrapper';
  // public static slideContainer: string = '.slide-container';
  public static slideBlockClass: string = '.slide-block';
}

class MinistryPageReferences {
  public static globeAttributeSelector: string = "[fs-3dglobe-element='container']";
  public static ministrySliderClass: string = '.ministry-side-slider';
  public static highlightCardClass: string = '.highlight_card.white';
}

class NavBarReferences {
  public static navLinksClass: string = '.link-block';
  public static scrollButton: string = '.outer-parent';
}

export class References {
  public static navBarClasses = NavBarReferences;
  public static cursorClasses = CursorReferences;
  public static swiperClasses = SwiperReferences;
  public static logoClasses = LogoReferences;
  public static transitionClasses = TransitionReferences;
  public static homePageClasses = HomePageReferences;
  public static ministryPageClasses = MinistryPageReferences;
}
