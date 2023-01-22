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


 })
let Exercise;
const createExercise=
 new mongoose.Schema ({
   username:{type:String},
    date: {type:String},
duration: {type:Number},
description: {type:String},
 });

  let Logs;
const createLogs=
  new mongoose.Schema({
    username:{type:String},
    count:{type:Number},
    log:{type:Array}
  })

Person = mongoose.model("Person",createAndSavePerson)
Exercise=mongoose.model("Exercise",createExercise)
Logs= mongoose.model("Logs",createLogs)
//-------------------------------------------------------//


    
app.post("/api/users",(req,res)=>{
  const {username}=req.body;
  let persona= new Person({
    username:username
  });
  persona.save()
  res.json(persona)
})

app.post("/api/users/:_id/exercises",async(req,res)=>{
  
  const {_id}=req.params
  const {date,duration,description}= req.body;
  console.log(_id,date,duration,description)
  let dat=date? new Date(date): new Date()
  let user= await Person.findOne({_id:_id});

  let exercises= new Exercise({
    _id,
    username:user.username,
    date: dat.toDateString(),
    duration: Number(duration),
    description
  })
 
  exercises.save()
  res.json(exercises)
});




  app.get("/api/users/:_id/logs",async(req,res)=>{
    const {_id}=req.params
    let user= await Exercise.find({_id:_id});
    console.log(user)
   
    let logs= new Logs({
      username:user[0].username,
      count : user.length,
       _id,
      log: user.map(e=>({
        description: e.description,
        duration: e.duration,
        date:e.date?e.date: (new Date()).toDateString(),
      }))
        
    })
    logs.save()
    res.json(logs)
  })



app.get("/api/users",async(req,res)=>{
    let user= await Person.find();
    res.send(user)
  })