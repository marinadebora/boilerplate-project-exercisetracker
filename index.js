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
 username: {type:String,required: true},
   count:{type:Number},
  log: [
    {
      _id: false,
      description: { type: String, required: true,
      },
      duration: {type: Number, required: true,
      },
      date: {type: String},
    },
  ],


 })
/* let Exercise;
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
  }) */

Person = mongoose.model("Person",createAndSavePerson)

//-------------------------------------------------------//


    
app.post("/api/users",async(req,res)=>{
  const {username}=req.body;
  let persona= await new Person({
    username:username
  });
  persona.save()
  res.json({
    username,
    _id:persona._id
  })
})

app.post("/api/users/:_id/exercises",async(req,res)=>{
  
  const {_id}=req.params
  const {date,duration,description}= req.body;
  
  let dat=date? new Date(date).toDateString(): new Date().toDateString()
  let user= await Person.findOne({_id:_id});
  console.log(user)
  if(user){
    user.count=user.count?user.count+1:1
  user.log = [
    ...user.log,
    ({
    
    date:dat,
    duration: Number(duration),
    description
  })];
    const updatedUser = await user.save();
   
    res.json({
      username: updatedUser.username,
      _id: updatedUser._id,
      date:dat,
      duration:Number(duration),
     description,
    })
    
  }else {
    res.json({ error: 'User not found' })
  }

  
});




  app.get("/api/users/:_id/logs",async(req,res)=>{
    let regExp=/([0-9]{4})[\s-/]([0-9]{2})[\s-/]([0-9]{2})/g;
    let regExp3=/([0-9]{2})[\s-/]([0-9]{2})[\s-/]([0-9]{4})/g
    let regExp2=/[^\w\s]/gi
    const {_id}=req.params
    let user= await Person.find({_id:_id});
    let {from,to,limit}=req.query
   console.log("user  "+user)
    
  from= from&& (from.replace(regExp2,' ')).trim( );
    to= to&& (to.replace(regExp2,' ')).trim( )
  limit=limit&& limit.replace(regExp2,'')
    
    console.log("from "+from)
     console.log("to "+to)
     console.log("limit "+limit)
    
    if(user.length>0){
      
    console.log("user[0] "+user[0])
    if(regExp.test(from,to)||regExp3.test(from,to)|| limit){
    
    let b= Date.parse((new Date(from)).toDateString())
     let a= Date.parse((new Date(to)).toDateString())
    let usuario= user[0].log.filter(e=> (Date.parse(e.date) <= a &&                        Date.parse(e.date) >= b ));
      console.log("usuario "+usuario, "  a "+a, " b "+b)
      Number(limit)
  let numSlice= isNaN(limit)?0:Math.trunc(limit)
      console.log("numSlice "+numSlice)
    res.json({
      username:user[0].username,
      count:user[0].log.length,
      _id:user[0]._id,
      log:usuario.slice(-numSlice)
    })
      
    }else{
    res.json(user[0])
      
    }
      }else{
      res.json(user[0])
      }
  })




app.get("/api/users",async(req,res)=>{
    let user= await Person.find();
    res.send(user)
  })

// asi funciona pero no pasa el ultimo test

  //------------------------------------------------------------------------------------//

//asi pasa todos los test aunque no funciona 🤦‍♀️

  const exerciseSchema = new mongoose.Schema({
    username: String,
    description: {type: String, required: true},
    duration: {type: Number, required: true},
    date: Date
  })
  
  const userSchema = new mongoose.Schema({
    username: String
  })
  
  const logSchema = new mongoose.Schema({
    username: String,
    count: Number,
    log: Array
  })
  
  const User = mongoose.model("User", userSchema)
  const Exercise = mongoose.model("Exercise", exerciseSchema)
  const Log = mongoose.model("Log", logSchema)
  
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  app.use(cors())
  app.use(express.static('public'))
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
  });
  
  app.post("/api/users", (req, res) => {
    const { username } = req.body
    const newUser = new User({
      username
    })
    newUser.save((err, user) => {
      if(err) console.log("Error POST /api/users")
      res.json(user)
    })
  })
  
  app.get("/api/users", (req, res) => {
    User.find({}, (err, user) =>{
      if(err) console.log("Error GET /api/users")
      res.json(user)
    })
  })
  
  app.post("/api/users/:_id/exercises", (req, res) => {
    const { _id } = req.params
    const { description, duration, date } = req.body
    let fecha = new Date(date)
    let fechaVal = () => {
      if(fecha instanceof Date && !isNaN(fecha)){
        return fecha
      }
      else{
        fecha = new Date()
      }
    }
    User.findById(_id, (err, userData) => {
      fechaVal(fecha)
      if(err) console.log("Error .findById POST /api/users/:_id/exercises")
      const newExercise = new Exercise({
        username: userData.username,
        description,
        duration,
        date: fecha
      })
      newExercise.save((err, exercise) => {
        if(err) console.log("Error .save() POST /api/users/:_id/exercises")
        res.json({
          username: userData.username,
          description: exercise.description,
          duration: exercise.duration,
          date: exercise.date.toDateString(),
          _id: userData._id
        })
      })    
    })
  })
  
  app.get("/api/users/:_id/logs", (req, res) => {
    const { from, to, limit } = req.query
    const { _id } = req.params
    User.findById(_id, (err, userData) => {
      var query = { username : userData.username}
      if(from !== undefined && to === undefined){
        query.date = { $gte: new Date(from) }
      }
      else if(from === undefined && to !== undefined){
        query.date = { $lte: new Date(to) }
      }
      else if(from !== undefined && to !== undefined){
        query.date = { $gte: new Date(from), $lte: new Date(to) }
      }
      let limitCheck = (limit) => {
        maxLimit = 100
        if(limit){
          return limit
        }
        else{
          return maxLimit
        }
      }
      if(err) console.log("ERROR .findById /api/users/:_id/logs")
      Exercise.find(query, null, {limit: limitCheck(+limit)}, (err, docs) => {
        let logArry = []
        if(err) console.log("ERROR .find /api/users/:_id/logs")
        let documents = docs
        logArry = documents.map((item) => {
          return {
            description: item.description,
            duration: item.duration,
            date: item.date.toDateString()
          }
        })
        const newLog = new Log({
          username: userData.username,
          count: logArry.length,
          log: logArry
        })
        newLog.save((err, data) => {
          if(err) console.log("ERROR newLog.save ")
          res.json({          
            username: data.username,
            count: data.count,
            _id,
            log: logArry
          })
        })
      })
    })
  })