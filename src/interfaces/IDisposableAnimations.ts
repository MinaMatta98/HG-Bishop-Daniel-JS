export interface IDisposableAnimations {
  disposePageAnimations: () => void;
}
export function instanceofIDisposableAnimations(obj: any): obj is IDisposableAnimations {
  return obj && typeof obj.disposePageAnimations === 'function';
}
