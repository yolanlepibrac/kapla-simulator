import React, { Component } from 'react';
//import { changeAccountState } from "../redux/actions/index";
import { connect } from "react-redux";
import { bounceInDown } from 'react-animations';
import styled, { keyframes } from 'styled-components';
import CanvasControl from './CanvasControl';


var pickRotation

function mapDispatchToProps(dispatch) {
  return {
  };
};

class ControlsComponent extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      position:0,
      rotation:0,
      point:0,
      offsetX:0,
      offsetY:0,
     }
  }

  componentDidMount = async () => {
    pickRotation = document.getElementById("pickRotation")
  }

  kaplaDebout = () => {
    this.setState({position:0})
    this.setPositionKapla(0,this.state.offsetX,this.state.offsetY, this.state.position);
  }

  kaplaTranche = () => {
    this.setState({position:1});
    this.setPositionKapla(1,this.state.offsetX,this.state.offsetY, this.state.position);
  }

  kaplaPlat = () => {
    this.setState({position:2});
    this.setPositionKapla(2,this.state.offsetX,this.state.offsetY, this.state.position);
  }

  setPositionKapla = (position, offsetX, offsetY, rotation) => {
    if(position === 0){
      this.props.setKaplaDimension([10,30,150],[offsetX,offsetY,150/2], rotation)
    }else if(position === 1){
      this.props.setKaplaDimension([10,150,30],[offsetX,offsetY,30/2], rotation);
    }else if(position === 2){
      this.props.setKaplaDimension([30,150,10],[offsetX,offsetY,10/2], rotation);
    }
  }

  point0 = () => {
    let offsetX = this.state.position===0?-5:this.state.position===1?-5:-15;
    let offsetY = this.state.position===0?-15:this.state.position===1?-75:-75;
    this.setState({
      point:0,
      offsetX:offsetX,
      offsetY:offsetY,
    })
    this.setPositionKapla(this.state.position,offsetX,offsetY,this.state.rotation);
  }

  point1 = () => {
    let offsetX = this.state.position===0?-5:this.state.position===1?-5:-15;
    let offsetY = 0;
    this.setState({
      point:1,
      offsetX:offsetX,
      offsetY:offsetY,
    })
    this.setPositionKapla(this.state.position,offsetX,offsetY,this.state.rotation);
  }

  point2 = () => {
    let offsetX = this.state.position===0?-5:this.state.position===1?-5:-15;
    let offsetY = this.state.position===0?15:this.state.position===1?75:75;
    this.setState({
      point:2,
      offsetX:offsetX,
      offsetY:offsetY,
    })
    this.setPositionKapla(this.state.position,offsetX,offsetY,this.state.rotation);
  }

  point3 = () => {
    let offsetX = 0;
    let offsetY = this.state.position===0?-15:this.state.position===1?-75:-75;
    this.setState({
      point:3,
      offsetX:offsetX,
      offsetY:offsetY,
    })
    this.setPositionKapla(this.state.position,offsetX,offsetY,this.state.rotation);
  }

  point4 = () => {
    let offsetX = 0;
    let offsetY = 0;
    this.setState({
      point:4,
      offsetX:offsetX,
      offsetY:offsetY,
    })
    this.setPositionKapla(this.state.position,offsetX,offsetY,this.state.rotation);
  }

  point5 = () => {
    let offsetX = 0;
    let offsetY = this.state.position===0?15:this.state.position===1?75:75;
    this.setState({
      point:5,
      offsetX:offsetX,
      offsetY:offsetY,
    })
    this.setPositionKapla(this.state.position,offsetX,offsetY,this.state.rotation);
  }

  point6 = () => {
    let offsetX = this.state.position===0?5:this.state.position===1?5:15;
    let offsetY = this.state.position===0?-15:this.state.position===1?-75:-75;
    this.setState({
      point:6,
      offsetX:offsetX,
      offsetY:offsetY,
    })
    this.setPositionKapla(this.state.position,offsetX,offsetY,this.state.rotation);
  }

  point7 = () => {
    let offsetX = this.state.position===0?5:this.state.position===1?5:15;
    let offsetY = 0;
    this.setState({
      point:7,
      offsetX:offsetX,
      offsetY:offsetY,
    })
    this.setPositionKapla(this.state.position,offsetX,offsetY,this.state.rotation);
  }

  point8 = () => {
    let offsetX = this.state.position===0?5:this.state.position===1?5:15;
    let offsetY = this.state.position===0?15:this.state.position===1?75:75;
    this.setState({
      point:8,
      offsetX:offsetX,
      offsetY:offsetY,
    })
    this.setPositionKapla(this.state.position,offsetX,offsetY,this.state.rotation);
  }


  setRotation = (rotation) => {
    this.setPositionKapla(this.state.position,this.state.offsetX,this.state.offsetY,rotation.z);
  }




  render(){

    return(
      <div style={{display:"flex", flexDirection:"column", width:"100%", marginTop:20}}>
        <div style={{height:"100%", width:"100%", display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
          <div onClick={this.kaplaDebout} style={{width:"30%", height:50, backgroundColor:this.state.position===0?"rgba(0,255,120,1)":"rgba(255,0,120,1)"}}>Debout</div>
          <div onClick={this.kaplaTranche} style={{width:"30%", height:50, backgroundColor:this.state.position===1?"rgba(0,255,120,1)":"rgba(255,0,120,1)"}}>Tranche</div>
          <div onClick={this.kaplaPlat} style={{width:"30%", height:50, backgroundColor:this.state.position===2?"rgba(0,255,120,1)":"rgba(255,0,120,1)"}}>Couché</div>
        </div>
        <CanvasControl setRotation={this.setRotation} position={this.state.position}/>
        <div>Point d'insertion
          <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
            <div onClick={this.point0}>0</div>
            <div onClick={this.point1}>1</div>
            <div onClick={this.point2}>2</div>
          </div>
          <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
            <div onClick={this.point3}>3</div>
            <div onClick={this.point4}>4</div>
            <div onClick={this.point5}>5</div>
          </div>
          <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
            <div onClick={this.point6}>6</div>
            <div onClick={this.point7}>7</div>
            <div onClick={this.point8}>8</div>
          </div>
        </div>
      </div>
    )

    }
  }

  const mapStateToProps = (state) => {
    return {
    }
  }

  const Controls = connect(mapStateToProps, mapDispatchToProps)(ControlsComponent);
  export default Controls;
