import SplitType from "split-type";
import { References } from "./references";
import { gsap, ScrollTrigger, Power2 } from "gsap/all";
import $ from 'jquery';

export class CarouselAnimations {
    private slider: JQuery<HTMLElement>;
    private buttons: JQuery<HTMLElement>;
    private images: JQuery<HTMLElement>;
    private childElements: JQuery<HTMLElement>;
    private activeIndex: number;
    private globalTimeline: GSAPTimeline;

    /**
     *
     */
    constructor() {
        $(() => {
            this.slider = $(References.homePageClasses.gsapSliderContainer);
            this.buttons = this.slider.find(References.homePageClasses.gsapButtons);
            this.images = this.slider.find(References.homePageClasses.gsapSliderImg);
            this.childElements = this.slider.find(References.homePageClasses.gsapDescriptor);
            this.activeIndex = 0;
            this.globalTimeline = gsap.timeline({ repeat: - 1 });
        })
    }

    private blendOutHeadings = (element: HTMLElement, duration?: number) => {
        const textHeading: HTMLElement = element.querySelector(References.homePageClasses.gsapHeadingDescriptor)
        const textSlogan: HTMLElement = element.querySelector(References.homePageClasses.gsapSloganDescriptor)
        const splitTextHeading = new SplitType(textHeading);
        const splitTextSlogan = new SplitType(textSlogan);
        [splitTextHeading.words, splitTextSlogan.words].forEach((text) => gsap.to(text, { opacity: 0, translateY: 50, duration: duration || 0 }));
        return { splitTextHeading, splitTextSlogan };
    }

    private handleHeadings = (element: HTMLElement) => {
        const { splitTextHeading, splitTextSlogan } = this.blendOutHeadings(element);
        const loadTl = gsap.timeline();
        loadTl.to(splitTextHeading.words, { opacity: 1, translateY: 0, stagger: 0.25 })
        loadTl.to(splitTextSlogan.words, { opacity: 1, translateY: 0, stagger: 0.25 })
    }

    // Start by ensuring that only 1 image is in place
    public initCarousel = async () => {
        $(async () => {
            const thisElement = this;
            gsap.set(this.images[0], { display: "flex" })
            await this.moveSlide(0);
            let started = false;


            this.childElements.each((index, element) => {
                if (index !== (this.childElements.length - 1)) {
                    const progressBar = element.querySelector(References.homePageClasses.gsapProgressContainer);
                    this.globalTimeline.addLabel(`seek-${index}`);
                    this.globalTimeline.fromTo(progressBar, { height: "0%" }, {
                        height: "100%", duration: 10, onStart: () => {
                            if (started) {
                                this.moveSlide(index)
                            }
                            started = true
                        }
                    })
                }
            })

            this.images.each((index, element) => {
                if (index == 0) {
                    ScrollTrigger.create({
                        trigger: this.slider,
                        start: 'top 40%',
                        end: 'bottom 45%',
                        // markers: true,
                        async onEnter() { thisElement.handleHeadings(element); },
                        onEnterBack() { thisElement.handleHeadings(element); },
                        onLeaveBack() { thisElement.blendOutHeadings(element, 0.5); }
                    })
                }
            })

            this.blendOutHeadings(this.images[this.activeIndex]);
            this.handleSlide(this.activeIndex, true, true);

        })
    }

    private handleSlide = async (index: number, activateText: boolean, activate: boolean) => {
        const progress = $(this.childElements[index]).find(References.homePageClasses.gsapProgressContainer);
        const text = $(this.childElements[index]).find(References.homePageClasses.gsapSliderDescriptor);

        const ease = Power2.easeInOut;
        const padding = activate ? 20 : 0;
        const borderRadius = activate ? 10 : 0;
        const background = activate ? 'var(--cursor-inner)' : null;
        const boxShadow = activate ? 'rgba(0,0,0,0.24) 0px 3px 8px' : 'unset';
        const opacity = activate ? 1 : 0;
        const textOpacity = activate ? 1 : 0.5;
        const progressColor = activate ? 'white' : null;
        const display = activate ? 'flex' : 'none';
        const textColor = activate ? 'white' : 'black';
        // const textOpacity = activate ? 1 : 0.5;
        // const position = activate ? 'relative' : 'static';

        gsap.to($(this.childElements[index]), { padding, borderRadius, background, boxShadow, ease, opacity: textOpacity });
        gsap.set($(this.images[index]), { ease, display });
        if (activate) gsap.fromTo(this.images[index], { translateY: "300%" }, {
            translateY: "0", duration: 1, onComplete: () => {
                this.images[index].style.transform = "unset";
            }
        });
        gsap.to($(progress), { backgroundColor: progressColor, opacity, duration: 1, ease });
        $(text.children().children()).each((_, child) => { gsap.to($(child), { opacity: textOpacity, duration: 1, color: textColor }) });
    }

    private moveSlide = async (nextIndex: number) => {

        // 1 for index, 1 for button
        if (nextIndex > (this.childElements.length - 2)) nextIndex = 0;

        if (nextIndex < 0) nextIndex = this.childElements.length - 2;

        this.handleSlide(this.activeIndex, true, false);

        const nextText = $(this.childElements[nextIndex]).find(References.homePageClasses.gsapSliderDescriptor);


        this.handleSlide(nextIndex, true, true);

        this.blendOutHeadings(this.images[nextIndex]);
        this.activeIndex = nextIndex;
        await gsap.to(nextText, { opacity: 1, duration: 2, ease: Power2.easeInOut })
        this.handleHeadings(this.images[nextIndex]);
    }

    public initializeButtons = () => {
        /**
         * Previous and Next button fn => () 
         */
        $(() => {
            this.buttons.each((index, button) => {
                index === 0 ? $(button).on('click', () => this.globalTimeline.seek(`seek-${this.activeIndex - 1}`))
                    : $(button).on('click', () => this.globalTimeline.seek(`seek-${this.activeIndex + 1}`));
            })
        })
    }

    public initializeWrappers = () => {
        $(() => {
            this.childElements.each((index, element) => {
                if (index !== (this.childElements.length - 1)) {
                    $(element).on('click', () => this.globalTimeline.seek(`seek-${index}`))
                }
            })
        })
    }
}
