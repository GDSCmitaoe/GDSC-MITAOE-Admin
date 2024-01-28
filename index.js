const app = require('./app');

const mongoose  = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

mongoose.connect(process.env.DATABASEURL).then(()=>{
    console.log("DATABASE Connected");
}).catch((e)=>{
    console.log('DATABASE Not Connected' + e.message);  
})
const port = process.env.PORT || 8080;

 
app.listen(port,()=>{
    console.log("Server is Running on " + port);
});