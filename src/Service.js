import { type } from '@testing-library/user-event/dist/type';
import React from 'react' 
 

const Service = (props) => { 
  const [isForm, setIsForm] = React.useState(false);
  const [newService, setNewService] = React.useState(false); 
  const [edit, setEdit] = React.useState(false) ;
  const [serviceId, setServiceId] = React.useState(0) ;
  const [serviceName, setServiceName] = React.useState(''); 
  const [duration, setDuration] = React.useState('');
  const [isActive, setIsActive] = React.useState(true);  
  const [data, setData] = React.useState([]);
 
 
    const handleSubmit = (e) => {
     
      e.preventDefault();
      if (! serviceName.trim() || !duration) {
        alert('Please fill in all fields');
        return ;
      }
      const newServiceData = {
        service_name: serviceName,
        duration: duration,
        is_active: isActive,
        timeStramp : new Date().toLocaleString,
        d_id : props.d_id 
      }; 
      if (newService){
        fetch('http://localhost:5000/services',{
          method : "POST", 
          headers: {"Content-Type" : "application/json"},
          body : JSON.stringify(newServiceData)
      })
          .then(response => response.text())
          .then(response=> alert(response))
          .catch(error => console.error('Error in Service adding:', error));  
        setNewService(false) ; 
      }
      else { 
         fetch(`http://localhost:5000/services/${serviceId}`,{
          method : "PUT", 
          headers: {"Content-Type" : "application/json"},
          body : JSON.stringify(newServiceData)
      })
        .then(response => response.json() )
      .then(data => {
        setData(data);
      })
      .catch(error => console.error('Error in Service editing: ', error));
    } 
      setEdit(false) ; 
      setIsForm(false);  
    }
  
        

  const addService = () => {
    setNewService(true) ;
    setIsForm(true);  
  }
   
 
  const bookService = (id) => {

  }
  const editService = (id) => {
   
    setEdit(true) ;
    setServiceId(id)
    setIsForm(true);  
  } 
 
  const deleteService = (id) => {
   
    if (window.confirm("Confirm Deletion")){
      fetch(`http://localhost:5000/services/${id}`,{
            method : "DELETE", 
           
        })
      .then(response => response.json() )
      .then(data => {
        setData(data);
      })
      .catch(error => console.error('Error in Service deleting:', error));
    }

  }

   React.useEffect(() => {
      fetch('http://localhost:5000/services')
      .then(response => response.json() )
      .then(data => {
        setData(data);
      })
      .catch(error => console.error('Error fetching Service:', error));  
    }, [isForm]);
  

  
  return (
    <div>
      { isForm ?  
          <form className="service-form">
            <h2>Add Service</h2>  
            <div className="form-group">
              <label htmlFor="serviceName">Service Name:</label>
              <input type="text" placeholder="Laser Eye Surgery" id="serviceName" value={serviceName} onChange={(e) => setServiceName(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">  
              <label htmlFor="duration">Duration in Minutes:</label>
              <input type="number" placeholder="70" id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="isActive">Is Active:</label>
              <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="form-check-input" />
            </div>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
            <button type="button" className="btn btn-secondary" onClick={() => setIsForm(false)}>Cancel</button>
          </form>
   :
  ( <div className="container">

    <headers className='headers'>
      <h1 className='text-center'>Services</h1>
      {props.isDoctor ? <button className='btn btn-secondary mx-auto d-block' onClick={() => addService()}>Add Service</button> :
      <p className='text-center'>We offer a variety of medical Service to cater to your health needs.</p>}
      
    </headers>

        <div className = "Service-list">

            {data.map((service, index) => (  
            
            service.is_active  && (
            <div key={service.service_id} className="service-card">
                <div className ="service-row">
                  <div className ="service-details"> 
                    <h3 className="service-name">{service.service_name}</h3> 
                    <p  className="service-info"><strong>Duration:</strong> {service.duration}</p>   
                  </div> 
              
                  { props.isDoctor 
                    ? <div> <button className="btn btn-primary  me-3" onClick={()=> editService(service.service_id)}>Edit Service</button> 
                      <button className="btn btn-danger" onClick={()=> deleteService(service.service_id)}>Delete Service</button>
                    </div>
                    : <button className="btn btn-primary" onClick={bookService}>Book Service</button> }
                </div>
            </div>
            )
        ))}
        </div> 
      
      </div> 
)}
  </div>
) ;
}

export default Service