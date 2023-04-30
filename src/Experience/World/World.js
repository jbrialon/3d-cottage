import * as THREE from "three";
import Experience from "../Experience";
import Environment from "./Environment";
import Cottage from "./Cottage";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources to be loaded
    this.resources.on("ready", () => {
      // Setup
      this.cottage = new Cottage();
      this.environment = new Environment();
    });
  }

  update() {}
}
