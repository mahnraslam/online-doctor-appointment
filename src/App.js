 
import './App.css';
import Home from './Home.js';
import Service from './Service.js';
import Appointments from './Appointments.js';
import Contact from './Contact.js';
import { BrowserRouter, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import {  Link, Route } from 'react-router-dom';

 

function App() {
   
  const [signIn, setSignIn] = useState(false);
  const [isDoctor, setIsDoctor] = useState(true); 
  const [doctorId, setDoctorId] = useState(1) ; 
  return (
    <div className='App'>
      <h1 className='App-header'> Online Doctor Appointment </h1>  
    <BrowserRouter>
      <div className="App"> 
        <div>
        <nav   className="container d-flex justify-content-end gap-2">
          < Link to="/" > <button className='btn btn-secondary mt-2' > Home </button></ Link>
          < Link to="/service" > <button  className='btn btn-secondary mt-2'  > Service </button> </ Link>
          < Link to="/appointments">  <button  className='btn btn-secondary mt-2'>Appointment</button> </ Link>
          < Link to="/contact" > <button  className='btn btn-secondary mt-2'> Contact Us</button></ Link>
        </nav>
       </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/service" element={<Service isDoctor={isDoctor} d_id={doctorId}/>} />
          <Route path="/appointments" element={<Appointments  />  }/>
          <Route path="/contact" element = {<Contact/>} />
        </Routes>
      </div>
    </BrowserRouter>
  </div>
  );
}

export default App;
