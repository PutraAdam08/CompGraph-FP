import { useState, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './App.css'
import SceneInit from "./lib/SceneInit.js"



function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();

    // const boxGeometry = new THREE.BoxGeometry(8, 8, 8);
    // const boxMaterial = new THREE.MeshNormalMaterial();
    // const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    // test.scene.add(boxMesh);

    

    let loadedModel;
    const glftLoader = new GLTFLoader();
    glftLoader.load('/hall.gltf', (gltfScene) => {
      loadedModel = gltfScene;
      // console.log(loadedModel);
      

      gltfScene.scene.rotation.y = Math.PI / 8;
      gltfScene.scene.position.y = 3;
      gltfScene.scene.scale.set(10, 10, 10);
      test.scene.add(gltfScene.scene);
    });/* */

    {
      let spotLight = new THREE.SpotLight( 0xff8800, 6, 10, Math.PI / 16, .02, 2 )
      // let spotLight = new THREE.SpotLight( 0xff8800, 1, 10, Math.PI / 16, 0, 2 )
      spotLight.position.set( 2, 7, 0 )
      let target = spotLight.target //= new THREE.Object3D()
      test.scene.add( target )
      target.position.set( 0, 5, 0 )
      spotLight.castShadow = true
      test.scene.add( spotLight )
      // spotLight.shadow.radius = 0
  }

    /*
    const boxGeometry = new THREE.BoxGeometry(16, 16, 16);
    const boxMaterial = new THREE.MeshStandardMaterial();
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    const planeGeometry = new THREE.PlaneGeometry(32, 32);
    const planeMaterial = new THREE.MeshStandardMaterial();
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)/* */

    test.scene.add(boxMesh);
    test.scene.add(planeMesh);/**/
  }, [])

  return (
    <>
      <canvas id="myThreeJsCanvas"/>
    </>
  )
}

export default App
