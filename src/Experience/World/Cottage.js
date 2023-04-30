import * as THREE from "three";
import Experience from "../Experience";

export default class Fox {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.time = this.experience.time;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Cottage");
    }

    // Setup
    this.resource = this.resources.items.cottageModel;
    this.bakedTexture = this.resources.items.bakedTexture;

    this.setTexture();
    this.setMaterial();
    this.setModel();
  }

  setTexture() {
    this.bakedTexture.flipY = false;
    this.bakedTexture.encoding = THREE.sRGBEncoding;
  }

  setMaterial() {
    this.bakedMaterial = new THREE.MeshBasicMaterial({
      map: this.bakedTexture,
      side: THREE.DoubleSide,
    });

    this.emissiveMaterial = new THREE.MeshBasicMaterial({ color: 0xff9141 });
  }

  setModel() {
    this.model = this.resource.scene;

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name.includes("emissive")) {
          child.material = this.emissiveMaterial;
        } else {
          child.material = this.bakedMaterial;
        }
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });

    this.scene.add(this.model);
  }
}
