import * as THREE from "three";
import { gsap } from "gsap";
import Experience from "../Experience";

export default class Smoke {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;
    this.resources = this.experience.resources;

    // Options
    this.options = {
      smokeColor: new THREE.Color(0x0b0a0a),
      x: -0.35,
      y: 3.05,
      z: -1.05,
    };

    this.animated = false;

    this.button = document.querySelector(".js-button");
    this.button.classList.remove("hidden");

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

    this.setAudio();
    this.setGeometry();
    // this.setMeshes();
  }

  setAudio() {
    const listener = new THREE.AudioListener();
    this.camera.add(listener);

    // create a global audio source
    const sound = new THREE.Audio(listener);

    // load a sound and set it as the Audio object's buffer
    sound.setBuffer(this.resources.items.audio);
    sound.setLoop(true);
    sound.setVolume(0.5);

    this.button.addEventListener("pointerdown", (e) => {
      if (this.button.classList.contains("playing")) {
        this.button.classList.remove("paused", "playing");
        this.button.classList.add("paused");
        sound.pause();
      } else {
        if (this.button.classList.contains("paused")) {
          this.button.classList.add("playing");
          sound.play();
        }
      }
      if (!this.button.classList.contains("paused")) {
        this.button.classList.add("paused");
        sound.pause();
      }
    });

    // create an AudioAnalyser, passing in the sound and desired fftSize
    this.analyser = new THREE.AudioAnalyser(sound, 32);
  }

  setGeometry() {
    this.geometry = new THREE.IcosahedronGeometry(0.1, 0);
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

  smoke() {
    this.animated = true;
    setTimeout(() => {
      this.animated = false;
    }, 350);
    const smoke = new THREE.Mesh(
      this.geometry,
      new THREE.MeshBasicMaterial({
        color: this.options.smokeColor,
        transparent: true,
      })
    );
    smoke.rotation.x = Math.random() * Math.PI * 2;
    smoke.rotation.y = Math.random() * Math.PI * 2;

    smoke.material.opacity = 0;

    this.scene.add(smoke);

    // define random numbers for scaling and position
    const scaleTo = Math.random() * 2.5 + 1;
    const yTo = 5;

    // animate the smoke using GSAP
    const tl = gsap.timeline();
    tl.fromTo(
      smoke.scale,
      { x: 1, y: 1, z: 1 },
      {
        x: scaleTo,
        y: scaleTo,
        z: scaleTo,
        duration: 1,
        onStart: () => {
          smoke.position.x = this.options.x;
          smoke.position.y = this.options.y;
          smoke.position.z = this.options.z;
          smoke.material.opacity = 1;
        },
      }
    )
      .fromTo(
        smoke.position,
        { y: this.options.y },
        { y: yTo, duration: 3 },
        "-=1"
      )
      .to(
        smoke.material,
        {
          opacity: 0,
          duration: 1,
        },
        "-=1"
      );
  }
  update() {
    let analysis = Math.pow(
      (this.analyser.getFrequencyData()[2] / 255) * 0.85,
      8
    );
    if (analysis > 0.013 && !this.animated) {
      this.smoke();
    }
  }
}
