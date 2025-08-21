

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


app.post('/services', (req, res) => {
  addService(req.body)
  .then(response=>{ 
    res.json({message: response});
  })
  .catch(err => {
     res.json({message : err}) ;
  })
});
app.put('/services/:id', (req, res) => {
  updateService(req.body, req.params)
    .then(response=>{ 
    res.json({message: response});
  })
  .catch(err => {
     res.json({message : err}) ;
  })
});


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});