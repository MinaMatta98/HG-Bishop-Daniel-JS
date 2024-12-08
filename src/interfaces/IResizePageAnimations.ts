type HandlerWithDispose<T extends (...args: any[]) => void> = {
  handler: T;
  dispose: (args?: any) => void;
};

export interface IResizePageAnimations {
  onResizeHandler: HandlerWithDispose<(...args: any[]) => void>;
}

export function instanceofIResizePageAnimations(obj: any): obj is IResizePageAnimations {
  return obj && typeof obj.onResizeHandler === 'function';
}
