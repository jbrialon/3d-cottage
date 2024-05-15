import * as THREE from "three";
import Experience from "./Experience";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    // Options
    this.options = {
      clearColor: 0x201919,
    };

    this.setDebug();
    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });

    THREE.ColorManagement.enabled = true;
    this.instance.outputColorSpace = THREE.SRGBColorSpace;
    this.instance.setClearColor(this.options.clearColor);
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }

  setDebug() {
    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("World");
      this.debugFolder
        .addColor(this.options, "clearColor")
        .name("Background Color")
        .onChange(() => {
          this.instance.setClearColor(this.options.clearColor);
        });
    }
  }
  update() {
    this.instance.render(this.scene, this.camera.instance);
  }
}
