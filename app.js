import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    StartDateTime: '',
    EndDateTime: '',
    PatientID: '',
    ProviderID: '',
    Reason: ''
  });

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, []);

  const fetchPatients = async () => {
    const response = await axios.get('http://localhost:5000/api/patients');
    setPatients(response.data);
  };

  const fetchAppointments = async () => {
    const response = await axios.get('http://localhost:5000/api/appointments');
    setAppointments(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/appointments', newAppointment);
    fetchAppointments();
    setNewAppointment({
      StartDateTime: '',
      EndDateTime: '',
      PatientID: '',
      ProviderID: '',
      Reason: ''
    });
  };

  return (
    <div className="App">
      <h1>Hospital Appointment System</h1>
      
      <div className="container">
        <div className="section">
          <h2>Schedule New Appointment</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="datetime-local"
              value={newAppointment.StartDateTime}
              onChange={(e) => setNewAppointment({...newAppointment, StartDateTime: e.target.value})}
              required
            />
            <input
              type="datetime-local"
              value={newAppointment.EndDateTime}
              onChange={(e) => setNewAppointment({...newAppointment, EndDateTime: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Patient ID"
              value={newAppointment.PatientID}
              onChange={(e) => setNewAppointment({...newAppointment, PatientID: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Provider ID"
              value={newAppointment.ProviderID}
              onChange={(e) => setNewAppointment({...newAppointment, ProviderID: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Reason"
              value={newAppointment.Reason}
              onChange={(e) => setNewAppointment({...newAppointment, Reason: e.target.value})}
              required
            />
            <button type="submit">Schedule Appointment</button>
          </form>
        </div>

        <div className="section">
          <h2>Recent Appointments</h2>
          <table>
            <thead>
              <tr>
                <th>Date/Time</th>
                <th>Patient</th>
                <th>Provider</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(apt => (
                <tr key={apt.AppointmentID}>
                  <td>{new Date(apt.StartDateTime).toLocaleString()}</td>
                  <td>{apt.PatientFirstName} {apt.PatientLastName}</td>
                  <td>{apt.ProviderFirstName} {apt.ProviderLastName}</td>
                  <td>{apt.Reason}</td>
                  <td>{apt.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="section">
          <h2>Patients List</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.PatientID}>
                  <td>{patient.PatientID}</td>
                  <td>{patient.FirstName} {patient.LastName}</td>
                  <td>{patient.Phone}</td>
                  <td>{patient.Email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;