const router = require('express').Router();
const mongojs = require('mongojs');
const db = mongojs('findMyPet',['pet']);

router.get('/pet',(req,res)=>{
    db.pet.find((error,pet)=>{
        if(error){
            return next(error);
        }
        res.json(pet);
    })
});

router.get('/pet/:id',(req,res,next)=>{
    db.pet.findOne({_id:mongojs.ObjectID(req.params.id)},(error,pet)=>{
        if(error){
            return next(error);
        }
        res.json(pet);
    })
});

router.post('/pet',(req,res,next)=>{
    const pet = req.body;
    if(/*!pet.title ||*/ !(pet.isLost+'')){
        res.status(400).json({
            error:'Bad Data'
        });
    }else{
        db.pet.save(pet,(error,pet)=>{
            if(error){
                return next(error);
            }
            res.json(pet);
        });
    }
});

router.delete('/pet/:id',(req,res,next)=>{
    db.pet.remove({_id:mongojs.ObjectID(req.params.id)},(error,result)=>{
        if(error){
            return next(error);
        }
        res.json(result);
    });
});

router.put('/pet/:id',(req,res,next)=>{
    const pet = req.body;
    const updatePet={};
    if(pet.isLost){
        updatePet.isLost=pet.isLost;
    }
    if(pet.title){
        updatePet.title=pet.title;
    }
    if(pet.name){
        updatePet.name=pet.name;
    }
    if(pet.breed_id){
        updatePet.breed_id=pet.breed_id;
    }
    if(pet.owner){
        updatePet.owner=pet.owner;
    }
    if(pet.location){
        updatePet.location=pet.location;
    }
    if(pet.image){
        updatePet.image=pet.image;
    }
    if(!updatePet){
        res.status(400).json({
            error:"Bad request"
        });
    }else{
        db.pet.update({_id:mongojs.ObjectID(req.params.id)},updatePet,(error,pet)=>{
            if(error){
                return next(error);
            }
            res.json(pet);
        });
    }
});
module.exports=router;