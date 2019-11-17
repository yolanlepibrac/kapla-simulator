import React, { Component } from 'react';
//import { changeAccountState } from "../redux/actions/index";
import { connect } from "react-redux";
import { bounceInDown } from 'react-animations';
import styled, { keyframes } from 'styled-components';
import * as THREE from 'three';
//import {Ammo} from './Ammo.js';
//import {Ammo} from '../ammo/builds/ammo.js';

import ControlsMenu from './Controls'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { bounce } from 'react-animations';
import posed from 'react-pose';

const bounceAnimation = keyframes`${bounce}`;
const BouncyDiv = styled.div`
  animation: 1s ${bounceAnimation};
`;

const CheckBox = posed.div({
  active: { left: 30, transition: { duration: 500 } },
  inactive: { left: 3, transition: { duration: 500 } }
})

const grid = require('../assets/images/grid.png')
const wood = require('../assets/images/wood.jpg')
//const Ammo = require('../ammo.js-master/builds/ammo.js')

const OrbitControls = require('three-orbit-controls')(THREE);
var Physijs = require('physijs-webpack');

var container;
var canvas;
var container, stats;
var camera, scene, renderer, obj, mesh, axes, groupligth, sol, skybox, tabOfPointsPicker, materialobjet ;
var materialobjet = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, color: 0xdd0000, vertexColors: THREE.FaceColors});
var controls;
var facteurPanPers = 2;
var facteurZoomPers = 20;
var facteurRotPers = 2;
var canvasPosition;
var materialplane = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0x888888, specular:0xbbaa99, shininess:14, combine:THREE.MultiplyOperation } );
var rollOverMesh, rollOverMaterial;
var objectsOfScenes = [];
var objectsSave = [];
var mouse, raycaster, isShiftDown = false;
var cubeGeo, cubeMaterial;
var cubeGeo = new THREE.BoxBufferGeometry( 50, 50, 50 );
var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xfeb74c, map: new THREE.TextureLoader().load( 'textures/square-outline-textured.png' ) } );

var kaplaGostMesh,kaplaGostGeo, kaplaGostMaterial;
var collidableMeshList = [];
var textureLoader;

//physics
var physicScene = Physijs.Scene


var clock = new THREE.Clock();
var gravityConstant = - 9.8;
var physicsWorld;
var rigidBodies = [];
var softBodies = [];
//var margin = 0.05;
var transformAux1;
var softBodyHelpers;



function mapDispatchToProps(dispatch) {
  return {
  };
};

class AppContainerComponent extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      kaplaDimensions : [10,30,150],
      kaplaOffset : [0,0,150/2],
      rotation:0,
      gravityActive : false
     }
  }

  setKaplaDimension = (dimensions, offset, rotation) => {
    console.log(rotation)
    this.setState({
      kaplaDimensions : dimensions,
      kaplaOffset : offset,
      rotation : rotation,
    })
    scene.remove( kaplaGostMesh );
    kaplaGostGeo = new THREE.BoxGeometry( dimensions[0], dimensions[1], dimensions[2] );
		kaplaGostMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
		kaplaGostMesh = new THREE.Mesh( kaplaGostGeo, kaplaGostMaterial );
    kaplaGostMesh.rotation.z = rotation
		scene.add( kaplaGostMesh );
  }


  componentDidMount = async () => {
    scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 });
    scene.setGravity(new THREE.Vector3( 0, 0, -0 ));
    scene.background = new THREE.Color( 0xbfd1e5 );
    renderer = new THREE.WebGLRenderer();

    canvas = document.getElementById( 'canvas' );
    canvas.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 70, canvas.clientWidth / canvas.clientHeight, 1, 100000 );
    camera.position.copy( new THREE.Vector3(100, 200, 200) );
    camera.up = new THREE.Vector3( 0, 0, 1 );

    renderer.setSize( canvas.offsetWidth, canvas.offsetHeight );
    renderer.domElement.addEventListener( 'wheel', event => this.mousewheel(event) );
    renderer.domElement.addEventListener( 'mousemove', event => this.mousemove(event) );
    renderer.domElement.addEventListener( 'mousedown', event => this.onclick(event) );
    renderer.domElement.addEventListener( 'keydown', event => this.onDocumentKeyDown(event), false );
		renderer.domElement.addEventListener( 'keyup', event => this.onDocumentKeyUp(event), false );
    renderer.shadowMap.enabled = true;

    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		controls.dampingFactor = 0.2;
		controls.screenSpacePanning = false;
		controls.minDistance = 100;
		controls.maxDistance = 500;
		controls.maxPolarAngle = Math.PI / 2;

    canvasPosition = renderer.domElement.getBoundingClientRect()

    var ambientLight = new THREE.AmbientLight( 0x404040 );
		scene.add( ambientLight );
		var light = new THREE.DirectionalLight( 0xffffff, 2 );
		light.position.set( - 10, 10, 5 );
		light.castShadow = true;
		var d = 20;
		light.shadow.camera.left = - d;
		light.shadow.camera.right = d;
		light.shadow.camera.top = d;
		light.shadow.camera.bottom = - d;
		light.shadow.camera.near = 2;
		light.shadow.camera.far = 50;
		light.shadow.mapSize.x = 1024;
		light.shadow.mapSize.y = 1024;
    scene.add( light );

//GRILLE
    var helper = new THREE.GridHelper( 2000, 100 );
    helper.rotateX( - Math.PI / 2 );
    helper.position.x = -0;
    helper.material.opacity = 0.5;
    helper.material.transparent = true;

    var planesol = new THREE.BoxGeometry( 2000, 100, 2000 );
    sol = new Physijs.BoxMesh( planesol, new THREE.MeshPhongMaterial( { color: 0xffffff } ), 0, { restitution: .2, friction: .8 } );
    sol.position.set( 0, 0, -50 );
    sol.rotateX( - Math.PI / 2 );
    sol.receiveShadow = true;

		scene.add( sol );

    textureLoader = new THREE.TextureLoader();
    textureLoader.load(grid, function ( texture ) {
      console.log("grid loaded")
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set( 40, 40 );
			sol.material.map = texture;
			sol.material.needsUpdate = true;

		}, () => {
      console.log("progress")
    }, (error) => {
      console.log(error)
    });

    objectsOfScenes.push( sol );
    objectsSave.push( sol );
    collidableMeshList.push(sol)

    axes = new THREE.AxesHelper( 100 );
    axes.position.set( 0, 0, 0 );

    //scene.add( sol );scene.add( axes );scene.add(skybox);
    //scene.add(helper);


    kaplaGostGeo = new THREE.BoxGeometry( this.state.kaplaDimensions[0], this.state.kaplaDimensions[1], this.state.kaplaDimensions[2] );
		kaplaGostMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00, opacity: 0.5, transparent: true } );
		kaplaGostMesh = new THREE.Mesh( kaplaGostGeo, kaplaGostMaterial );
    kaplaGostMesh.rotation.z = this.state.rotation
    kaplaGostMesh.position.set( 0,0,75 )
		scene.add( kaplaGostMesh );


    var animate = () => {
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
      controls.update();
      scene.simulate()
    };
    this.initPhysics();
    animate();


  }

  mousewheel = (event) => {
      controls.enableZoom = false;
      event.preventDefault();
      var factor = facteurZoomPers;
      var mX = ((event.clientX - canvas.offsetLeft) / canvas.offsetWidth) * 2 - 1;
      var mY = -((event.clientY - canvas.offsetTop) / canvas.offsetHeight) * 2 + 1;
      var vector = new THREE.Vector3(mX, mY, 0.5);
      vector.unproject(camera);
      vector.sub(camera.position);
      if (event.deltaY < 0) {
          camera.position.addVectors(camera.position,vector.setLength(factor));
          controls.target.addVectors(controls.target,vector.setLength(factor));
          camera.updateProjectionMatrix();
      } else {
          camera.position.subVectors(camera.position,vector.setLength(factor));
          controls.target.subVectors(controls.target,vector.setLength(factor));
          camera.updateProjectionMatrix();
      }
  }


  mousemove = (event) => {
    //console.log(event)
    event.preventDefault();
    var originPoint = kaplaGostMesh.position.clone();
    for (var vertexIndex = 0; vertexIndex < kaplaGostMesh.geometry.vertices.length; vertexIndex++){
  		var localVertex = kaplaGostMesh.geometry.vertices[vertexIndex].clone();
  		var globalVertex = localVertex.applyMatrix4( kaplaGostMesh.matrix );
  		var directionVector = globalVertex.sub( kaplaGostMesh.position );

  		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
  		var collisionResults = ray.intersectObjects( collidableMeshList );
  		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ){
        kaplaGostMesh.material.color.setHex(0xff0000)
      }else{
        kaplaGostMesh.material.color.setHex(0x00ff00)
      }
    }

    let mouseX = event.clientX - canvas.offsetLeft;
    let mouseY = event.clientY - canvas.offsetTop;
    let mouseVector = new THREE.Vector2( ( mouseX / canvas.offsetWidth ) * 2 - 1, - ( mouseY / canvas.offsetHeight ) * 2 + 1 );
    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera( mouseVector, camera );
    let intersection = raycaster.intersectObjects( objectsOfScenes, true );
    if ( intersection.length > 0 ) {
      let intersected = intersection[0];
      if(intersected.face){
        kaplaGostMesh.position.copy( intersected.point );
        kaplaGostMesh.rotation.z = this.state.rotation;
        kaplaGostMesh.position.add(new THREE.Vector3 (this.state.kaplaOffset[0]+this.state.kaplaOffset[1]*Math.cos(this.state.rotation),this.state.kaplaOffset[1]+this.state.kaplaOffset[0]*Math.sin(this.state.rotation),this.state.kaplaOffset[2]))
      }
    }

    /*
    if(this.isCollision(kaplaGostMesh, collidableMeshList)){
      kaplaGostMesh.material.color.setHex(0xff0000)
    }else{
      kaplaGostMesh.material.color.setHex(0x00ff00)
    }
    */

  }

  onclick = (event) => {
    event.preventDefault();
    if(event.which === 1){
      var originPoint = kaplaGostMesh.position.clone();
      for (var vertexIndex = 0; vertexIndex < kaplaGostMesh.geometry.vertices.length; vertexIndex++){
      		var localVertex = kaplaGostMesh.geometry.vertices[vertexIndex].clone();
      		var globalVertex = localVertex.applyMatrix4( kaplaGostMesh.matrix );
      		var directionVector = globalVertex.sub( kaplaGostMesh.position );

      		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
      		var collisionResults = ray.intersectObjects( collidableMeshList );
      		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()-0.005 ){

            var vector = kaplaGostMesh.geometry.vertices[vertexIndex].clone();
            vector.applyMatrix4( kaplaGostMesh.matrixWorld );
            console.log(vector)
            return
          }
      }
      if(this.state.mode !== "selection" || this.state.gravityActive ){
        return
      }
      let mouseX = event.clientX - canvas.offsetLeft;
      let mouseY = event.clientY - canvas.offsetTop;
      let mouseVector = new THREE.Vector2( ( mouseX / canvas.offsetWidth ) * 2 - 1, - ( mouseY / canvas.offsetHeight ) * 2 + 1 );
      let raycaster = new THREE.Raycaster();
      raycaster.setFromCamera( mouseVector, camera );
      let intersects = raycaster.intersectObjects( objectsOfScenes, true );
      if ( intersects.length > 0 ) {
        var intersect = intersects[ 0 ];
        if ( isShiftDown ) {
						if ( intersect.object !== sol ) {
							scene.remove( intersect.object );
							objectsOfScenes.splice( objectsOfScenes.indexOf( intersect.object ), 1 );
              collidableMeshList.splice( objectsOfScenes.indexOf( intersect.object ), 1 )
						}
						// create cube
					} else {
            textureLoader = new THREE.TextureLoader().load(wood);
            var material = new THREE.MeshBasicMaterial( { map: textureLoader } );
						var newKapla = new Physijs.BoxMesh( new THREE.BoxBufferGeometry( this.state.kaplaDimensions[0], this.state.kaplaDimensions[1], this.state.kaplaDimensions[2] ), material );
						newKapla.position.copy( intersect.point );
            newKapla.rotation.z = this.state.rotation;
            newKapla.position.add(new THREE.Vector3 (this.state.kaplaOffset[0]+this.state.kaplaOffset[1]*Math.cos(this.state.rotation),this.state.kaplaOffset[1]+this.state.kaplaOffset[0]*Math.sin(this.state.rotation),this.state.kaplaOffset[2]));
						scene.add( newKapla );
						objectsOfScenes.push(newKapla);
            objectsSave.push(newKapla.clone());
            collidableMeshList.push(newKapla)
					}

      }
    }
  }

  onDocumentKeyDown = ( event ) => {
		switch ( event.keyCode ) {
			case 16: isShiftDown = true; break;
		}
	}
	onDocumentKeyUp = ( event ) => {
		switch ( event.keyCode ) {
			case 16: isShiftDown = false; break;
		}
	}

  initPhysics = () => {
		// Physics configuration
/*
		var collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
		var dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
		var broadphase = new Ammo.btDbvtBroadphase();
		var solver = new Ammo.btSequentialImpulseConstraintSolver();
		var softBodySolver = new Ammo.btDefaultSoftBodySolver();
		//physicsWorld = new Ammo.btSoftRigidDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration, softBodySolver );
		physicsWorld.setGravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );
		physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );
		transformAux1 = new Ammo.btTransform();
		softBodyHelpers = new Ammo.btSoftBodyHelpers();
*/
	}

  updatePhysics = ( deltaTime ) => {
		// Step world
		physicsWorld.stepSimulation( deltaTime, 10 );
		// Update soft volumes
		for ( var i = 0, il = softBodies.length; i < il; i ++ ) {
			var volume = softBodies[ i ];
			var geometry = volume.geometry;
			var softBody = volume.userData.physicsBody;
			var volumePositions = geometry.attributes.position.array;
			var volumeNormals = geometry.attributes.normal.array;
			var association = geometry.ammoIndexAssociation;
			var numVerts = association.length;
			var nodes = softBody.get_m_nodes();
			for ( var j = 0; j < numVerts; j ++ ) {
				var node = nodes.at( j );
				var nodePos = node.get_m_x();
				var x = nodePos.x();
				var y = nodePos.y();
				var z = nodePos.z();
				var nodeNormal = node.get_m_n();
				var nx = nodeNormal.x();
				var ny = nodeNormal.y();
				var nz = nodeNormal.z();
				var assocVertex = association[ j ];
				for ( var k = 0, kl = assocVertex.length; k < kl; k ++ ) {
					var indexVertex = assocVertex[ k ];
					volumePositions[ indexVertex ] = x;
					volumeNormals[ indexVertex ] = nx;
					indexVertex ++;
					volumePositions[ indexVertex ] = y;
					volumeNormals[ indexVertex ] = ny;
					indexVertex ++;
					volumePositions[ indexVertex ] = z;
					volumeNormals[ indexVertex ] = nz;
				}
			}
			geometry.attributes.position.needsUpdate = true;
			geometry.attributes.normal.needsUpdate = true;
		}
		// Update rigid bodies
		for ( var i = 0, il = rigidBodies.length; i < il; i ++ ) {
			var objThree = rigidBodies[ i ];
			var objPhys = objThree.userData.physicsBody;
			var ms = objPhys.getMotionState();
			if ( ms ) {
				ms.getWorldTransform( transformAux1 );
				var p = transformAux1.getOrigin();
				var q = transformAux1.getRotation();
				objThree.position.set( p.x(), p.y(), p.z() );
				objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );
			}
		}
  }

  toggleGravity = () => {
    let gravityActive = this.state.gravityActive
    this.setState({gravityActive : !this.state.gravityActive})
    if(gravityActive){
      scene.setGravity(new THREE.Vector3( 0, 0, -0 ))
      console.log(objectsOfScenes)
      let l = objectsOfScenes.length
      for (var i = 0; i < l; i++) {
        console.log(i)
        if ( objectsOfScenes[i] !== sol ) {
          //console.log(objectsOfScenes[i])
          scene.remove(objectsOfScenes[i]);
          //objectsOfScenes.splice(i, 1)

        }
      }
      objectsOfScenes = [sol]
      for (var i = 0; i < objectsSave.length; i++) {
        let drawbackKapla = objectsSave[i].clone()
        objectsOfScenes.push(drawbackKapla)
        scene.add(drawbackKapla)
      }
    }else{
      scene.setGravity(new THREE.Vector3( 0, 0, -100 ))
    }
  }

  setRotationMode = () => {
    this.setState({
      mode:"rotation"
    })
  }

  setSelectionMode = () => {
    this.setState({
      mode:"selection"
    })
  }

  setDestructionMode = () => {
    this.setState({
      mode:"destruction"
    })
  }



  render(){

    return(
      <div style={{display:"flex", flexDirection:"row", height:"100%"}}>
        <div style={{width:"30vw", height:"100%"}}>
          <ControlsMenu setKaplaDimension={this.setKaplaDimension} setKaplaOffset={this.setKaplaOffset}/>
        </div>
        <div id="canvas" style={{width:"70vw", height:"calc(100vh - 35px)"}}>
        </div>
        <div style={{display:"flex", flexDirection:"row", position:"absolute", top:40, right:20, borderStyle:"solid", borderWidth:1, borderRadius:30, borderColor:"rgba(150,150,150,0.7)"}}>
          <div style={{width:100, height:34, "border-top-left-radius":25,"border-bottom-left-radius":25, backgroundColor:this.state.mode==="rotation"?"rgba(150,255,150,1)":"rgba(220,220,220,1)"}} onClick={this.setRotationMode}>rotation</div>
          <div style={{width:100, height:34,  backgroundColor:this.state.mode==="selection"?"rgba(150,255,150,1)":"rgba(220,220,220,1)"}} onClick={this.setSelectionMode}>selection</div>
          <div style={{width:100, height:34, "border-top-right-radius":25,"border-bottom-right-radius":25, backgroundColor:this.state.mode==="destruction"?"rgba(150,255,150,1)":"rgba(220,220,220,1)"}} onClick={this.setDestructionMode}>destruction</div>
        </div>
        <label class="switch" style={{position:"absolute", top:80, right:20, backgroundColor:this.state.gravityActive?"rgba(150,255,150,1)":"rgba(220,220,220,1)", width:60,height:34, borderStyle:"solid", borderWidth:1, borderRadius:30, borderColor:"rgba(150,150,150,0.7)"}}>
          <input type="checkbox" style={{opacity:0, width:0, height:0}} onClick={this.toggleGravity}/>
          <CheckBox pose={this.state.gravityActive ? 'active' : 'inactive'}  style={{position:"absolute", height:28, width:28, top:3, backgroundColor:"white", borderRadius:"50%"}}>
          </CheckBox>
        </label>
      </div>
    )

    }
  }

  const mapStateToProps = (state) => {
    return {
    }
  }

  const AppContainer = connect(mapStateToProps, mapDispatchToProps)(AppContainerComponent);
  export default AppContainer;
