const express = require('express');
const app = express();
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const File = require('./model/fileSchema');



app.set('view engine' , 'ejs');
app.use(express.static('./public'));



// Connect to mongodb
mongoose.connect(process.env.MongoURI, {useNewURIParser:true, useUnifiedTopology: true})
.then(()=> console.log('Mongo Connected...'))
.catch(err => console.log(err));

let date = Date.now();        
//set storage engine 
const Storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.filename +'_' + date + "myfile101" + path.extname(file.originalname));
    }
})

//Initialize upload
const upload = multer({
    storage: Storage,
    fileFilter:function(req,file,cb){
        checkFileType(file,cb)
    }
}).single("image");
//check file system

function checkFileType(file, cb){
    //Allow extensions
    const filetypes = /jpeg|jpg|png|gif|JPG|pdf/;
    //check ext
    const extname = filetypes.test(path.extname 
    (file.originalname).toLowerCase());
    //check mine
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    }else{
        cb('Error: Images only');
    }
}



// Upload File
app.post('/upload', (req , res )=>{  
    
    upload(req, res,(err)=>{
        if(err){
            res.render('index',{
                msg:err
            })
        }else{  
            if(req.file ==undefined){
                res.render('index' ,{
                    msg: 'Error: No file selected!'
                });
            }else{
                res.render('index',{
                    msg: 'file uploaded',
                    file: `uploads/${req.file.filename}`
                })
                const image= req.file.path
                const Pictures = new File({image});
                Pictures.save()
                console.log("file Uploaded!!!!")
            
            }
        }
    })
})

// Home Page
app.get('/', (req , res)=>{
    res.render('index');
})

// Get Uploaded file
app.get('/upload', (req , res)=>{
    res.render('index');
})

app.listen(process.env.PORT , ()=>{
    console.log("server stated at port 3000");
})









