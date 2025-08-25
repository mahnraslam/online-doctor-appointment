 
import './App.css';
import Home from './Home.js';
import Service from './Service.js';
import Appointments from './Appointments.js';
import Contact from './Contact.js';
import Register from './Register.js'
import Login from './Login.js'
import { BrowserRouter, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import {  Link, Route } from 'react-router-dom';

 

function App() {
    
  const [isDoctor, setIsDoctor] = useState(false); 
  const [id, setId] = useState(0) ; 
  return (
   
    <BrowserRouter>
      
      <h1 className='App-header'>Online Doctor Appointment </h1>  
        <nav  className=" d-flex justify-content-end  "  >
          < Link to="/" > <button className='btn btn-secondary mt-2 me-2 mb-0' > Home </button></ Link>
          < Link to="/service" > <button  className='btn btn-secondary mt-2 me-2 mb-0'  > Service </button> </ Link>
          < Link to="/appointments">  <button  className='btn btn-secondary mt-2 me-2 mb-0'>Appointment</button> </ Link>
          < Link to="/contact" > <button  className='btn btn-secondary mt-2 me-2 mb-0'> Contact Us</button></ Link>
          {!id &&
          < Link to="/register" > <button  className='btn btn-secondary mt-2 me-2 mb-0'>Sign In</button></ Link>
          }
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/service" element={<Service isDoctor={isDoctor} />} />
          <Route path="/appointments" element={<Appointments   />  }/>
          <Route path="/contact" element = {<Contact/>} />
          <Route path="/login" element = {<Login setId={setId} setIsDoctor={setIsDoctor}/>} />
          <Route path="/register" element = {<Register setId={setId} setIsDoctor={setIsDoctor} />} />
        </Routes>
 
    </BrowserRouter>
  
  );
}

export default App;
