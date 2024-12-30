//import { WebViewer } from '@pdftron/pdfjs-express-viewer';
//import { DOMAIN } from 'src';
import {
  type GsapAnimations,
  GsapComponentAnimations,
  type IGsapComponentAnimations,
} from 'src/interfaces/IGsapPageAnimations';
import { PageElements } from 'src/interfaces/IPageAnimations';
// import { APIQuery } from 'src/utils/query';

// This is a public key that is fine to share, as it allows for readonly query of database data, which is intended for public exposure.
// The key DOES NOT allow for CMS (database) modification
const KEYS: Record<string, string> = {
  'copticorthodoxsydney.com.au': 'AWsmB632822RyEvq9OKq',
  'hg-bishop-daniels-website.design.webflow.com': 'XiGCv5VsMuQEarsKwgw7',
};

interface PdfFieldData {
  pdf: { url: string };
}

export class PDFViewer implements IGsapComponentAnimations {
  gsapComponentAnimations: GsapComponentAnimations;

  animateComponent = () => {
    // @ts-ignore
    //WebViewer(
    //  {
    //    initialDoc: this._src,
    //    path: 'https://hg.pmsoftware.org/share',
    //    licenseKey: KEYS[DOMAIN],
    //  },
    //  this.pageElements.el.pdf[0]
    //);
  };

  private _src: string;

  constructor(gsapAnimations: GsapAnimations) {
    this.gsapComponentAnimations = new GsapComponentAnimations(gsapAnimations);
    this.initElements();
  }

  EL = ['.pdf'] as const;

  pageElements: PageElements<typeof this.EL>;

  initElements = async () => {
    this.pageElements = new PageElements(this.EL);

    this._src = this.pageElements.el.pdf.attr('data-cms-url');

    //const query: PdfFieldData = await APIQuery.getQuery('GET', src, 'sermons-content');

    //console.log('qyert', query);
  };
}
