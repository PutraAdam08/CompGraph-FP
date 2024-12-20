import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import RenderPixelatedPass from './RenderPixelatedPass';
import PixelatePass from './PixelatePass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { Vector2 } from "three"

export default class SceneInit {
  constructor(canvasId) {
    //Core components to initialize Three.js app.
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;

    this.composer = undefined;

    //Camera params;
    this.fov = 45;
    this.nearPlane = 1;
    this.farPlane = 1000;
    this.canvasId = canvasId;
    this.animateMixers = undefined;

    //Additional components.
    this.clock = undefined;
    this.stats = undefined;
    this.controls = undefined;

    //Lighting is basically required.
    this.ambientLight = undefined;
    this.directionalLight = undefined;
  }

  //Initialize Component
  initialize() {
    let screenResolution = new Vector2( window.innerWidth, window.innerHeight )
    let renderResolution = screenResolution.clone().divideScalar( 6 )
    renderResolution.x |= 3
    renderResolution.y |= 3
    let aspectRatio = screenResolution.x / screenResolution.y
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.y = 9;
    this.camera.position.z = 36;

    //Specify a canvas which is already created in the HTML.
    const canvas = document.getElementById(this.canvasId);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      //Anti-aliasing smooths out the edges.
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    //postprocessing 
    this.composer = new EffectComposer( this.renderer )
    this.composer.addPass( new RenderPixelatedPass( renderResolution, this.scene, this.camera ) )
    let bloomPass = new UnrealBloomPass( screenResolution, .4, .1, .9 )
    this.composer.addPass( bloomPass )
    this.composer.addPass( new PixelatePass( renderResolution ) )

    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.stats = Stats();
    document.body.appendChild(this.stats.dom);

    //ambient light which is for the whole scene
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(this.ambientLight);

    //directional light - parallel sun rays
    this.directionalLight = new THREE.DirectionalLight(0xfafafa, 0.5);
    this.directionalLight.castShadow = true;
    this.directionalLight.position.set(30, 20, 20);
    this.scene.add(this.directionalLight);

    //if window resizes
    window.addEventListener('resize', () => this.onWindowResize(), false);

    //Load space background.
    // this.loader = new THREE.TextureLoader();
    // this.scene.background = this.loader.load('./pics/space.jpeg');

    //Declare uniforms to pass into glsl shaders.
    // this.uniforms = {
    //   u_time: { type: 'f', value: 1.0 },
    //   colorB: { type: 'vec3', value: new THREE.Color(0xfff000) },
    //   colorA: { type: 'vec3', value: new THREE.Color(0xffffff) },
    // };
  }

  animate() {
    // NOTE: Window is implied.
    // requestAnimationFrame(this.animate.bind(this));
    window.requestAnimationFrame(this.animate.bind(this));
    const delta = this.clock.getDelta();
    this.animateMixers.forEach((mixer) => mixer.update(delta));
    this.composer.render();
    this.stats.update();
    this.controls.update();
  }

  /*render() {
    // NOTE: Update uniform data on each render.
    // this.uniforms.u_time.value += this.clock.getDelta();
    this.renderer.render(this.scene, this.camera);
  }/* */

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
