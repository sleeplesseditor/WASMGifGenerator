import React from 'react';
import Header from './components/Header';
import GIFConversion from './components/GIFConversion';
import './App.css';

function App() {
  
  return (
    <div className="App">
      <Header title="MP4 To GIF Convertor" />
      <GIFConversion />
    </div>
  );
}

export default App;
