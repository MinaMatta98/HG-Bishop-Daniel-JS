export interface ICssAnimations {
  loadCss: () => void;
  unloadCss: () => void;
}

export function instanceofICssAnimations(obj: any): obj is ICssAnimations {
  return obj && typeof obj.loadCss === 'function' && typeof obj.unloadCss === 'function';
}
