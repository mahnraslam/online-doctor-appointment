import React from 'react'  
import AppointmentsContext from './AppointmentContext';
import { useContext,useState } from 'react';

const Appointments = (props) => { 
  const { appointments, setAppointments } = useContext(AppointmentsContext);
  const [data, setData] = useState([]);
  return (
    <div className='header'>Appointments</div>

  )
}

export default Appointments