
import React, { useState } from 'react'
import {useform} from "react-hook-form"
import { DevTool } from '@hookform/devtools';

const Register = () => {
  const [username, setUsername] = useState("") ;
  const [contactNumber, setContactNumber] = useState()
  const [password, setPassword] = useState("")
  const [location, setLocation] = useState("") 

  const handleSubmit = ()=>{

  }
  return ( 
      <div className="container mt-2">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg rounded">
              <div className="card-body p-4">
                <h3 className="text-center mb-4">Register</h3>

          <form>
              <div  className="row mb-3 align-items-center"> 
              <label htmlFor="username"> Name :  </label>
              <input type="text" placeholder="Enter your Name :"  className="form-control" name="username" value={username} onChange={(e) => setUsername(e.target.value)}   />
              </div>
               <div  className="row mb-3 align-items-center"> 
              <label htmlFor="contactNumber">Contact Number :  </label>
              <input type="number" placeholder="Enter whatsapp Number "  className="form-control" name="contactNumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)}   />
            </div>

             <div  className="row mb-3 align-items-center"> 
              <label htmlFor="password">Password : </label>
              <input type="text"  className="form-control" name="password" value={password} onChange={(e) => setPassword(e.target.value)}   />
            </div>
             <div  className="row mb-2 align-items-center"> 
            <label htmlFor="location">Location : </label>
            <input type="text"  className="form-control" name="location" value={location} onChange={(e) => setLocation(e.target.value)}   />
          </div>

          <div  className="row mb-2">
            <button  type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
          </div>
            <div className="row  align-items-center"> Already have an account 
            <div className="col-sm-9"> <button>Login</button>  </div>
            </div>
          </form>
          <DevTool control = {control} />
        </div>
      </div>
      </div>
      </div>
  </div>
  )
}

export default Register