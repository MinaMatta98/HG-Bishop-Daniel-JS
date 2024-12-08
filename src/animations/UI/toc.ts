import { gsap } from 'gsap/all';
import $ from 'jquery';
import type { IDisposableAnimations } from 'src/interfaces/IDisposableAnimations';
import type { IGsapComponentAnimations } from 'src/interfaces/IGsapPageAnimations';
import { GsapAnimations } from 'src/interfaces/IGsapPageAnimations';
import { GsapComponentAnimations } from 'src/interfaces/IGsapPageAnimations';
import type { IMouseEventAnimations } from 'src/interfaces/IMouseEventAnimations';
import { GlobalPageAnimations, PageElements } from 'src/interfaces/IPageAnimations';
import type { IResizePageAnimations } from 'src/interfaces/IResizePageAnimations';

export class TOCAnimations
  implements
    IGsapComponentAnimations,
    IMouseEventAnimations,
    IDisposableAnimations,
    IResizePageAnimations
{
  public _tocButton: TOCButton;

  /** Page sections with attr*/
  private _sections: [HTMLElement, number][] = [];

  private _sectionWrappers: HTMLElement[] = [];

  private indentationLevel = (element: JQuery<HTMLElement>, acc: number): number => {
    const parent = element.parentsUntil(`[data-section-descriptor]`).parent();
    if (parent.length > 0) {
      if (parent.attr('data-section-descriptor') != null) {
        return this.indentationLevel(parent, acc + 1);
      }
    }

    return acc;
  };

  private setupInnerElements = (
    tocSectionHolder: JQuery<HTMLElement>,
    element: JQuery<HTMLElement>
  ): {
    textWrapper: JQuery<HTMLElement>;
    sectionWrapper: JQuery<HTMLElement>;
    sectionIcon: JQuery<HTMLElement>;
    sectionHeading: JQuery<HTMLElement>;
  } => {
    const sectionName = $(element).attr('data-section-descriptor');
    // Create individual elements
    const sectionWrapper = $('<div></div>').addClass('toc-section-wrapper');
    const sectionIcon = $('<div></div>').addClass('current-section-icon');
    const textWrapper = $('<div></div>').addClass('toc-section-text');
    const sectionHeading = $('<h5></h5>').addClass('toc-heading').text(sectionName);

    // Append elements to their respective parents
    textWrapper.append(sectionHeading);
    sectionWrapper.append(sectionIcon);
    sectionWrapper.append(textWrapper);
    tocSectionHolder.append(sectionWrapper);

    return {
      textWrapper,
      sectionWrapper,
      sectionIcon,
      sectionHeading,
    };
  };

  onResizeHandler = {
    handler: () => {
      const self = GlobalPageAnimations.tocAnimations;
      $(window).on('resize', () => {
        self.disposePageAnimations();
        this.animateComponent();
      });
    },
    dispose: () => {},
  };

  disposePageAnimations = () => {
    this.gsapComponentAnimations.disposePageAnimations();
  };

  initializeBaseState = () => {
    this.pageElements.el.sectionHolder.remove();

    const sectionHolder = $('<div></div>').addClass('section-holder');

    this.pageElements.el.sectionsToc.append(sectionHolder);

    this.pageElements = new PageElements(['.sections-toc', '.section-holder'] as const);

    this._tocButton.pageElements = new PageElements([
      '.sections-toc',
      '.section-holder',
      '.toc-button',
      '.code-embed-7',
    ] as const);

    this._sections = [];

    for (const e of Array.from($(`[data-section-descriptor]`))) {
      this._sections.push([e, this.indentationLevel($(e), 0)]);
    }

    this._sectionWrappers = [];
  };

  initElements = () => {
    this.gsapComponentAnimations = new GsapComponentAnimations(new GsapAnimations());

    this.pageElements = new PageElements(['.sections-toc', '.section-holder'] as const);

    for (const e of Array.from($(`[data-section-descriptor]`))) {
      this._sections.push([e, this.indentationLevel($(e), 0)]);
    }

    this._tocButton = new TOCButton(this.gsapComponentAnimations, this.pageElements);

    if (this._sections.length === 0) this._tocButton.hideSidebar();
  };

  pageElements: PageElements<readonly ['.sections-toc', '.section-holder']>;

  gsapComponentAnimations: GsapComponentAnimations;

  animateComponent = () => {
    $(() => {
      this.initElements();

      this.initializeBaseState();

      this._tocButton._toggled ? this._tocButton.hideSidebarAsync() : this._tocButton.hideSidebar();

      const { _sections, onMouseClickHandler } = this;

      const tocSectionHolder = this.pageElements.el.sectionHolder;

      const sectionWrappers = this._sectionWrappers;

      _sections.forEach(([element, parentNum]) => {
        const { textWrapper, sectionWrapper } = this.setupInnerElements(
          tocSectionHolder,
          $(element)
        );

        // Check if window is within section
        if (
          window.scrollY > $(element).offset().top &&
          window.scrollY <= $(element).offset().top + $(element).height()
        ) {
          sectionWrapper[0].className = 'toc-section-wrapper current';
        }

        gsap.set(textWrapper, { marginLeft: `${parentNum * 1}em` });

        sectionWrappers.push(sectionWrapper[0]);

        onMouseClickHandler.handler(this, sectionWrapper, $(element));

        const tween = gsap.to(sectionWrapper, {
          scrollTrigger: {
            trigger: element,
            start: 'top 50%',
            end: 'bottom 50%',
            scrub: true,
            onToggle() {
              $(sectionWrappers)
                .filter((i, e) => {
                  return parentNum !== _sections[i][1] || e !== sectionWrapper[0];
                })
                .each((_, e) => {
                  e.className = 'toc-section-wrapper';
                });
            },
            onRefresh() {
              $(sectionWrappers)
                .filter((i, e) => {
                  return parentNum !== _sections[i][1] || e !== sectionWrapper[0];
                })
                .each((_, e) => {
                  e.className = 'toc-section-wrapper';
                });
            },
          },
          className: 'toc-section-wrapper current',
        });
        this.gsapComponentAnimations.newItem(tween);
      });

      const { tocButton } = this._tocButton.pageElements.el;

      this._sections.length === 0
        ? tocButton.css('display', 'none')
        : tocButton.css('display', 'flex');
    });
  };

  onMouseClickHandler = {
    handler(self: TOCAnimations, from: JQuery<HTMLElement>, to: JQuery<HTMLElement>) {
      $(from).on('click', () => {
        self.gsapComponentAnimations.newItem(
          gsap.to(window, { duration: 1, scrollTo: { y: $(to).offset().top } })
        );
      });
    },
    dispose(self: TOCAnimations) {
      self.disposePageAnimations();
    },
  };
}

class TOCButton implements IGsapComponentAnimations, IMouseEventAnimations {
  public _toggled: boolean;
  /**
   *
   */
  constructor(
    gsapAnimations: GsapAnimations,
    pageElements: PageElements<readonly ['.sections-toc', '.section-holder']>
    //sectionToc: JQuery<HTMLElement>,
    //sectionHolder: JQuery<HTMLElement>
  ) {
    this.gsapComponentAnimations = new GsapComponentAnimations(gsapAnimations);
    this.pageElements = pageElements.extend(['.toc-button', '.code-embed-7'] as const);
    this.initElements();
    this.animateComponent();
  }

  initElements = () => {
    this._toggled = false;
  };

  pageElements: PageElements<
    readonly ['.sections-toc', '.section-holder', '.toc-button', '.code-embed-7']
  >;

  gsapComponentAnimations: GsapComponentAnimations;

  animateComponent = () => {
    this.onMouseClickHandler.handler(this);
  };

  onMouseClickHandler = {
    handler(self: TOCButton) {
      self.pageElements.el.tocButton.on('click', () => {
        self.toggleSidebar();
      });
    },
    dispose() {},
  };

  public hideSidebar = () => {
    const tweens = [
      gsap.set(this.pageElements.el.sectionsToc, { height: 0, padding: 0 }),
      gsap.set(this.pageElements.el.sectionHolder, { display: 'none', overflow: 'hidden' }),
      gsap.set(this.pageElements.el.tocButton, { backgroundColor: 'rgba(0, 0, 0, 0.57)' }),
      gsap.set(this.pageElements.el.codeEmbed7, { rotation: 180 }),
      gsap.set(this.pageElements.el.sectionHolder, { height: 0 }),
    ];
    this.gsapComponentAnimations.gsapPageAnimations.newItems(tweens);
  };

  public hideSidebarAsync = () => {
    const tl = gsap.timeline();

    const tweens = [
      gsap.to(this.pageElements.el.sectionsToc, { height: 0, padding: 0 }),
      gsap.to(this.pageElements.el.tocButton, {
        backgroundColor: 'rgba(0, 0, 0, 0.57)',
      }),
      gsap.to(this.pageElements.el.codeEmbed7, { rotation: 180 }),
      tl.set(this.pageElements.el.sectionsToc, { overflow: 'hidden' }),
      tl.to(this.pageElements.el.sectionHolder, { height: 0 }),
      tl.set(this.pageElements.el.sectionHolder, { display: 'none' }),
    ];

    this.gsapComponentAnimations.gsapPageAnimations.newItems([tl, ...tweens]);
  };

  private toggleSidebar = () => {
    const height = this._toggled ? 0 : 'auto';
    const padding = this._toggled ? 0 : '1em';
    const display: string = this._toggled ? 'none' : 'unset';
    const backgroundColor: string = this._toggled ? 'rgba(0, 0, 0, 0.57)' : 'rgba(0, 0, 0, 0.87)';
    const rotation: number = this._toggled ? 180 : 0;

    const tween = gsap.to(this.pageElements.el.sectionsToc, { height });
    const secondTween = gsap.to(this.pageElements.el.tocButton, { backgroundColor });
    const thirdTween = gsap.to(this.pageElements.el.codeEmbed7, { rotation });

    const tl = gsap.timeline();
    tl.to(this.pageElements.el.sectionHolder, { display });
    tl.to(this.pageElements.el.sectionHolder, { height });
    tl.to(this.pageElements.el.sectionsToc, { padding }, this._toggled ? '0' : '>-0.4');

    this._toggled = !this._toggled;

    this.gsapComponentAnimations.gsapPageAnimations.newItems([tl, tween, secondTween, thirdTween]);
  };
}
