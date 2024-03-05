const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const connection =mysql.createConnection({
    host :"localhost",
    user: "root",
    database:"delta_app",
    password:"$Tiger@0710$"
});

let getRandomUser = () => {
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
      ];
  };

app.get("/",(req,res)=>{
    let q=`Select count(*) from user`;
    try {
        connection.query(q,(err,result)=>{
            if (err) throw err;
            let count = result[0]["count(*)"];
            res.render("home.ejs",{count});
        });   
    }catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

app.get("/user",(req,res)=>{
    let q=`Select * from user`;
    try {
        connection.query(q,(err,result)=>{
            if (err) throw err;
            res.render("show.ejs",{result});
            // res.send(result);
        });   
    }catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

app.get("/user/:id/edit",(req,res)=>{
    let {id} = req.params;
    let q=`Select * from user where id ='${id}'`;
    try {
        connection.query(q,(err,result)=>{
            if (err) throw err;
            let a=result[0];
            res.render("edit.ejs",{a});
            // res.send(result);
        });   
    }catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

app.patch("/user/:id",(req,res)=>{
    let {id} = req.params;
    let{password:formPass,username:formUser}=req.body;
    let q=`Select * from user where id ='${id}'`;
    try {
        connection.query(q,(err,result)=>{
            if (err) throw err;
            let a=result[0];
            if(formPass!=a.password){
                res.send("wrong password");
            }
            else{
                let q2=`Update user set username='${formUser}' where id='${id}'`;
                connection.query(q2,(err,result)=>{
                    if (err) throw err;
                    res.redirect("/user");
                });
            }
        });   
    }catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

app.listen("5500",()=>{
    console.log("Server is listening to Port 5500");
});
