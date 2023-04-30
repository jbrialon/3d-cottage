import * as THREE from "three";
import Experience from "../Experience";

export default class Floor {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Options
    this.speed = 1;
    this.radius = 34;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Planet");
      this.debugFolder
        .add(this, "speed")
        .min(0.5)
        .max(2)
        .name("Planet Rotating Speed");
    }

    // Setup
    this.cloud = this.resources.items.cloudModel;

    this.setGround();
    this.setTrees();
    this.setClouds();
    this.setPlanet();
  }
  setGround() {
    this.ground = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0x674e34 })
    );
    this.ground.receiveShadow = true;
  }

  setTrees() {
    this.trees = [];
    // Generate random trees
    const treeCount = 100;
    const treeGeometry = new THREE.BoxGeometry(1, 7, 1);
    const treeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

    for (let i = 0; i < treeCount; i++) {
      const tree = new THREE.Mesh(treeGeometry, treeMaterial);
      tree.castShadow = true;

      // Randomly position trees on the surface of the planet
      const latitude = Math.random() * Math.PI - Math.PI / 2;
      const longitude = Math.random() * Math.PI * 2;
      const radius = this.radius;

      tree.position.set(
        radius * Math.cos(latitude) * Math.cos(longitude),
        radius * Math.sin(latitude),
        radius * Math.cos(latitude) * Math.sin(longitude)
      );
      tree.lookAt(this.ground.position);
      tree.rotateX(Math.PI / 2);

      this.trees.push(tree);
    }
  }

  setClouds() {
    this.clouds = [];
    // Generate random clouds
    const cloudCount = 100;
    const cloudGeometry = new THREE.SphereGeometry(1, 5, 5);
    const cloudMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const cloudPositions = []; // Array to store the positions of the clouds

    for (let i = 0; i < cloudCount; i++) {
      const cloud = this.cloud.scene.children[0].clone();
      cloud.material = cloudMaterial;
      cloud.castShadow = true;
      let positionIsValid = false;

      while (!positionIsValid) {
        // Randomly position cloud on the surface of the planet
        const latitude = Math.random() * Math.PI - Math.PI / 2;
        const longitude = Math.random() * Math.PI * 2;
        const radius = Math.random() * (66 - 45) + 45;
        cloud.position.set(
          radius * Math.cos(latitude) * Math.cos(longitude),
          radius * Math.sin(latitude),
          radius * Math.cos(latitude) * Math.sin(longitude)
        );
        const scale = Math.random() * 2;
        cloud.scale.set(scale, scale, scale);
        // Check if cloud position collides with existing cloud positions
        positionIsValid = cloudPositions.every(
          (pos) => cloud.position.distanceTo(pos) > 1.5
        );
        cloud.lookAt(this.ground.position);
        cloud.rotateX(-Math.PI / 2);
        cloud.rotateY(-Math.PI / 2);
      }
      this.clouds.push(cloud);
      cloudPositions.push(cloud.position.clone());
    }
  }

  setPlanet() {
    this.planet = new THREE.Group();
    this.planet.add(this.ground);
    this.trees.forEach((tree) => {
      this.planet.add(tree);
    });

    this.clouds.forEach((cloud) => {
      this.planet.add(cloud);
    });

    this.planet.castShadow = false;
    this.planet.receiveShadow = true;
    this.planet.position.y = -42;
    this.scene.add(this.planet);
  }

  update() {
    // Planet rotation
    this.planet.rotation.x = -(this.time.elapsed / 4000) * this.speed;
  }
}
