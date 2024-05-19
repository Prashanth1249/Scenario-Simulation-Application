import React, { useState, useEffect, useDebugValue } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Simulation.css';
import eidt from './pencil.png';
import bin from './bin.png';

const SIMULATION_INTERVAL = 200; // 1 second
const GRID_SIZE = 50;
const CONTAINER_WIDTH = window.innerWidth-380;
const CONTAINER_HEIGHT = window.innerHeight-300;


const TIME_DECREAMENT=0.25;
const Simulation = () => {
  const navigate = useNavigate();
  const [originalVehicles, setOriginalVehicles] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false); // State to control simulation

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await fetch('http://localhost:3001/scenarios');
        if (!response.ok) {
          throw new Error('Failed to fetch vehicle data');
        }
      
        const data = await response.json();
        const allVehicles = data.flatMap(scenario =>
          scenario.vehicles.map(vehicle => ({
            ...vehicle,
            time: parseInt(scenario.time),
            color: getRandomColor(),
            scenarioId: scenario.id
          }))
        );
        setVehicles(allVehicles);
        setOriginalVehicles(JSON.parse(JSON.stringify(allVehicles))); // Save original positions
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
      }
    };

    fetchVehicleData();

    return () => clearInterval();
  }, []);
  useEffect(() => {
    let simulationInterval;

    if (isSimulationRunning && vehicles.length > 0) {
      simulationInterval = setInterval(() => {
        const updatedVehicles = vehicles.map(vehicle => {
          if (vehicle.time > 0) {
            let newX = vehicle.positionX;
            let newY = vehicle.positionY;

            switch (vehicle.direction) {
              case 'Towards':
                newX += vehicle.speed;
                break;
              case 'Backwards':
                newX -= vehicle.speed;
                break;
              case 'Upwards':
                newY -= vehicle.speed;
                break;
              case 'Downwards':
                newY += vehicle.speed;
                break;
              default:
                break;
            }

            if (newX >= 0 && newX <= CONTAINER_WIDTH && newY >= 0 && newY <= CONTAINER_HEIGHT) {
              return {
                ...vehicle,
                positionX: newX,
                positionY: newY,
                hidden: false,
                time: vehicle.time - 0.25,
              };
            } else {
              return {
                ...vehicle,
                hidden: true,
              };
            }
          } else {
            return {
              ...vehicle,
              hidden: true,
            };
          }
        });
        setVehicles(updatedVehicles);

        // Check if all vehicles' time has completed or all are hidden
        const allTimeCompletedOrHidden = updatedVehicles.every(vehicle => vehicle.time === 0 || vehicle.hidden);
        if (allTimeCompletedOrHidden) {
          setIsSimulationRunning(false);
        }
      }, SIMULATION_INTERVAL);
    }

    return () => clearInterval(simulationInterval);
  }, [isSimulationRunning, vehicles]);

  const startSimulation = () => {
    // Reset vehicles to their original positions
    setVehicles(JSON.parse(JSON.stringify(originalVehicles)));
    setIsSimulationRunning(true);
  };

  const stopSimulation = () => {
    setIsSimulationRunning(false);
  };

  const renderGrid = () => {
    
    const rows = Math.floor(CONTAINER_HEIGHT / GRID_SIZE);
    const cols = Math.floor(CONTAINER_WIDTH / GRID_SIZE);

    const grids = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grids.push(
          <div
            key={`${i}-${j}`}
            style={{
              width: GRID_SIZE,
              height: GRID_SIZE,
              border: '1px solid white',
              boxSizing: 'border-box',
              position: 'absolute',
              left: j * GRID_SIZE,
              top: i * GRID_SIZE,
            }}
          ></div>
        );
      }
    }

    return grids;
  };

  const handleEdit = (vehicle) => {
    navigate('/add-vehicle', {
      state: { vehicle, isEdit: true }
    });
  };

  const handleDelete = async (vehicleId) => {
    try {
      console.log("p");
      console.log(vehicleId);
      console.log("q");
      // Fetch the scenarios from the database
      const response = await fetch('http://localhost:3001/scenarios');
      if (!response.ok) {
        throw new Error('Failed to fetch scenarios');
      }
      const scenarios = await response.json();
      
      // Find the scenario that contains the vehicle
      let targetScenario = null;
      let vehicleIndex = -1;
      console.log(vehicleId+"hi");
      scenarios.forEach(scenario => {
        const index = scenario.vehicles.findIndex(vehicle => vehicle.id === vehicleId);
        if (index !== -1) {
          targetScenario = scenario;
          vehicleIndex = index;
        }
      });
  
      if (!targetScenario || vehicleIndex === -1) {
        throw new Error('Vehicle not found');
      }
  
      // Remove the vehicle from the scenario
      const updatedVehicles = targetScenario.vehicles.filter(vehicle => vehicle.id !== vehicleId);
      const updatedScenario = {
        ...targetScenario,
        vehicles: updatedVehicles
      };
  
      // Send the updated scenario back to the database
      const updateResponse = await fetch(`http://localhost:3001/scenarios/${targetScenario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedScenario),
      });
  
      if (!updateResponse.ok) {
        throw new Error('Failed to update scenario');
      }
  
   
      const updatedLocalVehicles = vehicles.filter(vehicle => vehicle.id !== vehicleId);
      setVehicles(updatedLocalVehicles);
      setOriginalVehicles(updatedLocalVehicles);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };
  
  

  return (
    <div style={{color:"white"}}>
    <div id='firstContainer'>
      <p>Scenario</p>
    <select id="direction">
      <option value="test-scenario">Test Scenario</option>
      <option value="my-scenario">My Scenario</option>
    </select>
    </div>
    <table className='tableContainer' style={{ width: CONTAINER_WIDTH }}>
        <thead className='tableHeader'>
          <tr>
            <th className='headerItem'> Vehicle ID</th>
            <th>Vehicle Name</th>
            <th>Position X</th>
            <th>Position Y</th>
            <th>Speed</th>
            <th>Direction</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {originalVehicles.map(vehicle => (
            <tr key={`${vehicle.id}-${vehicle.scenarioId}`}>
              <td>{vehicle.id}</td>
              <td>{vehicle.name}</td>
              <td>{vehicle.positionX}</td>
              <td>{vehicle.positionY}</td>
              <td>{vehicle.speed}</td>
              <td>{vehicle.direction}</td>
              <td>
              <button onClick={() => handleEdit(vehicle)} style={{ border: 'none', padding: 0, background: 'none' }}>
                <img src={eidt} alt='Edit' style={{ height: '20px' }} />
              </button>
              </td>
              <td>
                <button onClick={() => handleDelete(vehicle.id)} style={{ border: 'none', padding: 0, background: 'none' }}>
                <img src={bin} alt='Delete' style={{ height: '20px' }} />
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='simulationButtons' style={{width:CONTAINER_WIDTH}}>
        <button onClick={startSimulation} disabled={isSimulationRunning}  
        style={{ backgroundColor: isSimulationRunning ? '#CCCCCC' : '#5CB85C', color: isSimulationRunning ? '#999999' : 'white' }}>
          Start Simulation
        </button>
        <button onClick={stopSimulation} 
        style={{ backgroundColor: !isSimulationRunning ? '#CCCCCC' : '#4A9ABA', color: !isSimulationRunning ? '#999999' : 'white',marginRight:"0px" }} >
          Stop Simulation
        </button>
      </div>


      <div className='additionalContent' style={{ position: 'relative', width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT, border: '1px solid black' }}>
        {renderGrid()}
        {vehicles.map(vehicle => (
          <div
            key={`${vehicle.id}-${vehicle.scenarioId}`}
            style={{
              position: 'absolute',
              left: vehicle.positionX - 2,
              top: vehicle.positionY - 2,
              display: vehicle.hidden ? 'none' : 'block',
            }}
          >
            <div
              style={{
                width: '7mm',
                height: '7mm',
                borderRadius: '50%',
                fontSize: '14px',
                background: vehicle.color,
                border: '0.5mm solid black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {vehicle.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Simulation;
