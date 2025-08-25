

const express = require('express'); 
const {Client} = require('pg'); 
const cors = require('cors'); 
const {addService,getServices, deleteService,updateService}  = require( "./services.js"  )
const {addUser,getUser} = require("./user.js")
console.log(getServices)

const app = express();
app.use(express.json());


require("dotenv").config();
app.use(cors({
    origin: 'http://localhost:3000',  
    methods: 'GET,POST,PUT,DELETE',
    credentials: true 
}));

const con = new Client({
    user: process.env.USER,
    host: process.env.HOST, 
    database: process.env.DATABASE_NAME,
    password: process.env.PASSWORD ,
    port: process.env.DB_PORT  
});

app.get('/services', (req, res) => {
  
getServices()
.then(response=>{ 
    res.json(response.rows);
  })
  .catch(err => {
     res.json({message : err}) ;
  })
}) 


app.delete('/services/:id', (req, res) => {
  deleteService(req.params.id)
  .then(response=>{ 
    res.json({message:response});
  })
  .catch(err => {
     res.json({message : err}) ;
  })
})


app.post('/services', async(req, res) => {
  await addService(req.body)
  .then(response=>{ 
    res.json({message: response});
  })
  .catch(err => {
     res.json({message : err.message}) ;
  })
});
app.put('/services/:id', async(req, res) => {
  await updateService(req.body, req.params.id)
    .then(response=>{ 
    console.log("completed", response) ;
    res.json({message: response});
  })
  .catch(err => {
     res.json({message : err.message}) ;
  })
});

app.post('/user', async(req, res) => {
  await addUser(req.body)
  .then(response=>{ 
    console.log(response)
    res.json({message: "Successfully added", user_id : response[0], role:response[1]});
  })
  .catch(err => {
     res.json({message : err.message}) ;
  })
});

app.get('/user/:name/:contactNumber/:password', async(req, res) => {
  
  const data = [req.params.name, req.params.contactNumber, req.params.password]
  console.log('DATA AT SERVER ', data) ;
  await getUser(data)
  .then(response=>{  
    res.json({message: "Already exist", user_id : response[0], role:response[1]});
  })
  .catch(err => {
     res.json({message : err.message}) ;
  })
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});