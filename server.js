const express = require('express');
const bodyParser = require('express');
const path= require('path');
const cors = require('cors');
const multer = require('multer');
const http = require('http');
let noticia=require('./models/user');
const app = express();

//multer settings
const multerConfig={
    storage:multer.diskStorage({
        destination:function (req,file,next) {
            next(null,'./public/images');
        },
        filename:function (req,file,next) {
            console.log(file);
            const ext=file.mimetype.split('/'[1]);
            next(null,file.fieldname+"-"+Date.now()+"."+ext);
        }
    }),
    //ensure the upload of the file or image
    fileFilter:function (req,file,next) {
        if (!file){
            next();
        }
        const image = file.mimetype.startsWith('image/');
        if(image){
            console.log('image uploaded');
            next(null,true);
        }else{
            console.log("file not supported");
            return next();
        }
    }
};

//settings
app.use(bodyParser.json());
app.set('views',path.join(__dirname,'views'));
app.set('port', process.env.PORT || 3000);
app.engine('html', require('pug').renderFile);
app.set('view engine','pug');

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extend:false}));


//static files

//default services
app.get('/visual',noticia.recognition);
app.get('/',function (req,res) {
   res.render('index')
});
app.post('/analyzer',multer(multerConfig).single('photo'),noticia.upload_analyze);


//start server
app.listen(app.get('port'), ()=>{
    console.log("server on port",app.get('port'));
});


