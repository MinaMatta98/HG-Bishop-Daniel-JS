import type { IMouseEventAnimations } from 'src/interfaces/IMouseEventAnimations';
import { GlobalPageAnimations, PageElements } from 'src/interfaces/IPageAnimations';

export class FooterAnimations {
  private static supportingAnimations: typeof GlobalPageAnimations;

  private static pageElements: PageElements<
    readonly ['.footer-section', '.footer-cta', '.footer-bottom', '.social-media-grid-top']
  >;

  private static initElements = (): void => {
    this.pageElements = new PageElements([
      '.footer-section',
      '.footer-cta',
      '.footer-bottom',
      '.social-media-grid-top',
    ] as const);
    this.supportingAnimations = GlobalPageAnimations;
  };

  public static animateFooterBlue = (): void => {
    $(() => {
      this.initElements();
      const { footerSection, footerCta, footerBottom, socialMediaGridTop } = this.pageElements.el;

      footerSection.css('background-color', 'var(--cursor-inner)');
      footerCta.css('background-color', 'white');
      footerCta.find('div').css('color', 'var(--cursor-inner)');
      footerBottom.css('color', 'white');
      socialMediaGridTop.find('a').css('color', 'white');

      footerSection.on('mouseenter', () => {
        this.supportingAnimations.cursorAnimations.cursorWhite();
      });

      footerCta.on('mouseenter', () => {
        this.supportingAnimations.cursorAnimations.cursorBlue();
      });

      footerCta.on('mouseleave', () => {
        this.supportingAnimations.cursorAnimations.cursorWhite();
      });

      this.onResizeHandler();
    });
  };

  public static onResizeHandler = (): void => {
    const { footerSection, footerCta } = this.pageElements.el;
    footerSection.off('mouseenter', () => {
      this.supportingAnimations.cursorAnimations.cursorWhite();
    });

    footerCta.off('mouseenter', () => {
      this.supportingAnimations.cursorAnimations.cursorBlue();
    });

    footerCta.off('mouseleave', () => {
      this.supportingAnimations.cursorAnimations.cursorWhite();
    });
  };

  public static animateFooterWhite = () => {
    $(() => {
      this.initElements();

      const { footerSection, footerCta, footerBottom, socialMediaGridTop } = this.pageElements.el;

      footerSection.css('background-color', 'white');
      footerCta.css('background-color', 'var(--cursor-inner)');
      footerCta.find('div').css('color', 'white');
      footerBottom.css('color', 'black');
      socialMediaGridTop.find('a').css('color', 'var(--cursor-inner)');

      footerSection.on('mouseenter', () => {
        this.supportingAnimations.cursorAnimations.cursorBlue();
      });

      footerCta.on('mouseenter', () => {
        this.supportingAnimations.cursorAnimations.cursorWhite();
      });

      footerCta.on('mouseleave', () => {
        this.supportingAnimations.cursorAnimations.cursorBlue();
      });
    });
  };
}
