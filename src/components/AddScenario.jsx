import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AddScenario.css';
import axios from 'axios';

const AddScenario = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.state?.isEditMode || false;
  const scenarioToEdit = location.state?.scenario || {};
  console.log(location.state);
  const [id, setId] = useState(scenarioToEdit.scenario || '');
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioTime, setScenarioTime] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      setId(scenarioToEdit.id);
      setScenarioName(scenarioToEdit.name);
      setScenarioTime(scenarioToEdit.time);
    }
  }, [isEditMode, scenarioToEdit]);

  const handleSaveScenario = async () => {
    const newErrors = {};
    if (!scenarioName.trim()) {
      newErrors.scenarioName = 'Scenario name is required';
    }
    if (!scenarioTime.trim()) {
      newErrors.scenarioTime = 'Scenario time is required';
    }
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.get('http://localhost:3001/scenarios');
        const scenarios = response.data;
        
        if (!isEditMode) {
          // For adding a new scenario
          const scenarios = response.data;
          // Filter out scenarios with invalid IDs and parse valid IDs as integers
          const validIds = scenarios
            .map(scenario => parseInt(scenario.id))
            .filter(id => !isNaN(id));
          const newId = validIds.length > 0 ? Math.max(...validIds) + 1: 1;

          await axios.post('http://localhost:3001/scenarios', {
            id: newId.toString(),
            name: scenarioName,
            time: scenarioTime,
            vehicles: []  
          });
        } else {
          const response = await axios.get(`http://localhost:3001/scenarios/${scenarioToEdit}`);
          const existingScenario = response.data;
          console.log(existingScenario);
          // Update the scenario with the new data while preserving vehicles
          await axios.put(`http://localhost:3001/scenarios/${scenarioToEdit}`, {
            ...existingScenario,  // Preserve existing vehicles and other data
            name: scenarioName,
            time: scenarioTime,
          });
      

        }

        navigate('/');
      } catch (error) {
        console.error('Error saving scenario:', error);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleReset = () => {
    if (isEditMode) {
      console.log(isEditMode);
      setScenarioName(scenarioToEdit.name);
      setScenarioTime(scenarioToEdit.time);
    } else {
      setScenarioName('');
      setScenarioTime('');
      setId('');
    }
    setErrors({});
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleScenarioNameChange = (e) => {
    const value = e.target.value;
    setScenarioName(value);
  };

  const handleScenarioTimeChange = (e) => {
    const value = e.target.value;
    setScenarioTime(value);
  };

  return (
    <div>
      <h2 style={{ color: 'white' }}>{isEditMode ? 'Edit Scenario' : 'Add Scenario'}</h2>
      <form>
        <div className='formContainer'>
          <div className='singleElement'>
            <label htmlFor="scenarioName">Scenario Name</label>
            <input
              type="text"
              id="scenarioName"
              value={scenarioName}
              onChange={handleScenarioNameChange}
            />
            {errors.scenarioName && <div style={{ color: 'red', border: '2px solid red' }}>{errors.scenarioName}</div>}
          </div>
          <div className='singleElement'>
            <label htmlFor="scenarioTime">Scenario Time (seconds)</label>
            <input
              type="number"
              id="scenarioTime"
              value={scenarioTime}
              onChange={handleScenarioTimeChange}
            />
            {errors.scenarioTime && <div style={{ color: 'red' }}>{errors.scenarioTime}</div>}
          </div>
        </div>
        <div className='buttonContainer'>
          <button type="button" className='btn btn-success' onClick={handleSaveScenario}>
            {isEditMode ? 'Update' : 'Add'}
          </button>
          <button type="button" onClick={handleReset}>Reset</button>
          <button type="button" onClick={handleGoBack}>Go Back</button>
        </div>
      </form>
    </div>
  );
};

export default AddScenario;
