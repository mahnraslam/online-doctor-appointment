 

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
        const {service_name,duration, is_active, created_at,created_by} = service ;
        const query = `Update services set  service_name = $1,
                        duration=$2,
                        is_active = $3,
                        created_at = $4,
                        created_by=$5
                            where service_id=$6`;
        const values = [service_name,duration, is_active, created_at,created_by,id] ;
        await con.query(query,values) ;
        return "Sucessfully updated" ;
    }
    catch(err){
        console.error(err) ;
        throw new Error("Internal server error") ; 
    }
}

const addService = async(service)=>{
    try { 
        const {service_name,duration, is_active, created_at,created_by} = service ;
        const query = `Insert into  services (service_name,
                        duration ,
                        is_active ,
                        created_at ,
                        created_by) Values ($1,$2,$3,$4,$5)`; 
        const values = [service_name,duration, is_active, created_at,created_by] ;
        await con.query(query,values) ;
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

