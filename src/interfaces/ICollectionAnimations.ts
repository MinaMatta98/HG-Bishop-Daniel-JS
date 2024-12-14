import { type PageElements } from './IPageAnimations';

/**
 * This simply defines the animations for the collection.
 * @param T - The collection of elements to animate should be tied into the complete PageElements
 * @PageElements class, which extends IPageElements
 */
export interface ICollectionAnimations<T extends readonly string[]> {
  pageElements: PageElements<readonly ['.item', '.filler', ...T]>;
  animateFillers: () => void;
}

export class GenericCollectionAnimations<T extends readonly string[]>
  implements ICollectionAnimations<T>
{
  pageElements: PageElements<readonly ['.item', '.filler', ...T]>;

  animateFillers = () => {
    const fillers = this.pageElements.el['filler'] as JQuery<HTMLElement>;

    fillers.each((i, filler) => {
      const el = $(filler);
      if (i !== 0 && i !== 2) el.css({ display: 'none' });
    });
  };
}

export function instanceofICollectionAnimations(obj: any): obj is ICollectionAnimations<any> {
  return (
    typeof obj.animateFillers === 'object' &&
    typeof obj.pageElements === 'object' &&
    'item' in obj.pageElements.el &&
    'filler' in obj.pageElements.el
  );
}
