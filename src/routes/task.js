const router = require('express').Router();
const mongojs = require('mongojs');
const db = mongojs('mean-db',['task']);


router.get('/task',function (req,res,next) {
   db.task.find(function (error, task) {
       if(error){
           return next(error);
       }
       res.json(task);
   })
});

router.get('/task/:id',function (req,res,next) {
   db.task.findOne({_id:mongojs.ObjectID(req.params.id)},function (error,task) {
       if(error){
           return next(error);
       }
       res.json(task);
   })
});

router.post('/task',function (req,res,next) {
    const task = req.body;
    if(!task.title || !(task.isDone+'')){
        res.status(400).json({
            error:'Bad Data'
        });
    }else{
        db.task.save(task,function (error, task) {
           if(error){
               return next(error);
           }
            res.json(task);
        });
    }
});

router.delete('/task/:id',function (req,res,next) {
    db.task.remove({_id:mongojs.ObjectID(req.params.id)},function (error,result) {
       if(error){
           return next(error);
       }
       res.json(result);
    });
});

router.put('/task/:id',function (req,res,next) {
   const task = req.body;
   const updateTask={};
   if(task.isDone){
       updateTask.isDone=task.isDone;
   }
   if(task.title){
       updateTask.title=task.title;
   }
   if(!updateTask){
       res.status(400).json({
           error:'Bad request'
       });
   }else{
       db.task.update({_id:mongojs.ObjectID(req.params.id)}, updateTask, function (error,task) {

           if(error){
               return next(error);
           }
           res.json(task);
       });
   }
});
module.exports = router;