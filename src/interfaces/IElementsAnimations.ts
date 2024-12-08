import type { PageElements } from './IPageAnimations';

export interface IElementsAnimations {
  pageElements: PageElements<readonly string[]>;

  initializeBaseState?: () => void;

  initElements: () => void;
}
