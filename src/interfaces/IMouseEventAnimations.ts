export interface IMouseEventAnimations {
  mouseEventTargets: Map<string, JQuery<HTMLElement>>;
  onMouseEnterHandler?: () => void;
  onMouseLeaveHandler?: () => void;
  onMouseClickHandler?: () => void;
}
