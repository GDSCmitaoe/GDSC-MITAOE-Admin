const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser")
const app = express();
//

// Importing Routes
const teamRouter = require('./routes/teamRouter')
const eventRouter = require('./routes/eventRouter')
const clientRouter = require("./routes/client")
const cors = require('cors')   
app.use(cors({
    origin: '*' 
}));

 // json parser
 
// Pug Set up
app.set('view engine',"ejs"); 
app.set('views');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json()); 
app.use(cookieParser());

app.use('public',express.static(__dirname + "/public"))  // serving static files

app.use(express.static('public'))

// APIs
app.get('/',(req,res)=>{
    res.redirect('/login') 
})

app.use('/',clientRouter)  // admin panel
app.use('/api/team',teamRouter);
app.use('/api/event',eventRouter)



app.get('*',(req,res)=>{
    res.send("404 Page not found");
})

module.exports = app; 

//