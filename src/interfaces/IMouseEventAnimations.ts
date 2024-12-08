type HandlerWithDispose<T extends (...args: any[]) => void> = {
  handler: T;
  dispose: (args?: any) => void;
};

export interface IMouseEventAnimations {
  onMouseEnterHandler?: HandlerWithDispose<(...args: any) => void>;
  onMouseLeaveHandler?: HandlerWithDispose<(...args: any) => void>;
  onMouseClickHandler?: HandlerWithDispose<(...args: any) => void>;
  onMouseMoveHandler?: HandlerWithDispose<(...args: any) => void>;
  onScrollEventHandler?: HandlerWithDispose<(...args: any) => void>;
}

export function instanceofIMouseEventAnimations(obj: any): obj is IMouseEventAnimations {
  if (!obj || typeof obj !== 'object') return false;

  const hasHandler = (key: keyof IMouseEventAnimations) => typeof obj[key] === 'object';

  return (
    hasHandler('onMouseLeaveHandler') ||
    hasHandler('onMouseEnterHandler') ||
    hasHandler('onMouseClickHandler') ||
    hasHandler('onMouseMoveHandler') ||
    hasHandler('onScrollEventHandler')
  );
}
