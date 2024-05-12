import React, { useState, useEffect } from 'react';
import "./App.css"
const apiKey = '#######'; // Replace with your Datadog API key

const App = () => {
  // State to hold monitor data fetched from Datadog API
  const [monitors, setMonitors] = useState([]);

  // State to manage form inputs
  const [formData, setFormData] = useState({
    message: '',
    name: '',
    query: '',
    type: ''
  });

  // Fetch monitors from Datadog API on component mount
  useEffect(() => {
    fetchMonitors();
  }, []);

  // Function to fetch monitors from Datadog API
  const fetchMonitors = async () => {
    try {
      const response = await fetch('https://api.datadoghq.com/api/v1/monitor', {
        headers: {
          'Content-Type': 'application/json',
          // Use directly embedded API key
          'Authorization': `API_KEY ${apiKey}`
        }
      });
      const data = await response.json();
      setMonitors(data.monitors);
    } catch (error) {
      console.error('Error fetching monitors:', error);
    }
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://api.datadoghq.com/api/v1/monitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Use directly embedded API key
          'Authorization': `API_KEY ${apiKey}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setMonitors([...monitors, data]); // Append newly created monitor
    } catch (error) {
      console.error('Error creating monitor:', error);
    }
  };

  return (
    <div>
      <h1>Datadog Monitor Integration</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Message</th>
            <th>Type</th>
            <th>Query</th>
          </tr>
        </thead>
        <tbody>
          {monitors.map(monitor => (
            <tr key={monitor.id}>
              <td>{monitor.name}</td>
              <td>{monitor.message}</td>
              <td>{monitor.type}</td>
              <td>{monitor.query}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setFormData({ message: '', name: '', query: '', type: '' })}>Create New Monitor</button>
      <form onSubmit={handleSubmit}>
        <label>
          Message:
          <input type="text" name="message" value={formData.message} onChange={handleInputChange} />
        </label>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
        </label>
        <label>
          Query:
          <input type="text" name="query" value={formData.query} onChange={handleInputChange} />
        </label>
        <label>
          Type:
          <input type="text" name="type" value={formData.type} onChange={handleInputChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default App;
