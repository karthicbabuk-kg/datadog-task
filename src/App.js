// App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css'; 

function App() {
  const [monitors, setMonitors] = useState([]);
  const [formData, setFormData] = useState({
    message: '',
    name: '',
    query: '',
    type: ''
  });

  useEffect(() => {
    fetchMonitors();
  }, []);

  const fetchMonitors = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_DATADOG_API_URL}/monitors`);
      setMonitors(response.data.monitors);
    } catch (error) {
      console.error('Error fetching monitors:', error);
    }
  };

  const createMonitor = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.post(`${process.env.REACT_APP_DATADOG_API_URL}/monitors`, formData);
      setMonitors([...monitors, response.data]);
      // Clear form fields after successful submission
      setFormData({
        message: '',
        name: '',
        query: '',
        type: ''
      });
    } catch (error) {
      console.error('Error creating monitor:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Message</th>
            <th>Query</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {monitors.map(monitor => (
            <tr key={monitor.id}>
              <td>{monitor.name}</td>
              <td>{monitor.message}</td>
              <td>{monitor.query}</td>
              <td>{monitor.type}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={createMonitor}>Create New Monitor</button>

      <form onSubmit={createMonitor}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} />
        <input type="text" name="message" placeholder="Message" value={formData.message} onChange={handleInputChange} />
        <input type="text" name="query" placeholder="Query" value={formData.query} onChange={handleInputChange} />
        <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
