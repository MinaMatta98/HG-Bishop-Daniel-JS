import PDFObject from 'pdfobject';
import * as Rx from 'rxjs';
import type { IDisposableAnimations } from 'src/interfaces/IDisposableAnimations';
import {
  type GsapAnimations,
  GsapComponentAnimations,
  type IGsapComponentAnimations,
} from 'src/interfaces/IGsapPageAnimations';
import type { IMouseEventAnimations } from 'src/interfaces/IMouseEventAnimations';
import { GlobalPageAnimations, PageElements } from 'src/interfaces/IPageAnimations';

// This is a public key that is fine to share, as it allows for readonly query of database data, which is intended for public exposure.
// The key DOES NOT allow for CMS (database) modification
//const KEYS: Record<string, string> = {
//  'copticorthodoxsydney.com.au': 'AWsmB632822RyEvq9OKq',
//  'hg-bishop-daniels-website.design.webflow.com': 'XiGCv5VsMuQEarsKwgw7',
//};

export class PDFViewer
  implements IGsapComponentAnimations, IMouseEventAnimations, IDisposableAnimations
{
  gsapComponentAnimations: GsapComponentAnimations;

  mouseObserverSubscriptions: Rx.Subscription[] = [];

  private _pdfElement: HTMLElement;

  supportAnimations = GlobalPageAnimations;

  disposePageAnimations = () => {
    this.onMouseEnterHandler.dispose(this);
    this.onMouseLeaveHandler.dispose(this);
  };

  animateComponent = () => {
    if (PDFObject.supportsPDFs) {
      this._pdfElement = PDFObject.embed(this._src, this.pageElements.el.pdf, {
        pdfOpenParams: {
          title: this._name,
        },
        forcePDFJS: true,
        height: this.pageElements.el.pdf.height().toString(),
        //width: this.pageElements.el.pdf.width().toString(),
      });
    } else {
      this._pdfElement = $('<iframe>')
        .attr('src', `http://docs.google.com/gview?url=${this._src}`)
        .appendTo(this.pageElements.el.pdf)[0];
    }

    this.onMouseEnterHandler.handler(this);

    this.onMouseLeaveHandler.handler(this);
  };

  onMouseEnterHandler = {
    handler: (self: PDFViewer) => {
      const rx = Rx.fromEvent(self._pdfElement, 'mouseenter').pipe(Rx.debounceTime(100));
      rx.subscribe(() => self.supportAnimations.cursorAnimations.hideCursor());
      this.mouseObserverSubscriptions.push(rx.subscribe());
    },
    dispose: (self: PDFViewer) => {
      self.mouseObserverSubscriptions.forEach((sub) => sub.unsubscribe());
    },
  };

  onMouseLeaveHandler = {
    handler: (self: PDFViewer) => {
      const rx = Rx.fromEvent(self._pdfElement, 'mouseleave').pipe(Rx.debounceTime(100));
      rx.subscribe(() => self.supportAnimations.cursorAnimations.showCursor());
      this.mouseObserverSubscriptions.push(rx.subscribe());
    },
    dispose: (self: PDFViewer) => {
      self.mouseObserverSubscriptions.forEach((sub) => sub.unsubscribe());
    },
  };

  private _src: string;

  private _name: string;

  constructor(gsapAnimations: GsapAnimations) {
    this.gsapComponentAnimations = new GsapComponentAnimations(gsapAnimations);
    this.initElements();
  }

  EL = ['.pdf'] as const;

  pageElements: PageElements<typeof this.EL>;

  initElements = async () => {
    this.pageElements = new PageElements(this.EL);

    this._src = this.pageElements.el.pdf.attr('data-cms-url');

    this._name = this.pageElements.el.pdf.attr('title');
  };
}
