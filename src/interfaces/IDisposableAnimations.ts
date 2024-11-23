export interface IDisposableAnimations {
  disposableTargets: Map<string, JQuery<HTMLElement>>;
  disposePageAnimations: () => void;
}
