import React from 'react';
import logo from './logo.svg';
import './App.css';
import AppContainer from './components/AppContainer'
import { createStore } from 'redux';
import { connect } from "react-redux";

function App() {
  return (
    <div className="App">
      <header className="App-header" style={{height:30}}>
        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
          <h2 style={{fontSize:15, marginRight:20}}>{"KAPLA SIMULATOR"}</h2>
          <h2 style={{fontSize:10}}>{"by Yolan Pibrac"}</h2>
        </div>
      </header>
      <AppContainer/>
    </div>
  );
}

export default App;
