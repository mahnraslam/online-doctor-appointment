
const {Client} = require('pg'); 

const con = new Client({
    user: "postgres",
    host: "localhost", 
    database: "online-doctor-appointments",
    password: "knowledge%a037",
    port: 5432  
});

con.connect()
  .then(() => console.log('Connected to the database'))
 .catch(err => console.error('Connection error', err.stack));


const addUser = async (data)=>{
     try { 
       
        const {username, contactNumber, password, role,location} = data ;
        const query = `Insert into  users (name,
                        contact_number ,
                        password ,
                        role ,
                        address) Values ($1,$2,$3,$4,$5)`; 
        const values = [username, contactNumber, password, role,location] ;
        console.log("Recieved data", values) ;
        await con.query(query,values) ;
        console.log("query run") ;
        return "Sucessfully added" ;
    }
    catch(err){
         
        console.error(err) ;
        throw new Error("Internal Server Error") ; 
    }

}
const getUser= ()=>{

}

module.exports = {addUser, getUser}


 