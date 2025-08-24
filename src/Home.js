import React from 'react'
import './App.css';
const Home = () => {
  return ( 
    <div style={{ 
            backgroundImage: "url('/home.jpg')", 
            backgroundSize: "cover", 
            backgroundPosition: "top",
            
            height: "100vh", 
            width: "100%" }} >
                
      <div  className="text-center p-2 mt-2"style={{ fontWeight: "bold" ,fontSize:30, backgroundColor:"#5798daff"}} >
        See our Services in the service section 
      </div>
     
      
  </div> 

  )
}

export default Home