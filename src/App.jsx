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

    //gltf load
    let loadedModel;
    const glftLoader = new GLTFLoader();
    glftLoader.load('/MushollaTC.gltf', (gltfScene) => {
      loadedModel = gltfScene;
      gltfScene.scene.rotation.y = Math.PI;
      // console.log(loadedModel);
      

      test.scene.add(gltfScene.scene);
    });/* */

    //spotlight
    {
      let spotLight = new THREE.SpotLight( 0xffff00, 500, 100, Math.PI / 16, .02, 2 )
      // let spotLight = new THREE.SpotLight( 0xff8800, 1, 10, Math.PI / 16, 0, 2 )
      spotLight.position.set( 5, 10, 4 )
      let target = spotLight.target //= new THREE.Object3D()
      test.scene.add( target )
      target.position.set( 1, 2, 1 )
      spotLight.castShadow = true
      test.scene.add( spotLight )
      // spotLight.shadow.radius = 0
    }/** */

    
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial();
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.translateX(5);
    boxMesh.translateY(10);
    boxMesh.translateZ(4);
    const planeGeometry = new THREE.PlaneGeometry(32, 32);
    const planeMaterial = new THREE.MeshStandardMaterial();
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)/*/* */

    test.scene.add(boxMesh);
    /*test.scene.add(planeMesh);/**/

    //raycast
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    const onMouseMove = (event) => {
      // (-1 to +1) for both components
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, test.camera);
      const intersects = raycaster.intersectObjects(test.scene.children);

      if (intersects.length > 0) {
        //intersects[0].object.material.color.set(0xff0000);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
  }, [])

  return (
    <>
      <canvas id="myThreeJsCanvas"/>
    </>
  )
}

export default App
