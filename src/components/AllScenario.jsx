import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import add from './add.png';
import edit from './pencil.png';
import bin from './bin.png';
import './allScena.css';
const AllScenario = () => {
  const [scenarios, setScenarios] = useState([]);
  const navigate = useNavigate();
  const CONTAINER_WIDTH = window.innerWidth-380;
const CONTAINER_HEIGHT = window.innerHeight-300;

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
  const handleAddVehicleMain = () => {
    navigate('/add-vehicle');
  };
  const handleAddScenarioMain =()=>{
    navigate('/scenario/add');
  }
  const handleDeleteAllScenarios = async () => {
    try {
      const response = await axios.get('http://localhost:3001/scenarios');
      const scenarios = response.data;
  
      // Iterate through all scenarios and delete each one
      await Promise.all(scenarios.map(scenario => axios.delete(`http://localhost:3001/scenarios/${scenario.id}`)));
      
      fetchScenarios(); // Refresh the list of scenarios
    } catch (error) {
      console.error('Error deleting all scenarios:', error);
    }
  };
  
  return (
    <div style={{color:"white"}}>
      <h2>Scenarios</h2>
      <div style={{
        display:"flex",
        alignContent:"center",
        justifyContent:"right",
        marginBottom:"10px"
      }}>  
          <button type="button" onClick={handleAddScenarioMain}  className='buttonClass1' style={{backgroundColor:"#4A9ABA",color:"white"}}>New Scenario</button>
          <button type="button" onClick={handleAddVehicleMain} className='buttonClass1' style={{backgroundColor:"#5CB85C",color:"white"}}>Add Vehicle</button>
          <button type="button" onClick={handleDeleteAllScenarios} className='buttonClass1' style={{backgroundColor:"#E37933",color:"white"}}>Delete All</button>
      </div>
      {/* <table  style={{ width: CONTAINER_WIDTH }}>
        <thead className='tableHeader'>
          <tr>
            <th > Scenario ID</th>
            <th>Scenario Name</th>
            <th>Scenario Time</th>
            <th>Number of Vehicles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((scenario) => (
            <tr key={scenario.id}>
              <td >{scenario.id}</td>
              <td className='columnClass'>{scenario.name}</td>
              <td className='columnClass'>{scenario.time}</td>
              <td className='columnClass'>{scenario.vehicles ? scenario.vehicles.length : 0}</td>
              <td className='columnClass'>
              <button onClick={() => handleAddVehicle(scenario.id)}>Add Vehicle</button>
              </td>
              <td className='columnClass'>
                <button onClick={() => handleEditScenario(scenario.id)}>Edit</button>
              </td>
              <td className='columnClass'>
                <button onClick={() => handleDeleteScenario(scenario.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
        <table style={{ width: CONTAINER_WIDTH }}>
  <thead className='tableHeader'>
    <tr>
      <th style={{ backgroundColor: '#333333', color: 'white' }}>Scenario ID</th>
      <th style={{ backgroundColor: '#333333', color: 'white' }}>Scenario Name</th>
      <th style={{ backgroundColor: '#333333', color: 'white' }}>Scenario Time</th>
      <th style={{ backgroundColor: '#333333', color: 'white' }}>Number of Vehicles</th>
      <th style={{ backgroundColor: '#333333', color: 'white' }}>Add Vehicle</th>
      <th style={{ backgroundColor: '#333333', color: 'white' }}>Edit</th>
      <th style={{ backgroundColor: '#333333', color: 'white' }}>Delete</th>
    </tr>
  </thead>
  <tbody>
    {scenarios.map((scenario) => (
      <tr key={scenario.id} style={{ backgroundColor: '#f2f2f2' }}>
        <td style={{ textAlign:'center' ,color:"black"}}>{scenario.id}</td>
        <td style={{color:"black",textAlign:"center"}} className='columnClass'>{scenario.name}</td>
        <td style={{color:"black",textAlign:"center"}} className='columnClass'>{scenario.time}</td>
        <td   style={{color:"black",textAlign:"center"}} className='columnClass'>{scenario.vehicles ? scenario.vehicles.length : 0}</td>
        <td className='columnClass'  style={{color:"black",textAlign:"center"}}>
          <button onClick={() => handleAddVehicle(scenario.id)} style={{ border: 'none', padding: 0, background: 'none' }}>
          <img src={add} alt='add' style={{ height: '20px' }} />
            </button>
        </td>
        <td className='columnClass'  style={{color:"black",textAlign:"center",padding:"2px"}} >
          <button onClick={() => handleEditScenario(scenario.id)} style={{ border: 'none', padding: 0, background: 'none' }} >
          <img src={edit} alt='Edit' style={{ height: '20px' }} />
          </button>
        </td>
        <td className='columnClass'  style={{color:"black",textAlign:"center"}}>
          <button onClick={() => handleDeleteScenario(scenario.id)} style={{ border: 'none', padding: 0, background: 'none' }}>
          <img src={bin} alt='Delete' style={{ height: '20px' }} />
            </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default AllScenario;
