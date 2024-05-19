import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import AddScenario from './components/AddScenario';
import AllScenarios from './components/AllScenario';
import AddVehicle from './components/AddVehicle';
import Simulation from './components/Simulation';
import './App.css'; // Import the App CSS

const App = () => {
  return (
    <Router>
      <div className="app" style={{backgroundColor:"black"}}>
         <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Simulation />} />
            <Route path="/scenario/add" element={<AddScenario />} />
            <Route path="/all-scenarios" element={<AllScenarios />} />
            <Route path="/add-vehicle" element={<AddVehicle />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
