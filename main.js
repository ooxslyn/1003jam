
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader'


import gsap from 'gsap'

import * as lil from 'lil-gui'
import * as stats from 'stats.js'


let scene, camera, renderer, controls
let canvas
let loader, mixer
let axies,statsUI




/**
 *  Base
 */

function init(){
    canvas = document.querySelector('.webgl')

    scene = new THREE.Scene()




    //model import

    const MODELURL = 'statics/textures/anim-model/modelWithAnim.gltf'
    
    loader = new GLTFLoader();

    loader.load( MODELURL, function ( gltf ) {
        const model = gltf.scene
        
        // model.rotation.y = -Math.PI/2
        scene.add( model );
        mixer = new THREE.AnimationMixer( model )
        const clips = gltf.animations
        const clip1 = THREE.AnimationClip.findByName(clips,'cube-anim')
        const action1 = mixer.clipAction(clip1)

        const clip2 = THREE.AnimationClip.findByName(clips,'ball-anim')
        const action2 = mixer.clipAction(clip2)

        const clip3 = THREE.AnimationClip.findByName(clips,'plate-anim')
        const action3 = mixer.clipAction(clip3)





        action1.play()
        action2.play()
        
        action3.play()






    }, undefined, function ( error ) {

        console.error( error );

    } );




    // dot
    const dots = new THREE.Group
    const dotGeo = new THREE.BoxGeometry(.4, 1, .2)
    const dotMat = new THREE.MeshStandardMaterial( {color:'#F3BD37'})
    scene.add(dots)

    for( let i=0;i<30; i++){
        const angle = Math.random()* Math.PI*2
        const radius = 4 + Math.random()*4

        const x = Math.sin(angle) *radius
        const z = Math.cos(angle) *radius

        const dot = new THREE.Mesh(dotGeo, dotMat)
        dot.position.set(x, 1/2, z)




        const wireframe = new THREE.WireframeGeometry( dotGeo );

        const line = new THREE.LineSegments( wireframe );
        line.material.depthTest = false;
        line.material.opacity = 0.25;
        line.material.transparent = true;
        line.position.set(x, 1/2, z)
        scene.add( line );

        
        dots.add(dot)

    }

    



/* 
Light
 */
    const pointLight = new THREE.PointLight({color: 0xffffff}, 6)
    pointLight.position.x =1
    pointLight.position.y = 5
    pointLight.position.z = 3

    pointLight.castShadow = true
    scene.add(pointLight)

    const ambLight = new THREE.AmbientLight({color: 0xffffff}, 5)
    ambLight.position.x =1
    ambLight.position.y = 2
    ambLight.position.z = 3

    scene.add(ambLight)


/* 
renderer
 */


    const sizes ={
        width: window.innerWidth,
        height: window.innerHeight
    }
    camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height )
    
    renderer = new THREE.WebGLRenderer({
        canvas : canvas
    })

    renderer.setClearColor(0xA3A3A3);





    // controls = new OrbitControls(camera, renderer.domElement)




    scene.add(camera)
    camera.position.y = 1

    camera.position.z = 2
    renderer.setSize(sizes.width, sizes.height)

 





}

const clock = new THREE.Clock()

function animate(){
    requestAnimationFrame( animate)
    renderer.render(scene, camera)
    // statsUI.update()
    if(mixer)
        mixer.update(clock.getDelta())



}

function cameraMove(){
    let camStage = 0
    let stage1,stage2,stage3 = false
    window.addEventListener('mousedown', ()=>{
        camStage+=1
        switch(camStage){
            case 1:
                // console.log(camStage,'1')
                stage1 = true
                stage2,stage3 = false
                cameraStageMovement(
                    -1.8990252002912795 , 2.2182166649757757 , 1.2988622226894475,
                    -0.7412098323239372 , -0.45722108830832275 , -0.3840097452311269)
                break
            case 2:
                // console.log(camStage,'2')
                stage2 = true
                stage1,stage3 = false

                cameraStageMovement(
                    0.48688138053612534 , 1.08135619811791 , 1.0634102198324191,
                    0.012916270402702679 , 0.561438539035642 , -0.006876953962118991
                )
                break
            case 3:
                // console.log(camStage,'3')
                stage3 = true
                stage1,stage2 = false

                cameraStageMovement(
                    2.8971145015687125 , 1.8004392292581222 , 1.630400247788628,
                    0.10233076111692373 , 0.5991366413704761 , -0.057845028254453736
                )

                camStage = 0
                break


            }

        }
    
    )
}

function cameraStageMovement(xp,yp,zp,xr,yr,zr){
    gsap.to(camera.position, {
        x: xp,
        y: yp,
        z: zp,
        duration: 2
    })
    gsap.to(camera.rotation, {
        x: xr,
        y: yr,
        z: zr,
        duration: 2
    })

}





function checkInputData(){
    window.addEventListener('keydown', (e)=>{
        if(e.key === 'z'){
            console.log('rotation!',camera.rotation.x,camera.rotation.y,camera.rotation.z)
            console.log('position!',camera.position.x,camera.position.y,camera.position.z)

            // console.log('position:',camera.position,'/n rotation:',camera.)
        }
    }
    
    )
}

function controlAnim(){
    window.addEventListener('keydown', (e)=>{
        if(e.key === 'x'){
            
            // console.log('position:',camera.position,'/n rotation:',camera.)
        }
    }
    
    )
}




init()
checkInputData()
cameraMove()
animate()


