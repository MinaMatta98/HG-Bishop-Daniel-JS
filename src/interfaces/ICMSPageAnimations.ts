import $ from 'jquery';

import type { IElementsAnimations } from './IElementsAnimations';
import type { ElementObjectProperties, IPageAnimations } from './IPageAnimations';

export interface ICMSPageAnimations extends IPageAnimations, IElementsAnimations {
  genericCMSAnimations: GenericCMSPageAnimations;
  replaceCMSAnimations?: <K extends keyof ElementObjectProperties<typeof this.EL>>(
    keys: keyof K[]
  ) => void[];
}

export class GenericCMSPageAnimations {
  replaceLinks = () => {
    $('[link]').each((_, element) => {
      const el = $(element);
      const text = el.attr('link'); // Use `let` since we'll update this

      const parts = text.split(/{{|}}/).map((part) => part.trim());

      // Initialize a new variable to hold the updated text
      let updatedText = '';

      // Iterate through the split parts and rebuild the text
      parts.forEach((part, index) => {
        // Every odd index will be the variable name
        if (index % 2 === 1) {
          const replacement = el.attr(part) || ''; // Get the attribute value or empty string if not found
          updatedText += replacement;
        } else {
          // Every even index will be regular text
          updatedText += part;
        }
      });

      // Set the updated href attribute
      el.attr('href', updatedText);
    });
  };

  replaceSpans = () => {
    $(() => {
      $('span[val]').each((_, element) => {
        const el = $(element);
        el.text(`${el.attr('val')} `); // Update the element's text
      });
    });
  };

  removeCss = () => {
    $('[css-remove]').each((i, element) => {
      if (i !== 0) {
        const el = $(element);
        el.removeAttr(el.attr('css-remove'));
      }
    });
  };
}
export function instanceofICMSPageAnimations(obj: any): obj is ICMSPageAnimations {
  return typeof obj.genericCMSAnimations === 'object';
}
