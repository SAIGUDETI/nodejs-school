require('dotenv').config()
const express = require("express");
const cors = require("cors");
const mongoClient= require("mongodb").MongoClient;

var connectionString = process.env.DB_STRING;

const school = express();
school.use(cors());
school.use(express.static("../public"));
school.use(express.urlencoded({
    extended:true
}));
school.use(express.json());

school.get("/getstudents",function(req,res){
    mongoClient.connect(connectionString,function(err,clientObject){
        if(!err){
            var object = clientObject.db(process.env.DB_NAME)
            object.collection("students").find({}).toArray(function(err,documents){
                if(!err){
                    res.send(documents);
                    res.end();
                }
            })
        }
    })
})

school.post("/poststudent",function(req,res){
    var data = {
        "StudentId": req.body.StudentId,
        "Name": req.body.Name,
        "Qualification": req.body.Qualification,
        "Phone": req.body.Phone,
        "Address": req.body.Address,
        "Email": req.body.Email
    }
    mongoClient.connect(connectionString,function(er,obj){
        if(!er){
            var dbo = obj.db(process.env.DB_NAME)
            dbo.collection("students").insertOne(data,function(er,result){
                if(!er){
                    console.log("Record Inserted Successfully");
                }   
            })
        }        
    })
})

school.listen(process.env.PORT);
console.log(`server started :`,process.env.PORT);