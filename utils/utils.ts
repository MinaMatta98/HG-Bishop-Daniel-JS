import { restartWebflow } from "@finsweet/ts-utils";
import { Animations } from "src/animations/animations";
import { gsap, ScrollTrigger, Flip } from "gsap/all";
import Swiper from 'swiper';
import type { ITransitionData } from "@barba/core/dist/core/src/src/defs";
import { DOMAIN } from "src";
import { References } from "src/animations/references";
import { Stats } from "./sentry";
import $ from 'jquery';

// import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'src/animations.css';

export class Utils {
    private static scriptUrls: URL[] = [
        new URL("https://cdnjs.cloudflare.com/ajax/libs/three.js/r125/three.min.js"),
        new URL("https://cdn.jsdelivr.net/npm/@finsweet/3dglobes@1/OrbitControls.min.js"),
        new URL("https://cdn.jsdelivr.net/npm/@finsweet/3dglobes@1/FsGlobe.min.js"),
    ];

    public static initStats = () => {
        Stats.init();
    }

    public static domReady = (fn: Function) => {
        $(document).on('readystatechange', () => {
            if (document.readyState == 'complete') {
                fn();
            }
        })
    }

    public static globeScriptHandler = async (scripts?: URL[]): Promise<void> => {
        const targetScripts = scripts || this.scriptUrls;

        // This will allow for the concurrent execution of the fetch
        await Promise.all(targetScripts.map((scriptUrl) => {
            return this.loadScript(scriptUrl)
        })).then((scripts) => {
            scripts.forEach((script) => {
                const scriptElement = document.createElement('script');
                scriptElement.textContent = script;
                document.body.append(scriptElement);
            });
        }).catch((error) => { console.log(error) });
    }

    /** Function to load a script and return a promise */
    public static loadScript = async (url: URL): Promise<string> => {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        return response.text();
    }

    public static manualLoadRedirector = (isFirstLoad: boolean): void => {
        // Timeout interval ensures no hanging on chrome browser engine
        if (isFirstLoad && window.location.href !== DOMAIN) {
            setTimeout(() => {
                console.warn('Redirecting due to illegal access');
                window.location.replace(DOMAIN);
            }, 10);
        }
    }

    private static sleep = async (ms: number): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private static swiperAnimation = async (initTime: number): Promise<void> => {
        const currentTime = new Date().getTime();

        await ((currentTime - initTime) < 2000 ? this.sleep(2000 - (currentTime - initTime)) : Promise.resolve());

        Animations.displayShow(References.transitionClasses.pageLoadClass, false);

        console.log('running pageLoaderHide');

        await Animations.pageLoaderHide();

        const photoSwiper = new Swiper(References.swiperClasses.swiperPhotoClass, {
            effect: "cards",
            grabCursor: true,
            loop: true,
            keyboard: true,
            navigation: {
                nextEl: References.swiperClasses.swiperNextElClass,
                prevEl: References.swiperClasses.swiperPrevElClass
            }
        });

        const contentSwiper = new Swiper(References.swiperClasses.swiperContentClass, {
            speed: 0,
            loop: true,
            followFinger: true,
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            }
        });

        photoSwiper.controller.control = contentSwiper;
        contentSwiper.controller.control = photoSwiper;
    }

    public static InitPage = async (initTime: number): Promise<void> => {

        document.onreadystatechange = async () => {
            if (document.readyState === 'complete') {
                Animations.displayShow('.cursor', true, 'flex');
                this.scrollFlipInit();
                Animations.gsapSliderInit();
                Animations.logoAnimation();
                Animations.initNavLinks();
                Animations.animateScrollButton()
                await this.swiperAnimation(initTime);
            }
        };
    }

    private static scrollFlipInit = () => {
        gsap.registerPlugin(ScrollTrigger, Flip);
        ScrollTrigger.normalizeScroll(true);
    }

    public static swiperHandler = async (initTime: number): Promise<void> => {
        await this.swiperAnimation(initTime);
    }

    public static scriptReloader = async (data: ITransitionData): Promise<void> => {
        const js = data.next.container.querySelectorAll('script');
        js ? js.forEach((item) => eval(item.innerHTML)) : null;
        await restartWebflow();
        window.dispatchEvent(new Event("resize"))
    }

    public static linkHandler = (): void => {
        var links = document.querySelectorAll('a[href]');
        var cbk = (e: Event) => {
            const target = e.currentTarget as HTMLAnchorElement;
            if (target.href === window.location.href) {
                e.preventDefault();
                e.stopPropagation();
            }
        };
        links.forEach((link) => link.addEventListener('click', cbk));
    }

}
