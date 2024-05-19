// import React, { Fragment, useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './AddScenario.css';
// import axios from 'axios';

// const AddVehicle = () => {
//   const location = useLocation();
//   const scenarioIdFromState = location.state?.scenarioId || '';
//   const navigate = useNavigate();

//   const [scenarios, setScenarios] = useState([]);
//   // const [selectedScenario, setSelectedScenario] = useState('');
//   const [selectedScenario, setSelectedScenario] = useState(scenarioIdFromState);
//   const [vehicleName, setVehicleName] = useState('');
//   const [positionX, setPositionX] = useState('');
//   const [positionY, setPositionY] = useState('');
//   const [speed, setSpeed] = useState('');
//   const [direction, setDirection] = useState('');
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     fetchScenarios();
//   }, []);

//   const fetchScenarios = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/scenarios');
//       setScenarios(response.data);
//       console.log(response.data);
//     } catch (error) {
//       console.error('Error fetching scenarios:', error);
//     }
//   };

//   const handleAddVehicle = async () => {
//     const newErrors = {};
//     if (!selectedScenario) {
//       newErrors.selectedScenario = 'Scenario is required';
//     }
//     if (!vehicleName.trim()) {
//       newErrors.vehicleName = 'Vehicle name is required';
//     }
//     if (!positionX.trim()) {
//       newErrors.positionX = 'Position X is required';
//     }
//     if (!positionY.trim()) {
//       newErrors.positionY = 'Position Y is required';
//     }
//     if (!speed.trim()) {
//       newErrors.speed = 'Speed is required';
//     }
//     if (!direction.trim()) {
//       newErrors.direction = 'Direction is required';
//     }

//     if (Object.keys(newErrors).length === 0) {
//       try {
//         // Fetch the selected scenario
//         const response = await axios.get(`http://localhost:3001/scenarios/${selectedScenario}`);
//         const scenario = response.data;
//         console.log(scenario);
//         // Create a new vehicle object
//         const newVehicle = {
//           id: scenario.vehicles.length > 0 ? Math.max(...scenario.vehicles.map(vehicle => vehicle.id)) + 1 : 1,
//           name: vehicleName,
//           positionX: parseInt(positionX),
//           positionY: parseInt(positionY),
//           speed: parseInt(speed),
//           direction: direction
//         };

//         // Add the new vehicle to the scenario's vehicles array
//         scenario.vehicles.push(newVehicle);

//         // Update the scenario with the new vehicle
//         await axios.put(`http://localhost:3001/scenarios/${selectedScenario}`, scenario);

//         // Navigate to another page after adding vehicle
//         navigate('/');
//       } catch (error) {
//         console.error('Error adding vehicle:', error);
//       }
//     } else {
//       setErrors(newErrors);
//     }
//   };
//   const handleReset = () => {
//     setSelectedScenario('');
//     setVehicleName('');
//     setPositionX('');
//     setPositionY('');
//     setSpeed('');
//     setDirection('');
//     setErrors({});
//   };

//   const handleGoBack = () => {
//     navigate(-1); // Go back to previous page
//   };

//   return (
//     <div >
//       <h2 style={{ color: 'white' }}>{location.pathname}</h2>
//       <h3 style={{ color: 'white' }}>Add Vehicle</h3>
//       <form >
//       <div className='formContainer'>
//       <div className='item'>
//         <div className='singleElement'>
//             <label htmlFor="selectedScenario">Scenario</label>
//             <select id="selectedScenario" value={selectedScenario} onChange={(e) => setSelectedScenario(e.target.value)}>
//               <option value="">Select Scenario</option>
//               {scenarios.map(scenario => (
//                 <option key={scenario.id} value={scenario.id}>{scenario.id}</option>
//               ))}
//             </select>
//             {errors.selectedScenario && <div style={{ color: 'red', border: '2px solid red' }}>{errors.selectedScenario}</div>}
//           </div>
//           <div className='singleElement'>
//             <label htmlFor="positionX">Position X</label>
//             <input
//               type="number"
//               id="positionX"
//               value={positionX}
//               onChange={(e) => setPositionX(e.target.value)}
//             />
//             {errors.positionX && <div style={{ color: 'red', border: '2px solid red' }}>{errors.positionX}</div>}
//           </div>
//         </div>

//           <div className='item'>
//           <div className='singleElement'>
//             <label htmlFor="vehicleName">Vehicle Name</label>
//             <input
//               type="text"
//               id="vehicleName"
//               value={vehicleName}
//               onChange={(e) => setVehicleName(e.target.value)}
//             />
//             {errors.vehicleName && <div style={{ color: 'red', border: '2px solid red' }}>{errors.vehicleName}</div>}
//           </div>
//           <div className='singleElement'>
//             <label htmlFor="positionY">Position Y</label>
//             <input
//               type="number"
//               id="positionY"
//               value={positionY}
//               onChange={(e) => setPositionY(e.target.value)}
//             />
//             {errors.positionY && <div style={{ color: 'red', border: '2px solid red' }}>{errors.positionY}</div>}
//           </div>
//         </div>
//         <div className='item'>
//           <div className='singleElement'>
//             <label htmlFor="speed">Speed</label>
//             <input
//               type="number"
//               id="speed"
//               value={speed}
//               onChange={(e) => setSpeed(e.target.value)}
//             />
//             {errors.speed && <div style={{ color: 'red', border: '2px solid red' }}>{errors.speed}</div>}
//           </div>
//           <div className='singleElement'>
//             <label htmlFor="direction">Direction</label>
//             <select id="direction" value={direction} onChange={(e) => setDirection(e.target.value)}>
//               <option value="">Select Direction</option>
//               <option value="Towards">Towards</option>
//               <option value="Backwards">Backwards</option>
//               <option value="Upwards">Upwards</option>
//               <option value="Downwards">Downwards</option>
//             </select>
//             {errors.direction && <div style={{ color: 'red', border: '2px solid red' }}>{errors.direction}</div>}
//           </div>
//         </div>
//         </div>
//         <div className='buttonContainer'>
//           <button type="button" className='btn btn-success' onClick={handleAddVehicle}>Add</button>
//           <button type="button" onClick={handleReset}>Reset</button>
//           <button type="button" onClick={handleGoBack}>Go Back</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddVehicle;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AddScenario.css';
import axios from 'axios';

const AddVehicle = () => {
  const location = useLocation();
  const scenarioIdFromState = location.state?.scenarioId || '';
  console.log(scenarioIdFromState);
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(scenarioIdFromState);
  const [vehicleName, setVehicleName] = useState('');
  const [positionX, setPositionX] = useState('');
  const [positionY, setPositionY] = useState('');
  const [speed, setSpeed] = useState('');
  const [direction, setDirection] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const response = await axios.get('http://localhost:3001/scenarios');
      setScenarios(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
    }
  };

  const handleAddVehicle = async () => {
    const newErrors = {};
    if (!selectedScenario) {
      newErrors.selectedScenario = 'Scenario is required';
    }
    if (!vehicleName.trim()) {
      newErrors.vehicleName = 'Vehicle name is required';
    }
    if (!positionX.trim()) {
      newErrors.positionX = 'Position X is required';
    }
    if (!positionY.trim()) {
      newErrors.positionY = 'Position Y is required';
    }
    if (!speed.trim()) {
      newErrors.speed = 'Speed is required';
    }
    if (!direction.trim()) {
      newErrors.direction = 'Direction is required';
    }

    if (Object.keys(newErrors).length === 0) {
      try {
        // Fetch the selected scenario
        const response = await axios.get(`http://localhost:3001/scenarios/${selectedScenario}`);
        const scenario = response.data;
        
        // Ensure vehicles property is initialized as an array if undefined
        if (!scenario.vehicles) {
          scenario.vehicles = [];
        }

        // Create a new vehicle object
        const newVehicle = {
          id: scenario.vehicles.length > 0 ? Math.max(...scenario.vehicles.map(vehicle => vehicle.id)) + 1 : 1,
          name: vehicleName,
          positionX: parseInt(positionX),
          positionY: parseInt(positionY),
          speed: parseInt(speed),
          direction: direction
        };

        // Add the new vehicle to the scenario's vehicles array
        scenario.vehicles.push(newVehicle);

        // Update the scenario with the new vehicle
        await axios.put(`http://localhost:3001/scenarios/${selectedScenario}`, scenario);

        // Navigate to another page after adding vehicle
        navigate('/');
      } catch (error) {
        console.error('Error adding vehicle:', error);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleReset = () => {
    if(!scenarioIdFromState)
        setSelectedScenario('');
    setVehicleName('');
    setPositionX('');
    setPositionY('');
    setSpeed('');
    setDirection('');
    setErrors({});
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div>
      <h2 style={{ color: 'white' }}>{location.pathname}</h2>
      <h3 style={{ color: 'white' }}>Add Vehicle</h3>
      <form>
        <div className='formContainer'>
          <div className='item'>
            <div className='singleElement'>
              <label htmlFor="selectedScenario">Scenario</label>
              <select id="selectedScenario" value={selectedScenario} onChange={(e) => setSelectedScenario(e.target.value)}>
                <option value="">Select Scenario</option>
                {scenarios.map(scenario => (
                  <option key={scenario.id} value={scenario.id}>{scenario.name}</option>
                ))}
              </select>
              {errors.selectedScenario && <div style={{ color: 'red', border: '2px solid red' }}>{errors.selectedScenario}</div>}
            </div>
            <div className='singleElement'>
              <label htmlFor="positionX">Position X</label>
              <input
                type="number"
                id="positionX"
                value={positionX}
                onChange={(e) => setPositionX(e.target.value)}
              />
              {errors.positionX && <div style={{ color: 'red', border: '2px solid red' }}>{errors.positionX}</div>}
            </div>
          </div>

          <div className='item'>
            <div className='singleElement'>
              <label htmlFor="vehicleName">Vehicle Name</label>
              <input
                type="text"
                id="vehicleName"
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
              />
              {errors.vehicleName && <div style={{ color: 'red', border: '2px solid red' }}>{errors.vehicleName}</div>}
            </div>
            <div className='singleElement'>
              <label htmlFor="positionY">Position Y</label>
              <input
                type="number"
                id="positionY"
                value={positionY}
                onChange={(e) => setPositionY(e.target.value)}
              />
              {errors.positionY && <div style={{ color: 'red', border: '2px solid red' }}>{errors.positionY}</div>}
            </div>
          </div>
          <div className='item'>
            <div className='singleElement'>
              <label htmlFor="speed">Speed</label>
              <input
                type="number"
                id="speed"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
              />
              {errors.speed && <div style={{ color: 'red', border: '2px solid red' }}>{errors.speed}</div>}
            </div>
            <div className='singleElement'>
              <label htmlFor="direction">Direction</label>
              <select id="direction" value={direction} onChange={(e) => setDirection(e.target.value)}>
                <option value="">Select Direction</option>
                <option value="Towards">Towards</option>
                <option value="Backwards">Backwards</option>
                <option value="Upwards">Upwards</option>
                <option value="Downwards">Downwards</option>
              </select>
              {errors.direction && <div style={{ color: 'red', border: '2px solid red' }}>{errors.direction}</div>}
            </div>
          </div>
        </div>
        <div className='buttonContainer'>
          <button type="button" className='btn btn-success' onClick={handleAddVehicle}>Add</button>
          <button type="button" onClick={handleReset}>Reset</button>
          <button type="button" onClick={handleGoBack}>Go Back</button>
        </div>
      </form>
    </div>
  );
};

export default AddVehicle;
