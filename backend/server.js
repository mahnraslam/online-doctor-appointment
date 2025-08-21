

const express = require('express'); 
const {Client} = require('pg'); 
const cors = require('cors'); 
const {addService,getServices, deleteService,updateService}  = require( "./services.js"  )

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
     console.log("error", err)
     res.json({message : err.message}) ;
  })
});


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});