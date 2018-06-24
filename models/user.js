let mongoose = require('mongoose');
var fs = require('fs');
var visualRecognitionV3= require('watson-developer-cloud/visual-recognition/v3');

//methods and declaration of variables
const visualRecognition = new visualRecognitionV3({
    url:"https://gateway.watsonplatform.net/visual-recognition/api",
    version:"2018-03-19",
    iam_apikey:"CW6jebGQ1VHaE7kIdVBQMn72YztGdKC2cJz31WUDWiLv",
});
//declaration of mongoose Schema
Schema = mongoose.Schema;

//connect to the database
mongoose.connect('mongodb://localhost/findMyPet');

//declaration of models for mongodb Schema
var breed_schema=new Schema({
   name:String
});

var pet_schema=new Schema({
    name:String,
    breed_id:{type:mongoose.Schema.Types.ObjectId, ref:'breeds'},
    gender:String,
    image:String,//subir imagen y colocar la url aca
    owner_id:{type:mongoose.Schema.Types.ObjectId, ref:'owners'}
});
var case_schema=new Schema({
   title:String,
   latitude:String,
   longitude:String,
   date:String,
   isLost:Boolean,
   description:String,
   user_id:{type:mongoose.Schema.Types.ObjectId, ref:'users'},
   pet_id:{type:mongoose.Schema.Types.ObjectId, ref:'pets'}
});
var owner_schema=new Schema({
    name:String,
    lastname:String,
    birthdate:String,
    telephone:String,
    address:String,
    pets:[{type:mongoose.Schema.Types.ObjectId,ref:'pets'}]
});
var userTypeSchema=new Schema({
    name:String
});
var user_schema=new Schema({
    username:String,
    password:String,
    user_type:{type:mongoose.Schema.Types.ObjectId,ref:'userType'}
});
breed_model=mongoose.model('breed',breed_schema,'breed');
user_model=mongoose.model('user',user_schema,'users');
owner_model=mongoose.model('owner',owner_schema,'owners');
module.exports={
    upload_analyze:(req,res)=>{
        var image = req.file.path;
        var dir="http://localhost:3000/";
        console.log(image);
        var imageDir=dir+image;
        var images_file=fs.createReadStream(imageDir);
        var classfier_ids=["default"];
        var threshold=0.6;
        var params={
            images_file:images_file,
            classfier_ids:classfier_ids,
            threshold:threshold
        };
        visualRecognition.classify(params,function (error,res) {
            if(error){
                console.log(error);
            }else{
                var result=JSON.stringify(res,null,2);
                console.log(result);
                res.render('image',result);
            }
        });
        //res.render('',{data:})
    },
    list_breed:(req,res)=>{

    },
    recognition:(req,res)=>{
        var images_file=fs.createReadStream('./public/images/dog_example_retriever.jpg');
        var classifier_ids=["default"];
        var threshold=0.6;
        var params={
            images_file:images_file,
            classifier_ids:classifier_ids,
            threshold:threshold
        };
        visualRecognition.classify(params,function (error,res) {
            if(error){
                console.log(error)
            } else{
                console.log(JSON.stringify(res,null,2));
            }
        });
    },
    createUser:(req,res)=>{
      if(req.body.username && req.body.password){
          let user={
              username:req.body.username,
              password:req.body.password
          };
          let nuevo = new user_model(user).save();
          console.log("se ha registrado un nuevo usuario:"+nuevo)
      }else{
          console.log("no se ha podido registrar al usuario debido a campos faltantes")
          res.status(400);
          res.send("no se ha podido crear el usuario");
      }
    },
    createOwner:(req,res)=>{
        if(req.body.name && req.body.lastname && req.body.birthdate
        && req.body.telephone && req.body.address){
            let user={
                name:req.body.name,
                lastname:req.body.lastname,
                birthdate:req.body.birthdate,
                telephone:req.body.telephone,
                address:req.body.address
            }
        }
    },
};
