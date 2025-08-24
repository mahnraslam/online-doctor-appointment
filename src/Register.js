 
import { useState } from "react";
import {useForm} from "react-hook-form" 

const Register = () => { 

  const [text , setText] = useState("Register")
  const handleLogin = () =>{
      setText("Login") ;
      <p> {text} </p>
  }
  const {register, handleSubmit,formState:{errors}} = useForm(
    {defaultValues : {role : "Patient"}}
  ) ; 
  const onSubmit =  (data)=>{
    
     fetch('http://localhost:5000/user',{
          method : "POST", 
          headers: {"Content-Type" : "application/json"},
          body : JSON.stringify(data)
     }).then(response => response.json() )
      .then(response=> alert(response.message) )
      .catch(error=>console.error('Error in Service adding:', error))
  }
  return (  
      <div className="container mt-2">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg rounded">
              <div className="card-body p-4">
                <h3 className="text-center mb-4">{text}</h3>
          {(text ==="Register") &&
          (<form onSubmit={ handleSubmit(onSubmit)} >
            
          <div  className="row mb-3"> 

            <label className="col-sm-4 col-form-label"  htmlFor="username"> Name :  </label>
              <div className ="col-sm-8">
              <input type="text" {...register("username",{required: "Name is required",minLength:{value:3, message:"Name is too short"}})}  className="form-control"  style={{ backgroundColor: "#dfdadaff" }}/>
              {errors.username &&  <p className ="text-danger">{errors.username.message}</p>}
              
            </div>
            </div>
               <div  className="row mb-3"> 
              <label className="col-sm-4 col-form-label"  htmlFor="contactNumber">WhatsApp Number </label>
               <div className ="col-sm-8">
              
              <input type="tel"  placeholder="0302-1111111"  {...register("contactNumber", {required: "Contact number is req for notifications", pattern:{value:/^0\d{3}-?\d{7}$/, message:"Invalid number"}})}   className="form-control"  style={{ backgroundColor: "#dfdadaff" }}/>
              {errors.contactNumber &&  <p className ="text-danger">{errors.contactNumber.message}</p>}
             
              </div>
            </div> 
             <div  className="row mb-3"> 
           
            <label className="col-sm-4 col-form-label"  htmlFor="password">Password : </label>
             <div className ="col-sm-8">
              <input   className="form-control"  style={{ backgroundColor: "#dfdadaff" }}{...register("password",{required:"Password is required", minLength:{value:8, message:"At least 8 chaaracters are required"}})}/>
            {errors.password &&  <p className ="text-danger">{errors.password.message}</p>}
              
            </div>
          </div>
             <div  className="row mb-3"> 
            <label className="col-sm-4 col-form-label"  htmlFor="location">Location : </label>
             <div className ="col-sm-8">
            <input  placeholder='479 Model Town Lahore' className="form-control"  style={{ backgroundColor: "#dfdadaff" }}{...register("location")}/>
            
          </div> 
        </div>
         
        <div className="row mb-3">
          <label  className="col-sm-4 col-form-label" htmlFor='role'>Select your Role </label>
        <div className ="col-sm-8">
          <div className ="form-check form-check-inline">
           <input type = "radio" id="Doctor" value="Doctor" {...register("role",{required:"Role is required"})} className='form-check-input'/>
           <label className='form-check-label'> Doctor</label>
          </div>
        
        <div className="form-check form-check-inline">
         
          <input type = "radio" id="Patient" value="Patient" {...register("role",{required:"Role is required"})} className='form-check-input'/>
          <label  className='form-check-label'> Patient</label>
        </div>
      </div>
        {errors.role &&  <p className ="text-danger">{errors.role.message}</p>}
            
        </div>
          <div  className="row mb-2">
            <button  type="submit" className="btn btn-primary">Submit</button>
          </div>
            <div className="row  align-items-center"> Already have an account 
            <div className="col-sm-9"> < button onclick = {handleLogin}>Login</button>  </div>
            </div>
          </form> 
        )}
        </div>
      </div>
      </div>
      </div>
  </div>
  )
}

export default Register