import * as THREE from "three";
import Experience from "../Experience";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Environment");
    }
  }
}
