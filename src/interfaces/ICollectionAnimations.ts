import $ from 'jquery';

import { type PageElements } from './IPageAnimations';

/**
 * This simply defines the animations for the collection.
 * @param T - The collection of elements to animate should be tied into the complete PageElements
 * @PageElements class, which extends IPageElements
 */
export interface ICollectionAnimations {
  pageElements: PageElements<readonly ['.item', '.filler', '.item-grid', ...string[]]>;
  animateFillers: () => Promise<void>;
}

export class GenericCollectionAnimations implements ICollectionAnimations {
  pageElements: PageElements<readonly ['.item', '.filler', '.item-grid', ...string[]]>;

  animateFillers = async () => {
    $(() => {
      const itemGrid: JQuery<HTMLElement> = this.pageElements.el['itemGrid'];

      const children = itemGrid.children();

      children.each((_, element) => {
        $(element).css({
          gridRow: 'span 2',
          height: $(element).height() * 2,
        });
      });
    });
  };
}

export function instanceofICollectionAnimations(obj: any): obj is ICollectionAnimations {
  return typeof obj.animateFillers === 'function';
}
