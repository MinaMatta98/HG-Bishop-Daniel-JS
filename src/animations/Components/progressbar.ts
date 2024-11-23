import { gsap } from 'gsap/all';

export class ProgressBarAnimations {
  public static showProgress = () => {
    gsap.set('.progress', { display: 'block' });
    gsap.set('.progress', { opacity: '1' });
  };
}
