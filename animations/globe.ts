import Globe, { type GlobeInstance } from 'globe.gl';
import countries from '../public/custom.geo.json';
import { MeshPhysicalMaterial } from 'three';
import * as THREE from 'three';
import $ from 'jquery';
import { References } from './references';
import { CursorAnimations } from './cursor-animations';
import gsap from 'gsap';

export class GlobeAnimation {
    private _RATIO = 0.95;
    private _ARC_REL_LEN = 0.4;
    private _FLIGHT_TIME = 1000;
    private _NUM_RINGS = 3;
    private _RINGS_MAX_R = 5;
    private _RING_PROPAGATION_SPEED = 5;
    private _canvas: JQuery<HTMLElement>;
    private _currentPolygon: object;
    private prevCoords = { lat: 0, lng: 0 };
    private _GLOBE: GlobeInstance;
    private _size: { innerHeight: number, innerWidth: number };
    /**
     *
     */
    constructor() {
        $(() => {
            this._canvas = $(References.homePageClasses.globeDiv);
            this._GLOBE = Globe()
                .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
                .globeMaterial(new MeshPhysicalMaterial({ color: 0xebeef5, reflectivity: 1, roughness: 0, iridescence: 2, clearcoat: 0.1, emissive: 0xebeef5, emissiveIntensity: 0.5 }))
                .width(this._canvas.width() * this._RATIO)
                .height(this._canvas.height() * this._RATIO)
                .backgroundColor('#ffffff00').pointsMerge(true);
            ;
            this._size = {
                innerHeight: this._canvas.width(),
                innerWidth: this._canvas.height()
            }
        })
    }

    private emitArc = ({ lat: endLat, lng: endLng }: { lat: number, lng: number, glb: GlobeInstance }) => {
        const { lat: startLat, lng: startLng } = this.prevCoords;
        setTimeout(() => { this.prevCoords = { lat: endLat, lng: endLng } }, this._FLIGHT_TIME);

        // add and remove arc after 1 cycle
        const arc = { startLat, startLng, endLat, endLng };
        this._GLOBE.arcsData([...this._GLOBE.arcsData(), arc]);
        setTimeout(() => this._GLOBE.arcsData(this._GLOBE.arcsData().filter(d => d !== arc)), this._FLIGHT_TIME * 2);

        // add and remove start rings
        const srcRing = { lat: startLat, lng: startLng };
        this._GLOBE.ringsData([...this._GLOBE.ringsData(), srcRing]);
        setTimeout(() => this._GLOBE.ringsData(this._GLOBE.ringsData().filter(r => r !== srcRing)), this._FLIGHT_TIME * this._ARC_REL_LEN);

        // add and remove target rings
        setTimeout(() => {
            const targetRing = { lat: endLat, lng: endLng };
            this._GLOBE.ringsData([...this._GLOBE.ringsData(), targetRing]);
            setTimeout(() => this._GLOBE.ringsData(this._GLOBE.ringsData().filter(r => r !== targetRing)), this._FLIGHT_TIME * this._ARC_REL_LEN);
        }, this._FLIGHT_TIME);
    }

    private addArcsData = () => {
        const N = 40;
        type ArcsData = {
            startLat: number,
            startLng: number,
            endLat: number,
            endLng: number,
            color: string,
            gap: number,
        }
        const arcsData = [...Array(N).keys()].map(() => ({
            startLat: (Math.random() - 0.5) * 180,
            startLng: (Math.random() - 0.5) * 360,
            endLat: (Math.random() - 0.5) * 180,
            endLng: (Math.random() - 0.5) * 360,
            color: ['white', 'blue'][Math.round(Math.random())],
            gap: Math.random() * 5
        }));

        this._GLOBE = this._GLOBE
            .arcsData(arcsData)
            .arcColor((d: ArcsData | null) => d.color || 'purple')
            .arcDashLength(this._ARC_REL_LEN)
            .arcDashGap(2)
            .arcDashInitialGap(() => Math.random() * 5)
            .arcDashAnimateTime(this._FLIGHT_TIME)
            .arcsTransitionDuration(0)
            .ringColor(() => `purple`)
            .ringMaxRadius(this._RINGS_MAX_R)
            .ringPropagationSpeed(this._RING_PROPAGATION_SPEED)
            .ringRepeatPeriod(this._FLIGHT_TIME * this._ARC_REL_LEN / this._NUM_RINGS)
            .onGlobeClick(({ lat, lng }) => { this.emitArc({ lat, lng, glb: this._GLOBE }) });
    }

    private initControls = () => {
        this._GLOBE.controls().autoRotateSpeed = 0.3;
        this._GLOBE.controls().autoRotate = true;
        this._GLOBE.controls().enableZoom = false;
    }

    private initCamera = () => {
        $(() => {
            const renderer = this._GLOBE.renderer();
            renderer.setPixelRatio(1.1);
            // const camera = this._GLOBE.camera();
            // camera.position.setZ(camera.position.z);
            // const pov = this._GLOBE.camera();
            // this._GLOBE.pointOfView({ lat: pov.position.x, lng: pov.position.y, altitude: pov.position.z });

        })
    }

    private addAtmosphere = () => {
        this._GLOBE = this._GLOBE
            .atmosphereColor('white')
            .atmosphereAltitude(0.4)
    }

    private addHexPolygonData = () => {
        this._GLOBE = this._GLOBE.hexPolygonsData(countries.features)
            .hexPolygonResolution(3)
            .hexPolygonMargin(0.6)
            .hexPolygonColor(() => '#3920F0')
            .hexPolygonAltitude(() => [0.1, 0.05][Math.round(Math.random())])
    }

    private addPolygonData = () => {
        this._GLOBE = this._GLOBE
            .polygonsData(countries.features)
            .polygonCapColor(() => '#206ff030')
            .polygonSideColor(() => '#206ff0')
            .polygonStrokeColor(() => 'white')
            .polygonLabel((d: { properties: { name: string } }) => `
					<h1 style="
						-webkit-text-stroke-color: blue;
						-webkit-text-stroke-width: 1px;
						color: white;
						font-family: 'Lato';
						text-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;">
					${d.properties.name}</h1>
			`)
            .onPolygonHover((hoverD: object | null) => {
                this._currentPolygon = hoverD;
                this._GLOBE
                    .polygonAltitude(d => d === hoverD ? 0.12 : 0.01)
                    .polygonCapColor((d) => (d === hoverD) ? '#206ff0' : '#206ff030');

                console.log(hoverD)
                hoverD ? CursorAnimations.cursorWhite() : CursorAnimations.cursorBlue();
            })
            .polygonsTransitionDuration(300)
        this.polygonHeightSetter();
    }

    private polygonHeightSetter = () => {
        setTimeout(() => {
            this._GLOBE.polygonAltitude((poly) => (poly !== this._currentPolygon) ? (Math.random() * 0.05) : 0.12)
            this.polygonHeightSetter();
        }, 2000);
    }

    public animateGlobeBlock = () => {
        $(() => {
            const globeG = $('.globe-svg').find('g');
            gsap.set(globeG.children(), { fill: 'white', opacity: 0 });
            const tl = gsap.timeline({ repeat: -1 }); // Create a timeline with infinite repetition
            tl.to(globeG.children(), { opacity: 0.5, stagger: 0.15 }, "timeline");
            tl.to(globeG.children(), { opacity: 0, stagger: 0.2 }, "timeline+=0.3"); // Adjust the delay as needed
            $(References.homePageClasses.ministryWrapper).on('mouseenter', () => CursorAnimations.cursorWhite());
            $(References.homePageClasses.ministryWrapper).on('mouseleave', () => CursorAnimations.cursorBlue());
        })
    }

    private initStarGeometry = () => {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1000;
        const starVerticies = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            const x = (Math.random() - 0.5) * 500;
            const y = (Math.random() - 0.5) * 500;
            const z = (Math.random() - 0.2) * 1000;

            starVerticies[i * 3] = x;
            starVerticies[i * 3 + 1] = y;
            starVerticies[i * 3 + 2] = z;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(starVerticies, 3));

        const material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                size: { value: 3.0 },
                scale: { value: 1 },
                color: { value: new THREE.Color('white') }
            },
            vertexShader: THREE.ShaderLib.points.vertexShader,
            fragmentShader: `
            uniform vec3 color;
            void main() {
                vec2 xy = gl_PointCoord.xy - vec2(0.5);
                float ll = length(xy);
                gl_FragColor = vec4(color, step(ll, 0.5));
            }
        `
        });

        const stars = new THREE.Points(starGeometry, material);
        this._GLOBE.scene().add(stars);
    }

    public init = () => {
        /**
         * Ensure that the DOM has loaded with JQuery ready
         */
        $(async () => {
            // const ThreeGlobe = new GlobeAnimation();

            this.addArcsData();
            this.addAtmosphere();
            this.addHexPolygonData();
            this.addPolygonData();
            this.initStarGeometry();
            this.initCamera();

            const c = this._GLOBE(this._canvas[0]);
            this.initControls();
            // $(c).on('mouseenter', () => CursorAnimations.cursorBlue());
            // $(c).on('mouseover', () => CursorAnimations.cursorBlue());

            $(window).on('resize', () => {
                console.log('resize event');
                this._size.innerWidth = this._canvas.width();
                this._size.innerHeight = this._canvas.height();
                const renderer = c.renderer();
                c.width(this._size.innerWidth * this._RATIO);
                c.height(this._size.innerHeight * this._RATIO);
                renderer.setSize(this._size.innerWidth * this._RATIO, this._size.innerHeight * this._RATIO)
            })

        });

    }
}


