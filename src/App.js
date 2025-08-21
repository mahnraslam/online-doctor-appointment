 
import './App.css';
import Home from './Home.js';
import Service from './Service.js';
import Appointments from './Appointments.js';
import Contact from './Contact.js';
import Register from './Register.js'
import { BrowserRouter, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import {  Link, Route } from 'react-router-dom';

 

function App() {
    
  const [isDoctor, setIsDoctor] = useState(true); 
  const [id, setId] = useState(0) ; 
  return (
   
    <BrowserRouter>
       
      <h1 className='App-header'> Online Doctor Appointment </h1>  
        <nav  className=" d-flex justify-content-end m-2 "  >
          < Link to="/" > <button className='btn btn-secondary mt-2 me-2' > Home </button></ Link>
          < Link to="/service" > <button  className='btn btn-secondary mt-2 me-2'  > Service </button> </ Link>
          < Link to="/appointments">  <button  className='btn btn-secondary mt-2 me-2'>Appointment</button> </ Link>
          < Link to="/contact" > <button  className='btn btn-secondary mt-2 me-2'> Contact Us</button></ Link>
          
          < Link to="/register" > <button  className='btn btn-secondary mt-2 me-2'>Sign In</button></ Link>
        </nav>
       
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/service" element={<Service isDoctor={isDoctor} />} />
          <Route path="/appointments" element={<Appointments   />  }/>
          <Route path="/contact" element = {<Contact/>} />
          <Route path="/register" element = {<Register/>} setId={setId} setIsDoctor={setIsDoctor}/>
        </Routes>
 
    </BrowserRouter>
  
  );
}

export default App;
