import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AddScenario.css';
import axios from 'axios';

const AddVehicle = () => {
  const location = useLocation();
  const scenarioIdFromState = location.state?.scenarioId || '';
  console.log(scenarioIdFromState);
  const navigate = useNavigate();

  const vehicleToEdit = location.state?.vehicle || null;
  const isEdit = location.state?.isEdit || false;
  const scenarioEditIdFromState = vehicleToEdit ? vehicleToEdit.scenarioId : location.state?.scenarioId || '';
  console.log(scenarioEditIdFromState);
 
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(isEdit ? scenarioEditIdFromState : scenarioIdFromState);

  // const [selectedScenario, setSelectedScenario] = useState(scenarioIdFromState);
  const [errors, setErrors] = useState({});
  

  const [vehicleName, setVehicleName] = useState(vehicleToEdit?.name || '');
const [positionX, setPositionX] = useState(vehicleToEdit?.positionX || '');
const [positionY, setPositionY] = useState(vehicleToEdit?.positionY || '');
const [speed, setSpeed] = useState(vehicleToEdit?.speed || '');
const [direction, setDirection] = useState(vehicleToEdit?.direction || '');

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


const handleDeleteforEdit = async (vehicleId) => {
  try {
    console.log("Starting deletion of vehicle with ID:", vehicleId);

    const response = await fetch('http://localhost:3001/scenarios');
    if (!response.ok) {
      throw new Error('Failed to fetch scenarios');
    }
    const scenarios = await response.json();
    let targetScenario = null;
    let vehicleIndex = -1;

    scenarios.forEach(scenario => {
      const index = scenario.vehicles.findIndex(vehicle => vehicle.id === vehicleId);
      if (index !== -1) {
        targetScenario = scenario;
        console.log(targetScenario);
        vehicleIndex = index;
      }
    });

    if (!targetScenario || vehicleIndex === -1) {
      throw new Error('Vehicle not found');
    }

    const updatedVehicles = targetScenario.vehicles.filter(vehicle => vehicle.id !== vehicleId);
    const updatedScenario = {
      ...targetScenario,
      vehicles: updatedVehicles
    };

    console.log("Updating scenario after deletion:", updatedScenario);

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

    console.log("Deletion task completed successfully");
  } catch (error) {
    console.log('Error:', error);
  }
}
  
const handleAddVehicle = async () => {
  const newErrors = {};
  if (!selectedScenario) {
    newErrors.selectedScenario = 'Scenario is required';
  }
  if (!vehicleName.trim()) {
    newErrors.vehicleName = 'Vehicle name is required';
  }
  if (!positionX.toString().trim()) {
    newErrors.positionX = 'Position X is required';
  }
  if (!positionY.toString().trim()) {
    newErrors.positionY = 'Position Y is required';
  }
  if (!speed.toString().trim()) {
    newErrors.speed = 'Speed is required';
  }
  if (!direction.trim()) {
    newErrors.direction = 'Direction is required';
  }

  if (Object.keys(newErrors).length === 0) {
    try {
      console.log("Beginning of add function");

      // Fetch all scenarios to get all vehicle IDs
      const allScenariosResponse = await axios.get('http://localhost:3001/scenarios');
      const allScenarios = allScenariosResponse.data;

      // Get all existing vehicle IDs across all scenarios
      const allVehicleIds = allScenarios.flatMap(scenario => scenario.vehicles.map(vehicle => vehicle.id));

      let idToAdd;
      if (!isEdit) {
        // Find a unique ID
        idToAdd = allVehicleIds.length > 0 ? Math.max(...allVehicleIds) + 1 : 1;
        while (allVehicleIds.includes(idToAdd)) {
          idToAdd++;
        }
      } else {
        idToAdd = vehicleToEdit.id; // Use the existing ID for editing
      }

      // Fetch the current scenario
      const response = await axios.get(`http://localhost:3001/scenarios/${selectedScenario}`);
      const scenario = response.data;

      if (!scenario.vehicles) {
        scenario.vehicles = [];
      }

      const newVehicle = {
        id: idToAdd,
        name: vehicleName,
        positionX: parseInt(positionX),
        positionY: parseInt(positionY),
        speed: parseInt(speed),
        direction: direction
      };

      if (!isEdit) {
        scenario.vehicles.push(newVehicle); // Add new vehicle
      } else {
        // Update the existing vehicle in the list
        scenario.vehicles = scenario.vehicles.map(vehicle =>
          vehicle.id === idToAdd ? newVehicle : vehicle
        );
      }

      await axios.patch(`http://localhost:3001/scenarios/${selectedScenario}`, {
        vehicles: scenario.vehicles
      });

      console.log("End of add function");
      navigate('/');
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  } else {
    setErrors(newErrors);
  }
};


  const handleAddVehicleonEdit = async () => {
    const newErrors = {};
    if (!selectedScenario) {
      newErrors.selectedScenario = 'Scenario is required';
    }
    if (!vehicleName.trim()) {
      newErrors.vehicleName = 'Vehicle name is required';
    }
    if (!positionX.toString().trim()) {
      newErrors.positionX = 'Position X is required';
    }
    if (!positionY.toString().trim()) {
      newErrors.positionY = 'Position Y is required';
    }
    if (!speed.toString().trim()) {
      newErrors.speed = 'Speed is required';
    }
    if (!direction.trim()) {
      newErrors.direction = 'Direction is required';
    }
  
    if (Object.keys(newErrors).length === 0) {
      try {
        console.log("Beginning of add function");
        const response = await axios.get(`http://localhost:3001/scenarios/${selectedScenario}`);
        const scenario = response.data;
  
        if (!scenario.vehicles) {
          scenario.vehicles = [];
        }
  
        let idToAdd;
        if (!isEdit) {
          idToAdd = scenario.vehicles.length > 0 ? Math.max(...scenario.vehicles.map(vehicle => vehicle.id)) + 1 : 1;
        } else {
          idToAdd = vehicleToEdit.id; // Use the existing ID for editing
        }
  
        const newVehicle = {
          id: idToAdd,
          name: vehicleName,
          positionX: parseInt(positionX),
          positionY: parseInt(positionY),
          speed: parseInt(speed),
          direction: direction
        };
  
        const updatedVehicles = [...scenario.vehicles, newVehicle]; // Use spread operator to add new vehicle
  
        scenario.vehicles = updatedVehicles;
  
        await axios.patch(`http://localhost:3001/scenarios/${selectedScenario}`, {
          vehicles: scenario.vehicles
        });
  
        console.log("End of add function");
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
    navigate(-1); 
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
              <select id="selectedScenario" value={selectedScenario} onChange={(e) => setSelectedScenario(e.target.value)} disabled={isEdit}>
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
          {/* <button type="button" className='btn btn-success' onClick={handleAddVehicle}>{isEdit ? 'Update' : 'Add'}</button> */}
          <button
  type="button"
  className="btn btn-success"
  onClick={() => (!isEdit ? handleAddVehicleonEdit() : handleAddVehicle())}
>
  {isEdit ? 'Update' : 'Add'}
</button>

          <button type="button" onClick={handleReset}>Reset</button>
          <button type="button" onClick={handleGoBack}>Go Back</button>
        </div>
      </form>
    </div>
  );
};

export default AddVehicle;
