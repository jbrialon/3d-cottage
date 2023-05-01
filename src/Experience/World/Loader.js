import * as THREE from "three";
import { gsap } from "gsap";
import Experience from "../Experience";

import vertexShader from "../../Shaders/Loader/vertex.glsl";
import fragmentShader from "../../Shaders/Loader/fragment.glsl";

export default class Loader {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    // Options
    this.options = {};

    this.button = document.querySelector(".js-button");
    gsap.set(this.button, { y: "100px", x: "-50%" });

    // Setup
    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uAlpha: { value: 1 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  hideLoader() {
    gsap.to(this.material.uniforms.uAlpha, {
      duration: 3,
      value: 0,
      ease: "power4.inOut",
      onComplete: () => {
        this.destroy();
      },
    });
    gsap.to(this.button, { y: 0, x: "-50%", delay: 1, duration: 1 });
  }

  destroy() {
    this.geometry.dispose();
    this.material.dispose();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.scene.remove(this.mesh);
  }
}
