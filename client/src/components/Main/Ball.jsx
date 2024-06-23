import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function Ball() {
  const refContainer = useRef(null);
  const websocketRef = useRef(null);

  useEffect(() => {
    const websocket = new WebSocket("ws://127.0.0.1:8080");
    websocketRef.current = websocket;

    websocket.onopen = () => {
      console.log("WebSocket is connected");
    };

    websocket.onmessage = (evt) => {
      console.log(`Received message from server: ${evt.data}`);
    };

    websocket.onclose = () => {
      console.log("WebSocket is closed");
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 20, 50);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    refContainer.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const addLighting = () => {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(0, 10, 0);
      light.target.position.set(-5, -2, -5);
      scene.add(light);
      scene.add(light.target);
    };
    addLighting();

    const containerGeometry = new THREE.BoxGeometry(20, 20, 20);
    const containerMaterial = new THREE.MeshPhongMaterial({
      color: 0xf9f6ee,
      transparent: true,
      opacity: 0.2,
    });
    const container = new THREE.Mesh(containerGeometry, containerMaterial);
    scene.add(container);

    const edges = new THREE.EdgesGeometry(containerGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const wireframe = new THREE.LineSegments(edges, edgesMaterial);
    container.add(wireframe);

    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x3b71b1,
      emissive: 0x220022,
      shininess: 100,
      specular: 0x555555,
      flatShading: true,
    });
    const sphere = new THREE.Mesh(geometry, sphereMaterial);
    sphere.position.set(0, 5, 0);
    sphere.name = "my-sphere";
    scene.add(sphere);

    const maxX = containerGeometry.parameters.width / 2 - geometry.parameters.radius;
    const minX = -maxX;
    const maxY = containerGeometry.parameters.height / 2 - geometry.parameters.radius;
    const minY = -maxY;
    const maxZ = containerGeometry.parameters.depth / 2 - geometry.parameters.radius;
    const minZ = -maxZ;

    let spherePosition = { x: 0, y: 5, z: 0 };
    let velocity = { x: 0.1, y: 0.05, z: 0.08 };

    const animate = () => {
      requestAnimationFrame(animate);

      // Update sphere position
      spherePosition.x += velocity.x;
      spherePosition.y += velocity.y;
      spherePosition.z += velocity.z;

      // Bounce back when hitting container walls
      if (spherePosition.x > maxX || spherePosition.x < minX) {
        velocity.x = -velocity.x;
      }
      if (spherePosition.y > maxY || spherePosition.y < minY) {
        velocity.y = -velocity.y;
      }
      if (spherePosition.z > maxZ || spherePosition.z < minZ) {
        velocity.z = -velocity.z;
      }

      // Update sphere position in the scene
      sphere.position.set(spherePosition.x, spherePosition.y, spherePosition.z);

      // Send sphere coordinates via WebSocket at intervals
      if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
        const coordinates = { x: spherePosition.x, y: spherePosition.y, z: spherePosition.z };
        websocketRef.current.send(JSON.stringify(coordinates));
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (refContainer.current) {
        refContainer.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={refContainer}></div>;
}

export default Ball;
