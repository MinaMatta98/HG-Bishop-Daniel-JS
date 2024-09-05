import { References } from './references';

export class FooterAnimations {
  public static animateFooterBlue = (): void => {
    $(() => {
      const footerSection = document.querySelector(References.footerClasses.footerSectionClass);
      const footerCta = document.querySelector(References.footerClasses.footerCtaClass);
      const footerBottom = document.querySelector(References.footerClasses.footerBottomClass);
      const footerSocial = document.querySelector(References.footerClasses.footerSocialClass);

      $(footerSection).css('background-color', 'var(--cursor-inner)');
      $(footerCta).css('background-color', 'white');
      $(footerCta).find('div').css('color', 'var(--cursor-inner)');
      $(footerBottom).css('color', 'white');
      $(footerSocial).find('a').css('color', 'white');
    });
  };

  public static animateFooterWhite = () => {
    $(() => {
      const footerSection = document.querySelector(References.footerClasses.footerSectionClass);
      const footerCta = document.querySelector(References.footerClasses.footerCtaClass);
      const footerBottom = document.querySelector(References.footerClasses.footerBottomClass);
      const footerSocial = document.querySelector(References.footerClasses.footerSocialClass);

      $(footerSection).css('background-color', 'white');
      $(footerCta).css('background-color', 'var(--cursor-inner)');
      $(footerCta).find('div').css('color', 'white');
      $(footerBottom).css('color', 'black');
      $(footerSocial).find('a').css('color', 'var(--cursor-inner)');
    });
  };
}
