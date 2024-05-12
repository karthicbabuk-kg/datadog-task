import React, { useState, useEffect } from 'react';
import "./App.css"
const apiKey = '#######';//API key is private so i removed
const App = () => {
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
      const response = await fetch('https://api.datadoghq.com/api/v1/monitor', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${apiKey}`
        }
      });
      const data = await response.json();
      setMonitors(data.monitors);
    } catch (error) {
      console.error('Error fetching monitors:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://api.datadoghq.com/api/v1/monitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${apiKey}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setMonitors([...monitors, data]);
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
