import gsap from 'gsap/all';

export class TransitionAnimations {
  public static displayShow(
    identifier: gsap.TweenTarget,
    view: true,
    display: gsap.TweenValue
  ): void;

  public static displayShow(identifier: gsap.TweenTarget, view: false): void;

  public static displayShow(
    identifier: gsap.TweenTarget,
    view: boolean,
    display?: gsap.TweenValue
  ) {
    gsap.set(identifier, { display: view ? display! : 'none' });
  }

  public static handleTransitionAnimation = async (inView: boolean): Promise<void> => {
    const loadTl = gsap.timeline();

    const transitionDivs = [
      '.first-transition',
      '.second-transition',
      '.third-transition',
      '.fourth-transition',
      '.fifth-transition',
    ];

    if (inView) {
      this.displayShow('.transition', true, 'flex');
      for (const div of transitionDivs) {
        gsap.set(div, { marginTop: '100vh' });
      }
    }

    for (const div of transitionDivs) {
      await loadTl.to(div, { marginTop: inView ? '0vh' : '100vh', duration: 0.25 });
    }

    if (!inView) this.displayShow('.transition', false);
  };
}
