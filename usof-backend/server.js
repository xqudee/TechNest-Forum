const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mysqlAdmin = require('node-mysql-admin');

const corsOptions ={
    origin: ['http://localhost:3000'], 
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json())
app.use(mysqlAdmin(app));
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(require('./Routers/index'))

const PORT = process.env.PORT || 3001;

app.listen(PORT, ()=>{
    console.log(`App listen on port ${PORT}`);
});
