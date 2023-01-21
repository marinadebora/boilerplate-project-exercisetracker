const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser= require("body-parser")

require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

//-------------------------------------------------------//

const mongoose = require("mongoose");
mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });





// modelo
let Person;
const createAndSavePerson =  
 new mongoose.Schema ({ 
 username: {type:String},
date: {type:String},
duration: {type:Number},
description: {type:String}
 })


Person = mongoose.model("Person",createAndSavePerson)


//-------------------------------------------------------//


    
app.post("/api/users",(req,res)=>{
  const {username}=req.body;
  let persona= new Person({
    username:username
  });
  persona.save()
  res.json(persona)
})

app.post("/api/users/:_id/exercises",(req,res)=>{
  const {_id}=req.params
  const {date,duration,description}= req.body;
  console.log(_id,date,duration,description)
  let dat=date? new Date(date): new Date()
   
  res.json({
    _id,
    //username,
    date: dat.toDateString(),
    duration,
    description
  })
});
  app.get("/api/users",async(req,res)=>{
    let user= await Person.find();
    res.send(user)
  })