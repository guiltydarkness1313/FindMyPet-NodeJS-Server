let mongoose = require('mongoose');
Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/findMyPet');
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
user_model=mongoose.model('user',user_schema,'users');
owner_model=mongoose.model('owner',owner_schema,'owners');
module.exports={
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
