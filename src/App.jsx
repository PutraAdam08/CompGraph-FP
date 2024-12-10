import { useState, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './App.css'
import SceneInit from "./lib/SceneInit.js"
import { mix } from 'three/webgpu';



function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');    
    const animateMixers = [];
    test.animateMixers = animateMixers
    //let clickableObjects = [];
    test.initialize();
    test.animate();
    //raycast
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();


    //gltf load
    var loadedModel1, loadedModel2,anim, mixer;
    const glftLoader = new GLTFLoader();
    glftLoader.load('/MushollaTC.gltf', (gltfScene) => {
    loadedModel1 = gltfScene;
    gltfScene.scene.rotation.y = Math.PI;
      //console.log(loadedModel1);
      

      test.scene.add(gltfScene.scene);
    });/* */

    glftLoader.load('/BushTest.gltf', (gltfScene) => {
      loadedModel2 = gltfScene;
      mixer = new THREE.AnimationMixer(gltfScene.scene);
      //console.log(loadedModel2.animations);
      anim = gltfScene.animations[0];
      gltfScene.scene.rotation.y = -Math.PI/4;
      gltfScene.scene.position.x = -3;
      gltfScene.scene.position.z = 2;
      gltfScene.scene.scale.set(3, 3, 3);
      // console.log(loadedModel);
      
      // Play all animations
      
      const action = mixer.clipAction(gltfScene.animations[0]);
      //action.play();
      

      // Add mixer to the update loop
      animateMixers.push(mixer);
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


    const onMouseClick = (event) => {
      // Convert mouse position to normalized device coordinates (-1 to +1)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Perform raycasting
      raycaster.setFromCamera(mouse, test.camera);
      const intersects = raycaster.intersectObjects(test.scene.children, true);
        //console.log(loadedModel2);
        const action = mixer.clipAction(anim);
        action.loop = THREE.LoopOnce; // Resume animation
        action.play();
        action.reset();
    };//

// Listen for mouse click
window.addEventListener('click', onMouseClick, false);
  }, [])

  return (
    <>
      <canvas id="myThreeJsCanvas"/>
    </>
  )
}

export default App
