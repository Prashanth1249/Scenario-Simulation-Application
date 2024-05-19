import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const AllScenario = () => {
  const [scenarios, setScenarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const response = await axios.get('http://localhost:3001/scenarios');
      setScenarios(response.data);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
    }
  };

  const handleDeleteScenario = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/scenarios/${id}`);
      fetchScenarios();
    } catch (error) {
      console.error('Error deleting scenario:', error);
    }
  };

  const handleAddVehicle = (id) => {
    navigate('/add-vehicle', { state: { scenarioId: id } });
  };

  const handleEditScenario = (scenario) => {
    navigate(`/scenario/add`, { state: { isEditMode: true, scenario } });
  };

  return (
    <div style={{color:"white"}}>
      <h2>Scenarios</h2>
      <table>
        <thead>
          <tr>
            <th>Scenario ID</th>
            <th>Scenario Name</th>
            <th>Scenario Time</th>
            <th>Number of Vehicles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((scenario) => (
            <tr key={scenario.id}>
              <td>{scenario.id}</td>
              <td>{scenario.name}</td>
              <td>{scenario.time}</td>
              <td>{scenario.vehicles ? scenario.vehicles.length : 0}</td>
              <td>
              <button onClick={() => handleAddVehicle(scenario.id)}>Add Vehicle</button>
              </td>
              <td>
                <button onClick={() => handleEditScenario(scenario.id)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDeleteScenario(scenario.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllScenario;
