 

const {Client} = require('pg'); 

const con = new Client({
    user: "postgres",
    host: "localhost", 
    database: "online-doctor-appointments",
    password: "knowledge%a037",
    port: 5432  
});

const getServices = async()=>{
    try { 
        const result = await con.query("Select * from services") ;
        return result ;  
    }
    catch(err){
        console.error(err) ;
        throw new Error("Internal server error") ; 
    }
}
const updateService = async(service, s_id)=>{
    try { 
        
         const id = parseInt(s_id, 10); 
        const {name, email, isActive,timeStramp, d_id} = service ;
        await con.query(`Update serivces  set name=$1 email=$2, isActive=$3 timestramp = $4 d_id= $5 where id=$6 `[name, email, isActive, timeStramp, d_id, id]) ; 
        return "Sucessfully updated" ;
    }
    catch(err){
        console.error(err) ;
        throw new Error("Internal server error") ; 
    }
}

const addService = async(service)=>{
    try { 
        const {name, email, isActive,timeStramp, d_id} = service ;
        await con.query(`Insert into services(service_name, duration, is_active, created_at, created_by)
                 Values ($1, $2, $3,$4, $5)`[name, email, isActive, timeStramp, d_id]) ;
        return "Sucessfully added" ;
    }
    catch(err){
        console.error(err) ;
        throw new Error("Internal server error") ; 
    }
}

const deleteService = async(s_id)=>{
    try { 
        const id = parseInt(s_id, 10);
        console.log("Deleting", id) ;
        const result =  await con.query(`Delete from services where service_id = $1`,[id]) ;  
        if (result.rowCount === 0) {
            throw new Error("Service not found");
        }
        return "Success" ;
    }
    catch(err){
         
        throw new Error("Internal server error") ; 
    }
}
module.exports = {addService,getServices, deleteService,updateService} ;

 

con.connect()
  .then(() => console.log('Connected to the database'))
 .catch(err => console.error('Connection error', err.stack));

