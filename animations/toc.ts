import { gsap } from 'gsap/all';
import $ from 'jquery';

import { References } from './references';

export class TOCAnimations {
  /** Page sections with attr*/
  private _sections: [HTMLElement, number][];
  /** Element holding the divs for sidebar */
  private _sectionHolder: JQuery<HTMLElement>;
  /** the divs for sidebar */
  private _sectionWrappers: HTMLElement[];

  private _sectionToc: JQuery<HTMLElement>;

  private _tocButton: TOCButton;

  constructor() {
    $(() => {
      this._sectionHolder = $('.' + References.tocClasses.tocSectionHolderClass);
      this._sections = [];
      for (const e of Array.from($(`[${References.tocClasses.sectionDescriptorAttribute}]`))) {
        this._sections.push([e, this.indentationLevel($(e), 0)]);
      }
      this._sectionWrappers = [];
      this._sectionToc = $(References.tocClasses.tocContainer);
      this._tocButton = new TOCButton(this._sectionToc, this._sectionHolder);
    });
  }

  private initToggleButton = () => {
    // set the initial height of the sidebar to 0
    this._tocButton.hideSidebar();
  };

  /** This results in the children being cleared */
  private reset = () => {
    this._sectionHolder.remove();

    this._sectionHolder = $('<div></div>').addClass(References.tocClasses.tocSectionHolderClass);

    this._tocButton.setSectionHolder(this._sectionHolder);

    this._sectionToc.append(this._sectionHolder);

    this._sections = [];

    for (const e of Array.from($(`[${References.tocClasses.sectionDescriptorAttribute}]`))) {
      this._sections.push([e, this.indentationLevel($(e), 0)]);
    }

    this._sectionWrappers = [];
  };

  private getParent = (element: JQuery<HTMLElement>): JQuery<HTMLElement> => {
    return element.parentsUntil(`[${References.tocClasses.sectionDescriptorAttribute}]`).parent();
  };

  private indentationLevel = (element: JQuery<HTMLElement>, acc: number): number => {
    const parent = this.getParent(element);
    if (parent.length > 0) {
      if (parent.attr(References.tocClasses.sectionDescriptorAttribute) != null) {
        return this.indentationLevel(parent, acc + 1);
      }
    }

    return acc;
  };

  private addClickHandler = (e: JQuery<HTMLElement>, target: JQuery<HTMLElement>) => {
    $(e).on('click', () => {
      window.scrollTo({ behavior: 'smooth', top: $(target).offset().top });
    });
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
    const sectionWrapper = $('<div></div>').addClass(
      References.tocClasses.individualSectionWrapper
    );
    const sectionIcon = $('<div></div>').addClass(References.tocClasses.tocSectionIconClass);
    const textWrapper = $('<div></div>').addClass(References.tocClasses.tocSectionTextClass);
    const sectionHeading = $('<h5></h5>')
      .addClass(References.tocClasses.tocSectionHeadingClass)
      .text(sectionName);

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

  public tocAnimation = () => {
    $(() => {
      this.reset();

      this.initToggleButton();

      const { _sections, addClickHandler } = this;

      const tocSectionHolder = this._sectionHolder;

      const sectionWrappers = this._sectionWrappers;

      _sections.forEach(([element, parentNum]) => {
        const { textWrapper, sectionWrapper } = this.setupInnerElements(
          tocSectionHolder,
          $(element)
        );

        gsap.set(textWrapper, { marginLeft: `${parentNum * 1}em` });

        sectionWrappers.push(sectionWrapper[0]);

        addClickHandler(sectionWrapper, $(element));

        gsap.to(sectionWrapper, {
          scrollTrigger: {
            trigger: element,
            start: 'top 50%',
            end: 'bottom 51%',
            scrub: true,
          },
          className: `${References.tocClasses.individualSectionWrapper} ${References.tocClasses.activeClass}`,
          onStart: () => {
            $(sectionWrappers)
              .filter((i, e) => {
                return parentNum <= _sections[i][1] && e !== sectionWrapper[0];
              })
              .each((_, e) => {
                gsap.set($(e), { className: References.tocClasses.individualSectionWrapper });
              });
          },
        });
      });
    });
  };
}

/**
 * This class is specific to the sidebar button
 */
class TOCButton {
  private _tocButton: JQuery<HTMLElement>;

  private _tocSvg: JQuery<HTMLElement>;

  private _sectionTocRef: JQuery<HTMLElement>;

  private _sectionHolderRef: JQuery<HTMLElement>;

  private _toggled: boolean;

  constructor(sectionToc: JQuery<HTMLElement>, sectionHolder: JQuery<HTMLElement>) {
    this._tocButton = $(References.tocClasses.tocToggleButton);
    this._tocSvg = $(References.tocClasses.tocButtonSvg);
    this._sectionTocRef = sectionToc;
    this._sectionHolderRef = sectionHolder;
    this._toggled = false;
    this.onClick();
  }

  public onClick = () => {
    this._tocButton.on('click', () => {
      this.toggleSidebar();
    });
  };

  public setSectionHolder = (sectionHolder: JQuery<HTMLElement>) => {
    this._sectionHolderRef = sectionHolder;
  };

  public hideSidebar = () => {
    gsap.set(this._sectionTocRef, { height: 0, padding: 0 });
    gsap.set(this._sectionHolderRef, { display: 'none', overflow: 'hidden' });
    gsap.set(this._tocButton, { backgroundColor: 'rgba(0, 0, 0, 0.57)' });
    gsap.set(this._tocSvg, { rotation: 180 });
    gsap.set(this._sectionHolderRef, { height: 0 });
  };

  private toggleSidebar = () => {
    const height = this._toggled ? 0 : 'auto';
    const padding = this._toggled ? 0 : '1em';
    const display: string = this._toggled ? 'none' : 'unset';
    const backgroundColor: string = this._toggled ? 'rgba(0, 0, 0, 0.57)' : 'rgba(0, 0, 0, 0.87)';
    const rotation: number = this._toggled ? 180 : 0;

    gsap.to(this._sectionTocRef, { height });
    gsap.to(this._tocButton, { backgroundColor });
    gsap.to(this._tocSvg, { rotation });
    const tl = gsap.timeline();
    tl.to(this._sectionHolderRef, { display });
    tl.to(this._sectionHolderRef, { height });
    tl.to(this._sectionTocRef, { padding }, this._toggled ? '0' : '>-0.4');

    this._toggled = !this._toggled;
  };
}
