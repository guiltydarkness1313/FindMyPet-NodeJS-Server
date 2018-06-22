const express = require('express');
const bodyParser = require('express');
const app = express();
let noticia= require('./models/user');
const path= require('path');
const cors = require('cors');
const http = require('http');

/*const indexRoutes= require('./routes/index');*/
const taskRoutes= require('./routes/task');
const petRoutes = require('./routes/pet');

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

//routes
//app.use(indexRoutes);
app.use('/api',taskRoutes);
app.use('/api/v1/',petRoutes);
//static files
app.use(express.static(path.join(__dirname,'dist/client')));

//start server
app.listen(app.get('port'), ()=>{
    console.log("server on port",app.get('port'));
});

//Attach Socket.io
var server = http.createServer(app);
var io = socketio.listen(server);
app.set('socketio',io);
app.set('server',server);

