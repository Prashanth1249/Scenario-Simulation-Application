import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // Import the Sidebar CSS

const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavLink to="/" end activeClassName="active">
        Home
      </NavLink>
      <NavLink to="/scenario/add" activeClassName="active">
        Add Scenario
      </NavLink>
      <NavLink to="/all-scenarios" activeClassName="active">
        All Scenarios
      </NavLink>
      <NavLink to="/add-vehicle" activeClassName="active">
        Add Vehicle
      </NavLink>
    </div>
  );
};

export default Sidebar;
