import * as THREE from "three";
import { gsap } from "gsap";
import Experience from "../Experience";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;

    // Options
    this.options = {
      smokeColor: new THREE.Color(0x0b0a0a),
      x: -0.35,
      y: 3.05,
      z: -1.05,
    };

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Smoke");
      this.debugFolder
        .addColor(this.options, "smokeColor")
        .name("Smoke Color")
        .onChange(() => {
          this.material.color.set(this.options.smokeColor);
        });
    }

    // Steup
    this.meshes = [];

    this.setGeometry();
    this.setMaterial();
    this.setMeshes();
  }

  setGeometry() {
    this.geometry = new THREE.IcosahedronGeometry(0.1, 0);
  }
  setMaterial() {
    this.material = new THREE.MeshBasicMaterial({
      color: this.options.smokeColor,
      transparent: true,
    });
  }

  setMeshes() {
    for (let i = 0; i < 5; i++) {
      this.meshes.push(
        new THREE.Mesh(
          this.geometry,
          new THREE.MeshBasicMaterial({
            color: this.options.smokeColor,
            transparent: true,
          })
        )
      );

      this.meshes[i].rotation.x = Math.random() * Math.PI * 2;
      this.meshes[i].rotation.y = Math.random() * Math.PI * 2;

      this.meshes[i].material.opacity = 0;

      this.scene.add(this.meshes[i]);

      // define random numbers for scaling and position
      const scaleTo = Math.random() * 2 + 1;
      const yTo = 2 + 3.05;

      // animate the smoke using GSAP
      const tl = gsap.timeline({
        delay: i,
        repeat: -1,
      });
      tl.fromTo(
        this.meshes[i].scale,
        { x: 1, y: 1, z: 1 },
        {
          x: scaleTo,
          y: scaleTo,
          z: scaleTo,
          duration: 1,
          onStart: () => {
            this.meshes[i].position.x = this.options.x;
            this.meshes[i].position.y = this.options.y;
            this.meshes[i].position.z = this.options.z;
            this.meshes[i].material.opacity = 1;
          },
        }
      )
        .fromTo(
          this.meshes[i].position,
          { y: this.options.y },
          { y: yTo, duration: 3 },
          "-=1"
        )
        .to(
          this.meshes[i].material,
          {
            opacity: 0,
            duration: 1,
          },
          "-=1"
        );
    }
  }
  update() {
    // this.mesh.position.x = this.options.x;
    // this.mesh.position.y = this.options.y;
    // this.mesh.position.z = this.options.z;
  }
}
