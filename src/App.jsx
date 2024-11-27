import { useState, useEffect } from 'react'
import * as THREE from 'three'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SceneInit from "./lib/SceneInit.js"


function App() {
  useEffect(() => {
    const test = new SceneInit("myTreeJsCanvas"); //SeceneInit class to simplify the main app.js
    test.initialize();
    test.animate();
    const boxGeometry = new THREE.BoxGeometry(16, 16, 16);
    const boxMaterial = new THREE.MeshNormalMaterial();
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

    test.scene.add(boxMesh);
  }, [])

  return (
    <>
      <canvas id="myTreeJsCanvas"/>
    </>
  )
}

export default App
