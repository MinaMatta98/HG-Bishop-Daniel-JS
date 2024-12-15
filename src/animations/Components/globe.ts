import Globe, { type GlobeInstance } from 'globe.gl';
import gsap from 'gsap/all';
import $ from 'jquery';
import type { IDisposableAnimations } from 'src/interfaces/IDisposableAnimations';
import type { GsapAnimations, IGsapComponentAnimations } from 'src/interfaces/IGsapPageAnimations';
import { GsapComponentAnimations } from 'src/interfaces/IGsapPageAnimations';
import { GlobalPageAnimations } from 'src/interfaces/IPageAnimations';
import { PageElements } from 'src/interfaces/IPageAnimations';
import type { IResizePageAnimations } from 'src/interfaces/IResizePageAnimations';
import { MeshPhysicalMaterial } from 'three';
import * as THREE from 'three';

import countries from '../../public/custom.geo.json';
//import { CursorAnimations } from '../UI/cursor-animations';

export class GlobeAnimation
  implements IGsapComponentAnimations, IDisposableAnimations, IResizePageAnimations
{
  private _RATIO = 0.95;
  private _ARC_REL_LEN = 0.4;
  private _FLIGHT_TIME = 1000;
  private _NUM_RINGS = 3;
  private _RINGS_MAX_R = 5;
  private _RING_PROPAGATION_SPEED = 5;
  private _currentPolygon: object;
  private prevCoords = { lat: 0, lng: 0 };
  private _GLOBE: GlobeInstance;
  private _timeout: number;
  private _tl: GSAPTimeline;
  private _lightBG: boolean;

  private setSize = (): number => {
    return Math.min(
      this.pageElements.el.webGL.width(),
      this.pageElements.el.webGL.height(),
      $(window).innerWidth(),
      $(window).innerHeight()
    );
  };
  /**
   *
   */
  constructor(lightBg: boolean, gsapAnimations: GsapAnimations) {
    $(() => {
      this.gsapComponentAnimations = new GsapComponentAnimations(gsapAnimations);

      this.initElements();

      this.supportingAnimations = GlobalPageAnimations;

      this._GLOBE = this.initGlobe();

      this._lightBG = lightBg;
    });
  }

  supportingAnimations: typeof GlobalPageAnimations;

  gsapComponentAnimations: GsapComponentAnimations;

  pageElements: PageElements<readonly ['#webGL', '.globe-svg', '.ministry-wrapper']>;

  initElements = () => {
    this.pageElements = new PageElements(['#webGL', '.globe-svg', '.ministry-wrapper'] as const);
  };

  private initGlobe = (): GlobeInstance => {
    return Globe({
      rendererConfig: {
        powerPreference: 'low-power',
        antialias: false,
        precision: 'lowp',
      },
    })
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .globeMaterial(
        new MeshPhysicalMaterial({
          color: 0xebeef5,
          reflectivity: 1,
          roughness: 0,
          iridescence: 2,
          clearcoat: 0.1,
          emissive: 0xebeef5,
          emissiveIntensity: 0.5,
        })
      )
      .width(this.setSize() * this._RATIO)
      .height(this.setSize() * this._RATIO)
      .backgroundColor('#ffffff00')
      .pointsMerge(true);
  };

  public disposePageAnimations = () => {
    if (this._GLOBE) this._GLOBE._destructor();
    this._GLOBE = null;
    if (this._timeout) clearTimeout(this._timeout);
    this.gsapComponentAnimations.disposePageAnimations();
    this.onResizeHandler.dispose();
  };

  private emitArc = ({
    lat: endLat,
    lng: endLng,
  }: {
    lat: number;
    lng: number;
    glb: GlobeInstance;
  }) => {
    const { lat: startLat, lng: startLng } = this.prevCoords;
    setTimeout(() => {
      this.prevCoords = { lat: endLat, lng: endLng };
    }, this._FLIGHT_TIME);

    // add and remove arc after 1 cycle
    const arc = { startLat, startLng, endLat, endLng };
    this._GLOBE.arcsData([...this._GLOBE.arcsData(), arc]);
    setTimeout(
      () => this._GLOBE.arcsData(this._GLOBE.arcsData().filter((d) => d !== arc)),
      this._FLIGHT_TIME * 2
    );

    // add and remove start rings
    const srcRing = { lat: startLat, lng: startLng };
    this._GLOBE.ringsData([...this._GLOBE.ringsData(), srcRing]);
    setTimeout(
      () => this._GLOBE.ringsData(this._GLOBE.ringsData().filter((r) => r !== srcRing)),
      this._FLIGHT_TIME * this._ARC_REL_LEN
    );

    // add and remove target rings
    setTimeout(() => {
      const targetRing = { lat: endLat, lng: endLng };
      this._GLOBE.ringsData([...this._GLOBE.ringsData(), targetRing]);
      setTimeout(
        () => this._GLOBE.ringsData(this._GLOBE.ringsData().filter((r) => r !== targetRing)),
        this._FLIGHT_TIME * this._ARC_REL_LEN
      );
    }, this._FLIGHT_TIME);
  };

  private addArcsData = () => {
    const N = 40;

    type ArcsData = {
      startLat: number;
      startLng: number;
      endLat: number;
      endLng: number;
      color: string;
      gap: number;
    };

    const arcsData = [...Array(N).keys()].map(() => ({
      startLat: (Math.random() - 0.5) * 180,
      startLng: (Math.random() - 0.5) * 360,
      endLat: (Math.random() - 0.5) * 180,
      endLng: (Math.random() - 0.5) * 360,
      color: ['white', 'blue'][Math.round(Math.random())],
      gap: Math.random() * 5,
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
      .ringRepeatPeriod((this._FLIGHT_TIME * this._ARC_REL_LEN) / this._NUM_RINGS)
      .onGlobeClick(({ lat, lng }) => {
        this.emitArc({ lat, lng, glb: this._GLOBE });
      });
  };

  private initControls = () => {
    const { controls } = this._GLOBE;
    controls().autoRotateSpeed = 0.3;
    controls().autoRotate = true;
    controls().enableZoom = false;
  };

  private initCamera = () => {
    $(() => {
      const renderer = this._GLOBE.renderer();
      renderer.setPixelRatio(1.1);
    });
  };

  private addAtmosphere = () => {
    const width = this.setSize() * this._RATIO;
    this._GLOBE = this._GLOBE.atmosphereColor('white');
    width < 445 ? this._GLOBE.atmosphereAltitude(2) : this._GLOBE.atmosphereAltitude(0.4);
  };

  private addHexPolygonData = () => {
    this._GLOBE = this._GLOBE
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.6)
      .hexPolygonColor(() => '#3920F0')
      .hexPolygonAltitude(() => [0.1, 0.05][Math.round(Math.random())]);
  };

  private addPolygonData = () => {
    this._GLOBE = this._GLOBE
      .polygonsData(countries.features)
      .polygonCapColor(() => '#206ff030')
      .polygonSideColor(() => '#206ff0')
      .polygonStrokeColor(() => 'white')
      .polygonLabel(
        (d: { properties: { name: string } }) => `
					<h1 style="
						-webkit-text-stroke-color: blue;
						-webkit-text-stroke-width: 1px;
						color: white;
						font-family: 'Lato';
						text-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;">
					${d.properties.name}</h1>
			`
      )
      .onPolygonHover((hoverD: object | null) => {
        this._currentPolygon = hoverD;
        this._GLOBE
          .polygonAltitude((d) => (d === hoverD ? 0.12 : 0.01))
          .polygonCapColor((d) => (d === hoverD ? '#206ff0' : '#206ff030'));

        hoverD
          ? this.supportingAnimations.cursorAnimations.cursorWhite()
          : this.supportingAnimations.cursorAnimations.cursorBlue();
      })
      .polygonsTransitionDuration(300);
    this.polygonHeightSetter();
  };

  private polygonHeightSetter = () => {
    this._timeout = setTimeout(() => {
      this._GLOBE.polygonAltitude((poly) =>
        poly !== this._currentPolygon ? Math.random() * 0.05 : 0.12
      );
      this.polygonHeightSetter();
    }, 2000);
  };

  public animateGlobeBlock = () => {
    $(() => {
      const globeG = this.pageElements.el.globeSvg.find('g');
      gsap.set(globeG.children(), { fill: 'white', opacity: 0 });

      this.gsapComponentAnimations.clearAnimation(this._tl);
      this._tl = gsap.timeline({ repeat: -1 }); // Create a timeline with infinite repetition
      this._tl.to(globeG.children(), { opacity: 0.5, stagger: 0.15 }, 'timeline');
      this._tl.to(globeG.children(), { opacity: 0, stagger: 0.2 }, 'timeline+=0.3'); // Adjust the delay as needed
      this.gsapComponentAnimations.newItem(this._tl);
      const defaultCursor = () =>
        this._lightBG
          ? this.supportingAnimations.cursorAnimations.cursorBlue()
          : this.supportingAnimations.cursorAnimations.cursorWhite();

      this.pageElements.el.ministryWrapper.on('mouseenter', () =>
        this.supportingAnimations.cursorAnimations.cursorWhite()
      );

      this.pageElements.el.ministryWrapper.on('mouseleave', () => defaultCursor());
    });
  };

  private animateStarGeometry = () => {
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
        color: { value: new THREE.Color('white') },
      },
      vertexShader: THREE.ShaderLib.points.vertexShader,
      fragmentShader: `
            uniform vec3 color;
            void main() {
                vec2 xy = gl_PointCoord.xy - vec2(0.5);
                float ll = length(xy);
                gl_FragColor = vec4(color, step(ll, 0.5));
            }
        `,
    });

    const stars = new THREE.Points(starGeometry, material);
    this._GLOBE.scene().add(stars);
  };

  public animateComponent = () => {
    $(async () => {
      if (this._GLOBE === null) {
        this.initElements();
        this._GLOBE = this.initGlobe();
      }

      this.addArcsData();
      this.addAtmosphere();
      this.addHexPolygonData();
      this.addPolygonData();
      this.animateStarGeometry();
      this.initCamera();

      const c = this._GLOBE(this.pageElements.el.webGL[0]);
      this.initControls();
      this.onResizeHandler.handler(this, c);
    });
  };

  onResizeHandler = {
    handler(self: GlobeAnimation, c: GlobeInstance) {
      $(window).on('resize', () => {
        const renderer = c.renderer();
        const setSize = self.setSize();
        renderer.setSize(setSize * self._RATIO, setSize * self._RATIO);
        c.width(setSize * self._RATIO);
        c.height(setSize * self._RATIO);
      });
    },
    dispose() {
      $(window).off('resize');
    },
  };
}
