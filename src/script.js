import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/8.png')
const matcapTexture2 = textureLoader.load('textures/matcaps/3.png')

/**
 * Fonts
 */
const fontLoader = new FontLoader()

//define donuts
const donutsArr = []

// Material
const firstMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
const secondMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture2 })

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {

        // Text
        const textGeometry = new TextGeometry(
            'MOHAMMAD NOURI',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 3
            }
        )
        textGeometry.center()

        const text = new THREE.Mesh(textGeometry, secondMaterial)
        scene.add(text)
    }
)

        // Donuts
        const donutGeometry = new THREE.IcosahedronGeometry(0.3)
        
        
        for(let i = 0; i < 1000; i++)
        {
            const donut = new THREE.Mesh(donutGeometry, secondMaterial)
            donut.position.x = (Math.random() - 0.5) * 100
            donut.position.y = (Math.random() - 0.5) * 100
            donut.position.z = (Math.random() - 0.9) * 1000
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            const scale = Math.random() + .5
            donut.scale.set(scale, scale, scale)
            donutsArr.push(donut)
            scene.add(donut)
        }

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = -1
camera.position.z = -3

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.enabled = false

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

gsap.to(camera.position, { duration: 6, delay: 1, x: 2, z: 4,  ease: "slow(0.7, 0.7, false)"})

for(let i=0 ; i < donutsArr.length ; i++){
    gsap.to(donutsArr[i].rotation, { duration: 1000, y: (Math.random() - .5) * Math.PI*100, z: (Math.random() - .5) * Math.PI*100 })
    gsap.to(donutsArr[i].position, { duration: 1000, x: (Math.random() - .5) * 100, y: (Math.random() - .5) * 100, z: Math.random() * 900 })
    donutsArr[i].position.z += Math.random() * 0.001
}

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()