import type { ITransitionData } from '@barba/core/dist/core/src/src/defs';
import { restartWebflow } from '@finsweet/ts-utils';
import { Flip, gsap, ScrollTrigger } from 'gsap/all';
import $ from 'jquery';

import { Animations } from '../animations/animations';
import { DOMAIN } from '../index';
import { Stats } from './sentry';

export class Utils {
  private static scriptUrls: URL[] = [
    new URL('https://cdnjs.cloudflare.com/ajax/libs/three.js/r125/three.min.js'),
    new URL('https://cdn.jsdelivr.net/npm/@finsweet/3dglobes@1/OrbitControls.min.js'),
    new URL('https://cdn.jsdelivr.net/npm/@finsweet/3dglobes@1/FsGlobe.min.js'),
  ];

  public static initStats = () => {
    Stats.init();
  };

  public static domReady = (fn: Function) => {
    $(document).on('readystatechange', () => {
      if (document.readyState == 'complete') {
        fn();
      }
    });
  };

  public static globeScriptHandler = async (scripts?: URL[]): Promise<void> => {
    const targetScripts = scripts || this.scriptUrls;

    // This will allow for the concurrent execution of the fetch
    await Promise.all(
      targetScripts.map((scriptUrl) => {
        return this.loadScript(scriptUrl);
      })
    )
      .then((scripts) => {
        scripts.forEach((script) => {
          const scriptElement = document.createElement('script');
          scriptElement.textContent = script;
          document.body.append(scriptElement);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /** Function to load a script and return a promise */
  public static loadScript = async (url: URL): Promise<string> => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    return response.text();
  };

  public static manualLoadRedirector = (isFirstLoad: boolean): void => {
    // Timeout interval ensures no hanging on chrome browser engine
    if (isFirstLoad && window.location.href !== DOMAIN) {
      setTimeout(() => {
        console.warn('Redirecting due to illegal access');
        window.location.replace(DOMAIN);
      }, 10);
    }
  };

  public static sleep = async (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  public static InitWebsite = async (initTime: number, isFirstLoad: boolean): Promise<void> => {
    document.onreadystatechange = async () => {
      if (document.readyState === 'complete') {
        Animations.displayShow('.cursor', true, 'flex');
        Animations.showProgress();
        this.scrollFlipInit();
        Animations.initNavLinks();
        await Animations.initHomePage(initTime, isFirstLoad);
        Animations.cursorHover();
        Animations.animateToc();
      }
    };
  };

  private static scrollFlipInit = () => {
    gsap.registerPlugin(ScrollTrigger, Flip);
    ScrollTrigger.normalizeScroll(true);
  };

  public static scriptReloader = async (data: ITransitionData): Promise<void> => {
    const js = data.next.container.querySelectorAll('script');
    js ? js.forEach((item) => eval(item.innerHTML)) : null;
    await restartWebflow();
    window.dispatchEvent(new Event('resize'));
  };

  public static linkHandler = (): void => {
    const links = document.querySelectorAll('a[href]');
    const cbk = (e: Event) => {
      const target = e.currentTarget as HTMLAnchorElement;
      if (target.href === window.location.href) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    links.forEach((link) => link.addEventListener('click', cbk));
  };
}
