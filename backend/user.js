
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
                        address) Values ($1,$2,$3,$4,$5) RETURNING user_id,role`; 
        const values = [username, contactNumber, password, role,location] ;
     
        const res = await con.query(query,values) ;
            return [res.rows[0].user_id,res.rows[0].role];
    }
    catch(err){
         
        console.error(err) ;
        throw new Error("Internal Server Error") ; 
    }

}
const getUser= async(data)=>{
     try { 
        
        const query = `Select user_id,role from users where name=$1 and contact_number = $2 and password= $3`; 
        
        const res = await con.query(query,data) 
        return [res.rows[0].user_id,res.rows[0].role];
        
    }
    catch(err){
         
        console.error(err) ;
        throw new Error("Internal Server Error") ; 
    }
}

module.exports = {addUser, getUser}


 