import type { PageElements } from './IPageAnimations';

export interface IElementsAnimations {
  EL: readonly string[];

  pageElements: PageElements<typeof this.EL>;

  initializeBaseState?: () => void;

  initElements: () => void;
}
