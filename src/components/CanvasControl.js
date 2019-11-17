
import React, { Component } from 'react';
import * as THREE from 'three';
//import { changeAccountState } from "../redux/actions/index";
import { connect } from "react-redux";
import { bounceInDown } from 'react-animations';
import styled, { keyframes } from 'styled-components';


var container;
var canvas;
var container, stats;
var camera, scene, renderer, obj, mesh, axes, groupligth, sol, skybox, tabOfPointsPicker, materialobjet ;
var materialobjet = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, color: 0xdd0000, vertexColors: THREE.FaceColors});
var controls;
var canvasPosition;
var kaplaGostMesh

function mapDispatchToProps(dispatch) {
  return {
  };
};

class CanvasControlComponent extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      position:0,
      rotation:0,
      point:0,
      offsetX:0,
      offsetY:0,
      kaplaDimensions:[10,30,150],
      previousMousePosition:{x:0,y:0},
      isDragging:false,
     }
  }

  componentDidUpdate = (prevProps) => {
    if(this.props.position != prevProps.position){
      if(this.props.position === 0){
        kaplaGostMesh.geometry = new THREE.BoxGeometry( 10, 30, 150 );
        kaplaGostMesh.position.set( 0, 0, 75 );
      }else if(this.props.position === 1){
        kaplaGostMesh.geometry = new THREE.BoxGeometry( 10, 150, 30 );
        kaplaGostMesh.position.set( 0, 0, 15 );
      }else if(this.props.position === 2){
        kaplaGostMesh.geometry = new THREE.BoxGeometry( 30, 150, 10 );
        kaplaGostMesh.position.set( 0, 0, 5 );
      }
    }
  }

  componentDidMount = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xbfd1e5 );
  renderer = new THREE.WebGLRenderer();

  canvas = document.getElementById( 'canvasControl' );
  canvas.appendChild( renderer.domElement );

  camera = new THREE.PerspectiveCamera( 70, canvas.clientWidth / canvas.clientHeight, 100, 1000 );
  camera.position.copy( new THREE.Vector3(100, 100, 150) );
  camera.up = new THREE.Vector3(0,0,1);
  camera.lookAt ( -100,-100,0 )

  renderer.setSize( canvas.offsetWidth, canvas.offsetHeight );
  renderer.shadowMap.enabled = true;
  renderer.domElement.addEventListener("mousedown", event => this.mouseDown(event) );
  renderer.domElement.addEventListener("mouseup", event => this.mouseUp(event) );


  canvasPosition = renderer.domElement.getBoundingClientRect()

  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

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
  sol = new THREE.Mesh( planesol, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
  sol.position.set( 0, 0, -50 );
  sol.rotateX( - Math.PI / 2 );
  sol.receiveShadow = true;


  axes = new THREE.AxesHelper( 100 );
  axes.position.set( 0, 0, 0 );

  scene.add( sol );scene.add( axes );scene.add(skybox);
  scene.add(helper);

  var kaplaGostGeo = new THREE.BoxGeometry( this.state.kaplaDimensions[0], this.state.kaplaDimensions[1], this.state.kaplaDimensions[2] );
  var kaplaGostMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00, opacity: 0.5, transparent: true } );
  kaplaGostMesh = new THREE.Mesh( kaplaGostGeo, kaplaGostMaterial );
  kaplaGostMesh.position.set( 0, 0, 75 );
  scene.add( kaplaGostMesh );

  var animate = () => {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
  };
  animate();
  }

  mouseDown = (e) => {
    this.setState({isDragging:true})
  }

  mouseUp = (e) => {
    this.setState({isDragging:false})
  }

  mouseMove = (e) => {
    var deltaMove = {
        x: e.nativeEvent.offsetX-this.state.previousMousePosition.x,
        y: e.nativeEvent.offsetY-this.state.previousMousePosition.y
    };
    if(this.state.isDragging) {
        var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,this.toRadians(deltaMove.x * 1),'XYZ'));
        kaplaGostMesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, kaplaGostMesh.quaternion);
        this.setState({
          previousMousePosition : {x: e.nativeEvent.offsetX,y: e.nativeEvent.offsetY}
        });
        this.props.setRotation(kaplaGostMesh.rotation)
    }

    /*
    let lowestPoint =  kaplaGostMesh.geometry.vertices[0].clone();
    for (var i = 0; i < kaplaGostMesh.geometry.vertices.length; i++) {
      var vector = kaplaGostMesh.geometry.vertices[i].clone();
      if(vector.z<lowestPoint.z){
        lowestPoint = vector
      };
    }
    lowestPoint.applyMatrix4( kaplaGostMesh.matrixWorld );
    kaplaGostMesh.position.z = -Math.abs(lowestPoint.z)
    console.log(lowestPoint.z)
    */
  }

  toRadians = (angle) => {
  	return angle * (Math.PI / 180);
  }

  toDegrees = (angle) => {
  	return angle * (180 / Math.PI);
  }







  render(){

    return(
      <div style={{display:"flex", flexDirection:"column", width:"100%", marginTop:20}}>
        <div onMouseMove={(e) => this.mouseMove(e)} id="canvasControl" style={{width:300, height:300}}>
        </div>
      </div>
    )

    }
  }

  const mapStateToProps = (state) => {
    return {
    }
  }

  const CanvasControl = connect(mapStateToProps, mapDispatchToProps)(CanvasControlComponent);
  export default CanvasControl;
