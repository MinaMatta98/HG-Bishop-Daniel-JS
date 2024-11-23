interface IResizePageAnimations {
  resizeableTargets: Map<string, JQuery<HTMLElement>>;
  onResizeHandler: (resizeElement: JQuery<HTMLElement>) => void;
}
