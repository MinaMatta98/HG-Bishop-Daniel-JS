import { Animations } from '../animations';
import { References } from '../references';

export class FooterAnimations {
  public static animateFooterBlue = (): void => {
    $(() => {
      const footerSection = $(References.footerClasses.footerSectionClass);
      const footerCta = $(References.footerClasses.footerCtaClass);
      const footerBottom = $(References.footerClasses.footerBottomClass);
      const footerSocial = $(References.footerClasses.footerSocialClass);

      footerSection.css('background-color', 'var(--cursor-inner)');
      footerCta.css('background-color', 'white');
      footerCta.find('div').css('color', 'var(--cursor-inner)');
      footerBottom.css('color', 'white');
      footerSocial.find('a').css('color', 'white');

      footerSection.on('mouseenter', () => {
        Animations.cursorWhite();
      });

      footerCta.on('mouseenter', () => {
        Animations.cursorBlue();
      });

      footerCta.on('mouseleave', () => {
        Animations.cursorWhite();
      });
    });
  };

  public static animateFooterWhite = () => {
    $(() => {
      const footerSection = $(References.footerClasses.footerSectionClass);
      const footerCta = $(References.footerClasses.footerCtaClass);
      const footerBottom = $(References.footerClasses.footerBottomClass);
      const footerSocial = $(References.footerClasses.footerSocialClass);

      footerSection.css('background-color', 'white');
      footerCta.css('background-color', 'var(--cursor-inner)');
      footerCta.find('div').css('color', 'white');
      footerBottom.css('color', 'black');
      footerSocial.find('a').css('color', 'var(--cursor-inner)');

      footerSection.on('mouseenter', () => {
        Animations.cursorBlue();
      });

      footerCta.on('mouseenter', () => {
        Animations.cursorWhite();
      });

      footerCta.on('mouseleave', () => {
        Animations.cursorBlue();
      });
    });
  };
}
