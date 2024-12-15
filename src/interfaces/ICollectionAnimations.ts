import $ from 'jquery';

import type { IMouseEventAnimations } from './IMouseEventAnimations';
import { type PageElements } from './IPageAnimations';

/**
 * This simply defines the animations for the collection.
 * @param T - The collection of elements to animate should be tied into the complete PageElements
 * @PageElements class, which extends IPageElements
 */
export interface ICollectionAnimations<T extends readonly string[]> {
  pageElements: PageElements<readonly ['.item', '.filler', '.item-grid', ...T]>;
  animateFillers: () => Promise<void>;
}

export class GenericCollectionAnimations<T extends readonly string[]>
  implements ICollectionAnimations<T>
{
  pageElements: PageElements<readonly ['.item', '.filler', '.item-grid', ...T]>;

  animateFillers = async () => {
    $(() => {
      const itemGrid: JQuery<HTMLElement> = this.pageElements.el['itemGrid'];
      //
      //const filler = $('<div></div>', {
      //  class: 'filler',
      //  css: {
      //    alignSelf: 'start',
      //    justifySelf: 'start',
      //    height: '100%',
      //  },
      //});
      //
      //const fillerClone = filler.clone();
      //
      //fillerClone.addClass('disposable');

      const children = itemGrid.children();

      //if (children.length > 1) filler.insertBefore(children[1]);
      //
      //if (children.length > 3) fillerClone.insertBefore(children[2]);

      children.each((_, element) => {
        $(element).css({
          gridRow: 'span 2',
          height: $(element).height() * 2,
        });
      });
    });
  };

  //onMouseClickHandler = {
  //  handler: () => {},
  //  dispose: () => {},
  //};
}

export function instanceofICollectionAnimations(obj: any): obj is ICollectionAnimations<any> {
  return typeof obj.animateFillers === 'function';
  //&&
  //typeof obj.pageElements === 'object' &&
  //'item' in obj.pageElements.el &&
  //'filler' in obj.pageElements.el
}
