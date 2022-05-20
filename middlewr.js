import express from 'express';
import axios from 'axios';
import fs from 'fs';
import jsonwebtoken from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 5000;
const rewdata = fs.readFileSync('data.json');
const users = JSON.parse(rewdata);
const privateKey = "213bvfe34hg4";
let resResult;
let checkJWT = 0;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const midleware = (req, res, next) => {
  let decoder = jsonwebtoken.verify(req.header('JWT'), privateKey);
  users.find( data => {
    if(jsonwebtoken.verify(data.password, privateKey) == decoder.password){
      return checkJWT = 1;     
    } 
  })
  next();
}

app.get('/', (req, res) => {
  res.end('<h1>Hello World</h1>');
})

app.get('/registration', (req, res) => {
  res.end('<h1>HellLo Registration</h1>');
  console.log('2.2');
})
app.get('/autorization', (req, res) => {
  res.end('<h1>Hello Autorization</h1>');
})
app.get('/allusers', midleware, (req, res) => {
  if(checkJWT == 1){
    res.send(users);
  } else {
    res.send("EROOR");
  }
})

app.post('/autorization', (req, res) => {
  resResult = Object.assign({}, req.body)
  let checkAutorization = 0;
  users.find(data => {
  if (data.username == resResult.username) {
      return checkAutorization = 1;
    } 
  })
  
  let checkAuto = 0;
  if(checkAutorization == 1){
      try {
        users.map(data => {
          let decoder = jsonwebtoken.verify(data.password, privateKey);
          if (decoder.password === resResult.password) {
              checkAuto = 1;
              if (checkAuto = 1);
              {
                res.send({pass: data.password});
              }
            }
          if(checkAuto == 0)
          {
            res.send("Passward is incorrect");
          }
          })
      } catch (error) {
          console.log(error);
          res.status(400).json({messsage: 'Autorization not complete'});
      }
  } else {
    res.send(`Account with username "${resResult.username}" not exist. For start register user`);
  }
})

app.post('/registration', (req, res) => {
  resResult = Object.assign({}, req.body)
  let checkRegistration = 0;
  users.find(data => {
  if (data.username == resResult.username) {
      return checkRegistration = 1;
    } 
  })
  
  if(checkRegistration == 1){
    res.send(`Account with username "${resResult.username}" exist`);
  } else {
  let token = jsonwebtoken.sign(resResult, privateKey)
      try {
        resResult.password = token;
        users[users.length] = resResult;
    
        fs.writeFileSync("data.json", JSON.stringify(users));
  
        res.send(`Accocunt "${resResult.username}" create`);
      } catch (error) {
          console.log(error);
          res.status(400).json({messsage: 'Registation not complete'});
      }
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

