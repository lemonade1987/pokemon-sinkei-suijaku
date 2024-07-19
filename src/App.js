import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js';
import Play from './pages/Play.js'

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} /> 
      </Routes>
    </div>
  );
}

export default App;
