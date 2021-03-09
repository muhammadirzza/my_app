import React from 'react';
import './App.css';
import Headers from './components/Header';
import Home from './pages/Home';
import GeojsontoGeohash from './pages/GeojsontoGeohash'
import { Switch, Route } from 'react-router-dom'

function App() {
  
  return (
    <div>
      <Headers />
      <Switch>
        <Route path="/" exact component = {Home} />
        <Route path="/jsontohash" exact component = {GeojsontoGeohash} />
      </Switch>
    </div>
  );
}

export default App;
